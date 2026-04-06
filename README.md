# Product Catalog - React + MUI DataGrid

This project is built for your front-end assignment using:

- React (Vite)
- Material UI
- MUI DataGrid (server-side pagination/sort)
- React Router
- Axios

## Features Implemented

1. MUI `DataGrid` for listing products
2. Data fetched from API with required header: `x-internal-call: true`
3. Product image shown in each row
4. Product details page (`/products/:id`)
5. Search filter by product name
6. Category filter dropdown
7. Price sort (`ASC` / `DESC`) via DataGrid sorting
8. Pagination from DataGrid itself (server mode)
9. Lazy loading (route lazy + image lazy), loader, error handling
10. Responsive UI for mobile/tablet/desktop
11. Deploy-ready for Vercel / Netlify with route rewrites

## API Configuration

Create `.env` file:

```bash
VITE_API_BASE_URL=https://catalog-management-system-dev-ak3ogf6zeauc.a.run.app
```

Or copy from `.env.example`.

## Local Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deployment

### Vercel

- `vercel.json` is included for SPA routing.
- Build command: `npm run build`
- Output directory: `dist`

### Netlify

- `netlify.toml` is included for SPA routing.
- Build command: `npm run build`
- Publish directory: `dist`

## Interview Notes (Short)

- `DataGrid` is configured with `paginationMode="server"` and `sortingMode="server"` so pagination/sort are API-driven.
- Search input is debounced before API call to reduce request frequency.
- API response normalization is used because real APIs often have varying field names.
- Details page supports state-based navigation and fallback API fetch by product id.
- CORS issue on deployed URL is expected based on assignment note.
