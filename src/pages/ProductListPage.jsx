import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import ProductGrid from '../components/ProductGrid'
import { fetchProducts } from '../api/products'

function ProductListPage() {
  const [rows, setRows] = useState([])
  const [rowCount, setRowCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [sortModel, setSortModel] = useState([{ field: 'price', sort: 'asc' }])

  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(searchInput.trim()), 450)
    return () => clearTimeout(timer)
  }, [searchInput])

  const sortOrder = useMemo(() => {
    const current = sortModel?.[0]
    if (!current || current.field !== 'price') return 'asc'
    return current.sort === 'desc' ? 'desc' : 'asc'
  }, [sortModel])

  useEffect(() => {
    let isMounted = true
    const run = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await fetchProducts({
          page: paginationModel.page + 1,
          pageSize: paginationModel.pageSize,
          search: searchQuery,
          category,
          sort: sortOrder,
        })
        if (!isMounted) return
        setRows(data.rows)
        setRowCount(data.total)
        setCategories((prev) => {
          const merged = new Set(prev)
          data.rows.forEach((row) => merged.add(row.category))
          return [...merged].filter(Boolean).sort()
        })
      } catch (err) {
        if (!isMounted) return
        setError(
          err?.response?.data?.message ||
            err?.message ||
            'Could not load products. Please try again.',
        )
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    run()
    return () => {
      isMounted = false
    }
  }, [paginationModel, searchQuery, category, sortOrder])

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
      <Stack spacing={2}>
        <Typography variant="h4" fontWeight={700}>
          Product Catalog
        </Typography>
        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ mb: 2 }}
            alignItems={{ sm: 'center' }}
          >
            <TextField
              label="Search by product name"
              value={searchInput}
              onChange={(event) => {
                setPaginationModel((prev) => ({ ...prev, page: 0 }))
                setSearchInput(event.target.value)
              }}
              size="small"
              fullWidth
            />
            <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 220 } }}>
              <InputLabel id="category-filter-label">Category</InputLabel>
              <Select
                labelId="category-filter-label"
                label="Category"
                value={category}
                onChange={(event) => {
                  setPaginationModel((prev) => ({ ...prev, page: 0 }))
                  setCategory(event.target.value)
                }}
              >
                <MenuItem value="">All</MenuItem>
                {categories.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          {error ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          ) : null}

          <Box sx={{ width: '100%', overflowX: 'auto' }}>
            <ProductGrid
              rows={rows}
              rowCount={rowCount}
              loading={loading}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              sortModel={sortModel}
              onSortModelChange={(model) => {
                if (model.length === 0) {
                  setSortModel([{ field: 'price', sort: 'asc' }])
                  return
                }
                const [first] = model
                if (first.field !== 'price') {
                  setSortModel([{ field: 'price', sort: first.sort || 'asc' }])
                  return
                }
                setSortModel([{ field: 'price', sort: first.sort || 'asc' }])
              }}
            />
          </Box>
        </Paper>
      </Stack>
    </Container>
  )
}

export default ProductListPage
