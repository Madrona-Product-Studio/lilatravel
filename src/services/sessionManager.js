import { supabase } from './supabaseClient';

const SESSION_KEY = 'lila_session_id';

export async function getOrCreateSession(formData) {
  // Return existing session if we have one
  const existing = localStorage.getItem(SESSION_KEY);
  if (existing) return existing;

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
