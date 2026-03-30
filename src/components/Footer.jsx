// ═══════════════════════════════════════════════════════════════════════════════
// FOOTER — shared across all pages
// ═══════════════════════════════════════════════════════════════════════════════

import { Link } from 'react-router-dom';
import { trackEvent } from '@utils/analytics';

export default function Footer() {
  const links = [
    { label: "Destinations", to: "/destinations" },
    { label: "Group Trips", to: "/group-trips" },
    { label: "Ethos", to: "/ethos" },
    { label: "Ways to Travel", to: "/ways-to-travel" },
    { label: "Contact", to: "/contact" },
  ];

  return (
    <footer className="px-[52px] py-12 bg-dark-ink">
      <div className="max-w-[1100px] mx-auto flex justify-between items-center flex-wrap gap-6">
        <div>
          <Link to="/" className="font-body text-xl font-medium tracking-[0.08em] text-white/70 mb-[5px] block no-underline">
            Lila Trips
          </Link>
          <p className="font-body text-[11px] text-white/25 tracking-[0.1em]">
            Less noise. More magic.
          </p>
        </div>

        <div className="flex gap-8 flex-wrap">
          {links.map(link => (
            <Link key={link.label} to={link.to}
              onClick={() => trackEvent('footer_link_clicked', { label: link.label.toLowerCase(), to: link.to })}
              className="font-body text-[11px] font-semibold tracking-[0.18em] uppercase text-white/[0.28] hover:text-white/70 transition-colors no-underline"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <p className="font-body text-[11px] text-white/[0.16] tracking-[0.06em]">
          © 2026 Lila Trips
        </p>
      </div>
    </footer>
  );
}
