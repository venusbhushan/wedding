import { saveBatch, secureResponse, sameOrigin, validateBatch } from '../lib/metrics.mjs';
export default async function handler(request, response) {
 secureResponse(response);
 if (request.method !== 'POST') return response.status(405).json({error:'Method not allowed'});
 if (!sameOrigin(request)) return response.status(403).json({error:'Invalid origin'});
 if (Number(request.headers['content-length'])>32000) return response.status(413).json({error:'Batch too large'});
 if (request.headers.dnt==='1' || /bot|crawler|spider|headless/i.test(request.headers['user-agent']||'')) return response.status(204).end();
 let batch;
 try { const body=typeof request.body==='string'?JSON.parse(request.body):request.body; batch=validateBatch(body,request.headers); }
 catch {return response.status(400).json({error:'Invalid event batch'});}
 try {await saveBatch(batch);return response.status(202).json({accepted:batch.events.length});}
 catch (error) {console.error('Metrics write failed',error.message);return response.status(503).json({error:'Metrics temporarily unavailable'});}
}
