import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'

const Catalog = lazy(() => import('./pages/ProductListPage'))
const Details = lazy(() => import('./pages/ProductDetailsPage'))

function App() {
  return (
    <Suspense
      fallback={
        <Box className="page-loader">
          <CircularProgress color="primary" />
        </Box>
      }
    >
      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/products/:id" element={<Details />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App
