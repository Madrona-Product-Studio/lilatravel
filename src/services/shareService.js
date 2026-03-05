import { supabase } from './supabaseClient';

// Stores a shareable snapshot of the itinerary and returns a URL
export async function createShareableUrl({ itineraryId, rawItinerary, formData, destination }) {
  try {
    // Update the itinerary row with a share token
    const shareToken = crypto.randomUUID();

    const { error } = await supabase
      .from('itineraries')
      .update({ share_token: shareToken })
      .eq('id', itineraryId);

    if (error) throw error;

    return `${window.location.origin}/trip/${shareToken}`;
  } catch (e) {
    // Fallback: just use current URL
    console.error('createShareableUrl failed:', e);
    return window.location.href;
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
