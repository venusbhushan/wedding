import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { get, list, put } from '@vercel/blob';

export const EVENT_NAMES = ['page_view', 'section_view', 'engagement', 'scroll_depth', 'rsvp_click', 'directions_click', 'flight_search', 'train_search', 'origin_change', 'transport_change', 'language_change'];
const idPattern = /^[a-zA-Z0-9-]{8,64}$/;
const text = value => typeof value === 'string' ? value.replace(/[^\p{L}\p{N} ._:/-]/gu, '').slice(0, 80) : '';
const properties = ['section', 'origin', 'mode', 'language', 'device', 'referrer', 'campaign', 'source'];
export function validateBatch(body, headers = {}, now = Date.now()) {
 if (!body || !idPattern.test(body.pageId) || !idPattern.test(body.sessionId) || !idPattern.test(body.visitorId) || !Array.isArray(body.events) || !body.events.length || body.events.length > 64) throw new Error('Invalid event batch');
 const events = body.events.map(event => {
  if (!EVENT_NAMES.includes(event.name) || !idPattern.test(event.id) || !Number.isFinite(event.at) || Math.abs(event.at - now) > 86400000) throw new Error('Invalid event');
  const data = Object.fromEntries(properties.filter(key => typeof event.data?.[key] === 'string').map(key => [key, text(event.data[key])]));
  if (event.name === 'engagement') data.seconds = Math.min(14400, Math.max(0, Math.round(Number(event.data?.seconds) || 0)));
  if (event.name === 'scroll_depth') data.percent = [25, 50, 75, 100].includes(event.data?.percent) ? event.data.percent : 0;
  return { id: event.id, name: event.name, at: event.at, data };
 });
 return { pageId: body.pageId, sessionId: body.sessionId, visitorId: body.visitorId, receivedAt: now,
  country: text(headers['x-vercel-ip-country']) || 'Unknown', region: text(headers['x-vercel-ip-country-region']) || 'Unknown', events };
}
const localDirectory = () => process.env.METRICS_LOCAL_DIR;
export async function saveBatch(batch) {
 const day = new Date(batch.receivedAt).toISOString().slice(0, 10);
 const pathname = `metrics/${day}/${randomUUID()}.json`;
 if (localDirectory() && !process.env.VERCEL) {
  await mkdir(join(localDirectory(), day), { recursive: true });
  await writeFile(join(localDirectory(), day, pathname.split('/').at(-1)), JSON.stringify(batch), { flag: 'wx', mode: 0o600 });
 } else {
  if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error('Metrics storage is not configured');
  await put(pathname, JSON.stringify(batch), { access: 'private', contentType: 'application/json', addRandomSuffix: false });
 }
}
export async function readBatches(days) {
 const dates = Array.from({length: days}, (_, index) => new Date(Date.now() - index * 86400000).toISOString().slice(0,10));
 const batches = [];
 let truncated = false;
 for (const day of dates) {
  if (localDirectory() && !process.env.VERCEL) {
   let files;
   try { files = await readdir(join(localDirectory(), day)); } catch (error) { if (error.code === 'ENOENT') continue; throw error; }
   for (const file of files.filter(name => name.endsWith('.json'))) batches.push(JSON.parse(await readFile(join(localDirectory(), day, file), 'utf8')));
  } else {
   let cursor;
   do {
    const page = await list({ prefix: `metrics/${day}/`, cursor, limit: 1000 });
    for (let offset = 0; offset < page.blobs.length; offset += 20) {
     const group = await Promise.all(page.blobs.slice(offset, offset + 20).map(async blob => {
      const result = await get(blob.pathname, {access:'private', useCache:false});
      if (!result || result.statusCode !== 200) throw new Error('A metrics record could not be read');
      return new Response(result.stream).json();
     }));
     batches.push(...group);
    }
    cursor = page.hasMore ? page.cursor : undefined;
    if (batches.length >= 10000) {truncated = Boolean(cursor) || day !== dates.at(-1); break;}
   } while (cursor);
  }
  if (batches.length >= 10000) {truncated = true; break;}
 }
 return {batches, truncated};
}
const group = (items, selector) => {
 const counts = new Map();
 for (const item of items) { const key = selector(item) || 'Unknown'; counts.set(key, (counts.get(key) || 0) + 1); }
 return [...counts].map(([label,count])=>({label,count})).sort((a,b)=>b.count-a.count).slice(0, 20);
};
export function summarize(batches, days, truncated = false, now = Date.now()) {
 const since = Date.parse(new Date(now - (days - 1) * 86400000).toISOString().slice(0,10));
 const seen = new Set(), events = [], pages = new Map(), duration = new Map();
 const visits = new Map(), visitors = new Set();
 for (const batch of batches) {
  for (const event of batch.events) {
   if (event.at < since || event.at > now || seen.has(event.id)) continue;
   seen.add(event.id);
   const item = {...event, pageId:batch.pageId, sessionId:batch.sessionId, visitorId:batch.visitorId, country:batch.country, region:batch.region};
   events.push(item);
   if (event.name === 'page_view') {
    pages.set(batch.pageId,item);visits.set(batch.sessionId,item);visitors.add(batch.visitorId);
   }
   if (event.name === 'engagement') duration.set(batch.pageId,Math.max(duration.get(batch.pageId)||0,event.data.seconds));
  }
 }
 const count = name => events.filter(event=>event.name===name).length;
 const sessionsFor = name => new Set(events.filter(e=>e.name===name && visits.has(e.sessionId)).map(e=>e.sessionId)).size;
 const reading = [...duration.values()].reduce((sum,n)=>sum+n,0);
 const engaged = new Set(events.filter(e=>visits.has(e.sessionId) && ((e.name==='engagement' && e.data.seconds>=10)||['rsvp_click','directions_click','flight_search','train_search'].includes(e.name))).map(e=>e.sessionId)).size;
 const daily = Array.from({length: days},(_,index)=>{
  const day = new Date(now-(days-index-1)*86400000).toISOString().slice(0,10);
  return {day,views:[...pages.values()].filter(e=>new Date(e.at).toISOString().startsWith(day)).length,
   rsvpClicks:events.filter(e=>e.name==='rsvp_click'&&new Date(e.at).toISOString().startsWith(day)).length};
 });
 return {generatedAt:new Date(now).toISOString(),days,truncated,firstCapturedAt:events.length?new Date(events.reduce((first,event)=>Math.min(first,event.at),now)).toISOString():null,
  totals:{visitors:visitors.size,visits:visits.size,pageViews:pages.size,rsvpClicks:count('rsvp_click'),rsvpVisits:sessionsFor('rsvp_click'),
   directions:count('directions_click'),flightSearches:count('flight_search'),trainSearches:count('train_search'),averageReadingSeconds:pages.size?Math.round(reading/pages.size):0,
   rsvpRate:visits.size?Math.round(sessionsFor('rsvp_click')/visits.size*1000)/10:0,engagedRate:visits.size?Math.round(engaged/visits.size*1000)/10:0,
   activeVisits:new Set(events.filter(e=>e.at>now-300000).map(e=>e.sessionId)).size},
  daily,actions:group(events.filter(e=>!['page_view','engagement','scroll_depth'].includes(e.name)),e=>e.name==='section_view'?`Section · ${e.data.section}`:e.name),
  countries:group([...visits.values()],e=>e.country),regions:group([...visits.values()],e=>e.region),devices:group([...visits.values()],e=>e.data.device),
  referrers:group([...visits.values()],e=>e.data.referrer||'Direct'),campaigns:group([...visits.values()],e=>e.data.campaign||'Unspecified'),
  origins:group(events.filter(e=>e.name==='origin_change'),e=>e.data.origin),languages:group(events.filter(e=>e.name==='language_change'),e=>e.data.language),
  scroll:group(events.filter(e=>e.name==='scroll_depth'),e=>`${e.data.percent}%`),
  recent:events.filter(e=>!['engagement','page_view','scroll_depth'].includes(e.name)).sort((a,b)=>b.at-a.at).slice(0,20).map(({name,at,data})=>({name,at,data}))};
}
export function sameSecret(value, expected) {
 if (typeof value !== 'string' || !expected) return false;
 const a = createHmac('sha256', expected).update(value).digest(), b = createHmac('sha256', expected).update(expected).digest();
 return timingSafeEqual(a,b);
}
export function sessionCookie(secret) {
 const expires = Date.now() + 7 * 86400000;
 const signature = createHmac('sha256',secret).update(String(expires)).digest('hex');
 return `${expires}.${signature}`;
}
export function authorized(request) {
 const secret = process.env.METRICS_DASHBOARD_PASSWORD;
 if (!secret) return false;
 const cookie = request.headers.cookie?.split(';').map(v=>v.trim()).find(v=>v.startsWith('wedding_metrics='))?.slice(16);
 if (!cookie) return false;
 const [expires,signature] = cookie.split('.');
 if (!/^\d+$/.test(expires) || Number(expires)<Date.now() || Number(expires)>Date.now()+8*86400000) return false;
 return sameSecret(signature,createHmac('sha256',secret).update(expires).digest('hex'));
}
export function secureResponse(response) {
 response.setHeader('Cache-Control','private, no-store');
 response.setHeader('Vercel-CDN-Cache-Control','no-store');
 response.setHeader('X-Content-Type-Options','nosniff');
}
export function sameOrigin(request) {
 const origin = request.headers.origin;
 if (!origin) return false;
 try {return new URL(origin).host === request.headers.host;} catch {return false;}
}
