/**
 * Google Places text search proxy.
 * Keeps GOOGLE_PLACES_API_KEY server-side.
 *
 * Prerequisites:
 *   - Google Cloud project with Places API enabled
 *   - GOOGLE_PLACES_API_KEY set in Vercel env vars and .env.local
 *
 * GET /api/places-search?query=Oscar%27s+Cafe+Springdale+UT
 * Returns: { placeId, name, rating, userRatingsTotal, photoRefs }
 */

import { checkOrigin, checkRateLimit } from './_utils.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!checkOrigin(req, res)) return;
  if (!checkRateLimit(req, res, 'places-search')) return;

  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) {
    return res.status(500).json({ error: 'Google Places API key not configured' });
  }

  const { query } = req.query;
  if (!query || typeof query !== 'string' || query.length > 200) {
    return res.status(400).json({ error: 'Invalid or missing query parameter (max 200 chars)' });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id,name,rating,user_ratings_total,photos,formatted_address,formatted_phone_number,geometry&key=${key}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK' || !data.candidates?.length) {
      return res.status(404).json({ error: 'Place not found', status: data.status });
    }

    const candidate = data.candidates[0];
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=172800');
    return res.json({
      placeId: candidate.place_id,
      name: candidate.name,
      rating: candidate.rating,
      userRatingsTotal: candidate.user_ratings_total,
      address: candidate.formatted_address,
      phone: candidate.formatted_phone_number,
      photoRefs: candidate.photos?.map(p => p.photo_reference) ?? [],
    });
  } catch (err) {
    console.error('Places search error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch place data' });
  }
}
