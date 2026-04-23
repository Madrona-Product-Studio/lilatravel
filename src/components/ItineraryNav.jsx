// ═══════════════════════════════════════════════════════════════════════════════
// ITINERARY NAV — fixed header for itinerary results page
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { C } from '@data/brand';
import { createShareableUrl } from '@services/shareService';
import { trackEvent } from '@utils/analytics';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@services/supabaseClient';

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

// ─── Person Icon ────────────────────────────────────────────────────────────

function PersonIcon({ color, size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

// ─── User Avatar ────────────────────────────────────────────────────────────

function UserAvatar({ user, size = 26 }) {
  const avatar = user.user_metadata?.avatar_url;
  const initial = user.user_metadata?.full_name?.[0] || user.email?.[0]?.toUpperCase() || '?';
  if (avatar) {
    return <img src={avatar} alt="" style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }} referrerPolicy="no-referrer" />;
  }
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: C.oceanTeal, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.45, fontWeight: 600, fontFamily: "'Quicksand', sans-serif" }}>
      {initial}
    </div>
  );
}

// ─── Account Dropdown (logged in) ───────────────────────────────────────────

function AccountDropdown({ user, trips, onSelect, onDelete, onNewTrip, onSignOut, onClose }) {
  const [confirmId, setConfirmId] = useState(null);
  return (
    <div className="absolute top-[calc(100%+10px)] right-0 w-[280px] max-h-[420px] overflow-y-auto bg-warm-white border border-stone rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.10)] z-[200] font-body">
      <div className="px-4 pt-3.5 pb-2 border-b border-stone">
        <div className="text-sm font-semibold text-dark-ink whitespace-nowrap overflow-hidden text-ellipsis">{user.user_metadata?.full_name || 'My Account'}</div>
        <div className="text-[11px] text-[#8a8278] mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">{user.email}</div>
      </div>
      <div className="px-4 pt-3 pb-1.5 text-[10px] font-bold tracking-[0.18em] uppercase text-[#8a8278]">My Trips</div>
      {trips.length === 0 && <div className="px-4 pt-1 pb-3 text-[13px] text-[#8a8278]">No trips yet</div>}
      {trips.map(trip => (
        <div key={trip.id} className="flex items-center px-4 py-2.5 cursor-pointer transition-colors border-b border-stone hover:bg-black/[0.03]" onClick={() => onSelect(trip)}>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-dark-ink whitespace-nowrap overflow-hidden text-ellipsis">{trip.title || trip.destination || 'Your Trip'}</div>
            <div className="text-[11px] text-[#8a8278] mt-0.5">{timeAgo(trip.generatedAt)}</div>
          </div>
          {confirmId === trip.id ? (
            <div className="flex gap-1.5 shrink-0" onClick={e => e.stopPropagation()}>
              <button onClick={() => { onDelete(trip.id); setConfirmId(null); }} className="bg-none border-none cursor-pointer px-1.5 py-0.5 text-[11px] font-semibold font-body text-[#b55] rounded transition-opacity">Remove</button>
              <button onClick={() => setConfirmId(null)} className="bg-none border-none cursor-pointer px-1.5 py-0.5 text-[11px] font-semibold font-body text-[#8a8278] rounded transition-opacity">Keep</button>
            </div>
          ) : (
            <button onClick={e => { e.stopPropagation(); setConfirmId(trip.id); }} className="bg-none border-none cursor-pointer px-1.5 py-1 text-base text-[#8a8278] leading-none shrink-0 rounded transition-colors hover:text-dark-ink" title="Remove trip">×</button>
          )}
        </div>
      ))}
      <div className="px-4 pt-3 pb-3.5 flex flex-col gap-2">
        <button onClick={onNewTrip} className="w-full py-2.5 border border-dark-ink bg-transparent cursor-pointer rounded font-body text-[11px] font-bold tracking-[0.16em] uppercase text-dark-ink transition-all hover:bg-dark-ink hover:text-white">Plan a New Trip</button>
        <button onClick={() => { onSignOut(); onClose(); }} className="w-full py-2 border border-stone bg-transparent cursor-pointer rounded font-body text-[11px] font-bold tracking-[0.16em] uppercase text-[#8a8278] transition-all hover:border-dark-ink hover:text-dark-ink">Sign Out</button>
      </div>
    </div>
  );
}

// ─── Trip Dropdown (logged out) ─────────────────────────────────────────────

