import { supabase } from './supabaseClient';

const SESSION_KEY = 'lila_session_id';

export async function getOrCreateSession(formData) {
  // Return existing session if it still exists in the DB
  const existing = localStorage.getItem(SESSION_KEY);
  if (existing) {
    const { data } = await supabase
      .from('sessions')
      .select('id')
      .eq('id', existing)
      .single();
    if (data) return existing;
    // Stale — clear and fall through to create a new one
    console.warn('getOrCreateSession: stale session ID, creating new');
    localStorage.removeItem(SESSION_KEY);
  }

  // Create new anonymous session in Supabase
  const { data, error } = await supabase
    .from('sessions')
    .insert({ form_data: formData })
    .select('id')
    .single();

  if (error) {
    console.error('Session creation failed:', error);
    return null;
  }

  localStorage.setItem(SESSION_KEY, data.id);
  return data.id;
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}
