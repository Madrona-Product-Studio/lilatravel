import { checkOrigin, checkRateLimit } from './_utils.js';

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!checkOrigin(req, res)) return;
  if (!checkRateLimit(req, res, 'astronomy')) return;

  const id = process.env.ASTRONOMY_APP_ID;
  const secret = process.env.ASTRONOMY_APP_SECRET;
  if (!id || !secret) {
    return res.status(500).json({ error: 'Astronomy API credentials not configured' });
  }
  const auth = Buffer.from(`${id}:${secret}`).toString('base64');
  const { type, date, lat = '37.2', lon = '-112.9' } = req.query;
  const today = date || new Date().toISOString().split('T')[0];

  let url, options = {};

  if (type === 'bodies') {
    url = `https://api.astronomyapi.com/api/v2/bodies/positions?latitude=${lat}&longitude=${lon}&elevation=1&from_date=${today}&to_date=${today}&time=21:00:00`;
    options = { method: 'GET' };
  } else if (type === 'moon-phase') {
    url = `https://api.astronomyapi.com/api/v2/studio/moon-phase`;
    options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        format: 'svg',
        style: { moonStyle: 'sketch', backgroundStyle: 'solid', backgroundColor: '#1a1a18', headingColor: '#E8E0D5', textColor: '#E8E0D5' },
        observer: { latitude: parseFloat(lat), longitude: parseFloat(lon), date: today },
        view: { type: 'portrait-simple', orientation: 'north-up' }
      })
    };
  } else {
    return res.status(400).json({ error: 'Unknown type. Use bodies or moon-phase.' });
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: { ...options.headers, Authorization: `Basic ${auth}` }
    });
    const data = await response.json();
    res.setHeader('Cache-Control', 'public, s-maxage=3600');
    res.status(200).json(data);
  } catch (err) {
    console.error('Astronomy API error:', err.message);
    res.status(500).json({ error: err.message });
  }
}
