import { Avatar, Box, Chip, Stack, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useNavigate } from 'react-router-dom'

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
})

function ProductGrid({
  rows,
  rowCount,
  loading,
  paginationModel,
  onPaginationModelChange,
  sortModel,
  onSortModelChange,
}) {
  const navigate = useNavigate()

  const columns = [
    {
      field: 'imageUrl',
      headerName: 'Image',
      width: 90,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Avatar
          variant="rounded"
          src={params.value}
          imgProps={{ loading: 'lazy' }}
          sx={{ width: 48, height: 48 }}
        >
          {params.row.name?.[0] || 'P'}
        </Avatar>
      ),
    },
    {
      field: 'name',
      headerName: 'Product Name',
      flex: 1.3,
      minWidth: 220,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={600}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: 1,
      minWidth: 160,
      sortable: false,
      renderCell: (params) => (
        <Chip size="small" label={params.value || 'Uncategorized'} variant="outlined" />
      ),
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 140,
      type: 'number',
      renderCell: (params) => currency.format(params.value || 0),
    },
    {
      field: 'stock',
      headerName: 'Stock',
      width: 100,
      type: 'number',
    },
  ]

  return (
    <Box sx={{ width: '100%' }}>
      <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
        loading={loading}
        pagination
        rowCount={rowCount}
        paginationMode="server"
        sortingMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        pageSizeOptions={[5, 10, 20, 50]}
        sortModel={sortModel}
        onSortModelChange={onSortModelChange}
        disableRowSelectionOnClick
        onRowClick={(params) => {
          navigate(`/products/${params.row.id}`, {
            state: { product: params.row },
          })
        }}
        sx={{
          '& .MuiDataGrid-row': { cursor: 'pointer' },
          '& .MuiDataGrid-cell': { py: 1 },
        }}
      />
      <Stack direction="row" justifyContent="space-between" sx={{ mt: 1, px: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          Tip: Click any row to open details page.
        </Typography>
      </Stack>
    </Box>
  )
}

export default ProductGrid
