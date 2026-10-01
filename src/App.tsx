import { useEffect, useRef, useState } from "react";
import type { FormEvent, SVGProps } from "react";
import { PLACES, RECEPTION, directionsUrl, placeUrl, sideDestination } from "./travel";
import type { Destination, GuestSide, TravelMode } from "./travel";

const EVENTS = [
  { id: "wedding", title: "Wedding", date: "30 November 2026", iso: "2026-11-30T00:00:00+05:30", nextDay: "2026-12-01T00:00:00+05:30", today: "It’s wedding day!", past: "Our forever has begun." },
];

function Icon({ kind, ...props }: SVGProps<SVGSVGElement> & { kind: "pin" | "arrow" | "car" | "train" | "copy" | "check" }) {
  const paths = {
    pin: <><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    arrow: <><path d="M4 12h16M14 6l6 6-6 6"/></>,
    car: <><path d="m4 9 2-5h12l2 5M3 9h18v9H3zM5 18v3M19 18v3M6 13h2M16 13h2"/></>,
    train: <><rect x="5" y="2" width="14" height="16" rx="3"/><path d="M5 10h14M12 2v8M7 18l-2 4M17 18l2 4M7 21h10M8 14h1M15 14h1"/></>,
    copy: <><rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V3H3v14h5"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" aria-hidden="true" {...props}>{paths[kind]}</svg>;
}

function Countdown({ now }: { now: number | null }) {
  return <section className="countdowns" aria-label="Countdown to our wedding">
    {EVENTS.map(event => {
      const target = Date.parse(event.iso);
      const total = now === null ? null : Math.max(0, Math.ceil((target - now) / 1000));
      const values = total === null ? [null, null, null, null] : [Math.floor(total / 86400), Math.floor(total % 86400 / 3600), Math.floor(total % 3600 / 60), total % 60];
      return <div key={event.id} className="countdown">
        <div className="countdown-label"><h2>{event.title}</h2><time dateTime={event.iso}>{event.date}</time></div>
        <div role="timer" aria-label={`Time until ${event.title.toLowerCase()}`} aria-live="off" className="timer">
          {values.map((value, index) => <span className="unit" key={index}><strong>{value === null ? "—" : String(value).padStart(2, "0")}</strong><span>{["Days", "Hours", "Minutes", "Seconds"][index]}</span></span>)}
        </div>
        {total === 0 && <p className="event-status" role="status">{now! < Date.parse(event.nextDay) ? event.today : event.past}</p>}
      </div>;
    })}
  </section>;
}

export default function App() {
  const [now, setNow] = useState<number | null>(null);
  const [side, setSide] = useState<GuestSide>("groom");
  const [destination, setDestination] = useState<Destination>("begusarai");
  const [origin, setOrigin] = useState("");
  const [mode, setMode] = useState<TravelMode>("driving");
  const [copied, setCopied] = useState<Destination | null>(null);
  const [copyError, setCopyError] = useState<Destination | null>(null);
  const copyTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    let interval: number | undefined;
    const syncClock = () => {
      window.clearInterval(interval);
      setNow(Date.now());
      if (!document.hidden) interval = window.setInterval(() => setNow(Date.now()), 1000);
    };
    syncClock();
    document.addEventListener("visibilitychange", syncClock);
    return () => { window.clearInterval(interval); window.clearTimeout(copyTimer.current); document.removeEventListener("visibilitychange", syncClock); };
  }, []);

  function changeSide(next: GuestSide) { setSide(next); setDestination(sideDestination(next)); }
  async function copyAddress(place: Destination) {
    try {
      await navigator.clipboard.writeText(`${PLACES[place].title}, ${PLACES[place].address}`);
      setCopied(place); setCopyError(null);
      window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(null), 2500);
    } catch { setCopyError(place); }
  }
  function openDirections(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.open(directionsUrl(PLACES[destination].query, origin, mode), "_blank", "noopener,noreferrer");
  }

  const steps = side === "groom" ? [
    { date: "30 NOV · 12 NOON", title: "The baraat sets off", location: "Begusarai → Muzaffarpur", detail: "Gather at the groom’s residence in Gandhi Chowk, Baghi. The baraat departs at noon.", link: directionsUrl(PLACES.wedding.query, PLACES.begusarai.query), action: "Baraat route" },
    { date: "30 NOVEMBER", title: "Venus weds Payal", location: "Ratna Banquet & Resort", detail: "Akharaghat Road, near FCI Godown, Muzaffarpur.", link: placeUrl(PLACES.wedding.query), action: "Wedding venue" },
    { date: "1 DECEMBER", title: "The journey home", location: "Muzaffarpur → Begusarai", detail: "Return to Begusarai the next day. Departure time will be shared by the family.", link: directionsUrl(PLACES.begusarai.query, PLACES.wedding.query), action: "Return route" },
    { date: RECEPTION.date.toUpperCase(), title: "The celebrations continue", location: "Reception · Begusarai", detail: `${RECEPTION.time}. At the groom’s residence.`, link: placeUrl(PLACES.begusarai.query), action: "Reception location" },
  ] : [
    { date: "30 NOVEMBER", title: "Welcome to the wedding", location: "Muzaffarpur", detail: "Join Payal’s family at Ratna Banquet & Resort, Akharaghat Road, near FCI Godown.", link: directionsUrl(PLACES.wedding.query), action: "Directions to the wedding" },
    { date: "1 DECEMBER", title: "Off to Begusarai", location: "Muzaffarpur → Begusarai", detail: "The couple and groom’s family return to Begusarai. Use the route if you’re travelling with them.", link: directionsUrl(PLACES.begusarai.query, PLACES.wedding.query), action: "Route to Begusarai" },
    { date: RECEPTION.date.toUpperCase(), title: "Together again for the reception", location: "The groom’s residence · Begusarai", detail: `${RECEPTION.time}. Gandhi Chowk, Baghi, Begusarai.`, link: directionsUrl(PLACES.begusarai.query), action: "Directions to the reception" },
  ];

  return <div className="site-shell">
    <a className="skip-link" href="#journey">Skip to travel information</a>
    <header className="site-nav"><a className="wordmark" href="#home">V <span>&</span> P</a><nav aria-label="Main navigation"><a href="#journey">Your journey</a><a href="#venues">The venues</a></nav><span className="nav-date">30.11.2026</span></header>
    <main id="home">
      <section className="invitation-hero" aria-labelledby="couple-names">
        <img className="invitation-art" src="/madhubani-invitation-1440.webp" srcSet="/madhubani-invitation-720.webp 720w, /madhubani-invitation-1440.webp 1440w, /madhubani-invitation-2172.webp 2172w" sizes="(min-width: 1400px) 1320px, calc(100vw - 32px)" width="2172" height="724" alt="Madhubani wedding artwork inspired by our invitation, with a groom, bride, peacocks and lotus borders" fetchPriority="high" decoding="async" />
        <div className="hero-copy"><p className="blessing" lang="hi">शुभ विवाह</p><h1 id="couple-names">Venus <span>&</span> Payal</h1><p className="hero-date">30 November 2026</p><p className="hometowns"><span>Begusarai</span><span aria-hidden="true">◆</span><span>Muzaffarpur</span></p></div>
      </section>
      <Countdown now={now} />
      <p className="countdown-note">Counting down to 30 November · Midnight IST</p>

      <section className="journey-section" id="journey" aria-labelledby="journey-title">
        <div className="section-heading"><span className="eyebrow">PLAN YOUR VISIT</span><h2 id="journey-title">Your side of the celebration</h2></div>
        <fieldset className="side-selector"><legend className="sr-only">Choose your side of the celebration</legend>
          <label className={side === "groom" ? "side-option selected" : "side-option"}><input type="radio" name="guest-side" value="groom" checked={side === "groom"} onChange={() => changeSide("groom")} /><span className="side-initial" aria-hidden="true">V</span><span><strong>Groom’s side</strong><small>Begusarai</small></span><span className="selection-mark" aria-hidden="true">{side === "groom" ? "✓" : "+"}</span></label>
          <label className={side === "bride" ? "side-option selected" : "side-option"}><input type="radio" name="guest-side" value="bride" checked={side === "bride"} onChange={() => changeSide("bride")} /><span className="side-initial" aria-hidden="true">P</span><span><strong>Bride’s side</strong><small>Muzaffarpur</small></span><span className="selection-mark" aria-hidden="true">{side === "bride" ? "✓" : "+"}</span></label>
        </fieldset>
        <div className="journey-layout">
          <section className="itinerary" aria-labelledby="itinerary-title"><div className="panel-heading"><p className="eyebrow">YOUR CELEBRATION PLAN</p><h3 id="itinerary-title">{side === "groom" ? "From Begusarai, with love" : "A warm Muzaffarpur welcome"}</h3></div>
            <ol className="timeline">{steps.map((step, i) => <li key={`${side}-${i}`}><span className="step-number" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span><div><p className="step-date">{step.date}</p><h4>{step.title}</h4><p className="step-location">{step.location}</p><p className="step-detail">{step.detail}</p><a className="text-link" href={step.link} target="_blank" rel="noreferrer">{step.action}<Icon kind="arrow" /></a></div></li>)}</ol>
          </section>
          <aside className="travel-panel" aria-labelledby="travel-title"><span className="planner-icon"><Icon kind="pin" /></span><p className="eyebrow">COME CELEBRATE WITH US</p><h3 id="travel-title">Find your way</h3>
            <form onSubmit={openDirections}>
              <label htmlFor="destination">I’m heading to</label><select id="destination" value={destination} onChange={e => setDestination(e.target.value as Destination)}><option value="wedding">Wedding · Muzaffarpur</option><option value="begusarai">Groom’s home · Begusarai</option></select>
              <label htmlFor="origin">Starting from <span>(optional)</span></label><input id="origin" value={origin} onChange={e => setOrigin(e.target.value)} placeholder="Your city, station or address" maxLength={200} autoComplete="off" />
              <fieldset className="mode-selector"><legend>Travel by</legend><label className={mode === "driving" ? "mode active" : "mode"}><input type="radio" name="travel-mode" value="driving" checked={mode === "driving"} onChange={() => setMode("driving")} /><Icon kind="car" /><span>Car / taxi</span></label><label className={mode === "transit" ? "mode active" : "mode"}><input type="radio" name="travel-mode" value="transit" checked={mode === "transit"} onChange={() => setMode("transit")} /><Icon kind="train" /><span>Public transport</span></label></fieldset>
              <button className="primary-button" type="submit">Open Google Maps<Icon kind="arrow" /></button><p className="form-note">Leave the starting point blank to choose it in Maps. Check current routes and travel times there.</p>
            </form>
            <div className="station-link"><Icon kind="train" /><div><strong>Arriving by train?</strong><a href={directionsUrl(PLACES[destination].query, PLACES[destination].station)} target="_blank" rel="noreferrer">{PLACES[destination].stationLabel} → {destination === "wedding" ? "wedding venue" : "groom’s home"}</a></div></div>
          </aside>
        </div>
      </section>

      <section className="venues-section" id="venues" aria-labelledby="venues-title"><div className="section-heading"><span className="eyebrow">WHERE TO JOIN US</span><h2 id="venues-title">Wedding & reception venues</h2></div>
        <div className="venue-grid">{(["wedding", "begusarai"] as const).map(key => <article className="venue-card" key={key}><div className="venue-top"><span className="venue-kicker">{key === "wedding" ? "THE WEDDING" : "BARAAT & RECEPTION"}</span><Icon kind="pin" /></div><h3>{PLACES[key].title}</h3><p className="venue-city">{PLACES[key].city}</p><address>{PLACES[key].address}</address><p className="venue-time">{key === "wedding" ? "30 November 2026" : `Baraat: 30 Nov, 12 noon · Reception: ${RECEPTION.date.toLowerCase()}`}</p><div className="venue-actions"><a className="secondary-button" href={placeUrl(PLACES[key].query)} target="_blank" rel="noreferrer">View on Maps<Icon kind="arrow" /></a><button className="copy-button" onClick={() => copyAddress(key)} aria-label={`Copy ${PLACES[key].title} address`}><Icon kind={copied === key ? "check" : "copy"} />{copied === key ? "Copied" : "Copy address"}</button></div>{copyError === key && <p className="copy-error" role="status">Please select and copy the address above.</p>}</article>)}</div>
        <p className="venue-note">For the Begusarai residence, Maps opens the locality named on the invitation. Confirm the final house location with the family.</p>
      </section>
    </main>
    <footer className="site-footer"><p>Venus <span>&</span> Payal</p><span>Begusarai · Muzaffarpur · 2026</span></footer>
  </div>;
}
