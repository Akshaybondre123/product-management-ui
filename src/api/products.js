import axios from 'axios'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://catalog-management-system-dev-ak3ogf6zea-uc.a.run.app'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
  headers: {
    'x-internal-call': 'true',
  },
})

const getVal = (obj, keys, fallback = '') => {
  for (const k of keys) {
    const val = k.split('.').reduce((acc, part) => acc?.[part], obj)
    if (val !== undefined && val !== null && val !== '') {
      return val
    }
  }
  return fallback
}

const toInt = (val) => {
  const num = Number(val)
  return Number.isFinite(num) ? num : 0
}

export const formatItem = (raw, index = 0) => {
  const imgs = raw.images || raw.productImages || []
  const first = Array.isArray(imgs) ? imgs[0] : imgs
  const imgUrl =
    getVal(raw, ['image', 'imageUrl', 'thumbnail', 'productImage']) ||
    (typeof first === 'string'
      ? first
      : first?.url || '')

  return {
    id: getVal(raw, ['_id', 'id', 'productId', 'sku'], `item-${index}`),
    name: getVal(raw, ['productName', 'name', 'title'], 'Generic Product'),
    category: getVal(
      raw,
      ['category.name', 'category.title', 'category', 'productCategory'],
      'Misc',
    ),
    price: toInt(getVal(raw, ['price', 'sellingPrice', 'mrp', 'amount'], 0)),
    imageUrl: imgUrl,
    description: getVal(
      raw,
      ['description', 'about', 'details', 'shortDescription'],
      'No info available.',
    ),
    brand: getVal(raw, ['brand.name', 'brand', 'manufacturer'], 'N/A'),
    stock: toInt(getVal(raw, ['stock', 'inventory', 'quantity'], 0)),
    raw,
  }
}

const getList = (payload) => {
  if (Array.isArray(payload)) return payload
  return (
    payload?.data ||
    payload?.products ||
    payload?.items ||
    payload?.result ||
    payload?.rows ||
    []
  )
}

const getCount = (payload, fallback) =>
  Number(
    payload?.total ||
    payload?.totalCount ||
    payload?.count ||
    payload?.pagination?.total ||
    fallback,
  )

export const getProducts = async ({
  page = 1,
  pageSize = 10,
  search = '',
  category = '',
  sort = 'asc',
}) => {
  console.log(`[API] Fetching products - Page: ${page}, Query: "${search}"`);

  const payload = {
    page,
    limit: pageSize,
    search,
    category,
    sortBy: 'price',
    sortOrder: sort,
  }

  try {
    const res = await api.get('/cms/products', { params: payload })
    const data = res.data
    const nodes = getList(data)
    const items = nodes.map((it, idx) => formatItem(it, idx))
    const total = getCount(data, items.length)

    console.log(`[API] Success - Found ${total} items total`);
    return { items, total }
  } catch (err) {
    console.error('[API] getProducts failed:', err.message);
    throw err;
  }
}

const mockData = [
  {
    id: 'm-1',
    name: 'Fresh Potato',
    category: 'Fresh Vegetables',
    price: 59,
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=60',
    description: 'Clean, medium-size potatoes for regular cooking.',
    brand: 'Fresho',
    stock: 120,
  },
  {
    id: 'm-2',
    name: 'Onion Loose',
    category: 'Fresh Vegetables',
    price: 156,
    imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=400&q=60',
    description: 'Fresh onions with strong aroma and flavor.',
    brand: 'Fresho',
    stock: 90,
  },
  {
    id: 'm-3',
    name: 'Carrot Orange',
    category: 'Fresh Vegetables',
    price: 35,
    imageUrl: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?auto=format&fit=crop&w=400&q=60',
    description: 'Crunchy orange carrots, ideal for salad and curry.',
    brand: 'Fresho',
    stock: 70,
  },
  {
    id: 'm-4',
    name: 'Tomato Hybrid',
    category: 'Fresh Vegetables',
    price: 15,
    imageUrl: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=400&q=60',
    description: 'Fresh red tomatoes with juicy texture.',
    brand: 'Fresho',
    stock: 140,
  },
  {
    id: 'm-5',
    name: 'Green Chilli',
    category: 'Herbs & Seasonings',
    price: 22,
    imageUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=400&q=60',
    description: 'Spicy green chillies, handpicked and fresh.',
    brand: 'Fresho',
    stock: 65,
  },
  {
    id: 'm-6',
    name: 'Coriander Leaves',
    category: 'Herbs & Seasonings',
    price: 12,
    imageUrl: 'https://images.unsplash.com/photo-1588879460618-9249e7d947d1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Aromatic coriander leaves for garnish and chutney.',
    brand: 'Fresho',
    stock: 55,
  },
]

export const getProductsLocal = ({
  page = 1,
  pageSize = 10,
  search = '',
  category = '',
  sort = 'asc',
}) => {
  console.log('[API] Loading local fallback data');
  const q = search.toLowerCase()
  let filtered = [...mockData]

  if (q) {
    filtered = filtered.filter((it) => it.name.toLowerCase().includes(q))
  }
  if (category) {
    filtered = filtered.filter((it) => it.category === category)
  }

  filtered.sort((a, b) =>
    sort === 'desc' ? Number(b.price) - Number(a.price) : Number(a.price) - Number(b.price),
  )

  const total = filtered.length
  const start = (page - 1) * pageSize
  const items = filtered.slice(start, start + pageSize)

  return { items, total, isLocal: true }
}

export const getProductDetails = async (id) => {
  console.log(`[API] Fetching product details for ID: ${id}`);
  const urls = [`/cms/products/${id}`, `/cms/products`]

  for (const url of urls) {
    try {
      const res =
        url === '/cms/products'
          ? await api.get(url, { params: { id } })
          : await apiClient.get(url)

      const payload = res.data
      const item =
        payload?.data?.product || payload?.data || payload?.product || payload
      const list = getList(payload)

      if (item && !Array.isArray(item) && typeof item === 'object') {
        return formatItem(item)
      }
      if (list.length > 0) {
        return formatItem(list[0])
      }
    } catch (error) {
    }
  }

  console.error(`[API] Product ID ${id} not found.`);
  throw new Error('Product not found.')
}
