import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Diamond = () => (
  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="shrink-0">
    <rect x="6" y="0.5" width="7.5" height="7.5" rx="0"
      transform="rotate(45 6 0.5)"
      stroke="rgba(212,168,83,0.35)" strokeWidth="1"/>
  </svg>
);

export default function WhisperBar({ destination, label }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

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
    <div
      className="fixed bottom-0 left-0 right-0 h-20 md:h-[72px] z-[100] bg-dark-ink border-t border-[rgba(212,168,83,0.12)] flex items-center justify-center gap-4 md:gap-5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{ transform: visible ? 'translateY(0)' : 'translateY(100%)' }}
    >
      <Diamond />

      <span className="hidden md:inline-block font-body font-normal text-sm text-[rgba(245,241,234,0.45)] tracking-[0.06em] whitespace-nowrap">
        Feeling the pull?
      </span>

      <span className="hidden md:inline-block w-px h-5 bg-[rgba(245,241,234,0.2)] shrink-0" />

      <span
        role="link"
        tabIndex={0}
        onClick={() => navigate(`/plan?destination=${destination}`)}
        onKeyDown={e => { if (e.key === 'Enter') navigate(`/plan?destination=${destination}`); }}
        className="font-body font-bold text-[10px] text-[rgba(212,168,83,0.7)] uppercase tracking-[0.22em] border-b border-[rgba(212,168,83,0.25)] cursor-pointer whitespace-nowrap"
      >
        Design your {label} trip →
      </span>

      <Diamond />

      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        className="absolute right-3 md:right-6 bg-none border-none font-body text-[10px] text-[rgba(245,241,234,0.18)] cursor-pointer p-1 leading-none"
      >
        ✕
      </button>
    </div>
  );
}
