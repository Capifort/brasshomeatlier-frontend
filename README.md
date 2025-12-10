# Brass Hardware Store (React + Vite + Material UI)

Material Design e‑commerce scaffold for selling brass hardware (dummy data).

## Features

- Material UI theme with brass-inspired palette
- Navbar with nested Categories → SKUs dropdown
- Pages: Home, Category listing, SKU detail
- SKU detail: pricing per kg, minimum order, lead time
- "Get Quote" dialog (dummy submit to console)

## Tech

- React 18 + TypeScript, Vite
- Material UI v6
- React Router v6

## Getting Started

1. Install dependencies:

```bash
pnpm install
# or: npm install
# or: yarn
```

2. Run the dev server:

```bash
pnpm dev
# or: npm run dev
# or: yarn dev
```

Open http://localhost:5173

## Structure

```
src/
  components/
    Navbar.tsx
    CategoryList.tsx
    SkuCard.tsx
    SkuGrid.tsx
    QuoteDialog.tsx
  data/
    mockData.ts
  pages/
    Home.tsx
    CategoryPage.tsx
    SkuDetailPage.tsx
  App.tsx
  main.tsx
  theme.ts
  styles.css
```

## Notes

- Images use unsplash placeholders.
- Replace the `QuoteDialog` submit with a real API when ready.


