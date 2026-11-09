import { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { IiftRsvp } from './IiftRsvp';
import './portrait-cover.css';
import { GREETINGS } from '../lib/greeting.mjs';
import { languageFromPreferences, languageUrl } from './language';
import { invitationPhrases, weddingRibbon } from './invitationPhrases';
const LANGUAGE_NAMES: Record<string,string> = {en:'English',hi:'Hindi · हिन्दी',bn:'Bengali · বাংলা',as:'Assamese · অসমীয়া',gu:'Gujarati · ગુજરાતી',mr:'Marathi · मराठी',kok:'Konkani · कोंकणी',kn:'Kannada · ಕನ್ನಡ',ml:'Malayalam · മലയാളം',ta:'Tamil · தமிழ்',te:'Telugu · తెలుగు',or:'Odia · ଓଡ଼ିଆ',pa:'Punjabi · ਪੰਜਾਬੀ',ne:'Nepali · नेपाली',mni:'Manipuri · ꯃꯤꯇꯩꯂꯣꯟ',lus:'Mizo',ur:'Urdu · اردو',es:'Spanish · Español',tr:'Turkish · Türkçe',el:'Greek · Ελληνικά'};
import type { ReactNode } from 'react';
import { PLACES, RECEPTION } from './travel';
import { AIRPORT, AIR_SOURCE, DELHI_FLIGHT, MFP_ARRIVALS, NAVI_MUMBAI_FLIGHT, NONSTOP, ORIGINS, RAIL_BOOKING, RAIL_ENQUIRY, STATION, flightSearch } from './routes';
import type { Origin } from './routes';

function Band() { return <div className="folk-band" aria-hidden="true"/>; }
function Arrow() { return <span aria-hidden="true">↗</span>; }
function OutLink({href,children,className=''}:{href:string;children:ReactNode;className?:string}) { return <a className={className} href={href} target="_blank" rel="noopener noreferrer">{children}<Arrow/></a>; }
function Countdown({greeting}: {greeting: ReturnType<typeof useLocalInvitation>}) {
 const [now,setNow]=useState<number|null>(null);
 useEffect(()=>{let id:number|undefined; const tick=()=>{clearInterval(id);setNow(Date.now());if(!document.hidden)id=window.setInterval(()=>setNow(Date.now()),1000);};tick();document.addEventListener('visibilitychange',tick);return()=>{clearInterval(id);document.removeEventListener('visibilitychange',tick);};},[]);
 const seconds=now===null?null:Math.max(0,Math.ceil((Date.parse('2026-11-30T00:00:00+05:30')-now)/1000));
 const units=seconds===null?[null,null,null,null]:[Math.floor(seconds/86400),Math.floor(seconds%86400/3600),Math.floor(seconds%3600/60),seconds%60];
 return <section className="countdown" aria-label="Wedding countdown"><div className="countdown-caption"><span lang={greeting.lang} dir={greeting.dir}>{invitationPhrases(greeting.lang).auspiciousTime}</span><h2>Almost<br/>{' '}<em>time.</em></h2></div><div><p className="eyebrow">THE COUNTDOWN TO 30 NOVEMBER</p><div className="timer" role="timer" aria-label="Time until the wedding" aria-live="off">{units.map((v,i)=><div key={i}><strong>{v===null?'—':String(v).padStart(2,'0')}</strong><span>{['Days','Hours','Minutes','Seconds'][i]}</span></div>)}</div><p className="timer-note">{seconds===0?(now!<Date.parse('2026-12-01T00:00:00+05:30')?'It’s wedding day!':'Our forever has begun.'):'30 November 2026 · Midnight IST'}</p></div></section>;
}
function FlightCard({origin}: {origin: Origin}) {
 const airlines = NONSTOP[origin.airportCode];
 const example = origin.airportCode === 'DEL' ? DELHI_FLIGHT : null;
 const alternate = origin.id === 'mh' ? NAVI_MUMBAI_FLIGHT : null;
 return <article className="ticket flight-ticket">
  <div className="ticket-heading"><span className="eyebrow">THE MITHILA GATEWAY</span><span className="arrival-code" aria-hidden="true">{AIRPORT.code}</span></div>
  <h4>{AIRPORT.city} <span>Airport</span></h4>
  <div className="route-line">
   <div><strong>{origin.airportCode}</strong><span>{origin.airport}</span></div>
   <div className="route-middle"><span aria-hidden="true">— ✈ —</span><small>{airlines ? 'Nonstop listed' : 'Check connections'}</small></div>
   <div><strong>{AIRPORT.code}</strong><span>{AIRPORT.city}</span></div>
  </div>
  <p className={airlines ? 'badge direct' : 'badge'}>{airlines ? 'Published nonstop routes' : 'No nonstop verified'}</p>
  {airlines && <p className="carrier">{airlines}</p>}
  {example && <p className="ticket-note">Published example: {example.airline} {example.number} · {example.time}</p>}
  <p className="ticket-note">{airlines
   ? 'Select your travel date to check scheduled departures, fares and seats.'
   : 'Search for flights with a connection on your travel date. From nearby cities, rail may be simpler.'}</p>
  <div className="ticket-bottom">
   <OutLink className="book-link" href={flightSearch(origin)}>{airlines ? 'Find flights' : 'Search flights'}</OutLink>
   <details><summary>View flight sources <span className="disclosure-mark" aria-hidden="true">+</span></summary>
    <OutLink href={AIR_SOURCE}>Darbhanga route directory</OutLink>
    {example && <OutLink href={example.source}>{example.number} timetable</OutLink>}
   </details>
  </div>
  {alternate && <div className="train-service">
   <p className="badge direct">Another nonstop from Navi Mumbai</p>
   <p className="carrier">{alternate.airline} {alternate.number} · {alternate.airportCode} → {AIRPORT.code}</p>
   <p className="ticket-note">Published example: {alternate.time}. Check the operating day before booking.</p>
   <OutLink className="book-link" href={flightSearch(alternate)}>Find Navi Mumbai flights</OutLink>
   {' · '}<OutLink href={alternate.source}>Timetable</OutLink>
  </div>}
 </article>;
}

function TrainCard({origin}: {origin: Origin}) {
 return <article className="ticket train-ticket">
  <div className="ticket-heading"><span className="station-code">{STATION.code}</span><span className="eyebrow">FOR THE WEDDING</span></div>
  <h4>{STATION.name}</h4>
  {origin.trains.map(train => <div className="train-service" key={train.number}>
   <p className={origin.connectionOnly ? 'badge' : 'badge direct'}>{origin.connectionOnly ? 'After a separate connection' : 'Direct from the boarding station'}</p>
   <p className="train-number">{train.number}</p>
   <h5>{train.name}</h5>
   <p className="boarding">{train.from} <b>{train.fromCode}</b><span aria-hidden="true"> → </span>{STATION.name} <b>{STATION.code}</b></p>
   {MFP_ARRIVALS[train.number] && <p className="ticket-note">
    Published times · {train.departure && `Depart ${train.departure} · `}Arrive {MFP_ARRIVALS[train.number]} IST
   </p>}
   <OutLink className="book-link" href={train.source}>Timetable &amp; operating days</OutLink>
  </div>)}
  {origin.trains.length === 0 && <p className="ticket-note">No direct train to {STATION.name} was verified for this origin. Search using {STATION.code} as your destination.</p>}
  <p className="rail-footnote">Check your boarding date and seat availability on <OutLink href={RAIL_BOOKING}>IRCTC</OutLink>. Confirm your train’s running status on <OutLink href={RAIL_ENQUIRY}>NTES</OutLink>.</p>
 </article>;
}

function TravelGuide({automaticOrigin}: {automaticOrigin:string|null}) {
 const [chosenOrigin,setChosenOrigin]=useState<string|null>(null);
 const originId=chosenOrigin || automaticOrigin || 'delhi';
 const [mode,setMode]=useState<'flights'|'trains'>('flights');
 const origin=ORIGINS.find(o=>o.id===originId)!;
 return <section className="travel-section" id="travel" aria-labelledby="travel-title"><div className="travel-intro"><div><p className="eyebrow">02 / THE JOURNEY</p><h2 id="travel-title">All roads<br/><em>lead to Bihar.</em></h2></div><div className="journey-painting" aria-hidden="true"><div className="journey-art"/><span className="journey-seal">Bihar<br/><small>AWAITS YOU</small></span></div></div>
  <div className="travel-book" id="route-planner"><div className="travel-book-top"><span>YOUR PASSAGE TO THE CELEBRATION</span><span>DBR BY AIR · MFP BY RAIL</span></div>
   <div className="travel-controls"><div className="origin-field"><label htmlFor="origin">Where are you coming from?</label><div className="select-wrap"><select id="origin" value={originId} onChange={e=>setChosenOrigin(e.target.value)}>{ORIGINS.map(o=><option key={o.id} value={o.id}>{o.capital} · {o.state}</option>)}</select><span className="select-chevron" aria-hidden="true">⌄</span></div><p>{!chosenOrigin && automaticOrigin?'Capital selected from your approximate location · Change it anytime.':'Choose a city or state · 28 states + Delhi · capital cities and their gateways'}</p></div><fieldset className="transport-toggle"><legend>Choose your journey</legend><label className={mode==='flights'?'active':''}><input type="radio" name="transport" checked={mode==='flights'} onChange={()=>setMode('flights')}/><span className="mode-number" aria-hidden="true">01</span><span className="mode-name">By air</span></label><label className={mode==='trains'?'active':''}><input type="radio" name="transport" checked={mode==='trains'} onChange={()=>setMode('trains')}/><span className="mode-number" aria-hidden="true">02</span><span className="mode-name">By rail</span></label></fieldset></div>
   <div className="results-heading"><div><p className="eyebrow">YOUR STARTING POINT</p><h3>{origin.capital} <span>to {mode==='flights'?AIRPORT.city:'Muzaffarpur'}</span></h3></div><span className="researched">Published schedules · Check your date</span></div>
   <div className="route-results" aria-live="polite" aria-atomic="false">
   {mode==='flights' ? <>
    <p className="gateway-note">{origin.airportNote || `Search from ${origin.airport} (${origin.airportCode}).`}</p>
    <div className="flights-grid"><FlightCard key={origin.id} origin={origin}/></div>
    <p className="guide-note">From Darbhanga Airport, allow time for onward road travel to the wedding venue in Muzaffarpur.</p>
   </> : <div id="train-guide">
    {origin.railNote && <p className="gateway-note">{origin.railNote} {origin.gatewaySource && <OutLink href={origin.gatewaySource}>Connection source</OutLink>}</p>}
    <div className="trains-grid"><TrainCard key={origin.id} origin={origin}/></div>
    <p className="guide-note">Check the arrival date as well as the time. Some journeys arrive one or more days after boarding.</p>
   </div>}
   </div>
  </div>
  <footer className="mithila-journey-footer" aria-hidden="true">
   <img src="/mithila-journey-footer.svg" width="232" height="112" alt="" loading="lazy"/>
  </footer>
 </section>;
}
function Celebration({greeting}: {greeting: ReturnType<typeof useLocalInvitation>}) {
 const venue = PLACES.wedding;
 const mapQuery = new URLSearchParams({api: '1', query: `${venue.title}, ${venue.address}`});
 return <section className="celebration-section" id="celebrations" aria-labelledby="celebration-title">
  <header className="celebration-intro">
   <p className="eyebrow">01 / THE CELEBRATIONS</p>
   <h2 id="celebration-title"><span>Two homes.</span>{' '}<em>One wedding.</em></h2>
  </header>
  <figure className="celebration-art">
   <div className="celebration-portraits">
    <div className="portrait bride-portrait" role="img" aria-label="Madhubani illustration of Payal"/>
    <div className="portrait groom-portrait" role="img" aria-label="Madhubani illustration of Venus"/>
   </div>
   <figcaption className="portrait-caption">
    <svg viewBox="-18 -18 36 36" width="52" height="52" aria-hidden="true" focusable="false">
     <path d="M-13 0h26M0-13v26M0-13h13M13 0v13M0 13h-13M-13 0v-13"
      fill="none" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round"/>
     <g fill="currentColor">
      <circle cx="-7" cy="-7" r="1.9"/>
      <circle cx="7" cy="-7" r="1.9"/>
      <circle cx="-7" cy="7" r="1.9"/>
      <circle cx="7" cy="7" r="1.9"/>
     </g>
    </svg>
    <span lang={greeting.lang} dir={greeting.dir}>{invitationPhrases(greeting.lang).together}</span>
   </figcaption>
  </figure>
  <div className="celebration-details">
   <time dateTime="2026-11-30">30 November 2026</time>
   <h3>
    <OutLink className="celebration-map" href={`https://www.google.com/maps/search/?${mapQuery}`}>
     {venue.title}, {venue.city}{' '}
    </OutLink>
   </h3>
  </div>
 </section>;
}
function useLocalInvitation() {
 const [greeting,setGreeting]=useState({lang:'en',text:'Wedding celebration',dir:'ltr',groom:'Venus',bride:'Payal',invitation:'With love, you’re invited',originId:null as string|null});
 useEffect(()=>{
  const controller=new AbortController();
  const timeout=window.setTimeout(()=>controller.abort(),4000);
  fetch('/api/greeting',{signal:controller.signal,cache:'no-store'})
   .then(response=>response.ok?response.json():null)
   .then(value=>{if(!controller.signal.aborted&&value&&typeof value.lang==='string'&&['text','groom','bride','invitation'].every(key=>typeof value[key]==='string'&&value[key].length>0&&value[key].length<120)) setGreeting({lang:value.lang,text:value.text,groom:value.groom,bride:value.bride,invitation:value.invitation,originId:ORIGINS.some(origin=>origin.id===value.originId)?value.originId:null,dir:value.dir==='rtl'?'rtl':'ltr'});})
   .catch(()=>{/* Keep English if location is unavailable. */})
   .finally(()=>window.clearTimeout(timeout));
  return()=>{controller.abort();window.clearTimeout(timeout);};
 },[]);
 return greeting;
}
function Hero({greeting}: {greeting: ReturnType<typeof useLocalInvitation>}) {
 return <section className="portrait-cover" aria-labelledby="couple-names">
  <img className="portrait-cover-photo" src="/wedding-portrait.jpg" srcSet="/wedding-portrait-small.jpg 900w, /wedding-portrait.jpg 1800w"
   sizes="(max-width:640px) 150vw, 100vw" width="1800" height="1200" alt="Payal and Venus together in warm evening light" fetchPriority="high"/>
  <div className="portrait-cover-wash" aria-hidden="true"/>
  <header className="portrait-cover-nav">
   <p>A wedding in Bihar</p>
   <nav aria-label="Main navigation">
    <a href="#celebrations">The details <span aria-hidden="true">↘</span></a>
    <a href="#travel">Getting here <Arrow/></a>
   </nav>
  </header>
  <div className="portrait-cover-names">
   <time dateTime="2026-11-30">30 November 2026</time>
   <h1 id="couple-names" lang={greeting.lang} className={greeting.bride === 'Payal' && greeting.groom === 'Venus' ? undefined : 'portrait-regional-names'}>
    <bdi dir={greeting.dir}>{greeting.bride}</bdi>{' '}<i lang="en">&amp;</i>{' '}<bdi dir={greeting.dir}>{greeting.groom}</bdi>
   </h1>
  </div>
  <a className="portrait-cover-next" href="#invitation"><span aria-hidden="true">↓</span> Read the invitation</a>
 </section>;
}
function InvitationNote({greeting}: {greeting: ReturnType<typeof useLocalInvitation>}) {
 return <section className="portrait-welcome" id="invitation" aria-labelledby="invitation-title">
  <div className="portrait-welcome-copy">
   <p className="eyebrow" lang={greeting.lang} dir={greeting.dir}>{greeting.text}</p>
   <h2 id="invitation-title">You’re <em>invited.</em></h2>
   <p>With our families, we invite you to celebrate our wedding in Bihar.</p>
  </div>
  <figure className="portrait-welcome-art">
   <img src="/mithila-celebration-960.webp" srcSet="/mithila-celebration-640.webp 640w, /mithila-celebration-960.webp 960w"
    sizes="(max-width:680px) 86vw, 580px" width="960" height="640" alt="Madhubani peacocks, fish and lotus flowers" loading="lazy"/>
  </figure>
  <a className="portrait-welcome-link" href="#celebrations">The celebrations <span aria-hidden="true">↓</span></a>
 </section>;
}
function Ribbon({greeting}: {greeting: ReturnType<typeof useLocalInvitation>}) {
 const [paused,setPaused] = useState(false);
 const blessing = weddingRibbon(greeting.lang);
 const inscription = <>
  <span className="ribbon-names">Payal &amp; Venus</span>
  <b className="ribbon-flower" aria-hidden="true">✳</b>
  <time className="ribbon-date" dateTime="2026-11-30">30 November 2026</time>
  <b className="ribbon-flower" aria-hidden="true">✳</b>
  <span className="ribbon-blessing" lang={blessing.lang} dir={blessing.dir}>{blessing.text}</span>
  <b className="ribbon-flower" aria-hidden="true">✳</b>
 </>;
 return <div className="wedding-ribbon" data-paused={paused}>
  <div className="ribbon-static sr-only">{inscription}</div>
  <div className="ribbon-window" aria-hidden="true">
   <div className="ribbon-track">
    {[0,1].map(run=><div className="ribbon-run" key={run}>
     {[0,1,2,3].map(index=><div className="ribbon-inscription" key={index}>{inscription}</div>)}
    </div>)}
   </div>
  </div>
  <button type="button" className="ribbon-toggle" aria-label={paused?'Resume scrolling invitation text':'Pause scrolling invitation text'} onClick={()=>setPaused(value=>!value)}>
   <span className={paused?'ribbon-play-mark':'ribbon-pause-mark'} aria-hidden="true"/>
  </button>
 </div>;
}
export default function App() {
 const automaticGreeting=useLocalInvitation();
 function readLanguage(){
  let saved=null;
  try {saved=localStorage.getItem('wedding-language');} catch {/* Shared links still work without storage. */}
  return languageFromPreferences(window.location.search,saved);
 }
 const [language,setLanguage]=useState(readLanguage);
 useEffect(()=>{
  const syncLanguage=()=>setLanguage(readLanguage());
  window.addEventListener('popstate',syncLanguage);
  return()=>window.removeEventListener('popstate',syncLanguage);
 },[]);
 const greeting=language==='auto'?automaticGreeting:{...GREETINGS[language],originId:automaticGreeting.originId,dir:GREETINGS[language].dir || 'ltr'};
 function changeLanguage(value:string){setLanguage(value);window.history.replaceState(window.history.state,'',languageUrl(window.location.href,value));try {if(value==='auto') localStorage.removeItem('wedding-language');else localStorage.setItem('wedding-language',value);} catch {/* Selection still works without storage. */}}

 return <div className="page-frame"><a className="skip-link" href="#travel">Skip to travel guide</a><main id="home"><Hero greeting={greeting}/><Ribbon greeting={greeting}/><InvitationNote greeting={greeting}/><Countdown greeting={greeting}/><Celebration greeting={greeting}/><TravelGuide automaticOrigin={automaticGreeting.originId}/><section className="venues-section" aria-labelledby="venues-title"><div className="venue-intro"><p className="eyebrow">03 / MEET US HERE</p><h2 id="venues-title">A place<br/><em>for you.</em></h2><span lang="hi">अतिथि देवो भवः</span></div><div className="venue-grid">{(['wedding','begusarai'] as const).map((k,i)=><article key={k}><p className="eyebrow">{k==='wedding'?'30 NOVEMBER · THE WEDDING':'BARAAT & RECEPTION'}</p><span className="venue-number" aria-hidden="true">0{i+1}</span><h3>{PLACES[k].title}</h3><p className="venue-city">{PLACES[k].city}</p><address>{PLACES[k].address}</address>{k==='begusarai'&&<p className="venue-detail">Baraat: 30 November, noon<br/>Reception: {RECEPTION.date}</p>}</article>)}</div></section></main><footer><Band/><div className="footer-art"><p className="footer-invitation" lang={greeting.lang} dir={greeting.dir}>{greeting.invitation}</p><p>A little Bihar.<br/><em>A lot of love.</em></p><a href="#home">Payal & Venus <span aria-hidden="true">↑</span></a><span>30 NOVEMBER 2026 · WITH OUR FAMILIES</span></div><div className="language-settings"><label htmlFor="display-language">Invitation language</label><div className="language-select-wrap"><select id="display-language" value={language} onChange={event=>changeLanguage(event.target.value)} aria-describedby="language-help"><option value="auto">Automatic · use my location</option>{Object.entries(LANGUAGE_NAMES).map(([code,name])=><option key={code} value={code}>{name}</option>)}</select><span aria-hidden="true">⌄</span></div><p id="language-help">Changes the greeting, couple’s names, countdown caption, portrait caption, scrolling blessing and invitation above. Copy this page’s URL to share your chosen language.</p><p className="language-status" role="status">{language==='auto'?`Automatic · ${LANGUAGE_NAMES[Object.keys(GREETINGS).find(key=>GREETINGS[key].lang===greeting.lang) || 'en']}`:`Selected · ${LANGUAGE_NAMES[language]}`}</p></div><Band/></footer><IiftRsvp /><Analytics /><SpeedInsights /></div>;
}
