// ═══════════════════════════════════════════════════════════════════════════════
// FOOTER — shared across all pages
// ═══════════════════════════════════════════════════════════════════════════════

import { Link } from 'react-router-dom';
import { C } from '@data/brand';
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
    <footer style={{ padding: "48px 52px", background: C.darkInk }}>
      <div style={{
        maxWidth: 1100, margin: "0 auto",
        display: "flex", justifyContent: "space-between",
        alignItems: "center", flexWrap: "wrap", gap: 24,
      }}>
        <div>
          <Link to="/" style={{
            fontFamily: "'Quicksand', sans-serif",
            fontSize: 20, fontWeight: 500, letterSpacing: "0.08em",
            color: "rgba(255,255,255,0.7)", marginBottom: 5, display: "block",
            textDecoration: "none",
          }}>
            Lila Trips
          </Link>
          <p style={{
            fontFamily: "'Quicksand'", fontSize: 10,
            color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em",
          }}>
            Less noise. More magic.
          </p>
        </div>

        <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
          {links.map(link => (
            <Link key={link.label} to={link.to}
              onClick={() => trackEvent('footer_link_clicked', { label: link.label.toLowerCase(), to: link.to })}
              style={{
              fontFamily: "'Quicksand'", fontSize: 10, fontWeight: 600,
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.28)", transition: "color 0.25s",
              textDecoration: "none",
            }}
            onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.7)"}
            onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.28)"}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <p style={{
          fontFamily: "'Quicksand'", fontSize: 10,
          color: "rgba(255,255,255,0.16)", letterSpacing: "0.06em",
        }}>
          © 2026 Lila Trips
        </p>
      </div>
    </footer>
  );
}
