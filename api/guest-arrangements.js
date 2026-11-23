import { createHash, timingSafeEqual } from 'node:crypto';
import { get, put, BlobPreconditionFailedError } from '@vercel/blob';

const pathname = 'guest-arrangements-v1.json';
const digest = value => createHash('sha256').update(value).digest();
const fields = ['name', 'origin', 'destination', 'date', 'time', 'departurePlace', 'departureDate', 'departureTime', 'notes'];

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  const password = process.env.GUEST_TRACKER_PASSWORD;
  if (!password) return res.status(503).json({ error: 'Guest tracker is unavailable.' });
  if (!timingSafeEqual(digest(req.headers.authorization ?? ''), digest('Bearer ' + password))) {
    return res.status(401).json({ error: 'Enter the correct tracker password.' });
  }
  try {
    if (req.method === 'GET') {
      const file = await get(pathname, {access: 'private', useCache: false});
      if (!file) return res.status(200).json({guests: [], version: null});
      if (file.statusCode !== 200) throw new Error('Unexpected storage response');
      return res.status(200).json({guests: await new Response(file.stream).json(), version: file.blob.etag});
    }
    if (req.method === 'PUT') {
      const {guests, version} = req.body ?? {};
      if (!(version === null || typeof version === 'string') || !Array.isArray(guests) || guests.length > 500 ||
        !guests.every(guest => guest && typeof guest.id === 'string' && guest.id.length <= 100 && typeof guest.done === 'boolean' &&
          fields.every(field => typeof guest[field] === 'string' && guest[field].length <= (field === 'notes' ? 3000 : 200)) &&
          guest.name && guest.destination && /^\d{4}-\d{2}-\d{2}$/.test(guest.date)) ||
        new Set(guests.map(guest => guest.id)).size !== guests.length) {
        return res.status(400).json({error: 'Check the guest details and field lengths.'});
      }
      const clean = guests.map(guest => ({id: guest.id, done: guest.done, ...Object.fromEntries(fields.map(field => [field, guest[field]]))}));
      const file = await put(pathname, JSON.stringify(clean), {
        access: 'private', contentType: 'application/json', addRandomSuffix: false, allowOverwrite: version !== null,
        ...(version === null ? {} : {ifMatch: version}),
      });
      return res.status(200).json({version: file.etag});
    }
    res.setHeader('Allow', 'GET, PUT');
    return res.status(405).end();
  } catch (error) {
    if (error instanceof BlobPreconditionFailedError || /already exists/i.test(error?.message ?? "")) {
      return res.status(409).json({error: 'Another device updated the list. Sign out and back in to load the latest entries.'});
    }
    console.error('Guest storage request failed', error?.name);
    return res.status(503).json({error: 'Could not reach guest storage. Try again shortly.'});
  }
}
