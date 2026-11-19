type MetricData = Record<string,string|number>;
type MetricEvent = {id:string;name:string;at:number;data:MetricData};
let enqueue: ((name:string,data?:MetricData)=>void) | undefined;

// Invitation interactions share one small queue and never block navigation.
export function trackMetric(name:string,data:MetricData={}) {enqueue?.(name,data);}

export function startMetrics() {
 if (navigator.doNotTrack==='1' || window.location.pathname.startsWith('/dashboard')) return ()=>{};
 let visitorId=crypto.randomUUID(), sessionId=crypto.randomUUID();
 try {
  visitorId=localStorage.getItem('wedding-visitor') as typeof visitorId || visitorId;
  localStorage.setItem('wedding-visitor',visitorId);
  const previous=JSON.parse(sessionStorage.getItem('wedding-visit')||'null');
  if(previous && Date.now()-previous.at<1800000) sessionId=previous.id;
  sessionStorage.setItem('wedding-visit',JSON.stringify({id:sessionId,at:Date.now()}));
 } catch {/* Capture still works when browser storage is unavailable. */}
 const pageId=crypto.randomUUID();
 let queue:MetricEvent[]=[], inFlight=false, activeMs=0, lastTick=performance.now(), maxScroll=0;
 const add=(name:string,data:MetricData={})=>{
  if(queue.length<64)queue.push({id:crypto.randomUUID(),name,at:Date.now(),data});
 };
 enqueue=add;
 const engagement=()=>{
  const current=performance.now();
  if(!document.hidden)activeMs+=Math.min(current-lastTick,30000);
  lastTick=current;
  add('engagement',{seconds:Math.floor(activeMs/1000)});
 };
 const payload=(events:MetricEvent[])=>JSON.stringify({pageId,sessionId,visitorId,events});
 async function flush() {
  if(inFlight||!queue.length)return;
  const batch=queue.splice(0,64);inFlight=true;
  try {
   const response=await fetch('/api/metrics',{method:'POST',headers:{'Content-Type':'application/json'},body:payload(batch),keepalive:true});
   if(!response.ok)queue=[...batch,...queue].slice(0,64);
  } catch {queue=[...batch,...queue].slice(0,64);}
  finally {inFlight=false;}
 }
 const away=()=>{
  engagement();
  if(queue.length && navigator.sendBeacon('/api/metrics',new Blob([payload(queue)],{type:'application/json'}))) queue=[];
 };
 const visibility=()=>{
  // The preceding interval was visible when the page has just become hidden.
  if(document.hidden)activeMs+=Math.min(performance.now()-lastTick,30000);
  lastTick=performance.now();
  if(document.hidden)away();
 };
 let referrer='Direct';
 try {if(document.referrer)referrer=new URL(document.referrer).hostname;}catch {/* Keep direct. */}
 const query=new URLSearchParams(location.search);
 add('page_view',{device:matchMedia('(max-width: 700px)').matches?'Mobile':'Desktop / tablet',referrer,campaign:query.get('utm_campaign')||'',source:query.get('utm_source')||'',language:query.get('lang')||'auto'});
 void flush();
 const observer=new IntersectionObserver(entries=>{
  for(const entry of entries)if(entry.isIntersecting){add('section_view',{section:entry.target.id});observer.unobserve(entry.target);}
 },{threshold:.15});
 document.querySelectorAll('main section[id]').forEach(section=>observer.observe(section));
 const scroll=()=>{
  const height=document.documentElement.scrollHeight-innerHeight;
  const percent=height>0?Math.min(100,Math.round(scrollY/height*100)):100;
  for(const value of [25,50,75,100])if(value>maxScroll&&percent>=value){add('scroll_depth',{percent:value});maxScroll=value;}
 };
 const click=(event:MouseEvent)=>{
  const link=(event.target as Element)?.closest?.('a');
  if(!link)return;
  const url=new URL(link.href,location.href);
  if(url.hostname==='wa.me')add('rsvp_click');
  else if(url.hostname.includes('google.')&&url.pathname.startsWith('/maps'))add('directions_click');
  else if(url.pathname.includes('/travel/flights'))add('flight_search',{origin:(document.querySelector('#origin') as HTMLSelectElement)?.value||''});
  else if(url.hostname.includes('irctc.co.in')||url.hostname.includes('indianrail.gov.in')||link.closest('.train-service'))add('train_search',{origin:(document.querySelector('#origin') as HTMLSelectElement)?.value||''});
  else return;
  void flush();
 };
 const change=(event:Event)=>{
  const input=event.target as HTMLInputElement;
  if(input.id==='origin')add('origin_change',{origin:input.value});
  if(input.id==='display-language')add('language_change',{language:input.value});
  if(input.name==='transport')add('transport_change',{mode:input.parentElement?.querySelector('.mode-name')?.textContent||''});
 };
 const interval=window.setInterval(()=>{engagement();void flush();},30000);
 document.addEventListener('click',click);
 document.addEventListener('change',change);
 document.addEventListener('visibilitychange',visibility);
 window.addEventListener('pagehide',away);
 window.addEventListener('scroll',scroll,{passive:true});
 return ()=>{
  enqueue=undefined;observer.disconnect();clearInterval(interval);
  document.removeEventListener('click',click);document.removeEventListener('change',change);document.removeEventListener('visibilitychange',visibility);
  window.removeEventListener('pagehide',away);window.removeEventListener('scroll',scroll);
 };
}
