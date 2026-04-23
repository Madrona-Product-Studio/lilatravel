import { supabase } from './supabaseClient';

const SESSION_KEY = 'lila_session_id';

/** Get the current Supabase auth user ID, if logged in. */
async function getCurrentUserId() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.id ?? null;
  } catch { return null; }
}

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

  const userId = await getCurrentUserId();

  // Create new session in Supabase (with user_id if logged in)
  const row = { form_data: formData };
  if (userId) row.user_id = userId;

  const { data, error } = await supabase
    .from('sessions')
    .insert(row)
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
