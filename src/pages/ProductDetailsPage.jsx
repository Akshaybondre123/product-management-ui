import { useEffect, useState } from 'react'
import { Link as RouterLink, useLocation, useParams } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { getProductDetails } from '../api/products'

const fmt = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

function ItemView() {
  const { id } = useParams()
  const loc = useLocation()

  const [item, setItem] = useState(loc.state?.product || null)
  const [wait, setWait] = useState(!loc.state?.product)
  const [errMsg, setErrMsg] = useState('')

  useEffect(() => {
    if (item) return
    let active = true
    const load = async () => {
      console.log('getting item:', id)
      setWait(true); setErrMsg('')
      try {
        const data = await getProductDetails(id)
        if (active) setItem(data)
      } catch (err) {
        if (active) setErrMsg('Failed to load item.')
      } finally {
        if (active) setWait(false)
      }
    }
    load()
    return () => { active = false }
  }, [id, item])

  return (
    <Box sx={{ bgcolor: '#fafafa', minHeight: '100vh', pb: 8 }}>
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 5 } }}>
        <Button
          component={RouterLink} to="/" startIcon={<span style={{ fontSize: 20 }}>←</span>}
          sx={{ mb: 4, textTransform: 'none', color: '#666', fontWeight: 600 }}
        >
          Go Back
        </Button>

        {wait && <Box className="page-loader"><CircularProgress color="primary" /></Box>}
        {errMsg && <Alert severity="error" sx={{ mx: 'auto', maxWidth: 600 }}>{errMsg}</Alert>}

        {!wait && !errMsg && item && (
          <Paper elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid #eee', bgcolor: '#fff' }}>
            <Stack direction={{ xs: 'column', md: 'row' }}>
              <Box sx={{ flex: '1 1 50%', bgcolor: '#fcfcfc', display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 2, sm: 6 }, borderRight: { md: '1px solid #eee' } }}>
                <Box component="img" src={item.imageUrl} alt={item.name} sx={{ maxWidth: '100%', maxHeight: 500, objectFit: 'contain' }} />
              </Box>

              <Box sx={{ flex: '1 1 50%', p: { xs: 3, sm: 6 } }}>
                <Stack spacing={3}>
                  <Box>
                    <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                      <Chip
                        label={item.category}
                        size="small"
                        sx={{ bgcolor: '#f0f4f8', color: '#1976d2', fontWeight: 600, border: 'none', borderRadius: 1.5 }}
                      />
                      <Chip
                        label={item.brand}
                        size="small"
                        sx={{ bgcolor: '#fff8e1', color: '#f57c00', fontWeight: 600, border: 'none', borderRadius: 1.5 }}
                      />
                    </Stack>
                    <Typography variant="h3" fontWeight={900} sx={{ color: '#1a1a1a', mb: 1 }}>{item.name}</Typography>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography variant="h4" color="primary.main" fontWeight={900} sx={{ mb: 0.5 }}>
                      {fmt.format(item.price || 0)}
                    </Typography>
                    <Typography variant="body2" fontWeight={600} color={item.stock > 0 ? 'success.main' : 'error.main'}>
                      {item.stock > 0 ? `In Stock (${item.stock})` : 'Out of Stock'}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle1" fontWeight={700} gutterBottom sx={{ color: '#666' }}>Description</Typography>
                    <Typography variant="body1" sx={{ color: '#333', lineHeight: 1.7 }}>{item.description}</Typography>
                  </Box>

                  <Box sx={{ pt: 2 }}>
                    <Button variant="contained" size="large" disabled={item.stock <= 0} sx={{ px: 8, py: 2, borderRadius: 3, textTransform: 'none', fontWeight: 700 }}>
                      {item.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </Paper>
        )}
      </Container>
    </Box>
  )
}

export default ItemView
