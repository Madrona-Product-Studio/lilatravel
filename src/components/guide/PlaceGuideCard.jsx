import { Link } from 'react-router-dom';
import { G } from '@data/guides/guide-styles';
import { trackEvent } from '@utils/analytics';

export default function PlaceGuideCard({ label, descriptor, bg, to }) {
  return (
    <Link
      to={to}
      onClick={() => trackEvent('place_guide_clicked', { guide: to.split('/').pop() })}
      style={{ position: 'relative', overflow: 'hidden', height: 148, margin: '32px 0', cursor: 'pointer', borderRadius: 14, display: 'block', textDecoration: 'none' }}
    >
      <div style={{ position: 'absolute', inset: 0, background: bg }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,14,18,0.62) 0%, rgba(10,14,18,0.18) 55%, rgba(10,14,18,0.06) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, padding: '16px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>
          Place Guide
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 24, fontWeight: 700, color: 'white', lineHeight: 1, letterSpacing: '-0.01em', marginBottom: 5 }}>{label}</div>
            {descriptor && <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 400, color: 'rgba(255,255,255,0.55)' }}>{descriptor}</div>}
          </div>
          <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>→</span>
        </div>
      </div>
    </Link>
  );
}
