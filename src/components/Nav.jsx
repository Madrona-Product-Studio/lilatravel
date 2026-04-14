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
      <path d="M9.5 7V5a2.5 2.5 0 0 1 5 0v2" />
      <rect x="4" y="7" width="16" height="14" rx="3" />
    </svg>
  );
}

// ─── Trip Dropdown ───────────────────────────────────────────────────────────

function TripDropdown({ trips, onSelect, onDelete, onNewTrip, onClose }) {
  const [confirmId, setConfirmId] = useState(null);
  return (
    <div className="absolute top-[calc(100%+10px)] right-0 w-[280px] max-h-[360px] overflow-y-auto bg-warm-white border border-stone rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.10)] z-[200] font-body">
      {/* Header */}
      <div className="px-4 pt-3.5 pb-2 text-[10px] font-bold tracking-[0.18em] uppercase text-[#8a8278]">
        My Trips
      </div>

      {/* Trip rows */}
      {trips.length === 0 && (
        <div className="px-4 pt-3 pb-4 text-[13px] text-[#8a8278]">
          No trips yet
        </div>
      )}
      {trips.map(trip => (
        <div
          key={trip.id}
          className="flex items-center px-4 py-2.5 cursor-pointer transition-colors border-b border-stone hover:bg-black/[0.03]"
          onClick={() => onSelect(trip)}
        >
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-dark-ink whitespace-nowrap overflow-hidden text-ellipsis">
              {trip.title || trip.destination || 'Your Trip'}
            </div>
            <div className="text-[11px] text-[#8a8278] mt-0.5">
              {timeAgo(trip.generatedAt)}
            </div>
          </div>
          {confirmId === trip.id ? (
            <div className="flex gap-1.5 shrink-0" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => { onDelete(trip.id); setConfirmId(null); }}
                className="bg-none border-none cursor-pointer px-1.5 py-0.5 text-[11px] font-semibold font-body text-[#b55] rounded transition-opacity"
              >
                Remove
              </button>
              <button
                onClick={() => setConfirmId(null)}
                className="bg-none border-none cursor-pointer px-1.5 py-0.5 text-[11px] font-semibold font-body text-[#8a8278] rounded transition-opacity"
              >
                Keep
              </button>
            </div>
          ) : (
            <button
              onClick={e => { e.stopPropagation(); setConfirmId(trip.id); }}
              className="bg-none border-none cursor-pointer px-1.5 py-1 text-base text-[#8a8278] leading-none shrink-0 rounded transition-colors hover:text-dark-ink"
              title="Remove trip"
            >
              ×
            </button>
          )}
        </div>
      ))}

      {/* Footer */}
      <div className="px-4 pt-3 pb-3.5">
        <button
          onClick={onNewTrip}
          className="w-full py-2.5 border border-dark-ink bg-transparent cursor-pointer rounded font-body text-[11px] font-bold tracking-[0.16em] uppercase text-dark-ink transition-all hover:bg-dark-ink hover:text-white"
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
    <div className="w-[22px] h-4 relative">
      {[0, 1, 2].map(i => (
        <span key={i} className="absolute left-0 h-[1.5px] rounded-sm transition-all duration-350 ease-[cubic-bezier(0.4,0,0.2,1)]" style={{
          /* dynamic — position/rotation driven by open state */
          background: color,
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
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className="fixed inset-0 z-[99]" style={{ pointerEvents: open ? "auto" : "none" }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/35 transition-opacity duration-400 ease-out"
        style={{ opacity: open ? 1 : 0 }}
      />

      {/* Slide-in panel */}
      <div
        className="absolute top-0 right-0 bottom-0 w-[min(340px,85vw)] bg-warm-white flex flex-col transition-transform duration-[0.45s] ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          transform: open ? "translateX(0)" : "translateX(100%)",
          boxShadow: open ? "-8px 0 40px rgba(0,0,0,0.12)" : "none",
        }}
      >
        <div className="h-20 shrink-0" />

        <div className="flex-1 flex flex-col justify-center px-12">
          {links.map((link, i) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => { trackEvent('nav_clicked', { label: link.label.toLowerCase(), to: link.to, page: window.location.pathname }); onClose(); }}
              className="font-body text-xl font-medium tracking-[0.08em] text-dark-ink no-underline py-5"
              style={{
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

        <div className="px-12 pt-8 pb-14" style={{
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0)" : "translateY(12px)",
          transition: `opacity 0.4s ease ${0.15 + links.length * 0.06}s, transform 0.4s ease ${0.15 + links.length * 0.06}s`,
        }}>
          <Link to="/plan" onClick={() => { trackEvent('nav_clicked', { label: 'plan_a_trip', to: '/plan', page: window.location.pathname }); onClose(); }}
            className="block font-body text-xs font-bold tracking-[0.2em] uppercase text-white bg-dark-ink text-center py-4 px-6 no-underline transition-opacity duration-[0.25s]"
          >
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

  useEffect(() => {
    const sync = () => setTrips(readTrips());
    window.addEventListener('focus', sync);
    window.addEventListener('lila_trips_changed', sync);
    return () => {
      window.removeEventListener('focus', sync);
      window.removeEventListener('lila_trips_changed', sync);
    };
  }, []);

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

  useEffect(() => {
    setMenuOpen(false);
    setTripsOpen(false);
  }, [location.pathname]);

  const showSolid = scrolled || !transparent;

  const links = [
    { label: "Destinations", to: "/destinations" },
    { label: "Group Trips", to: "/group-trips" },
    { label: "Ethos", to: "/ethos" },
    { label: "Practice", to: "/practice" },
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
    <div data-trips-container className="relative inline-flex">
      <button
        onClick={() => { setTripsOpen(prev => !prev); }}
        className="relative flex items-center bg-none border-none cursor-pointer p-1"
        title="My Trips"
      >
        <SuitcaseIcon color={suitcaseColor} />
        {trips.length > 0 && (
          <span
            className="absolute -top-[5px] -right-[7px] min-w-4 h-4 rounded-full bg-golden-amber flex items-center justify-center text-[9px] font-bold text-white font-body px-1"
            style={{ border: `1.5px solid ${showSolid ? C.warmWhite : 'rgba(0,0,0,0.3)'}` }}
          >
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
      <nav ref={navRef} className="fixed top-0 left-0 right-0 z-[100] transition-all duration-400 ease-out" style={{
        /* dynamic — background depends on scroll + transparent prop + breathConfig */
        background: breathConfig ? C.warmWhite : (showSolid ? "rgba(250,248,244,0.97)" : "transparent"),
        backdropFilter: breathConfig ? "none" : (showSolid ? "blur(16px)" : "none"),
      }}>
        <div className="relative px-6 py-[18px] md:px-[52px] md:py-5 flex items-center justify-between" style={{
          borderBottom: breathConfig && showSolid ? '1px solid rgba(26,37,48,0.08)' : (showSolid ? `1px solid ${C.stone}` : "none"),
        }}>
        <Link to="/" className="font-body text-[22px] font-medium tracking-[0.08em] no-underline transition-colors duration-400" style={{
          /* dynamic — color depends on showSolid */
          color: showSolid ? C.darkInk : "white",
        }}>
          Lila Trips
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex gap-[34px] items-center">
          {links.map(link => (
            <Link key={link.label} to={link.to}
              onClick={() => trackEvent('nav_clicked', { label: link.label.toLowerCase(), to: link.to, page: location.pathname })}
              className="font-body text-xs font-semibold tracking-[0.18em] uppercase no-underline transition-opacity duration-200 py-2.5 px-1.5"
              style={{
                /* dynamic — color/opacity depend on showSolid + active route */
                color: showSolid ? C.darkInk : "rgba(255,255,255,0.75)",
                opacity: location.pathname.startsWith(link.to) ? 1 : 0.75,
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
            className="font-body text-[11px] font-bold tracking-[0.2em] uppercase no-underline py-[9px] px-5 transition-all duration-300"
            style={{
              /* dynamic — color/border depend on showSolid */
              color: showSolid ? C.darkInk : "white",
              border: showSolid ? `1px solid ${C.darkInk}` : "1px solid rgba(255,255,255,0.55)",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = C.darkInk; e.currentTarget.style.color = "white"; e.currentTarget.style.borderColor = C.darkInk; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = showSolid ? C.darkInk : "white"; e.currentTarget.style.borderColor = showSolid ? C.darkInk : "rgba(255,255,255,0.55)"; }}
          >
            Plan a Trip
          </Link>
        </div>

        {/* Mobile: suitcase + hamburger */}
        <div className="flex md:hidden items-center gap-4 z-[101]">
          {trips.length > 0 && renderSuitcase()}
          <div
            onClick={() => { setMenuOpen(!menuOpen); setTripsOpen(false); }}
            className="p-2 cursor-pointer"
          >
            <HamburgerIcon open={menuOpen} color={showSolid ? C.darkInk : "white"} />
          </div>
        </div>
        </div>
      </nav>

      <MobileMenu open={menuOpen} links={links} onClose={() => setMenuOpen(false)} />
    </>
  );
}
