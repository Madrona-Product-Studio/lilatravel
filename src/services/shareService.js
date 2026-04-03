import { supabase } from './supabaseClient';

// Returns a stable shareable URL — reuses the existing token if one exists
// Requires index on itineraries.share_token — verify in Supabase dashboard:
// create index if not exists itineraries_share_token_idx on itineraries(share_token);
export async function createShareableUrl({ itineraryId, rawItinerary, formData, destination }) {
  try {
    if (!itineraryId) {
      console.error('createShareableUrl: no itineraryId — trip was not saved to database');
      return null;
    }

    // Check if this itinerary already has a share token
    const { data: existing } = await supabase
      .from('itineraries')
      .select('share_token')
      .eq('id', itineraryId)
      .single();

    if (existing?.share_token) {
      return `${window.location.origin}/trip/${existing.share_token}`;
    }

    // No token yet — generate one and persist it
    const shareToken = crypto.randomUUID();

    const { data: updated, error } = await supabase
      .from('itineraries')
      .update({ share_token: shareToken })
      .eq('id', itineraryId)
      .select('id')
      .single();

    if (error) throw error;
    if (!updated) throw new Error('Update matched zero rows — itineraryId may not exist');

    return `${window.location.origin}/trip/${shareToken}`;
  } catch (e) {
    console.error('createShareableUrl failed:', e);
    return null;
  }
}

export async function sendTripEmail({ email, mode, itineraryUrl, itineraryTitle }) {
  const res = await fetch('/api/send-trip-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, mode, itineraryUrl, itineraryTitle }),
  });
  if (!res.ok) throw new Error('Email send failed');
  return res.json();
}
