import { authorized, readBatches, sameOrigin, sameSecret, secureResponse, sessionCookie, summarize } from '../lib/metrics.mjs';
export default async function handler(request,response) {
 secureResponse(response);
 response.setHeader('X-Robots-Tag','noindex, nofollow');
 if (request.method === 'POST') {
  if (!sameOrigin(request)) return response.status(403).json({error:'Invalid origin'});
  if (!process.env.METRICS_DASHBOARD_PASSWORD) return response.status(503).json({error:'Dashboard access is not configured'});
  let body;
  try {body=typeof request.body==='string'?JSON.parse(request.body):request.body;} catch {return response.status(400).json({error:'Invalid request'});}
  if (!sameSecret(body?.password,process.env.METRICS_DASHBOARD_PASSWORD)) return response.status(401).json({error:'Incorrect password'});
  const secure=process.env.VERCEL?'; Secure':'';
  response.setHeader('Set-Cookie',`wedding_metrics=${sessionCookie(process.env.METRICS_DASHBOARD_PASSWORD)}; HttpOnly; SameSite=Strict; Path=/api/dashboard; Max-Age=604800${secure}`);
  return response.status(200).json({ok:true});
 }
 if (!authorized(request)) return response.status(401).json({error:'Sign in to view metrics'});
 if (request.method === 'DELETE') {
  if (!sameOrigin(request)) return response.status(403).json({error:'Invalid origin'});
  response.setHeader('Set-Cookie','wedding_metrics=; HttpOnly; SameSite=Strict; Path=/api/dashboard; Max-Age=0');
  return response.status(200).json({ok:true});
 }
 if (request.method !== 'GET') return response.status(405).json({error:'Method not allowed'});
 const days=Number(new URL(request.url,'https://local').searchParams.get('days')||7);
 if (![1,7,30].includes(days)) return response.status(400).json({error:'Invalid date range'});
 try { const {batches,truncated}=await readBatches(days);return response.status(200).json(summarize(batches,days,truncated)); }
 catch (error) {console.error('Metrics read failed',error.message);return response.status(503).json({error:'Metrics temporarily unavailable. Please retry.'});}
}
