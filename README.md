# Venus & Payal — a Madhubani wedding

A responsive React + TypeScript wedding website for **30 November 2026**, with a wedding-only countdown (midnight IST), groom/bride celebration plans, and a Madhubani invitation theme.

## Travel guide

Choose from all 28 Indian states plus Delhi. Flight cards cover Patna (PAT) and Darbhanga (DBR); rail cards cover Begusarai (BGS), Barauni Junction (BJU), and Muzaffarpur Junction (MFP). Nearby gateways, connection ideas and onward transfers are explicitly identified. No maps are embedded or linked.

The guide is a sourced snapshot researched on 1 October 2026, **not live seat availability**. It shows selected services rather than every train or flight. Fares, operating dates, flight numbers and departure times must be checked with the linked booking or schedule providers. See [RESEARCH.md](RESEARCH.md) for sources, discrepancies and maintenance notes.

## Run

Node.js 22.13 or newer:

```sh
npm ci
npm run dev
npm test
npm run build
```

Vercel: Vite preset, build `npm run build`, output `dist`, repository root. No environment variables or backend required. Pushes to main use the existing Vercel integration.

## Edit

- `src/routes.ts`: capital cities, gateways, sourced airline and train records.
- `src/travel.ts`: venue and reception details (reception date still awaits confirmation).
- `src/App.tsx`: countdown and guest experience.
- `src/styles.css`: responsive Madhubani design.
- `public/`: invitation artwork and favicon.
