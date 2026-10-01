# Travel research — 1 October 2026

This is a reviewed snapshot of public route information extracted from the pages below, not a live inventory or exhaustive timetable. No fare, seat count, flight number, departure time, or November availability is inferred. Special seasonal trains were excluded where their November operation could not be confirmed.

## Flights

- [Patna arrival network](https://www.flightconnections.com/flights-to-patna-pat), page dated 18 September 2026: airlines and nonstop origins used in `DIRECT.PAT`.
- [Darbhanga arrival network](https://www.flightconnections.com/flights-to-darbhanga-dbr): airlines and nonstop origins used in `DIRECT.DBR`.
- [Delhi arrival network](https://www.flightconnections.com/flights-to-new-delhi-del), page dated 17 September 2026: the selected departure airports all list an IndiGo leg to Delhi. Combined with the published IndiGo Delhi–PAT/DBR legs, this provides a **connection idea**, not a verified through itinerary or same-day connection.
- [IndiGo Kolkata–Darbhanga](https://www.goindigo.in/domestic-flights/kolkata-to-darbhanga-flights.html) advertises direct service, while the reviewed Darbhanga directory omits Kolkata. The website discloses this discrepancy rather than silently promising a nonstop departure.
- [IndiGo Patna–Guwahati](https://www.goindigo.in/domestic-flights/patna-to-guwahati-flights.html) mentions direct flights, but the reviewed Patna network omits Guwahati. The guide conservatively shows a connection idea and does not claim direct flights are unavailable.
- [IndiGo airport and schedule directory](https://www.goindigo.in/information/flight-schedule.html) supplies airport identifiers and an official place to recheck schedules.

The cards show one practical published route or a sourced two-leg network idea. They are not sorted by fare or travel time. Other hubs and airports may be preferable. Patna guests are shown local onward travel instead of an unnecessary flight itinerary.

## Trains

Every train card links its source. Through-train labels refer to the named boarding station, not automatically to the capital city. Gateway transport and separately planned connections are stated above the results. Each origin has results for BGS, BJU and MFP; where the selected service reaches another station, the card names the actual arrival and explicitly requires onward travel.

| Service | Reviewed facts / source |
|---|---|
| 12554 Vaishali | New Delhi / Lucknow to MFP, BJU, BGS — https://www.confirmtkt.com/train-schedule/12554 |
| 15227 Muzaffarpur Express | SMVT Bengaluru, Perambur, Vijayawada, Bhubaneswar and Dankuni to BGS, BJU, MFP — https://erail.in/train-enquiry/15227 |
| 15909 Avadh Assam | Dimapur, Guwahati and New Jalpaiguri to BGS, BJU, MFP — https://etrain.info/train/Avadh-Assam-Exp-15909/schedule |
| 19483 Ahmedabad–Saharsa | Ahmedabad, Rani Kamalapati and Danapur to MFP, BJU, BGS — https://www.confirmtkt.com/train-schedule/19483 |
| 15904 Chandigarh–Dibrugarh | Chandigarh to MFP and BJU; no BGS stop used — https://erail.in/train-enquiry/15904 |
| 22411 Arunachal | Naharlagun to BJU — https://erail.in/train-enquiry/22411 |
| 15232 Gondia–Barauni | Raipur to MFP and BJU — https://erail.in/train-enquiry/15232 |
| 15027 Maurya | Ranchi to BJU and MFP — https://www.confirmtkt.com/train-schedule/15027- |
| 11061 LTT–Jaynagar | Mumbai LTT to MFP — https://erail.in/hi/train-enquiry/11061 |
| 15945 LTT–Dibrugarh | Mumbai LTT / Patna to NBJU and BGS. **NBJU is not BJU.** — https://erail.in/train-enquiry/15945 |
| 13019 Bagh | Howrah to BJU and MFP; do not infer BGS from city-level booking search results — https://www.confirmtkt.com/trains/kolkata-to-muzaffarpur-train-tickets |
| 17005 Hyderabad–Raxaul | Hyderabad Deccan to BJU — https://etrain.info/train/Hyb-Rxl-Express-17005/schedule |
| 14619 Tripura Sundari | Agartala to BJU — https://erail.in/train-enquiry/14619 |
| 19601 Udaipur–NJP | Jaipur to MFP — https://erail.in/train-enquiry/19601 |
| 15002 Dehradun–Muzaffarpur | Dehradun to MFP — https://www.confirmtkt.com/train-schedule/15002-ddn-mfp-express |
| 15550 Patna–Jaynagar | Patna Junction to MFP — https://erail.in/train-enquiry/15550 |
| 12522 Rapti Sagar | Ernakulam to MFP/BJU; Thiruvananthapuram guests need a separate first leg — https://etrain.info/train/Raptisagar-Exp-12522/schedule |
| 12741 Vasco–Patna | Madgaon to Patna, followed by separate Bihar travel — https://erail.in/train-enquiry/12741 |
| 20507 Sairang Rajdhani | Sairang to Guwahati first-leg idea for Aizawl; onward 15909 separately planned — https://erail.in/train-enquiry/20507 |

## Gateway references

- Shillong via Guwahati: https://www.meghalayatourism.in/plan/how-to-reach/air-rail-road/
- Gangtok via Bagdogra / New Jalpaiguri: https://www.sikkim.gov.in/KnowSikkim/about-sikkim/how-to-reach-sikkim (only gateway geography used; old airline names on this page are not used).
- Imphal rail planning: https://www.mapsofindia.com/imphal/travel/by-train.html — the first leg to Guwahati is not a confirmed service in this guide.

## Updating

Review the named train's full stop list and the airline schedule before editing `src/routes.ts`. Keep BJU and NBJU distinct. Do not turn a city-level nearby-station search into a direct-station claim. Keep the research date honest and retain the connection and availability disclosures. Re-run `npm test` and `npm run build` after changing the catalog.
