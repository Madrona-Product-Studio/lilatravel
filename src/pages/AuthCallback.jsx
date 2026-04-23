import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@services/supabaseClient';
import { C } from '@data/brand';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase automatically picks up the tokens from the URL hash.
    // We just wait for the session to be established, then redirect home.
    supabase.auth.getSession().then(({ data: { session } }) => {
      // Small delay so onAuthStateChange fires first (claims trips)
      setTimeout(() => {
        navigate(session ? '/' : '/?auth_error=1', { replace: true });
      }, 300);
    });
  }, [navigate]);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: C.cream,
    }}>
      <div
        style={{
          width: 28, height: 28, borderRadius: '50%',
          border: `2px solid ${C.oceanTeal}30`,
          borderTopColor: C.oceanTeal,
          animation: 'spin 0.8s linear infinite',
        }}
      />
    </div>
  );
}
