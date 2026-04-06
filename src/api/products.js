import axios from 'axios'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://catalog-management-system-dev-ak3ogf6zeauc.a.run.app'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'x-internal-call': 'true',
  },
})

const getField = (obj, keys, fallback = '') => {
  for (const key of keys) {
    const value = key.split('.').reduce((acc, part) => acc?.[part], obj)
    if (value !== undefined && value !== null && value !== '') {
      return value
    }
  }
  return fallback
}

const toNumber = (value) => {
  const num = Number(value)
  return Number.isFinite(num) ? num : 0
}

export const normalizeProduct = (raw, index = 0) => {
  const images = raw.images || raw.productImages || []
  const imageCandidate = Array.isArray(images) ? images[0] : images
  const imageUrl =
    getField(raw, ['image', 'imageUrl', 'thumbnail', 'productImage']) ||
    (typeof imageCandidate === 'string'
      ? imageCandidate
      : imageCandidate?.url || '')

  return {
    id: getField(raw, ['_id', 'id', 'productId', 'sku'], `row-${index}`),
    name: getField(raw, ['productName', 'name', 'title'], 'Unknown Product'),
    category: getField(
      raw,
      ['category.name', 'category.title', 'category', 'productCategory'],
      'Uncategorized',
    ),
    price: toNumber(getField(raw, ['price', 'sellingPrice', 'mrp', 'amount'], 0)),
    imageUrl,
    description: getField(
      raw,
      ['description', 'about', 'details', 'shortDescription'],
      'No description available.',
    ),
    brand: getField(raw, ['brand.name', 'brand', 'manufacturer'], 'N/A'),
    stock: toNumber(getField(raw, ['stock', 'inventory', 'quantity'], 0)),
    raw,
  }
}

const extractList = (payload) => {
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

const extractTotal = (payload, fallback) =>
  Number(
    payload?.total ||
      payload?.totalCount ||
      payload?.count ||
      payload?.pagination?.total ||
      fallback,
  )

export const fetchProducts = async ({
  page = 1,
  pageSize = 10,
  search = '',
  category = '',
  sort = 'asc',
}) => {
  const params = {
    page,
    limit: pageSize,
    search,
    category,
    sortBy: 'price',
    sortOrder: sort,
  }

  const response = await apiClient.get('/cms/products', { params })
  const payload = response.data
  const list = extractList(payload)
  const rows = list.map((item, index) => normalizeProduct(item, index))
  const total = extractTotal(payload, rows.length)

  return { rows, total }
}

export const fetchProductById = async (id) => {
  const attemptUrls = [`/cms/products/${id}`, `/cms/products`]

  for (const url of attemptUrls) {
    try {
      const response =
        url === '/cms/products'
          ? await apiClient.get(url, { params: { id } })
          : await apiClient.get(url)
      const payload = response.data
      const single =
        payload?.data?.product || payload?.data || payload?.product || payload
      const list = extractList(payload)

      if (single && !Array.isArray(single) && typeof single === 'object') {
        return normalizeProduct(single)
      }
      if (list.length > 0) {
        return normalizeProduct(list[0])
      }
    } catch (error) {
      // continue fallback attempts
    }
  }

  throw new Error('Product not found.')
}
