# Cheese Webapp

A small webapp for browsing cheese types with a list view + detail pages, including search & filters.

## Tech

- Vite + React + TypeScript
- react-router-dom
- Local JSON dataset (`src/data/cheeses.json`)
- Simple CSS styling (`src/index.css`)

## Run locally

```bash
npm install
npm run dev
```

Open the printed local URL (usually http://localhost:5173).

## What’s included per cheese

As available in the dataset:

- Name, country/region
- Milk type, texture
- Aging range/typical
- Flavor notes, aroma
- Rind type, paste type
- Fat %
- PDO/PGI status (when known / if labeled)
- Typical pairings (wine/beer/fruit/bread)
- Allergens
- Vegetarian suitability
- How to store
- Serving suggestions

## Project structure

- `src/data/cheeses.json` — local cheese data (~25 entries)
- `src/types.ts` — data types
- `src/lib/cheeseData.ts` — data helpers
- `src/pages/CheeseListPage.tsx` — list + search/filters
- `src/pages/CheeseDetailPage.tsx` — detail page
- `src/components/*` — tiny UI primitives
