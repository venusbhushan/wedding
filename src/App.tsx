"use client";

import { useEffect, useState } from "react";

const EVENTS = [
  { id: "engagement", title: "Engagement", date: "21 October 2026", iso: "2026-10-21T00:00:00+05:30", nextDay: "2026-10-22T00:00:00+05:30", today: "It’s engagement day!", past: "Engaged, with love." },
  { id: "wedding", title: "Wedding", date: "30 November 2026", iso: "2026-11-30T00:00:00+05:30", nextDay: "2026-12-01T00:00:00+05:30", today: "It’s wedding day!", past: "Forever begins." },
];

function getTimeRemaining(target: number, now: number) {
  const seconds = Math.max(0, Math.ceil((target - now) / 1000));
  return [Math.floor(seconds / 86400), Math.floor((seconds % 86400) / 3600), Math.floor((seconds % 3600) / 60), seconds % 60];
}

export default function Home() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const update = () => setNow(Date.now());
    let interval: number | undefined;
    const syncClock = () => {
      window.clearInterval(interval);
      update();
      if (!document.hidden) interval = window.setInterval(update, 1000);
    };
    syncClock();
    document.addEventListener("visibilitychange", syncClock);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", syncClock);
    };
  }, []);

  return (
    <main className="celebration" aria-label="Our engagement and wedding countdowns">
      <div className="outer-border" aria-hidden="true" />
      <div className="celebration-inner">
        <header className="art-header">
          <img className="folk-art" src="/mithila-celebration-960.webp" srcSet="/mithila-celebration-640.webp 640w, /mithila-celebration-960.webp 960w, /mithila-celebration-1536.webp 1536w" sizes="(min-width: 1600px) 1554px, calc(100vw - 32px)" decoding="async" alt="Madhubani-inspired painting of peacocks, fish, lotus flowers and wedding rings in bright marigold, vermilion, green and blue" width="1536" height="1024" fetchPriority="high" />
          <div className="title-plaque"><span className="plaque-star" aria-hidden="true">✦</span><h1 lang="hi">शुभ आरंभ</h1><span className="plaque-star" aria-hidden="true">✦</span></div>
        </header>
        <div className="woven-divider" aria-hidden="true" />

        <div className="countdown-stage">
          <div className="events">
            {EVENTS.map((event) => {
              const target = Date.parse(event.iso);
              const isReached = now !== null && now >= target;
              const isToday = isReached && now! < Date.parse(event.nextDay);
              const values = now === null ? [null, null, null, null] : getTimeRemaining(target, now);
              return (
                <section className={`event-card ${event.id}`} key={event.id} aria-labelledby={`${event.id}-title`}>
                  <div className="card-inner">
                    <div className="event-heading">
                      <span className="heading-star" aria-hidden="true">✦</span>
                      <h2 id={`${event.id}-title`}>{event.title}</h2>
                      <span className="heading-star" aria-hidden="true">✦</span>
                    </div>
                    <time className="event-date" dateTime={event.iso}>{event.date}</time>
                    <div className="small-rule" aria-hidden="true"><span />◆<span /></div>
                    <div className="timer" role="timer" aria-label={`Time until ${event.title.toLowerCase()}`} aria-live="off">
                      {values.map((value, unit) => (
                        <div className="time-unit" key={unit}>
                          <span className="time-value">{value === null ? "—" : String(value).padStart(2, "0")}</span>
                          <span className="time-label">{["Days", "Hours", "Minutes", "Seconds"][unit]}</span>
                        </div>
                      ))}
                    </div>
                    {isReached && <p className="celebration-message" role="status">{isToday ? event.today : event.past}</p>}
                    <div className="card-trim" aria-hidden="true" />
                  </div>
                </section>
              );
            })}
          </div>
          <footer><span aria-hidden="true">✦</span><p>MIDNIGHT · IST (UTC+5:30)</p><span aria-hidden="true">✦</span></footer>
        </div>
        <div className="woven-divider bottom" aria-hidden="true" />
      </div>
    </main>
  );
}
