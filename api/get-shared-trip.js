import { createClient } from '@supabase/supabase-js';

// Use the service role key to bypass RLS — this runs server-side only
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const { token } = req.query;
  if (!token) return res.status(400).json({ error: 'Missing token' });

  // Validate UUID v4 format before querying database
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(token)) {
    return res.status(400).json({ error: 'Invalid token format' });
  }

  // Fail fast if env vars are missing
  if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('get-shared-trip: missing env vars', {
      hasUrl: !!process.env.VITE_SUPABASE_URL,
      hasKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    });
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  try {
    // Try share_token first, fall back to itinerary ID
    let data, error;
    ({ data, error } = await supabase
      .from('itineraries')
      .select('id, raw_itinerary, destination, session_id, trip_logistics, title')
      .eq('share_token', token)
      .single());

    if (error || !data) {
      // Fallback: try as itinerary ID
      ({ data, error } = await supabase
        .from('itineraries')
        .select('id, raw_itinerary, destination, session_id, trip_logistics, title')
        .eq('id', token)
        .single());
    }

    if (error) {
      console.error('get-shared-trip query error:', error.code, error.message);
      return res.status(404).json({ error: 'Trip not found', detail: error.message });
    }
    if (!data) {
      console.error('get-shared-trip: query returned null data for token', token);
      return res.status(404).json({ error: 'Trip not found' });
    }

    // Fetch form_data from sessions
    let formData = null;
    if (data.session_id) {
      const { data: session } = await supabase
        .from('sessions')
        .select('form_data')
        .eq('id', data.session_id)
        .single();
      if (session?.form_data) formData = session.form_data;
    }

    // Fetch all iterations for this trip via session_id
    let iterations = [];
    if (data.session_id) {
      const { data: iterRows } = await supabase
        .from('itineraries')
        .select('id, iteration, created_at')
        .eq('session_id', data.session_id)
        .order('iteration', { ascending: true });
      if (iterRows) iterations = iterRows;
    }

    res.status(200).json({
      id: data.id,
      rawItinerary: data.raw_itinerary,
      destination: data.destination,
      formData,
      tripLogistics: data.trip_logistics || null,
      tripTitle: data.title || null,
      iterations,
    });
  } catch (err) {
    console.error('get-shared-trip exception:', err);
    res.status(500).json({ error: 'Server error', detail: err.message });
  }
}
