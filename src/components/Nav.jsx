// ═══════════════════════════════════════════════════════════════════════════════
// NAV — shared navigation across all pages
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { C } from '@data/brand';
import { trackEvent } from '@utils/analytics';

// ─── Animated Hamburger Icon ─────────────────────────────────────────────────
function HamburgerIcon({ open, color }) {
  return (
    <div style={{ width: 22, height: 16, position: "relative" }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          position: "absolute", left: 0, height: 1.5,
          background: color, borderRadius: 1,
          transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          ...(i === 0 ? {
            top: open ? 7 : 0, width: 22,
            transform: open ? "rotate(45deg)" : "none",
          } : i === 1 ? {
            top: 7, width: 16,
            opacity: open ? 0 : 1,
            transform: open ? "translateX(8px)" : "none",
          } : {
            top: open ? 7 : 14, width: 19,
            transform: open ? "rotate(-45deg)" : "none",
          }),
        }} />
      ))}
    </div>
  );
}

// ─── Mobile Menu Overlay ─────────────────────────────────────────────────────
function MobileMenu({ open, links, onClose }) {
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 99, pointerEvents: open ? "auto" : "none",
    }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "absolute", inset: 0,
          background: "rgba(0,0,0,0.35)",
          opacity: open ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      />

      {/* Slide-in panel */}
      <div style={{
        position: "absolute",
        top: 0, right: 0, bottom: 0,
        width: "min(340px, 85vw)",
        background: C.warmWhite,
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
        display: "flex", flexDirection: "column",
        boxShadow: open ? "-8px 0 40px rgba(0,0,0,0.12)" : "none",
      }}>
        {/* Top padding (aligns with nav bar height) */}
        <div style={{ height: 80, flexShrink: 0 }} />

        {/* Nav links */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          justifyContent: "center", padding: "0 48px",
        }}>
          {links.map((link, i) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => { trackEvent('nav_clicked', { label: link.label.toLowerCase(), to: link.to, page: window.location.pathname }); onClose(); }}
              style={{
                fontFamily: "'Quicksand', sans-serif",
                fontSize: 20, fontWeight: 500,
                letterSpacing: "0.08em",
                color: C.darkInk,
                textDecoration: "none",
                padding: "20px 0",
                borderBottom: i < links.length - 1 ? `1px solid ${C.stone}` : "none",
                opacity: open ? 1 : 0,
                transform: open ? "translateX(0)" : "translateX(24px)",
                transition: `opacity 0.4s ease ${0.15 + i * 0.06}s, transform 0.4s ease ${0.15 + i * 0.06}s`,
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA button at bottom */}
        <div style={{
          padding: "32px 48px 56px",
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0)" : "translateY(12px)",
          transition: `opacity 0.4s ease ${0.15 + links.length * 0.06}s, transform 0.4s ease ${0.15 + links.length * 0.06}s`,
        }}>
          <Link to="/plan" onClick={() => { trackEvent('nav_clicked', { label: 'plan_a_trip', to: '/plan', page: window.location.pathname }); onClose(); }} style={{
            display: "block",
            fontFamily: "'Quicksand', sans-serif",
            fontSize: 12, fontWeight: 700,
            letterSpacing: "0.2em", textTransform: "uppercase",
            color: "white", background: C.darkInk,
            textAlign: "center", padding: "16px 24px",
            textDecoration: "none", transition: "opacity 0.25s",
          }}>
            Plan a Trip
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Nav Component ───────────────────────────────────────────────────────────
export default function Nav({ transparent = false }) {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Active trip state (for backpack icon)
  const [activeTrip, setActiveTrip] = useState(() => {
    try {
      const stored = localStorage.getItem('lila_active_trip');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  // Re-check on focus (handles returning from another tab)
  useEffect(() => {
    const onFocus = () => {
      try {
        const stored = localStorage.getItem('lila_active_trip');
        setActiveTrip(stored ? JSON.parse(stored) : null);
      } catch { setActiveTrip(null); }
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h, { passive: true });
    h();
    return () => window.removeEventListener("scroll", h);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const showSolid = scrolled || !transparent;

  const links = [
    { label: "Destinations", to: "/destinations" },
    { label: "Group Trips", to: "/group-trips" },
    { label: "Ethos", to: "/ethos" },
    { label: "Ways to Travel", to: "/ways-to-travel" },
  ];

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "20px 52px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: showSolid ? "rgba(250,248,244,0.97)" : "transparent",
        backdropFilter: showSolid ? "blur(16px)" : "none",
        borderBottom: showSolid ? `1px solid ${C.stone}` : "none",
        transition: "all 0.4s ease",
      }}>
        <Link to="/" style={{
          fontFamily: "'Quicksand', sans-serif",
          fontSize: 22, fontWeight: 500, letterSpacing: "0.08em",
          color: showSolid ? C.darkInk : "white",
          transition: "color 0.4s", textDecoration: "none",
        }}>
          Lila Trips
        </Link>

        {/* Desktop links */}
        <div className="nav-links" style={{ display: "flex", gap: 34, alignItems: "center" }}>
          {links.map(link => (
            <Link key={link.label} to={link.to}
              onClick={() => trackEvent('nav_clicked', { label: link.label.toLowerCase(), to: link.to, page: location.pathname })}
              style={{
                fontFamily: "'Quicksand'", fontSize: 12, fontWeight: 600,
                letterSpacing: "0.18em", textTransform: "uppercase",
                color: showSolid ? C.darkInk : "rgba(255,255,255,0.75)",
                transition: "opacity 0.2s", textDecoration: "none",
                opacity: location.pathname.startsWith(link.to) ? 1 : 0.75,
                padding: "10px 6px",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.55"}
              onMouseLeave={e => e.currentTarget.style.opacity = location.pathname.startsWith(link.to) ? "1" : "0.75"}
            >
              {link.label}
            </Link>
          ))}

          {activeTrip && (
            <Link
              to={activeTrip.path || '/itinerary'}
              onClick={() => trackEvent('nav_clicked', { label: 'backpack', page: location.pathname })}
              style={{ position: 'relative', display: 'flex', alignItems: 'center', color: C.goldenAmber, textDecoration: 'none' }}
              title={`Back to ${activeTrip.destination}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 2h6a1 1 0 0 1 1 1v2H8V3a1 1 0 0 1 1-1z"/>
                <path d="M4 7h16a1 1 0 0 1 1 1v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a1 1 0 0 1 1-1z"/>
                <path d="M9 11h6"/>
                <path d="M12 11v5"/>
              </svg>
              <span style={{
                position: 'absolute', top: -3, right: -3,
                width: 7, height: 7, borderRadius: '50%',
                background: C.goldenAmber,
                border: `1.5px solid ${showSolid ? C.cream : 'rgba(0,0,0,0.3)'}`,
              }} />
            </Link>
          )}

          <Link to="/plan"
            onClick={() => trackEvent('nav_clicked', { label: 'plan_a_trip', to: '/plan', page: location.pathname })}
            style={{
              fontFamily: "'Quicksand'", fontSize: 11, fontWeight: 700,
              letterSpacing: "0.2em", textTransform: "uppercase",
              color: showSolid ? C.darkInk : "white",
              padding: "9px 20px", textDecoration: "none",
              border: showSolid ? `1px solid ${C.darkInk}` : "1px solid rgba(255,255,255,0.55)",
              transition: "all 0.3s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = C.darkInk; e.currentTarget.style.color = "white"; e.currentTarget.style.borderColor = C.darkInk; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = showSolid ? C.darkInk : "white"; e.currentTarget.style.borderColor = showSolid ? C.darkInk : "rgba(255,255,255,0.55)"; }}
          >
            Plan a Trip
          </Link>
        </div>

        {/* Mobile: backpack + hamburger */}
        <div
          className="nav-mobile-toggle"
          style={{ display: "none", alignItems: "center", gap: 16, zIndex: 101 }}
        >
          {activeTrip && (
            <Link
              to={activeTrip.path || '/itinerary'}
              onClick={() => trackEvent('nav_clicked', { label: 'backpack', page: location.pathname })}
              style={{ position: 'relative', display: 'flex', alignItems: 'center', color: C.goldenAmber, textDecoration: 'none' }}
              title={`Back to ${activeTrip.destination}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 2h6a1 1 0 0 1 1 1v2H8V3a1 1 0 0 1 1-1z"/>
                <path d="M4 7h16a1 1 0 0 1 1 1v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a1 1 0 0 1 1-1z"/>
                <path d="M9 11h6"/>
                <path d="M12 11v5"/>
              </svg>
              <span style={{
                position: 'absolute', top: -3, right: -3,
                width: 7, height: 7, borderRadius: '50%',
                background: C.goldenAmber,
                border: `1.5px solid ${showSolid ? C.cream : 'rgba(0,0,0,0.3)'}`,
              }} />
            </Link>
          )}
          <div
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ padding: 8, cursor: "pointer" }}
          >
            <HamburgerIcon open={menuOpen} color={showSolid ? C.darkInk : "white"} />
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <MobileMenu open={menuOpen} links={links} onClose={() => setMenuOpen(false)} />

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 900px) {
          nav { padding: 18px 24px !important; }
          .nav-links { display: none !important; }
          .nav-mobile-toggle { display: flex !important; }
        }
      `}</style>
    </>
  );
}
