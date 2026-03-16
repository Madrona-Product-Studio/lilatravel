// ═══════════════════════════════════════════════════════════════════════════════
// ITINERARY NAV — fixed header for itinerary results page
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { C, FONTS } from '@data/brand';
import { createShareableUrl } from '@services/shareService';
import { trackEvent } from '@utils/analytics';

// ─── Helpers (shared with Nav.jsx) ──────────────────────────────────────────

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

// ─── Suitcase Icon ──────────────────────────────────────────────────────────

function SuitcaseIcon({ color, size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 7V5a2.5 2.5 0 0 1 5 0v2" />
      <rect x="4" y="7" width="16" height="14" rx="3" />
    </svg>
  );
}

// ─── Trip Dropdown ──────────────────────────────────────────────────────────

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

// ─── ItineraryNav Component ─────────────────────────────────────────────────

export default function ItineraryNav({ itinerary, iteration, itineraryId, rawItinerary, formData, onShare, tripTitle, onTitleChange }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [saveState, setSaveState] = useState('unsaved'); // 'unsaved' | 'saving' | 'saved'
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [trips, setTrips] = useState(readTrips);
  const [tripsOpen, setTripsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Nav title editing
  const [editingNavTitle, setEditingNavTitle] = useState(false);
  const [draftNavTitle, setDraftNavTitle] = useState('');
  const navTitleRef = useRef(null);

  const handleNavTitleClick = () => {
    setDraftNavTitle(tripTitle);
    setEditingNavTitle(true);
    setTimeout(() => navTitleRef.current?.select(), 0);
  };

  const commitNavTitle = () => {
    const trimmed = draftNavTitle.trim();
    if (trimmed && trimmed !== tripTitle) {
      onTitleChange?.(trimmed);
    }
    setEditingNavTitle(false);
  };

  const handleNavTitleKeyDown = (e) => {
    if (e.key === 'Enter') commitNavTitle();
    if (e.key === 'Escape') setEditingNavTitle(false);
  };

  // Pre-set saved state for shared trips
  useEffect(() => {
    if (location.pathname.startsWith('/trip/')) {
      setSaveState('saved');
      setShareUrl(window.location.href);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-generate share URL when itineraryId changes, but only if already saved
  useEffect(() => {
    if (!itineraryId || saveState !== 'saved') return;
    createShareableUrl({ itineraryId, rawItinerary, formData, destination: formData?.destination })
      .then(url => setShareUrl(url));
  }, [itineraryId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset to unsaved when a refinement completes (iteration increments)
  useEffect(() => {
    if (iteration > 0) {
      setSaveState('unsaved');
      setShareUrl('');
    }
  }, [iteration]);

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

  // Click-outside to close dropdown
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

  // Close dropdown on route change
  useEffect(() => {
    setTripsOpen(false);
  }, [location.pathname]);

  // Resize listener
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // ─── Handlers ───────────────────────────────────────────────────────────

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

  const handleSave = async () => {
    if (saveState === 'saving') return;
    setSaveState('saving');
    trackEvent('save_trip_clicked', { source: 'itinerary_nav' });
    try {
      const url = await createShareableUrl({ itineraryId, rawItinerary, formData, destination: formData?.destination });
      setShareUrl(url);
      setSaveState('saved');

      // Update lila_trips in localStorage with the share path
      try {
        const existing = readTrips();
        const shareToken = url.split('/trip/')[1];
        if (shareToken) {
          const sharePath = `/trip/${shareToken}`;
          const alreadyHasPath = existing.some(t => t.path === sharePath);
          if (!alreadyHasPath) {
            const updated = existing.map(t =>
              t.path === '/itinerary' ? { ...t, path: sharePath, title: itinerary?.title || t.title } : t
            );
            localStorage.setItem('lila_trips', JSON.stringify(updated));
            setTrips(updated);
            window.dispatchEvent(new Event('lila_trips_changed'));
          }
        }
      } catch { /* localStorage unavailable */ }
    } catch {
      setSaveState('unsaved');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    trackEvent('copy_link_clicked', { source: 'itinerary_nav' });
    setTimeout(() => setCopied(false), 2000);
  };

  // ─── Save Pill Visual States ────────────────────────────────────────────

  const renderSavePill = () => {
    const F = FONTS.body;
    const divider = (color) => (
      <span style={{ width: 1, height: 14, background: color, opacity: 0.3, flexShrink: 0 }} />
    );

    if (saveState === 'unsaved') {
      return (
        <button
          onClick={handleSave}
          style={{
            display: 'flex', alignItems: 'center', gap: isMobile ? 6 : 10,
            padding: isMobile ? '6px 12px' : '6px 14px',
            background: 'rgba(212,168,83,0.08)',
            border: '1px solid rgba(212,168,83,0.25)',
            borderRadius: 20, cursor: 'pointer',
            fontFamily: F, fontSize: 12, fontWeight: 600,
            color: '#9a7d3a',
            transition: 'all 0.2s',
          }}
        >
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: C.goldenAmber, flexShrink: 0,
          }} />
          {!isMobile && <span>{iteration > 1 ? 'New draft' : 'Unsaved'}</span>}
          {!isMobile && divider('#9a7d3a')}
          <span>{isMobile ? 'Save' : (iteration > 1 ? 'Save' : 'Save trip')}</span>
        </button>
      );
    }

    if (saveState === 'saving') {
      return (
        <div style={{
          display: 'flex', alignItems: 'center', gap: isMobile ? 6 : 10,
          padding: isMobile ? '6px 12px' : '6px 14px',
          background: 'rgba(0,0,0,0.03)',
          border: `1px solid ${C.stone}`,
          borderRadius: 20,
          fontFamily: F, fontSize: 12, fontWeight: 600,
          color: '#8a8278',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#8a8278', flexShrink: 0,
            animation: 'itnav-pulse 1.2s ease-in-out infinite',
          }} />
          <span>{isMobile ? 'Saving' : 'Saving...'}</span>
        </div>
      );
    }

    // saved
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: isMobile ? 6 : 10,
        padding: isMobile ? '6px 12px' : '6px 14px',
        background: 'rgba(245,241,234,0.8)',
        border: `1px solid ${C.stone}`,
        borderRadius: 20,
        fontFamily: F, fontSize: 12, fontWeight: 600,
        color: '#8a8278',
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: C.seaGlass, flexShrink: 0,
        }} />
        {!isMobile && <span>Saved</span>}
        {!isMobile && divider('#8a8278')}
        <button
          onClick={handleCopy}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: F, fontSize: 12, fontWeight: 600,
            color: '#8a8278', padding: 0,
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = C.darkInk}
          onMouseLeave={e => e.currentTarget.style.color = '#8a8278'}
        >
          {copied ? 'Copied!' : (isMobile ? 'Copy' : 'Copy link')}
        </button>
      </div>
    );
  };

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 56, zIndex: 100,
        background: 'rgba(250,248,244,0.97)',
        borderBottom: '1px solid rgba(26,37,48,0.1)',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: isMobile ? '0 18px' : '0 24px',
      }}>
        {/* Left — Logo */}
        <Link to="/" style={{
          fontFamily: FONTS.body, fontSize: 22, fontWeight: 500,
          letterSpacing: '0.08em', color: C.darkInk, textDecoration: 'none',
        }}>
          Lila Trips
        </Link>

        {/* Center — Trip identity (desktop only) */}
        {!isMobile && (tripTitle || itinerary?.title) && (
          <div style={{
            position: 'absolute', left: '50%', transform: 'translateX(-50%)',
            display: 'flex', alignItems: 'center', gap: 10,
            maxWidth: '40%',
          }}>
            {editingNavTitle ? (
              <input
                ref={navTitleRef}
                value={draftNavTitle}
                onChange={e => setDraftNavTitle(e.target.value)}
                onBlur={commitNavTitle}
                onKeyDown={handleNavTitleKeyDown}
                style={{
                  fontFamily: FONTS.body, fontSize: 13, fontWeight: 600,
                  color: C.darkInk, background: 'transparent',
                  border: 'none', borderBottom: `1px solid ${C.goldenAmber}`,
                  borderRadius: 0, outline: 'none', padding: 0,
                  letterSpacing: '0.01em', textAlign: 'center',
                  minWidth: 120,
                }}
              />
            ) : (
              <span
                onClick={handleNavTitleClick}
                style={{
                  fontFamily: FONTS.body, fontSize: 14, fontWeight: 600,
                  color: C.darkInk, whiteSpace: 'nowrap', overflow: 'hidden',
                  textOverflow: 'ellipsis', cursor: 'text',
                  borderBottom: '1px dashed transparent',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderBottomColor = 'rgba(26,37,48,0.2)'}
                onMouseLeave={e => e.currentTarget.style.borderBottomColor = 'transparent'}
              >
                {tripTitle || itinerary.title}
              </span>
            )}
            {iteration > 0 && (
              <span style={{
                fontFamily: FONTS.body, fontSize: 10, fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: '#8a8278', background: 'rgba(0,0,0,0.04)',
                padding: '3px 8px', borderRadius: 4, whiteSpace: 'nowrap',
              }}>
                Draft {iteration}
              </span>
            )}
          </div>
        )}

        {/* Right — Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {renderSavePill()}

          {/* Share */}
          <button
            onClick={() => { trackEvent('share_clicked', { source: 'itinerary_nav' }); onShare?.(); }}
            style={{
              display: 'flex', alignItems: 'center',
              background: 'none', border: 'none', cursor: 'pointer', padding: 4,
            }}
            title="Share trip"
          >
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#8a8278" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4z" />
            </svg>
          </button>

          {/* Suitcase */}
          <div data-trips-container style={{ position: 'relative', display: 'inline-flex' }}>
            <button
              onClick={() => setTripsOpen(prev => !prev)}
              style={{
                position: 'relative', display: 'flex', alignItems: 'center',
                background: 'none', border: 'none', cursor: 'pointer', padding: 4,
              }}
              title="My Trips"
            >
              <SuitcaseIcon color={C.goldenAmber} />
              {trips.length > 0 && (
                <span style={{
                  position: 'absolute', top: -5, right: -7,
                  minWidth: 16, height: 16, borderRadius: 8,
                  background: C.goldenAmber,
                  border: `1.5px solid ${C.warmWhite}`,
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
        </div>
      </nav>

      {/* Pulse animation for saving dot */}
      <style>{`
        @keyframes itnav-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </>
  );
}
