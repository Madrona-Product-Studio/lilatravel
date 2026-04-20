// ═══════════════════════════════════════════════════════════════════════════════
// FOOTER — shared across all pages
// ═══════════════════════════════════════════════════════════════════════════════

import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="px-[52px] py-12 bg-dark-ink">
      <div className="max-w-[1100px] mx-auto flex justify-between items-center flex-wrap gap-4">
        <Link to="/" className="font-body text-xl font-medium tracking-[0.08em] text-white/70 no-underline">
          Lila Trips
        </Link>
        <div className="flex items-center gap-4 font-body text-[11px] tracking-[0.06em]">
          <p className="text-white/[0.25] m-0">
            © 2026 Lila Trips
          </p>
          <span className="text-white/[0.15]">·</span>
          <p className="text-white/[0.25] m-0">
            Created by{' '}
            <a href="https://madronaproductstudio.com" target="_blank" rel="noopener noreferrer"
              className="no-underline hover:underline" style={{ color: '#E07856', fontWeight: 500 }}>
              Madrona Product Studio
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
