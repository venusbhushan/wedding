# Payal & Venus — a Madhubani wedding

A responsive React + TypeScript wedding website for **30 November 2026**, with a wedding-only countdown (midnight IST), groom/bride celebration plans, and a Madhubani invitation theme.

## Travel guide

Choose from all 28 Indian states plus Delhi. The only flight arrival is Darbhanga (DBR) and the only rail arrival is Muzaffarpur Junction (MFP). Timetable links show published services. Use Google Flights or IRCTC for travel-date availability. Gateway stations and independently arranged first legs are labelled. No maps are embedded or linked.

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

Location is approximate (IP-based); VPNs and mobile networks can report a different region. The app requests no GPS permission, sends no location to a third-party API, and stores no location. The endpoint returns only the greeting and language, with private/no-store browser and CDN caching. The greeting, couple’s names, countdown caption, portrait caption, wedding event, scrolling blessing and footer invitation change language; the remaining content stays as designed. Local Vite development falls back to English; the geographic headers are available on Vercel.

References: [Vercel request headers](https://vercel.com/docs/headers/request-headers), [Goa official language](https://www.goa.gov.in/department/official-language/), [Mizoram state profile](https://ceo.mizoram.gov.in/state-profile1), [Meghalaya language decision](https://meghalaya.gov.in/meghalaya/sites/default/files/press_release/Press_Release_DIPR_53.pdf).

## Share a language-specific invitation

Add `?lang=hi` for Hindi or `?lang=en` for English, before any section anchor (for example `https://vp-wedddng.vercel.app/?lang=hi#home`). A supported URL language overrides both location detection and a saved browser preference; `?lang=auto` explicitly uses location detection. Without a valid parameter, the saved preference applies, then location detection.

Supported codes: `en`, `hi`, `bn`, `as`, `gu`, `mr`, `kok`, `kn`, `ml`, `ta`, `te`, `or`, `pa`, `ne`, `mni`, `lus`, `ur`, `es` (Spanish), `tr` (Turkish), `el` (Greek). The footer language selector updates the URL so the selected language can be shared. This controls the existing localized greeting, couple’s names, countdown caption, portrait caption, wedding event, scrolling blessing and footer invitation; the other components remain as designed. Travel origin still follows approximate location independently of the language.


## Host metrics dashboard

Open `/dashboard` and sign in using `METRICS_DASHBOARD_PASSWORD`. This server-only password signs a seven-day HttpOnly session cookie. Metrics reads require that cookie. Vercel Blob stores private event batches using the project’s `BLOB_READ_WRITE_TOKEN`.

Capture covers anonymous visits, page views, foreground reading time, section and scroll milestones, WhatsApp clicks, venue directions, flight and rail links, selected origins, transport mode and languages. Approximate country/state is supplied by Vercel. Only referring hostnames and explicit campaign/source tags are retained. No IP addresses, WhatsApp messages or personal contact fields are stored. The collector respects Do Not Track. Clicks do not prove attendance or completed bookings.

Reports use UTC calendar days, deduplicate retried event IDs and use the greatest reading-time heartbeat per page. Reads are bounded at 10,000 batches and explicitly show when a report is partial. Counts start at deployment, with no historical backfill. Private Blob storage uses the Vercel account’s usage allowance and billing.

For local development, put `METRICS_DASHBOARD_PASSWORD=<your password>` in gitignored `.env.local`. Run `npm run dev:api` and `npm run dev` in separate terminals. Local capture is written to gitignored `.local-metrics/`; local browsing does not write to production storage. Local QA traffic is labelled with `utm_campaign=local-validation`. No sample data is preloaded. A shared URL can include `?utm_campaign=batchmates` to group its traffic.
