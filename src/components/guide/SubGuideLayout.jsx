import { Link } from 'react-router-dom';
import { Nav, Footer } from '@components';
import { G } from '@data/guides/guide-styles';

export default function SubGuideLayout({ title, descriptor, children, backPath = '/destinations/zion', backLabel = 'Zion Guide' }) {
  return (
    <div className="font-body min-h-screen flex flex-col" style={{ background: G.warmWhite, color: G.ink }}>
      <Nav />
      <main style={{ maxWidth: 860, margin: '0 auto', width: '100%', padding: '0 max(20px, min(52px, 5vw))', paddingTop: 80 }}>
        <div style={{ maxWidth: 660 }}>
          <Link to={backPath} className="inline-flex items-center gap-1.5 no-underline" style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', color: G.oceanTeal, marginTop: 32, marginBottom: 24, display: 'inline-flex' }}>
            ← {backLabel}
          </Link>
          <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: G.oceanTeal, marginBottom: 12 }}>
            Place Guide
          </div>
          <h1 style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 700, color: G.darkInk, lineHeight: 1.0, letterSpacing: '-0.01em', margin: '0 0 8px' }}>
            {title}
          </h1>
          {descriptor && (
            <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 400, color: G.inkBody, margin: '0 0 32px', lineHeight: 1.6 }}>
              {descriptor}
            </p>
          )}
          <div style={{ height: '0.5px', background: G.border, marginBottom: 8 }} />
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
