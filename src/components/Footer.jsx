// ═══════════════════════════════════════════════════════════════════════════════
// FOOTER — shared across all pages
// ═══════════════════════════════════════════════════════════════════════════════

import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="px-[52px] py-12 bg-dark-ink">
      <div className="max-w-[1100px] mx-auto flex justify-between items-center">
        <Link to="/" className="font-body text-xl font-medium tracking-[0.08em] text-white/70 no-underline">
          Lila Trips
        </Link>
        <p className="font-body text-[11px] text-white/[0.25] tracking-[0.06em] m-0">
          © 2026 Lila Trips
        </p>
      </div>
    </footer>
  );
}
