import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const { itineraryId } = req.query;
  if (!itineraryId) return res.status(400).json({ error: 'Missing itineraryId' });

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(itineraryId)) {
    return res.status(400).json({ error: 'Invalid itineraryId format' });
  }

  if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  try {
    // Look up the session_id for this itinerary
    const { data: row, error: rowErr } = await supabase
      .from('itineraries')
      .select('session_id')
      .eq('id', itineraryId)
      .single();

    if (rowErr || !row?.session_id) {
      return res.status(404).json({ error: 'Itinerary not found' });
    }

    // Fetch all iterations for this session
    const { data: iterations, error: iterErr } = await supabase
      .from('itineraries')
      .select('id, iteration, created_at')
      .eq('session_id', row.session_id)
      .order('iteration', { ascending: true });

    if (iterErr) {
      console.error('get-trip-iterations query error:', iterErr);
      return res.status(500).json({ error: 'Failed to fetch iterations' });
    }

    res.status(200).json({ iterations: iterations || [] });
  } catch (err) {
    console.error('get-trip-iterations exception:', err);
    res.status(500).json({ error: 'Server error', detail: err.message });
  }
}
