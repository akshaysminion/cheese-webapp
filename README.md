# Cheese Webapp — RINDVERSE MVP

This app now has two faces:

- **RINDVERSE** (homepage `/`): a premium, desktop-first, three.js journey
  - Portal Entry → Living Globe → **Spain / France** → Biome dive → Featured cheese → **Dissection Ritual**
  - **Synesthesia v1**: flavor notes influence palette, motion, and ambient audio
- **Cheese Library** (`/library`): the original list/search/filter experience
  - **Cheese details** remain at `/cheese/:slug`

## Highlights

- **@react-three/fiber + @react-three/drei + GSAP** for cinematic transitions
- **Sound toggle (default OFF)**
  - Uses a lightweight WebAudio engine (UI sounds + RINDVERSE ambient)
- **Respects `prefers-reduced-motion`**
  - Motion defaults to OFF when the OS requests reduced motion
- **Performance-minded**
  - Heavy scenes are **code-split** (dynamic import)
  - **Quality**: Auto / Low / High (affects DPR + antialias)
  - **Pauses rendering when the tab is hidden**
- **Error boundaries**
  - Scene failures do not blank the app; users get a fallback with a link to `/library`

## Routes

- `/` → RINDVERSE experience
- `/library` → Cheese Library list/search
- `/cheese/:slug` → Cheese detail

## Tech

- Vite + React + TypeScript
- react-router-dom
- Three.js via @react-three/fiber + @react-three/drei
- GSAP
- Local JSON dataset: `src/data/cheeses.json`
- Procedural-only visuals (no external textures/models)

## Run locally

```bash
npm install
npm run dev
```

## Project structure (key files)

- `src/pages/RindversePage.tsx` — RINDVERSE state machine + Canvas + overlay UI
- `src/rindverse/content.ts` — Spain/France biomes + featured cheeses
- `src/rindverse/synesthesia.ts` — flavor-notes → palette/motion/audio mapping
- `src/rindverse/audio.ts` — WebAudio ambient engine
- `src/pages/CheeseListPage.tsx` — library list + filters
- `src/pages/CheeseDetailPage.tsx` — detail page
- `src/components/ErrorBoundary.tsx` — resilient UI fallback
- `src/settings/SettingsContext.tsx` — persisted preferences (Sound/Motion/Quality)

## Deploy

This repo uses the existing `deploy.sh` script.
