import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function WhisperBar({ destination, label, ctaRef }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [nearCta, setNearCta] = useState(false);

  // Show after 35% scroll, dissolve when near the bottom CTA section
  useEffect(() => {
    if (dismissed) return;
    const onScroll = () => {
      const scrollPct = (window.scrollY + window.innerHeight) / document.body.scrollHeight;
      if (scrollPct >= 0.35) setVisible(true);

      // Dissolve when the in-page CTA is visible
      if (ctaRef?.current) {
        const rect = ctaRef.current.getBoundingClientRect();
        setNearCta(rect.top < window.innerHeight + 20);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [dismissed, ctaRef]);

  if (dismissed) return null;

  const shouldShow = visible && !nearCta;

  return (
    <div
      style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        height: 56, zIndex: 97,
        background: '#1a2530',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 12,
        transform: shouldShow ? 'translateY(0)' : 'translateY(100%)',
        opacity: shouldShow ? 1 : 0,
        transition: 'transform 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease',
        pointerEvents: shouldShow ? 'auto' : 'none',
      }}
    >
      <span
        role="link"
        tabIndex={0}
        onClick={() => navigate(`/plan?destination=${destination}`)}
        onKeyDown={e => { if (e.key === 'Enter') navigate(`/plan?destination=${destination}`); }}
        style={{
          fontFamily: "'Quicksand', sans-serif",
          fontSize: 10, fontWeight: 700,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'rgba(245,241,234,0.55)',
          cursor: 'pointer', whiteSpace: 'nowrap',
          padding: '8px 0',
        }}
      >
        Design your {label} trip <span style={{ marginLeft: 4 }}>→</span>
      </span>

      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        style={{
          position: 'absolute', right: 16,
          background: 'none', border: 'none',
          fontFamily: "'Quicksand', sans-serif",
          fontSize: 11, color: 'rgba(245,241,234,0.2)',
          cursor: 'pointer', padding: 6, lineHeight: 1,
        }}
      >
        ✕
      </button>
    </div>
  );
}