function TripDropdown({ trips, onSelect, onDelete, onNewTrip, onSignIn, onClose }) {
  const [confirmId, setConfirmId] = useState(null);
  return (
    <div className="absolute top-[calc(100%+10px)] right-0 w-[280px] max-h-[360px] overflow-y-auto bg-warm-white border border-stone rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.10)] z-[200] font-body">
      <div className="px-4 pt-3.5 pb-2 text-[10px] font-bold tracking-[0.18em] uppercase text-[#8a8278]">
        My Trips
      </div>

      {trips.length === 0 && (
        <div className="px-4 pt-3 pb-4 text-[13px] text-[#8a8278]">No trips yet</div>
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
            <div className="text-[11px] text-[#8a8278] mt-0.5">{timeAgo(trip.generatedAt)}</div>
          </div>
          {confirmId === trip.id ? (
            <div className="flex gap-1.5 shrink-0" onClick={e => e.stopPropagation()}>
              <button onClick={() => { onDelete(trip.id); setConfirmId(null); }} className="bg-none border-none cursor-pointer px-1.5 py-0.5 text-[11px] font-semibold font-body text-[#b55] rounded transition-opacity">Remove</button>
              <button onClick={() => setConfirmId(null)} className="bg-none border-none cursor-pointer px-1.5 py-0.5 text-[11px] font-semibold font-body text-[#8a8278] rounded transition-opacity">Keep</button>
            </div>
          ) : (
            <button
              onClick={e => { e.stopPropagation(); setConfirmId(trip.id); }}
              className="bg-none border-none cursor-pointer px-1.5 py-1 text-base text-[#8a8278] leading-none shrink-0 rounded transition-colors hover:text-dark-ink"
              title="Remove trip"
            >×</button>
          )}
        </div>
      ))}

      <div className="px-4 pt-3 pb-3.5 flex flex-col gap-2">
        <button onClick={onNewTrip} className="w-full py-2.5 border border-dark-ink bg-transparent cursor-pointer rounded font-body text-[11px] font-bold tracking-[0.16em] uppercase text-dark-ink transition-all hover:bg-dark-ink hover:text-white">
          Plan a New Trip
        </button>
        {onSignIn && (
          <button onClick={onSignIn} className="w-full py-2 border border-stone bg-transparent cursor-pointer rounded font-body text-[11px] font-bold tracking-[0.16em] uppercase text-[#8a8278] transition-all hover:border-dark-ink hover:text-dark-ink">
            Sign In to Save Trips
          </button>
        )}
      </div>
    </div>
  );
}

// ─── ItineraryNav Component ─────────────────────────────────────────────────

