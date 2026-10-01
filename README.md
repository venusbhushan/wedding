# Venus & Payal — wedding and travel

A mobile-friendly React + TypeScript website inspired by the couple’s Madhubani invitation.

- Wedding countdown to **30 November 2026, midnight IST (UTC+05:30)**.
- Groom-side and bride-side celebration plans.
- Baraat from Begusarai to Muzaffarpur on 30 November at noon, returning on 1 December.
- Google Maps directions, optional starting location, transport choices, station-to-venue links, and copyable addresses.
- Reception details are configured in `src/travel.ts`; its date currently awaits confirmation because the invitation and requested schedule differ.

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

## Vercel

Import this repository with the **Vite** preset. Build command: `npm run build`; output directory: `dist`; root directory: repository root. No environment variables or backend services are required.

## Personalize

- Wedding countdown and celebration plans: `src/App.tsx`
- Addresses, reception date and map helpers: `src/travel.ts`
- Colors and responsive layout: `src/styles.css`
- Title and metadata: `index.html`
- Responsive Madhubani artwork and favicon: `public/`

The Begusarai map link opens the invitation’s locality, not a verified house pin. Route times and transport availability are provided by Google Maps. Countdown ticking pauses when the tab is hidden.
