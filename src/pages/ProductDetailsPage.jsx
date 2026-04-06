import { useEffect, useState } from 'react'
import { Link as RouterLink, useLocation, useParams } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from '@mui/material'
import { fetchProductById } from '../api/products'

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
})

function ProductDetailsPage() {
  const { id } = useParams()
  const location = useLocation()
  const [product, setProduct] = useState(location.state?.product || null)
  const [loading, setLoading] = useState(!location.state?.product)
  const [error, setError] = useState('')

  useEffect(() => {
    if (product) return
    let isMounted = true
    const run = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await fetchProductById(id)
        if (isMounted) setProduct(data)
      } catch (err) {
        if (isMounted) {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              'Could not fetch product details.',
          )
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    run()
    return () => {
      isMounted = false
    }
  }, [id, product])

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 } }}>
      <Button component={RouterLink} to="/" variant="text" sx={{ mb: 2 }}>
        Back to Products
      </Button>

      {loading ? (
        <Box className="page-loader">
          <CircularProgress />
        </Box>
      ) : null}

      {error ? <Alert severity="error">{error}</Alert> : null}

      {!loading && !error && product ? (
        <Card variant="outlined">
          <CardMedia
            component="img"
            image={product.imageUrl || 'https://via.placeholder.com/700x420?text=No+Image'}
            alt={product.name}
            sx={{ objectFit: 'contain', maxHeight: 420, bgcolor: '#f8f8f8', p: 2 }}
          />
          <CardContent>
            <Stack spacing={1.5}>
              <Typography variant="h4" fontWeight={700}>
                {product.name}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                <Chip label={product.category} size="small" />
                <Typography variant="body2" color="text.secondary">
                  Brand: {product.brand}
                </Typography>
              </Stack>
              <Typography variant="h5" color="success.main" fontWeight={700}>
                {currency.format(product.price || 0)}
              </Typography>
              <Typography variant="body1">{product.description}</Typography>
              <Typography variant="body2" color="text.secondary">
                Available stock: {product.stock}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      ) : null}
    </Container>
  )
}

export default ProductDetailsPage
