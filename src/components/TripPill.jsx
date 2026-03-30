import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const ArrowIcon = ({ size = 12, color = '#FFFFFF' }) => (
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
    <button
      onClick={() => navigate(trip.path)}
      className="fixed bottom-6 right-6 z-[150] flex items-center gap-[7px] px-[18px] py-2.5 rounded-3xl bg-dark-ink text-white border-none cursor-pointer font-body text-[13px] font-semibold tracking-[0.04em] shadow-[0_4px_20px_rgba(30,40,37,0.15)] hover:-translate-y-px hover:shadow-[0_6px_24px_rgba(30,40,37,0.19)] transition-[transform,box-shadow] duration-200"
    >
      Trip in Progress
      <ArrowIcon size={12} />
    </button>
  );
}
