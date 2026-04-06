import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'

const ProductListPage = lazy(() => import('./pages/ProductListPage'))
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage'))

function App() {
  return (
    <Suspense
      fallback={
        <Box className="page-loader">
          <CircularProgress />
        </Box>
      }
    >
      <Routes>
        <Route path="/" element={<ProductListPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App
