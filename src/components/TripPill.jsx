import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { C as BrandC } from '@data/brand';

const C = {
  slate: BrandC.darkInk,
  ink:   '#1E2825',
  white: '#FFFFFF',
};

const F = "'Quicksand', sans-serif";

const ArrowIcon = ({ size = 12, color = C.white }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 8h10" /><path d="M9 4l4 4-4 4" />
  </svg>
);

export default function TripPill() {
  const location = useLocation();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);

  // Re-check sessionStorage on every route change
  useEffect(() => {
    const raw = sessionStorage.getItem('lilaActiveTrip');
    setTrip(raw ? JSON.parse(raw) : null);
  }, [location.pathname]);

  // Don't render on itinerary pages — SavePill handles it there
  const isItineraryPage = location.pathname === '/itinerary'
    || location.pathname.startsWith('/trip/');
  if (isItineraryPage) return null;

  if (!trip) return null;

  return (
    <button onClick={() => navigate(trip.path)} style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 150,
      display: 'flex', alignItems: 'center', gap: 7,
      padding: '10px 18px', borderRadius: 24,
      background: C.slate, color: C.white,
      border: 'none', cursor: 'pointer',
      fontFamily: F, fontSize: 13, fontWeight: 600,
      letterSpacing: '0.04em',
      boxShadow: `0 4px 20px ${C.ink}25`,
      WebkitTapHighlightColor: 'transparent',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 6px 24px ${C.ink}30`; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 20px ${C.ink}25`; }}
    >
      Trip in Progress
      <ArrowIcon size={12} color={C.white} />
    </button>
  );
}
