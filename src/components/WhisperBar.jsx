import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { C, FONTS } from '@data/brand';

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
      height: 52,
      zIndex: 100,
      background: C.darkInk,
      borderTop: '1px solid rgba(212,168,83,0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: isMobile ? 10 : 16,
      paddingLeft: 16,
      paddingRight: isMobile ? 52 : 16,
      transform: visible ? 'translateY(0)' : 'translateY(100%)',
      transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      <span style={{
        fontFamily: FONTS.body,
        fontWeight: 300,
        fontSize: isMobile ? 13 : 14,
        color: C.cream,
        opacity: 0.75,
        whiteSpace: 'nowrap',
      }}>
        Ready to go deeper?
      </span>

      {!isMobile && (
        <span style={{
          display: 'inline-block',
          width: 1,
          height: 20,
          background: 'rgba(245,241,234,0.2)',
          flexShrink: 0,
        }} />
      )}

      <span
        role="link"
        tabIndex={0}
        onClick={() => navigate(`/plan?destination=${destination}`)}
        onKeyDown={e => { if (e.key === 'Enter') navigate(`/plan?destination=${destination}`); }}
        style={{
          fontFamily: FONTS.body,
          fontWeight: 600,
          fontSize: isMobile ? 12 : 13,
          color: C.goldenAmber,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        Plan Your {label} Trip
      </span>

      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        style={{
          position: 'absolute',
          right: 16,
          background: 'none',
          border: 'none',
          color: C.cream,
          fontSize: 14,
          opacity: 0.7,
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
