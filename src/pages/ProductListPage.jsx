import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  InputAdornment,
} from '@mui/material'
import ProductGrid from '../components/ProductGrid'
import { getProducts, getProductsLocal } from '../api/products'

function Inventory() {
  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const [isOffline, setIsOffline] = useState(false)

  const [qInput, setQInput] = useState('')
  const [qReal, setQReal] = useState('')

  const [cat, setCat] = useState('')
  const [cats, setCats] = useState([])

  const [pageCfg, setPageCfg] = useState({ page: 0, pageSize: 10 })
  const [sortCfg, setSortCfg] = useState([{ field: 'price', sort: 'asc' }])

  useEffect(() => {
    const t = setTimeout(() => setQReal(qInput.trim()), 450)
    return () => clearTimeout(t)
  }, [qInput])

  const sortOrder = useMemo(() => {
    const s = sortCfg?.[0]
    return s?.sort === 'desc' ? 'desc' : 'asc'
  }, [sortCfg])

  useEffect(() => {
    let alive = true
    const run = async () => {
      console.log('fetching catalog...');
      setLoading(true)
      setErr('')

      const args = {
        page: pageCfg.page + 1,
        pageSize: pageCfg.pageSize,
        search: qReal,
        category: cat,
        sort: sortOrder,
      }

      try {
        const data = await getProducts(args)
        if (!alive) return
        setList(data.items)
        setTotal(data.total)
        setIsOffline(false)
        setCats((prev) => {
          const s = new Set(prev)
          data.items.forEach((it) => s.add(it.category))
          return [...s].filter(Boolean).sort()
        })
      } catch (e) {
        if (!alive) return
        const res = getProductsLocal(args)
        setList(res.items)
        setTotal(res.total)
        setIsOffline(true)
        setCats((prev) => {
          const s = new Set(prev)
          res.items.forEach((it) => s.add(it.category))
          return [...s].filter(Boolean).sort()
        })
        setErr('Unable to reach server. Showing local data.')
      } finally {
        if (alive) setLoading(false)
      }
    }
    run()
    return () => { alive = false }
  }, [pageCfg, qReal, cat, sortOrder])

  const tryAgain = async () => {
    console.log('retrying...');
    setLoading(true)
    setErr('')
    const args = { page: pageCfg.page + 1, pageSize: pageCfg.pageSize, search: qReal, category: cat, sort: sortOrder }
    try {
      const data = await getProducts(args)
      setList(data.items); setTotal(data.total); setIsOffline(false)
      setCats((p) => {
        const s = new Set(p); data.items.forEach((it) => s.add(it.category)); return [...s].filter(Boolean).sort()
      })
      console.log('back online');
    } catch (e) {
      const res = getProductsLocal(args)
      setList(res.items); setTotal(res.total); setIsOffline(true); setErr('Retry failed.')
    } finally { setLoading(false) }
  }

  return (
    <Box sx={{ bgcolor: '#fafafa', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 6 } }}>
        <Stack spacing={4}>
          <Box>
            <Typography variant="h3" fontWeight={900} sx={{ color: '#000', letterSpacing: '-1px' }}>
              Product Catalog
            </Typography>
            <Box sx={{ width: 60, height: 4, bgcolor: 'primary.main', mt: 1, borderRadius: 2 }} />
          </Box>

          <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, border: '1px solid #eee', bgcolor: '#fff' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }} alignItems={{ sm: 'center' }}>
              <TextField 
                placeholder="Find items..." value={qInput} onChange={(e) => { setPageCfg((p) => ({ ...p, page: 0 })); setQInput(e.target.value) }} 
                size="small" fullWidth 
                InputProps={{ startAdornment: <InputAdornment position="start"><span>🔍</span></InputAdornment>, sx: { borderRadius: 2, bgcolor: '#fcfcfc' } }} 
              />
              <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 240 } }}>
                <InputLabel id="cat-label">Category</InputLabel>
                <Select labelId="cat-label" label="Category" value={cat} onChange={(e) => { setPageCfg((p) => ({ ...p, page: 0 })); setCat(e.target.value) }} displayEmpty renderValue={(val) => val === '' ? 'All categories' : val} startAdornment={<InputAdornment position="start" sx={{ ml: 1 }}><span>📁</span></InputAdornment>} sx={{ borderRadius: 2, bgcolor: '#fcfcfc' }}>
                  <MenuItem value=""><em>All categories</em></MenuItem>
                  {cats.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 220 } }}>
                <InputLabel id="sort-label">Sort by price</InputLabel>
                <Select labelId="sort-label" label="Sort by price" value={sortOrder} onChange={(e) => { setSortCfg([{ field: 'price', sort: e.target.value }]) }} startAdornment={<InputAdornment position="start" sx={{ ml: 1 }}><span>↕️</span></InputAdornment>} sx={{ borderRadius: 2, bgcolor: '#fcfcfc' }}>
                  <MenuItem value="asc">Low to high</MenuItem>
                  <MenuItem value="desc">High to low</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            {err && (
              <Alert severity="error" variant="outlined" sx={{ mb: 2, borderRadius: 2 }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
                  <Box>{err}</Box>
                  {isOffline && <Button size="small" variant="contained" color="error" onClick={tryAgain} sx={{ textTransform: 'none', ml: 'auto' }}>Retry</Button>}
                </Stack>
              </Alert>
            )}

            <Box sx={{ width: '100%' }}>
              <ProductGrid 
                rows={list} rowCount={total} loading={loading} paginationModel={pageCfg} onPaginationModelChange={setPageCfg} sortModel={sortCfg} 
                onSortModelChange={(m) => m.length ? setSortCfg([{ field: 'price', sort: m[0].sort || 'asc' }]) : setSortCfg([{ field: 'price', sort: 'asc' }])} 
              />
            </Box>
          </Paper>
        </Stack>
      </Container>
    </Box>
  )
}

export default Inventory
