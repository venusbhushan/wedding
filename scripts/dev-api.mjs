import {createServer} from 'node:http';
import {resolve} from 'node:path';
import metrics from '../api/metrics.js';
import dashboard from '../api/dashboard.js';
import greeting from '../api/greeting.js';
if (process.env.NODE_ENV==='production' || process.env.VERCEL) throw new Error('Local API server must not run in production');
process.env.METRICS_LOCAL_DIR=resolve('.local-metrics');
if(!process.env.METRICS_DASHBOARD_PASSWORD) throw new Error('Set METRICS_DASHBOARD_PASSWORD in .env.local');
const routes={'/api/metrics':metrics,'/api/dashboard':dashboard,'/api/greeting':greeting};
createServer(async(request,response)=>{
 response.status=code=>{response.statusCode=code;return response;};
 response.json=value=>response.end(JSON.stringify(value));
 response.setHeader('Content-Type','application/json');
 const handler=routes[new URL(request.url,'http://local').pathname];
 if(!handler)return response.status(404).json({error:'Not found'});
 let raw='';
 try {
  for await(const chunk of request){raw+=chunk;if(Buffer.byteLength(raw)>32000)return response.status(413).json({error:'Too large'});}
  if(raw)request.body=JSON.parse(raw);
  await handler(request,response);
 }catch {response.status(400).json({error:'Invalid request'});}
}).listen(5176,'127.0.0.1',()=>console.log('Local metrics API at http://127.0.0.1:5176'));
