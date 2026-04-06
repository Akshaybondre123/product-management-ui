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

