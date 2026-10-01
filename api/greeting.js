import { greetingForLocation, originForLocation } from '../lib/greeting.mjs';

export default function handler(request, response) {
 // Never share a location-specific response through a browser or CDN cache.
 response.setHeader('Cache-Control', 'private, no-store, max-age=0');
 response.setHeader('Vercel-CDN-Cache-Control', 'no-store');
 if(request.method !== 'GET') {
  response.setHeader('Allow', 'GET');
  return response.status(405).json({error:'Method not allowed'});
 }
 const headers=request.headers;
 return response.status(200).json({...greetingForLocation(
  headers['x-vercel-ip-country'], headers['x-vercel-ip-country-region']
 ),originId:originForLocation(headers['x-vercel-ip-country'],headers['x-vercel-ip-country-region'])});
}
