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

## Location-aware greeting

`api/greeting.js` reads Vercel's `x-vercel-ip-country` and `x-vercel-ip-country-region` headers. `lib/greeting.mjs` maps Indian states and union territories to one official language per region. International requests, unrecognized regions and network failures display English. Meghalaya, Arunachal Pradesh and Nagaland use English, an official language in each. In multilingual states this is a display default, not a statement about a visitor's language.

Location is approximate (IP-based); VPNs and mobile networks can report a different region. The app requests no GPS permission, sends no location to a third-party API, and stores no location. The endpoint returns only the greeting and language, with private/no-store browser and CDN caching. Only the opening wedding greeting changes language; the rest of the site stays as designed. Local Vite development falls back to English; the geographic headers are available on Vercel.

References: [Vercel request headers](https://vercel.com/docs/headers/request-headers), [Goa official language](https://www.goa.gov.in/department/official-language/), [Mizoram state profile](https://ceo.mizoram.gov.in/state-profile1), [Meghalaya language decision](https://meghalaya.gov.in/meghalaya/sites/default/files/press_release/Press_Release_DIPR_53.pdf).
