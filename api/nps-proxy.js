import { checkOrigin } from './_utils.js';

const NPS_BASE_URL = 'https://developer.nps.gov/api/v1';
const ALLOWED_ENDPOINTS = new Set(['thingstodo', 'events', 'alerts']);

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  if (!checkOrigin(req, res)) return;

  const { endpoint, parkCode } = req.query;

  if (!endpoint || !ALLOWED_ENDPOINTS.has(endpoint)) {
    return res.status(400).json({ error: 'Invalid endpoint' });
  }
  if (!parkCode || !/^[a-z]{2,10}$/i.test(parkCode)) {
    return res.status(400).json({ error: 'Invalid parkCode' });
  }

  const apiKey = process.env.NPS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'NPS API key not configured' });
  }

  try {
    const limit = endpoint === 'thingstodo' ? 50 : 20;
    const response = await fetch(
      `${NPS_BASE_URL}/${endpoint}?parkCode=${parkCode}&limit=${limit}`,
      { headers: { 'X-Api-Key': apiKey } }
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: `NPS API returned ${response.status}` });
    }

    const data = await response.json();
    // Cache for 30 minutes on CDN/browser
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');
    res.status(200).json(data);
  } catch (err) {
    console.error('NPS proxy error:', err);
    res.status(500).json({ error: 'Failed to fetch from NPS API' });
  }
}
