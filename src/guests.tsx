/// <reference types="vite/client" />
import { useRef, useState } from "react";
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

type Session = { password: string; guests: Guest[]; version: string | null };

async function guestRequest(password: string, body?: { guests: Guest[]; version: string | null }) {
  const response = await fetch("/api/guest-arrangements", {
    method: body ? "PUT" : "GET",
    headers: { Authorization: "Bearer " + password, ...(body ? { "Content-Type": "application/json" } : {}) },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Guest tracker is unavailable.");
  return result;
}

function GuestAccess() {
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (session) return <GuestTracker session={session} onLock={() => setSession(null)}/>;
  return <main><header><a href="/">← Wedding invitation</a><h1>Guest arrangements</h1></header>
    <form onSubmit={async event => {
      event.preventDefault();
      const password = String(new FormData(event.currentTarget).get("password") ?? "");
      setBusy(true);
      setError("");
      try {
        const result = await guestRequest(password);
        setSession({ password, guests: result.guests, version: result.version });
      } catch (failure) {
        setError(failure instanceof Error ? failure.message : "Could not unlock the tracker.");
      } finally {
        setBusy(false);
      }
    }}>
      <label>Tracker password<input type="password" name="password" autoComplete="current-password" required/></label>
      <div className="actions"><button disabled={busy}>{busy ? "Unlocking…" : "Unlock tracker"}</button></div>
      {error && <p role="alert">{error}</p>}
    </form>
  </main>;
}

function GuestTracker({ session, onLock }: { session?: Session; onLock?: () => void }) {
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
        const result = await guestRequest(session.password, { guests: next, version: version.current });
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
    <header><a href="/">← Wedding invitation</a><h1>Guest arrangements</h1><p>{session ? "Entries sync across devices." : "Entries are saved in this browser on this device."}</p>{onLock && <button type="button" className="secondary" disabled={saving} onClick={onLock}>Lock tracker</button>}</header>
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

createRoot(document.getElementById("root")!).render(import.meta.env.DEV ? <GuestTracker/> : <GuestAccess/>);
