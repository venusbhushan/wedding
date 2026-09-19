# Wedding countdown

A mobile-friendly React + TypeScript website with Bihar-inspired Madhubani artwork and live countdowns for:

- Engagement: **21 October 2026**
- Wedding: **30 November 2026**

Both countdowns end at midnight in **India Standard Time (UTC+05:30)**.

## Run locally

Requires Node.js 22.13 or later.

```sh
npm ci
npm run dev
```

## Build

```sh
npm run build
npm run preview
```

## Deploy on Vercel

Import this repository into Vercel and use its **Vite** preset:

- Build command: `npm run build`
- Output directory: `dist`
- Root directory: repository root

No environment variables or backend services are required. Deployment is left to the repository owner.

## Personalize

- Dates and event messages: `src/App.tsx`
- Colors and responsive layout: `src/styles.css`
- Title and metadata: `index.html`
- Artwork and favicon: `public/`

The page supports browser zoom, phone safe areas, responsive WebP artwork, and reduced work while the tab is hidden. The artwork was generated specifically for this website.
