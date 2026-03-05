import { supabase } from './supabaseClient';
import { getOrCreateSession } from './sessionManager';

export async function saveItinerary({ formData, rawItinerary, destination, iteration = 0 }) {
  try {
    const sessionId = await getOrCreateSession(formData);
    if (!sessionId) return null;

    const { data, error } = await supabase
      .from('itineraries')
      .insert({
        session_id: sessionId,
        iteration,
        raw_itinerary: rawItinerary,
        destination,
      })
      .select('id')
      .single();

    if (error) { console.error('saveItinerary failed:', error); return null; }
    return data.id;
  } catch (e) {
    console.error('saveItinerary exception:', e);
    return null;
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
