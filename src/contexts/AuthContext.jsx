import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@services/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const newUser = session?.user ?? null;
        setUser(newUser);

        // On first sign-in, claim any anonymous trips from localStorage
        if (event === 'SIGNED_IN' && newUser) {
          claimAnonymousTrips(newUser.id);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// ─── Auth actions ──────────────────────────────────────────────────────────

async function signIn(provider = 'google') {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) console.error('Sign-in error:', error.message);
}

async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) console.error('Sign-out error:', error.message);
}

// ─── Claim anonymous trips on first login ──────────────────────────────────

async function claimAnonymousTrips(userId) {
  try {
    const trips = JSON.parse(localStorage.getItem('lila_trips') || '[]');
    if (trips.length === 0) return;

    // Collect share tokens from localStorage trip paths (e.g. /trip/abc-123)
    const shareTokens = trips
      .map(t => t.path?.match(/^\/trip\/(.+)$/)?.[1])
      .filter(Boolean);

    if (shareTokens.length === 0) return;

    const res = await fetch('/api/claim-trips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, shareTokens }),
    });

    if (res.ok) {
      // Trips are now in the DB under this user — localStorage stays as cache
      console.log('Claimed anonymous trips for user');
    }
  } catch (e) {
    console.error('Failed to claim anonymous trips:', e);
  }
}
