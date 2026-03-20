import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { C, FONTS } from '@data/brand';

const Diamond = () => (
  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
    <rect x="6" y="0.5" width="7.5" height="7.5" rx="0"
      transform="rotate(45 6 0.5)"
      stroke="rgba(212,168,83,0.35)" strokeWidth="1"/>
  </svg>
);

export default function WhisperBar({ destination, label }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Responsive
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Show after 45% scroll (one-way)
  useEffect(() => {
    if (dismissed) return;
    const onScroll = () => {
      if (window.scrollY + window.innerHeight >= document.body.scrollHeight * 0.45) {
        setVisible(true);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [dismissed]);

  if (dismissed) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: isMobile ? 80 : 72,
      zIndex: 100,
      background: C.darkInk,
      borderTop: '1px solid rgba(212,168,83,0.12)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: isMobile ? 16 : 20,
      transform: visible ? 'translateY(0)' : 'translateY(100%)',
      transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      <Diamond />

      {!isMobile && (
        <>
          <span style={{
            fontFamily: FONTS.body,
            fontWeight: 400,
            fontSize: 14,
            color: 'rgba(245,241,234,0.45)',
            letterSpacing: '0.06em',
            whiteSpace: 'nowrap',
          }}>
            Feeling the pull?
          </span>

          <span style={{
            display: 'inline-block',
            width: 1,
            height: 20,
            background: 'rgba(245,241,234,0.2)',
            flexShrink: 0,
          }} />
        </>
      )}

      <span
        role="link"
        tabIndex={0}
        onClick={() => navigate(`/plan?destination=${destination}`)}
        onKeyDown={e => { if (e.key === 'Enter') navigate(`/plan?destination=${destination}`); }}
        style={{
          fontFamily: FONTS.body,
          fontWeight: 700,
          fontSize: 10,
          color: 'rgba(212,168,83,0.7)',
          textTransform: 'uppercase',
          letterSpacing: '0.22em',
          borderBottom: '1px solid rgba(212,168,83,0.25)',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        Design your {label} trip →
      </span>

      <Diamond />

      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        style={{
          position: 'absolute',
          right: isMobile ? 12 : 24,
          background: 'none',
          border: 'none',
          fontFamily: FONTS.body,
          fontSize: 10,
          color: 'rgba(245,241,234,0.18)',
          cursor: 'pointer',
          padding: 4,
          lineHeight: 1,
        }}
      >
        ✕
      </button>
    </div>
  );
}
