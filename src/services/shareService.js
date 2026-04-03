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

/**
 * After a refinement creates a new itinerary row, move the share token
 * from the old row to the new one. The URL stays the same — it now
 * resolves to the latest version. The old row keeps its data intact
 * (minus share_token) for history.
 */
export async function migrateShareToken(oldItineraryId, newItineraryId) {
  if (!oldItineraryId || !newItineraryId || oldItineraryId === newItineraryId) return;
  try {
    // Read the old row's token
    const { data: oldRow } = await supabase
      .from('itineraries')
      .select('share_token')
      .eq('id', oldItineraryId)
      .single();

    if (!oldRow?.share_token) return; // nothing to migrate

    // Clear the old row's token
    await supabase
      .from('itineraries')
      .update({ share_token: null })
      .eq('id', oldItineraryId);

    // Set it on the new row
    const { error } = await supabase
      .from('itineraries')
      .update({ share_token: oldRow.share_token })
      .eq('id', newItineraryId);

    if (error) {
      console.error('migrateShareToken: failed to set token on new row', error);
      // Try to restore the old row's token
      await supabase
        .from('itineraries')
        .update({ share_token: oldRow.share_token })
        .eq('id', oldItineraryId);
    }
  } catch (e) {
    console.error('migrateShareToken failed:', e);
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
