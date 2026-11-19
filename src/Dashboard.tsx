import {useCallback, useEffect, useRef, useState} from 'react';
import type {FormEvent} from 'react';
import './dashboard.css';

type Row={label:string;count:number};
type Summary={
 generatedAt:string;days:number;truncated:boolean;firstCapturedAt:string|null;
 totals:{visitors:number;visits:number;pageViews:number;rsvpClicks:number;rsvpVisits:number;directions:number;flightSearches:number;trainSearches:number;averageReadingSeconds:number;rsvpRate:number;engagedRate:number;activeVisits:number};
 daily:{day:string;views:number;rsvpClicks:number}[];
 actions:Row[];countries:Row[];regions:Row[];devices:Row[];referrers:Row[];campaigns:Row[];origins:Row[];languages:Row[];scroll:Row[];
 recent:{name:string;at:number;data:Record<string,string|number>}[];
};
const labels:Record<string,string>={rsvp_click:'WhatsApp RSVP clicks',directions_click:'Venue directions',flight_search:'Flight searches',train_search:'Train timetable / booking clicks',origin_change:'Origin changes',transport_change:'Transport choices',language_change:'Language changes'};
const friendly=(name:string)=>labels[name]||name.replaceAll('_',' ');
const format=(n:number)=>n.toLocaleString('en-IN');
function Breakdown({title,rows,help}:{title:string;rows:Row[];help?:string}) {
 const max=Math.max(1,...rows.map(row=>row.count));
 return <section className="dash-panel"><h2>{title}</h2>{help&&<p className="dash-muted">{help}</p>}
  {rows.length?<ul className="dash-bars">{rows.map(row=><li key={row.label}>
   <div><span>{friendly(row.label)}</span><strong>{format(row.count)}</strong></div>
   <span className="dash-bar" style={{width:`${row.count/max*100}%`}}/>
  </li>)}</ul>:<p className="dash-empty">No activity captured in this period.</p>}
 </section>;
}
export default function Dashboard() {
 const [days,setDays]=useState(7),[summary,setSummary]=useState<Summary|null>(null),[signedIn,setSignedIn]=useState(false);
 const [password,setPassword]=useState(''),[error,setError]=useState(''),[loading,setLoading]=useState(true),[loggingIn,setLoggingIn]=useState(false);
 const activeRequest=useRef<AbortController|null>(null);
 const load=useCallback(async()=>{
  activeRequest.current?.abort();
  const controller=new AbortController();
  activeRequest.current=controller;
  setLoading(true);
  try {
   const response=await fetch(`/api/dashboard?days=${days}`,{cache:'no-store',signal:controller.signal});
   if(response.status===401){setSignedIn(false);setSummary(null);return;}
   const data=await response.json();
   if(!response.ok)throw new Error(data.error||'Unable to load metrics');
   setSignedIn(true);setSummary(data);setError('');
  }catch(reason){if(!controller.signal.aborted)setError(reason instanceof Error?reason.message:'Unable to load metrics');}
  finally {if(activeRequest.current===controller)setLoading(false);}
 },[days]);
 useEffect(()=>{void load();return()=>activeRequest.current?.abort();},[load]);
 useEffect(()=>{
  if(!signedIn)return;
  const timer=setInterval(()=>{if(!document.hidden)void load();},60000);
  return()=>clearInterval(timer);
 },[signedIn,load]);
 useEffect(()=>{document.title='Invitation dashboard · Payal & Venus';},[]);
 async function login(event:FormEvent) {
  event.preventDefault();setLoggingIn(true);setError('');
  try {
   const response=await fetch('/api/dashboard',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password})});
   const data=await response.json();
   if(!response.ok)throw new Error(data.error||'Sign in failed');
   setPassword('');setSignedIn(true);await load();
  }catch(reason){setError(reason instanceof Error?reason.message:'Sign in failed');}
  finally {setLoggingIn(false);}
 }
 async function logout(){
  const response=await fetch('/api/dashboard',{method:'DELETE'});
  if(response.ok){activeRequest.current?.abort();setSignedIn(false);setSummary(null);setLoading(false);}else setError('Could not sign out. Please retry.');
 }
 function download(){
  if(!summary)return;
  const rows=[['Date (UTC)','Page views','WhatsApp RSVP clicks'],...summary.daily.map(row=>[row.day,row.views,row.rsvpClicks])];
  const url=URL.createObjectURL(new Blob([rows.map(row=>row.join(',')).join('\n')],{type:'text/csv'}));
  const link=document.createElement('a');link.href=url;link.download='wedding-metrics.csv';link.click();URL.revokeObjectURL(url);
 }
 const totals=summary?.totals;
 return <div className="metrics-dashboard">
  <header className="dash-header"><a href="/">P ✳ V</a><div><p>PAYAL &amp; VENUS · 30 NOVEMBER 2026</p><h1>Invitation dashboard</h1></div>{signedIn&&<button onClick={()=>void logout()}>Sign out</button>}</header>
  {!signedIn?<main className="dash-login"><p className="dash-kicker">FOR THE HOST</p><h2>See how your invitation is travelling.</h2><p>Sign in to view visits, RSVP interest and guest travel activity.</p><form onSubmit={login}><label htmlFor="dashboard-password">Dashboard password</label><input id="dashboard-password" type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} required/><button disabled={loggingIn||loading}>{loggingIn?'Signing in…':loading?'Checking access…':'Open dashboard'}</button></form>{error&&<p role="alert" className="dash-error">{error}</p>}</main>:
  <main className="dash-main">
   <div className="dash-toolbar"><div><p className="dash-kicker">THE GUEST PICTURE</p><h2>A little insight.<br/><em>A lot to look forward to.</em></h2></div><div className="dash-controls"><label>Period<select value={days} onChange={e=>setDays(Number(e.target.value))}><option value={1}>Today (UTC)</option><option value={7}>Last 7 days</option><option value={30}>Last 30 days</option></select></label><button disabled={loading} onClick={()=>void load()}>{loading?'Refreshing…':'Refresh'}</button><button disabled={!summary} onClick={download}>Export daily CSV</button></div></div>
   {error&&<p role="alert" className="dash-error">{error}</p>}
   {summary&&totals&&<>
    <p className="dash-meta">Updated {new Date(summary.generatedAt).toLocaleString('en-IN')} · Refreshes every minute · Daily chart uses UTC</p>
    {!summary.firstCapturedAt&&<div className="dash-notice">Capture is ready. Open the invitation and try its RSVP, travel or venue links to start seeing activity here.</div>}
    {summary.truncated&&<div className="dash-notice">This period exceeded the dashboard’s 10,000-batch read limit. Figures are partial. Select a shorter period.</div>}
    <section className="dash-stats" aria-label="Key metrics">
     {[['Visitors',format(totals.visitors),'Anonymous browsers'],['Visits',format(totals.visits),'Sessions across page loads'],['RSVP click rate',`${totals.rsvpRate}%`,`${totals.rsvpVisits} visits clicked WhatsApp`],['Active reading',`${totals.averageReadingSeconds}s`,'Average foreground time per page view']].map(([title,value,help])=><article key={title}><h3>{title}</h3><strong>{value}</strong><p>{help}</p></article>)}
    </section>
    <section className="dash-mini" aria-label="Activity totals">
     <span><b>{format(totals.pageViews)}</b> page views</span><span><b>{format(totals.rsvpClicks)}</b> WhatsApp clicks</span><span><b>{format(totals.directions)}</b> directions clicks</span><span><b>{format(totals.flightSearches)}</b> flight searches</span><span><b>{format(totals.trainSearches)}</b> rail clicks</span><span><b>{format(totals.activeVisits)}</b> active in last 5 min</span><span><b>{totals.engagedRate}%</b> engaged visits</span>
    </section>
    <section className="dash-panel dash-chart"><div><h2>Invitation traffic</h2><p className="dash-muted">Daily page views in gold. RSVP clicks appear in vermilion.</p></div><div className="dash-columns">{summary.daily.map(day=><div key={day.day} title={`${day.day}: ${day.views} views, ${day.rsvpClicks} RSVP clicks`}><div className="dash-column-pair"><span style={{height:`${day.views/Math.max(1,...summary.daily.map(d=>d.views))*110}px`}}/><span style={{height:`${day.rsvpClicks/Math.max(1,...summary.daily.map(d=>Math.max(d.views,d.rsvpClicks)))*110}px`}}/></div><small>{day.day.slice(5)}</small><span className="sr-only">{day.views} views, {day.rsvpClicks} RSVP clicks</span></div>)}</div></section>
    <div className="dash-grid">
     <Breakdown title="Guest actions" rows={summary.actions}/>
     <Breakdown title="Travel origins" rows={summary.origins} help="Explicit choices in the travel planner."/>
     <Breakdown title="Countries" rows={summary.countries} help="Approximate visit location."/>
     <Breakdown title="States / regions" rows={summary.regions}/>
     <Breakdown title="Devices" rows={summary.devices}/>
     <Breakdown title="Language choices" rows={summary.languages}/>
     <Breakdown title="Referring sites" rows={summary.referrers}/>
     <Breakdown title="Shared-link campaigns" rows={summary.campaigns} help="Use ?utm_campaign=batchmates on a shared invitation URL."/>
     <Breakdown title="Reading depth" rows={summary.scroll} help="Page views that reached each scroll milestone."/>
     <section className="dash-panel"><h2>Recent activity</h2>{summary.recent.length?<ul className="dash-recent">{summary.recent.map((event,index)=><li key={index}><span>{friendly(event.name)} <small>{Object.values(event.data).join(' · ')}</small></span><time>{new Date(event.at).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}</time></li>)}</ul>:<p className="dash-empty">No interactions yet.</p>}</section>
    </div>
    <footer className="dash-footnote">WhatsApp clicks measure interest. Sending a message, attendance and completed bookings cannot be confirmed by the invitation. Reading time counts foreground activity. Anonymous browser IDs can reset or be shared. Do Not Track requests are respected. IP addresses and personal message contents are not stored. Capture begins with this release.</footer>
   </>}
  </main>}
 </div>;
}