export default function ItineraryNav({ itinerary, iteration, itineraryId, rawItinerary, formData, onShare, onIterations, iterationCount = 0, tripTitle, onTitleChange, feedbackCount = 0, onRefine, isRefining }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signIn, signOut } = useAuth();

  const [saveState, setSaveState] = useState('unsaved');
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [trips, setTrips] = useState(readTrips);
  const [tripsOpen, setTripsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

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

  useEffect(() => {
    if (location.pathname.startsWith('/trip/')) {
      setSaveState('saved');
      setShareUrl(window.location.href);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!itineraryId || saveState !== 'saved') return;
    createShareableUrl({ itineraryId, rawItinerary, formData, destination: formData?.destination })
      .then(url => { if (url) setShareUrl(url); });
  }, [itineraryId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (iteration > 0) {
      setSaveState('unsaved');
      setShareUrl('');
    }
  }, [iteration]);

  // Fetch trips from DB when logged in
  const fetchUserTrips = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('itineraries')
        .select('id, destination, title, share_token, created_at')
        .eq('user_id', user.id)
        .not('share_token', 'is', null)
        .order('created_at', { ascending: false })
        .limit(10);
      if (error || !data) return;
      const dbTrips = data.map(row => ({
        id: row.id,
        path: `/trip/${row.share_token}`,
        destination: row.destination || 'Your Trip',
        title: row.title || null,
        generatedAt: new Date(row.created_at).getTime(),
      }));
      if (dbTrips.length > 0) {
        setTrips(dbTrips);
        localStorage.setItem('lila_trips', JSON.stringify(dbTrips));
        window.dispatchEvent(new Event('lila_trips_changed'));
      }
    } catch (e) { console.error('fetchUserTrips:', e); }
  }, [user]);

  useEffect(() => { if (user) fetchUserTrips(); }, [user, fetchUserTrips]);

  useEffect(() => {
    const sync = () => { if (!user) setTrips(readTrips()); };
    window.addEventListener('focus', sync);
    window.addEventListener('lila_trips_changed', sync);
    return () => {
      window.removeEventListener('focus', sync);
      window.removeEventListener('lila_trips_changed', sync);
    };
  }, [user]);

  useEffect(() => {
    if (!tripsOpen && !userMenuOpen) return;
    const handler = (e) => {
      if (tripsOpen && !e.target.closest('[data-trips-container]')) setTripsOpen(false);
      if (userMenuOpen && !e.target.closest('[data-user-menu]')) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [tripsOpen, userMenuOpen]);

  useEffect(() => { setTripsOpen(false); setUserMenuOpen(false); }, [location.pathname]);

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
      if (!url) {
        console.error('Save failed — could not generate share URL');
        setSaveState('unsaved');
        return;
      }
      setShareUrl(url);
      setSaveState('saved');

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

  const divider = (color) => (
    <span className="hidden md:inline-block w-px h-3.5 shrink-0" style={{ background: color, opacity: 0.3 }} />
  );

  const renderSavePill = () => {
    if (saveState === 'unsaved') {
      return (
        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 md:gap-2.5 px-3 md:px-3.5 py-1.5 bg-[rgba(212,168,83,0.08)] border border-[rgba(212,168,83,0.25)] rounded-full cursor-pointer font-body text-xs font-semibold text-[#9a7d3a] transition-all"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-golden-amber shrink-0" />
          <span className="hidden md:inline">{iteration > 1 ? 'New draft' : 'Unsaved'}</span>
          {divider('#9a7d3a')}
          <span className="md:hidden">Save</span>
          <span className="hidden md:inline">{iteration > 1 ? 'Save' : 'Save trip'}</span>
        </button>
      );
    }

    if (saveState === 'saving') {
      return (
        <div className="flex items-center gap-1.5 md:gap-2.5 px-3 md:px-3.5 py-1.5 bg-black/[0.03] border border-stone rounded-full font-body text-xs font-semibold text-[#8a8278]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8a8278] shrink-0 animate-itnav-pulse" />
          <span className="md:hidden">Saving</span>
          <span className="hidden md:inline">Saving...</span>
        </div>
      );
    }

    // saved
    return (
      <div className="flex items-center gap-1.5 md:gap-2.5 px-3 md:px-3.5 py-1.5 bg-cream/80 border border-stone rounded-full font-body text-xs font-semibold text-[#8a8278]">
        <span className="w-1.5 h-1.5 rounded-full bg-sea-glass shrink-0" />
        <span className="hidden md:inline">Saved</span>
        {divider('#8a8278')}
        <button
          onClick={handleCopy}
          className="bg-none border-none cursor-pointer font-body text-xs font-semibold text-[#8a8278] p-0 transition-colors hover:text-dark-ink"
        >
          <span className="md:hidden">{copied ? 'Copied!' : 'Copy'}</span>
          <span className="hidden md:inline">{copied ? 'Copied!' : 'Copy link'}</span>
        </button>
      </div>
    );
  };

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <nav className="fixed top-0 left-0 right-0 h-14 z-[100] bg-[rgba(250,248,244,0.97)] border-b border-[rgba(26,37,48,0.1)] backdrop-blur-[16px] flex items-center justify-between px-[18px] md:px-6">
      {/* Left — Logo */}
      <Link to="/" className="font-body text-[22px] font-medium tracking-[0.08em] text-dark-ink no-underline">
        Lila Trips
      </Link>

      {/* Center — Trip identity (desktop only) */}
      {(tripTitle || itinerary?.title) && (
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-2.5 max-w-[40%]">
          {editingNavTitle ? (
            <input
              ref={navTitleRef}
              value={draftNavTitle}
              onChange={e => setDraftNavTitle(e.target.value)}
              onBlur={commitNavTitle}
              onKeyDown={handleNavTitleKeyDown}
              className="font-body text-[13px] font-semibold text-dark-ink bg-transparent border-none border-b border-golden-amber rounded-none outline-none p-0 tracking-[0.01em] text-center min-w-[120px]"
            />
          ) : (
            <span
              onClick={handleNavTitleClick}
              className="font-body text-sm font-semibold text-dark-ink whitespace-nowrap overflow-hidden text-ellipsis cursor-text border-b border-dashed border-transparent transition-[border-color] duration-200 hover:border-[rgba(26,37,48,0.2)]"
            >
              {tripTitle || itinerary.title}
            </span>
          )}
          {iteration > 0 && (
            <span className="font-body text-[10px] font-bold tracking-[0.12em] uppercase text-[#8a8278] bg-black/[0.04] px-2 py-[3px] rounded whitespace-nowrap">
              Draft {iteration}
            </span>
          )}
        </div>
      )}

      {/* Right — Actions */}
      <div className="flex items-center gap-3.5">
        {/* Refine */}
        <button
          onClick={() => { if (feedbackCount > 0 && !isRefining) onRefine?.(); }}
          disabled={feedbackCount === 0 || isRefining}
          className="font-body text-[11px] font-semibold tracking-[0.1em] uppercase py-[7px] px-4 bg-transparent transition-all duration-200"
          style={{
            /* dynamic — border/color/cursor depend on feedbackCount + isRefining */
            border: `1px solid ${feedbackCount > 0 && !isRefining ? C.darkInk : C.stone}`,
            color: feedbackCount > 0 && !isRefining ? C.darkInk : C.stone,
            cursor: feedbackCount > 0 && !isRefining ? 'pointer' : 'not-allowed',
            opacity: feedbackCount === 0 || isRefining ? 0.5 : 1,
            WebkitTapHighlightColor: 'transparent',
          }}
          onMouseEnter={e => { if (feedbackCount > 0 && !isRefining) { e.currentTarget.style.background = C.darkInk; e.currentTarget.style.color = C.warmWhite; } }}
          onMouseLeave={e => { if (feedbackCount > 0 && !isRefining) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.darkInk; } }}
        >
          {isRefining ? 'REFINING...' : (feedbackCount > 0 ? `REFINE · ${feedbackCount}` : 'REFINE')}
        </button>

        {/* Iterations */}
        <button
          onClick={() => onIterations?.()}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-transparent border border-stone rounded-full cursor-pointer font-body text-xs font-semibold text-[#8a8278] transition-all hover:border-[rgba(26,37,48,0.25)]"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <span className="hidden md:inline">Iterations</span>
          <span className="md:hidden">v{iterationCount}</span>
          {iterationCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[10px] font-bold hidden md:inline-flex"
              style={{ background: C.goldenAmber, color: '#6B4D1A', padding: '0 5px' }}>
              {iterationCount}
            </span>
          )}
        </button>

        {/* Share */}
        <button
          onClick={() => { trackEvent('share_clicked', { source: 'itinerary_nav' }); onShare?.(); }}
          className="flex items-center bg-none border-none cursor-pointer p-1"
          title="Share trip"
        >
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#8a8278" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4z" />
          </svg>
        </button>

        {/* Account icon */}
        {user ? (
          <div data-user-menu className="relative inline-flex">
            <button
              onClick={() => setUserMenuOpen(prev => !prev)}
              className="relative flex items-center bg-none border-none cursor-pointer p-1 rounded-full transition-opacity hover:opacity-80"
              title="My Trips"
            >
              <UserAvatar user={user} size={26} />
              {trips.length > 0 && (
                <span className="absolute -top-[5px] -right-[7px] min-w-4 h-4 rounded-full bg-golden-amber border-[1.5px] border-warm-white flex items-center justify-center text-[9px] font-bold text-white font-body px-1">
                  {trips.length}
                </span>
              )}
            </button>
            {userMenuOpen && (
              <AccountDropdown
                user={user}
                trips={trips}
                onSelect={handleSelectTrip}
                onDelete={handleDeleteTrip}
                onNewTrip={handleNewTrip}
                onSignOut={signOut}
                onClose={() => setUserMenuOpen(false)}
              />
            )}
          </div>
        ) : trips.length > 0 ? (
          <div data-trips-container className="relative inline-flex">
            <button
              onClick={() => setTripsOpen(prev => !prev)}
              className="relative flex items-center bg-none border-none cursor-pointer p-1"
              title="My Trips"
            >
              <SuitcaseIcon color={C.goldenAmber} />
              <span className="absolute -top-[5px] -right-[7px] min-w-4 h-4 rounded-full bg-golden-amber border-[1.5px] border-warm-white flex items-center justify-center text-[9px] font-bold text-white font-body px-1">
                {trips.length}
              </span>
            </button>
            {tripsOpen && (
              <TripDropdown
                trips={trips}
                onSelect={handleSelectTrip}
                onDelete={handleDeleteTrip}
                onNewTrip={handleNewTrip}
                onSignIn={() => signIn('google')}
                onClose={() => setTripsOpen(false)}
              />
            )}
          </div>
        ) : (
          <button
            onClick={() => signIn('google')}
            className="relative flex items-center bg-none border-none cursor-pointer p-1 transition-opacity hover:opacity-70"
            title="Sign In"
          >
            <PersonIcon color={C.goldenAmber} size={20} />
          </button>
        )}
      </div>
    </nav>
  );
}
