import { Avatar, Box, Chip, Stack, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useNavigate } from 'react-router-dom'

const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const defaultImg = 'https://via.placeholder.com/64x64?text=IMG'

function ItemsGrid({
  rows,
  rowCount,
  loading,
  paginationModel,
  onPaginationModelChange,
  sortModel,
  onSortModelChange,
}) {
  const navigate = useNavigate()

  const cols = [
    {
      field: 'imageUrl',
      headerName: 'Image',
      width: 80,
      sortable: false,
      filterable: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: (p) => (
        <Avatar
          variant="rounded"
          src={p.value || defaultImg}
          imgProps={{ loading: 'lazy' }}
          sx={{
            width: 44,
            height: 44,
            border: '1px solid #f0f0f0',
            bgcolor: '#fafafa',
            multiline: true,
            '& img': { objectFit: 'contain' }
          }}
        >
          {p.row.name?.[0] || 'P'}
        </Avatar>
      ),
    },
    {
      field: 'name',
      headerName: 'Product Name',
      flex: 1.5,
      minWidth: 250,
      renderCell: (p) => (
        <Box sx={{ py: 1 }}>
          <Typography variant="body2" fontWeight={700} color="text.primary" sx={{ lineHeight: 1.2, whiteSpace: 'normal' }}>
            {p.value}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', whiteSpace: 'normal' }}>
            {p.row.brand || 'Fresho'}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 180,
      headerAlign: 'center',
      align: 'center',
      renderCell: (p) => (
        <Chip
          size="small"
          label={p.value || 'Misc'}
          variant="soft"
          sx={{
            bgcolor: '#ebf5e1',
            color: '#4e7021',
            fontWeight: 600,
            fontSize: '0.7rem',
            borderRadius: '4px'
          }}
        />
      ),
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 140,
      type: 'number',
      headerAlign: 'center',
      align: 'center',
      renderCell: (p) => (
        <Typography variant="body2" fontWeight={800} color="#111">
          {inr.format(p.value || 0)}
        </Typography>
      ),
    },
    {
      field: 'stock',
      headerName: 'Stock',
      width: 120,
      type: 'number',
      headerAlign: 'center',
      align: 'center',
      renderCell: (p) => (
        <Stack direction="row" alignItems="center" spacing={0.5} justifyContent="center">
          <span style={{ fontSize: 14 }}>📦</span>
          <Typography variant="body2" color={p.value > 0 ? 'text.secondary' : 'error.main'}>
            {p.value}
          </Typography>
        </Stack>
      ),
    },
  ]

  return (
    <Box sx={{ width: '100%', mt: 1 }}>
      <DataGrid
        autoHeight
        rows={rows}
        columns={cols}
        loading={loading}
        pagination
        rowCount={rowCount}
        paginationMode="server"
        sortingMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={(m) => {
          console.log('[Table] Page model updated:', m);
          onPaginationModelChange(m);
        }}
        pageSizeOptions={[5, 10, 15]}
        sortModel={sortModel}
        onSortModelChange={(m) => {
          console.log('[Table] Sort updated:', m);
          onSortModelChange(m);
        }}
        disableRowSelectionOnClick
        disableColumnFilter
        disableColumnMenu
        getRowHeight={() => 'auto'}
        getEstimatedRowHeight={() => 64}
        onRowClick={(p) => {
          console.log('[Table] Row clicked, navigating to:', p.row.id);
          navigate(`/products/${p.row.id}`, { state: { product: p.row } })
        }}
        sx={{
          border: 'none',
          '& .MuiDataGrid-columnHeaders': {
            bgcolor: '#f8f9fa',
            borderRadius: '4px 4px 0 0',
            borderBottom: '1px solid #eee'
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 700,
            color: '#666',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          },
          '& .MuiDataGrid-row': {
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            borderBottom: '1px solid #f9f9f9',
            '&:hover': { bgcolor: '#f4fcf0 !important' }
          },
          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
            display: 'flex',
            alignItems: 'center',
            py: 1.5
          },
          '& .MuiDataGrid-footerContainer': { borderTop: '1px solid #eee' }
        }}
      />
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1.5, px: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', opacity: 0.8 }}>
          * Tap on a product to see more details.
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
          {rowCount} Items found
        </Typography>
      </Stack>
    </Box>
  )
}

export default ItemsGrid
