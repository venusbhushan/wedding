/// <reference types="vite/client" />
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { createRoot } from "react-dom/client";
import "./guests.css";

type Details = { name: string; origin: string; destination: string; date: string; time: string; departurePlace: string; departureDate: string; departureTime: string; notes: string };
type Guest = Details & { id: string; done: boolean };
const key = "wedding-guest-arrangements-v1";
const empty: Details = { name: "", origin: "", destination: "", date: "", time: "", departurePlace: "", departureDate: "", departureTime: "", notes: "" };

function formatDate(date: string) {
  return date ? new Date(date + "T12:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";
}

type Session = { guests: Guest[]; version: string | null };

async function guestRequest(body?: { guests: Guest[]; version: string | null }) {
  const response = await fetch("/api/guest-arrangements", {
    method: body ? "PUT" : "GET",
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Guest tracker is unavailable.");
  return result;
}

function SharedGuestTracker() {
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    guestRequest().then(
      result => { if (active) setSession(result); },
      failure => { if (active) setError(failure.message); },
    );
    return () => { active = false; };
  }, []);

  if (session) return <GuestTracker session={session}/>;
  return <main><h1>Guest arrangements</h1><p role={error ? "alert" : "status"}>
    {error || "Loading guest arrangements…"}
  </p>{error && <button onClick={() => window.location.reload()}>Try again</button>}</main>;
}

function GuestOverview({ guests }: { guests: Guest[] }) {
  const done = guests.filter(guest => guest.done).length;
  const pending = guests.length - done;
  const progress = guests.length ? Math.round(done / guests.length * 100) : 0;
  const arrivals = new Map<string, number>();
  const destinations = new Map<string, number>();
  for (const guest of guests) {
    if (guest.date) arrivals.set(guest.date, (arrivals.get(guest.date) ?? 0) + 1);
    destinations.set(guest.destination, (destinations.get(guest.destination) ?? 0) + 1);
  }

  const arrivalsMax = Math.max(1, ...arrivals.values());

  const destinationsMax = Math.max(1, ...destinations.values());

  return <section className="guest-overview" aria-labelledby="guest-overview-title">
    <h2 id="guest-overview-title">At a glance</h2>
    <div className="overview-grid">
      <article><h3>Arrangements</h3><strong>{done} of {guests.length} done</strong>
        <div className="overview-track" aria-hidden="true"><span style={{ width: progress + "%" }}/></div>
        <p>{pending} pending</p>
      </article>
      <article><h3>Arrivals by day</h3>
        {arrivals.size ? <ul>{[...arrivals].sort(([a], [b]) => a.localeCompare(b)).map(([date, count]) =>
          <li key={date}><span>{formatDate(date)}</span><strong>{count}</strong><meter aria-label={formatDate(date) + " arrivals"} min={0} max={arrivalsMax} value={count}/></li>)}</ul> : <p>Arrival dates will appear here.</p>}
      </article>
      <article><h3>Arrival destinations</h3>
        {destinations.size ? <ul>{[...destinations].sort((a, b) => b[1] - a[1]).map(([place, count]) =>
          <li key={place}><span>{place}</span><strong>{count}</strong><meter aria-label={place + " arrivals"} min={0} max={destinationsMax} value={count}/></li>)}</ul> : <p>Destinations will appear here.</p>}
      </article>
    </div>
  </section>;
}

function GuestTracker({ session }: { session?: Session }) {
  const [initial] = useState(() => {
    if (session) return { guests: session.guests.map(guest => ({ ...empty, ...guest })), error: "" };
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(key) ?? "[]");
      if (!Array.isArray(saved)) throw new Error();
      return { guests: (saved as Guest[]).map(guest => ({ ...empty, ...guest })), error: "" };
    } catch {
      return { guests: [] as Guest[], error: "Saved entries could not be read. Check your browser storage before making changes." };
    }
  });
  const [guests, setGuests] = useState(initial.guests);
  const [error, setError] = useState(initial.error);
  const [draft, setDraft] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [day, setDay] = useState("");
  const [notice, setNotice] = useState("");

  const pending = useRef(false);
  const version = useRef(session?.version ?? null);
  const [saving, setSaving] = useState(false);

  async function save(next: Guest[], message: string) {
    if (initial.error || pending.current) return false;
    pending.current = true;
    setSaving(true);
    try {
      if (session) {
        const result = await guestRequest({ guests: next, version: version.current });
        version.current = result.version;
      } else localStorage.setItem(key, JSON.stringify(next));
      setGuests(next);
      setError("");
      setNotice(message);
      return true;
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Could not save. Try again.");
      return false;
    } finally {
      pending.current = false;
      setSaving(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const details = Object.fromEntries((Object.keys(empty) as (keyof Details)[]).map(field => [field, draft[field].trim()])) as Details;
    if (!details.name || !details.destination) {
      setError("Enter a guest name and arrival destination.");
      return;
    }
    const next = editing
      ? guests.map(guest => guest.id === editing ? { ...guest, ...details } : guest)
      : [...guests, { ...details, id: crypto.randomUUID(), done: false }];
    if (await save(next, editing ? "Guest updated." : "Guest added.")) {
      setDraft(empty);
      setEditing(null);
    }
  }

  const query = search.trim().toLowerCase();
  const visible = guests.filter(guest =>
    (!day || guest.date === day) &&
    (filter === "all" || guest.done === (filter === "done")) &&
    [guest.name, guest.origin, guest.destination, guest.departurePlace, guest.notes].some(value => value.toLowerCase().includes(query))
  ).sort((a, b) => a.date.localeCompare(b.date) || (a.time || "99").localeCompare(b.time || "99") || a.name.localeCompare(b.name));
  const done = guests.filter(guest => guest.done).length;

  function renderFields(fields: [keyof Details, string, string, boolean][]) {
    return fields.map(([field, label, type, required]) =>
      <label key={field}>{label}<input type={type} required={required}
        list={field === "destination" || field === "departurePlace" ? "destinations" : undefined}
        value={draft[field]} onChange={event => setDraft({ ...draft, [field]: event.target.value })}/></label>
    );
  }

  return <main>
    <header><a href="/">← Wedding invitation</a><h1>Guest arrangements</h1><p>{session ? "Entries sync across devices." : "Entries are saved in this browser on this device."}</p></header>
    <GuestOverview guests={guests}/>
    <form id="guest-form" onSubmit={submit}>
      <h2>{editing ? "Edit guest" : "Add a guest"}</h2>
      <div className="fields">
        {renderFields([
          ["name", "Guest name", "text", true],
          ["origin", "Travelling from (optional)", "text", false],
        ])}
        <fieldset><legend>Arrival</legend><div className="fields">
          {renderFields([
            ["destination", "Arriving at", "text", true],
            ["date", "Arrival date", "date", true],
            ["time", "Time (IST)", "time", false],
          ])}
        </div></fieldset>
        <fieldset><legend>Departure <small>Optional</small></legend><div className="fields">
          {renderFields([
            ["departurePlace", "Departing from", "text", false],
            ["departureDate", "Departure date", "date", false],
            ["departureTime", "Time (IST)", "time", false],
          ])}
        </div></fieldset>
        <datalist id="destinations"><option value="Muzaffarpur"/><option value="Begusarai"/><option value="Patna"/><option value="Darbhanga"/><option value="Barauni"/></datalist>
        <label className="notes">Arrangements and notes<textarea rows={3} placeholder="Pickup, room, flight or train number…" value={draft.notes} onChange={event => setDraft({ ...draft, notes: event.target.value })}/></label>
      </div>
      <div className="actions"><button disabled={saving || Boolean(initial.error)}>{editing ? "Save changes" : "Add guest"}</button>{editing && <button type="button" className="secondary" onClick={() => { setEditing(null); setDraft(empty); }}>Cancel</button>}</div>
      {error && <p role="alert">{error}</p>}<p role="status">{notice}</p>
    </form>

    <section aria-labelledby="arrivals">
      <h2 id="arrivals">Arrivals</h2>
      <div className="totals"><span>{guests.length} guests</span><span>{guests.length - done} pending</span><span>{done} done</span></div>
      <div className="fields filters">
        <label>Search<input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Name, city or notes"/></label>
        <label>Arrival date<input type="date" value={day} onChange={event => setDay(event.target.value)}/></label>
        <label>Status<select value={filter} onChange={event => setFilter(event.target.value)}><option value="all">All arrangements</option><option value="pending">Pending</option><option value="done">Done</option></select></label>
      </div>
      {!visible.length && <p>{guests.length ? "No guests match these filters." : "Add your first guest to start tracking arrivals."}</p>}
      {visible.map(guest => <article key={guest.id}>
        <div className="guest-heading"><h3>{guest.name}</h3><span className={guest.done ? "badge done" : "badge"}>{guest.done ? "Done" : "Pending"}</span></div>
        <dl className="itinerary">
          <div><dt>Arrival</dt><dd>{guest.origin && guest.origin + " → "}{guest.destination}</dd><dd>{formatDate(guest.date)}{guest.time && " · " + guest.time + " IST"}</dd></div>
          <div><dt>Departure</dt><dd>{[guest.departurePlace, formatDate(guest.departureDate), guest.departureTime && guest.departureTime + " IST"].filter(Boolean).join(" · ") || "To be confirmed"}</dd></div>
        </dl>
        {guest.notes && <p className="guest-notes">{guest.notes}</p>}
        <div className="actions">
          <button disabled={saving} onClick={() => save(guests.map(item => item.id === guest.id ? { ...item, done: !item.done } : item), guest.done ? "Marked pending." : "Marked done.")}>{guest.done ? "Reopen" : "Mark done"}</button>
          <a href="#guest-form" onClick={() => { setEditing(guest.id); setDraft(guest); setNotice(""); }}>Edit</a>
          <button disabled={saving} className="secondary" onClick={async () => {
            if (window.confirm("Remove " + guest.name + " from the guest tracker?") && await save(guests.filter(item => item.id !== guest.id), "Guest removed.") && editing === guest.id) {
              setEditing(null);
              setDraft(empty);
            }
          }}>Remove</button>
        </div>
      </article>)}
    </section>
  </main>;
}

createRoot(document.getElementById("root")!).render(import.meta.env.DEV ? <GuestTracker/> : <SharedGuestTracker/>);
