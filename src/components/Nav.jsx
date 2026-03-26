// ═══════════════════════════════════════════════════════════════════════════════
// NAV — shared navigation across all pages
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { C } from '@data/brand';
import { trackEvent } from '@utils/analytics';
import useBreathCanvas from '@hooks/useBreathCanvas';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function readTrips() {
  try {
    const raw = localStorage.getItem('lila_trips');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

// ─── Suitcase Icon ───────────────────────────────────────────────────────────

function SuitcaseIcon({ color, size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Slim curved handle */}
      <path d="M9.5 7V5a2.5 2.5 0 0 1 5 0v2" />
      {/* Rounded body */}
      <rect x="4" y="7" width="16" height="14" rx="3" />
    </svg>
  );
}

// ─── Trip Dropdown ───────────────────────────────────────────────────────────

function TripDropdown({ trips, onSelect, onDelete, onNewTrip, onClose }) {
  const [confirmId, setConfirmId] = useState(null);
  return (
    <div style={{
      position: 'absolute', top: 'calc(100% + 10px)', right: 0,
      width: 280, maxHeight: 360, overflowY: 'auto',
      background: C.warmWhite, border: `1px solid ${C.stone}`,
      borderRadius: 8, boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
      zIndex: 200, fontFamily: "'Quicksand', sans-serif",
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px 8px', fontSize: 10, fontWeight: 700,
        letterSpacing: '0.18em', textTransform: 'uppercase',
        color: '#8a8278',
      }}>
        My Trips
      </div>

      {/* Trip rows */}
      {trips.length === 0 && (
        <div style={{ padding: '12px 16px 16px', fontSize: 13, color: '#8a8278' }}>
          No trips yet
        </div>
      )}
      {trips.map(trip => (
        <div
          key={trip.id}
          style={{
            display: 'flex', alignItems: 'center', padding: '10px 16px',
            cursor: 'pointer', transition: 'background 0.15s',
            borderBottom: `1px solid ${C.stone}`,
          }}
          onClick={() => onSelect(trip)}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.03)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 14, fontWeight: 600, color: C.darkInk,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {trip.title || trip.destination || 'Your Trip'}
            </div>
            <div style={{ fontSize: 11, color: '#8a8278', marginTop: 2 }}>
              {timeAgo(trip.generatedAt)}
            </div>
          </div>
          {confirmId === trip.id ? (
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
              <button
                onClick={() => { onDelete(trip.id); setConfirmId(null); }}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '2px 6px', fontSize: 11, fontWeight: 600,
                  fontFamily: "'Quicksand', sans-serif",
                  color: '#b55', borderRadius: 4, transition: 'opacity 0.15s',
                }}
              >
                Remove
              </button>
              <button
                onClick={() => setConfirmId(null)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '2px 6px', fontSize: 11, fontWeight: 600,
                  fontFamily: "'Quicksand', sans-serif",
                  color: '#8a8278', borderRadius: 4, transition: 'opacity 0.15s',
                }}
              >
                Keep
              </button>
            </div>
          ) : (
            <button
              onClick={e => { e.stopPropagation(); setConfirmId(trip.id); }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '4px 6px', fontSize: 16, color: '#8a8278',
                lineHeight: 1, flexShrink: 0, borderRadius: 4,
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = C.darkInk}
              onMouseLeave={e => e.currentTarget.style.color = '#8a8278'}
              title="Remove trip"
            >
              ×
            </button>
          )}
        </div>
      ))}

      {/* Footer */}
      <div style={{ padding: '12px 16px 14px' }}>
        <button
          onClick={onNewTrip}
          style={{
            width: '100%', padding: '10px 0', border: `1px solid ${C.darkInk}`,
            background: 'transparent', cursor: 'pointer', borderRadius: 4,
            fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700,
            letterSpacing: '0.16em', textTransform: 'uppercase', color: C.darkInk,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = C.darkInk; e.currentTarget.style.color = 'white'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.darkInk; }}
        >
          Plan a New Trip
        </button>
      </div>
    </div>
  );
}

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
export default function Nav({ transparent = false, breathConfig = null }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navRef = useRef(null);
  useBreathCanvas(breathConfig, navRef, { opacityScale: 0.85, flat: true });

  // Multi-trip state
  const [trips, setTrips] = useState(() => {
    // Migrate legacy single-trip format
    try {
      const legacy = localStorage.getItem('lila_active_trip');
      if (legacy) {
        const old = JSON.parse(legacy);
        const migrated = [{ id: crypto.randomUUID(), path: old.path || '/itinerary', destination: old.destination || 'Your Trip', title: null, generatedAt: old.generatedAt || Date.now() }];
        localStorage.setItem('lila_trips', JSON.stringify(migrated));
        localStorage.removeItem('lila_active_trip');
        return migrated;
      }
    } catch {}
    return readTrips();
  });

  const [tripsOpen, setTripsOpen] = useState(false);

  // Sync trips from localStorage on focus and custom event
  useEffect(() => {
    const sync = () => setTrips(readTrips());
    window.addEventListener('focus', sync);
    window.addEventListener('lila_trips_changed', sync);
    return () => {
      window.removeEventListener('focus', sync);
      window.removeEventListener('lila_trips_changed', sync);
    };
  }, []);

  // Click-outside to close dropdown (uses data attribute to find container)
  useEffect(() => {
    if (!tripsOpen) return;
    const handler = (e) => {
      if (!e.target.closest('[data-trips-container]')) {
        setTripsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [tripsOpen]);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h, { passive: true });
    h();
    return () => window.removeEventListener("scroll", h);
  }, []);

  // Close menu + dropdown on route change
  useEffect(() => {
    setMenuOpen(false);
    setTripsOpen(false);
  }, [location.pathname]);

  const showSolid = scrolled || !transparent;

  const links = [
    { label: "Destinations", to: "/destinations" },
    { label: "Group Trips", to: "/group-trips" },
    { label: "Ethos", to: "/ethos" },
    { label: "Ways to Travel", to: "/ways-to-travel" },
  ];

  const handleSelectTrip = (trip) => {
    trackEvent('nav_clicked', { label: 'trip_dropdown_select', destination: trip.destination, page: location.pathname });
    navigate(trip.path);
    setTripsOpen(false);
  };

  const handleDeleteTrip = (id) => {
    const updated = trips.filter(t => t.id !== id);
    localStorage.setItem('lila_trips', JSON.stringify(updated));
    setTrips(updated);
    window.dispatchEvent(new Event('lila_trips_changed'));
    trackEvent('trip_deleted', { page: location.pathname });
  };

  const handleNewTrip = () => {
    trackEvent('nav_clicked', { label: 'plan_new_trip', page: location.pathname });
    navigate('/plan');
    setTripsOpen(false);
  };

  const suitcaseColor = C.goldenAmber;

  const renderSuitcase = () => (
    <div data-trips-container style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        onClick={() => { setTripsOpen(prev => !prev); }}
        style={{
          position: 'relative', display: 'flex', alignItems: 'center',
          background: 'none', border: 'none', cursor: 'pointer', padding: 4,
        }}
        title="My Trips"
      >
        <SuitcaseIcon color={suitcaseColor} />
        {trips.length > 0 && (
          <span style={{
            position: 'absolute', top: -5, right: -7,
            minWidth: 16, height: 16, borderRadius: 8,
            background: C.goldenAmber,
            border: `1.5px solid ${showSolid ? C.warmWhite : 'rgba(0,0,0,0.3)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 9, fontWeight: 700, color: 'white',
            fontFamily: "'Quicksand', sans-serif",
            padding: '0 4px',
          }}>
            {trips.length}
          </span>
        )}
      </button>
      {tripsOpen && (
        <TripDropdown
          trips={trips}
          onSelect={handleSelectTrip}
          onDelete={handleDeleteTrip}
          onNewTrip={handleNewTrip}
          onClose={() => setTripsOpen(false)}
        />
      )}
    </div>
  );

  return (
    <>
      <nav ref={navRef} style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: breathConfig ? C.warmWhite : (showSolid ? "rgba(250,248,244,0.97)" : "transparent"),
        backdropFilter: breathConfig ? "none" : (showSolid ? "blur(16px)" : "none"),
        borderBottom: "none",
        transition: "all 0.4s ease",
      }}>
        <div className="nav-inner" style={{
          position: 'relative',
          padding: "20px 52px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: breathConfig && showSolid ? '1px solid rgba(26,37,48,0.08)' : (showSolid ? `1px solid ${C.stone}` : "none"),
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

          {trips.length > 0 && renderSuitcase()}

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

        {/* Mobile: suitcase + hamburger */}
        <div
          className="nav-mobile-toggle"
          style={{ display: "none", alignItems: "center", gap: 16, zIndex: 101 }}
        >
          {trips.length > 0 && renderSuitcase()}
          <div
            onClick={() => { setMenuOpen(!menuOpen); setTripsOpen(false); }}
            style={{ padding: 8, cursor: "pointer" }}
          >
            <HamburgerIcon open={menuOpen} color={showSolid ? C.darkInk : "white"} />
          </div>
        </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <MobileMenu open={menuOpen} links={links} onClose={() => setMenuOpen(false)} />

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 900px) {
          .nav-inner { padding: 18px 24px !important; }
          .nav-links { display: none !important; }
          .nav-mobile-toggle { display: flex !important; }
        }
      `}</style>
    </>
  );
}
