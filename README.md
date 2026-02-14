# Cheese Webapp

A high-polish cheese browser with list/search/filters + detail pages **and an interactive 3D cheese hero**.

## Highlights

- **Interactive 3D cheese** (procedural wedge) built with **Three.js** via **@react-three/fiber** + **@react-three/drei**
  - Drag to rotate, scroll to zoom
  - Subtle lighting + contact shadows
- **Settings (top-right):**
  - **Sound** (default OFF) — subtle Web Audio UI sounds
  - **Motion** — transitions + card tilt/parallax
  - **3D quality** — Auto / Low / High
- **Performance-minded**
  - 3D loads lazily (code-split)
  - Pauses 3D when the tab is hidden
  - Auto quality downgrades on coarse pointer / low-end devices
  - Respects `prefers-reduced-motion`
- **Accessibility**
  - Keyboard-accessible Settings dialog (Esc to close)
  - Switches use `role="switch"` + `aria-checked`

## Tech

- Vite + React + TypeScript
- react-router-dom
- Three.js via @react-three/fiber + @react-three/drei
- Local JSON dataset (`src/data/cheeses.json`)
- CSS micro-interactions (`src/index.css`)

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
- `src/pages/CheeseListPage.tsx` — list + search/filters (+ 3D hero)
- `src/pages/CheeseDetailPage.tsx` — detail page (+ compact 3D hero)
- `src/components/LazyCheeseHero3D.tsx` — lazy-loaded 3D entrypoint
- `src/components/CheeseHero3D.tsx` — R3F scene + procedural cheese wedge
- `src/components/SettingsButton.tsx` — Settings dialog (Sound/Motion/Quality)
- `src/lib/uiSounds.ts` — Web Audio UI bleeps
- `src/settings/SettingsContext.tsx` — persisted preferences
- `src/components/*` — UI primitives
