import { supabase } from './supabaseClient';
import { getOrCreateSession, clearSession } from './sessionManager';

/** Get the current Supabase auth user ID, if logged in. */
async function getCurrentUserId() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.id ?? null;
  } catch { return null; }
}

export async function saveItinerary({ formData, rawItinerary, destination, iteration = 0, previousItineraryId = null, tripLogistics = null }) {
  try {
    let sessionId = await getOrCreateSession(formData);
    if (!sessionId) {
      // One retry — clear stale session and try again
      clearSession();
      sessionId = await getOrCreateSession(formData);
    }
    if (!sessionId) return null;

    const userId = await getCurrentUserId();

    const row = {
      session_id: sessionId,
      iteration,
      raw_itinerary: rawItinerary,
      destination,
    };
    if (userId) row.user_id = userId;
    if (tripLogistics) row.trip_logistics = tripLogistics;

    // Try insert with one retry on failure
    let data, error;
    ({ data, error } = await supabase
      .from('itineraries')
      .insert(row)
      .select('id')
      .single());

    if (error) {
      console.warn('saveItinerary: first attempt failed, retrying...', error.message);
      await new Promise(r => setTimeout(r, 1500));
      ({ data, error } = await supabase
        .from('itineraries')
        .insert(row)
        .select('id')
        .single());
    }

    if (error) { console.error('saveItinerary failed after retry:', error); return null; }

    // If this is a refinement, migrate the share token from the old row
    if (previousItineraryId && data.id) {
      try {
        const { data: oldRow } = await supabase
          .from('itineraries')
          .select('share_token')
          .eq('id', previousItineraryId)
          .single();

        if (oldRow?.share_token) {
          // Clear old row's token, set it on new row
          await supabase.from('itineraries').update({ share_token: null }).eq('id', previousItineraryId);
          const { error: migrateErr } = await supabase
            .from('itineraries')
            .update({ share_token: oldRow.share_token })
            .eq('id', data.id);

          if (migrateErr) {
            console.error('saveItinerary: token migration failed, restoring old token', migrateErr);
            await supabase.from('itineraries').update({ share_token: oldRow.share_token }).eq('id', previousItineraryId);
          }
        }
      } catch (migErr) {
        console.error('saveItinerary: token migration exception', migErr);
      }
    }

    return data.id;
  } catch (e) {
    console.error('saveItinerary exception:', e);
    return null;
  }
}

export async function updateTripLogistics(itineraryId, tripLogistics) {
  if (!itineraryId) return;
  try {
    const { error } = await supabase
      .from('itineraries')
      .update({ trip_logistics: tripLogistics })
      .eq('id', itineraryId);
    if (error) console.error('updateTripLogistics failed:', error);
  } catch (e) {
    console.error('updateTripLogistics exception:', e);
  }
}

export async function updateItineraryTitle(itineraryId, title) {
  try {
    const { error } = await supabase
      .from('itineraries')
      .update({ title })
      .eq('id', itineraryId);
    if (error) console.error('updateItineraryTitle failed:', error);
  } catch (e) {
    console.error('updateItineraryTitle exception:', e);
  }
}

export async function saveFeedback({ formData, itineraryId, activityFeedback, dayFeedback, pulse, overallNote, iteration }) {
  try {
    const sessionId = await getOrCreateSession(formData);
    if (!sessionId) return;

    const { error } = await supabase
      .from('feedback_events')
      .insert({
        session_id: sessionId,
        itinerary_id: itineraryId,
        activity_feedback: activityFeedback,
        day_feedback: dayFeedback,
        pulse,
        overall_note: overallNote,
        iteration,
      });

    if (error) console.error('saveFeedback failed:', error);
  } catch (e) {
    console.error('saveFeedback exception:', e);
  }
}
