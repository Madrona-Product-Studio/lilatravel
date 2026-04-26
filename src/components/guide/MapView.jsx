import { useEffect, useRef, useState } from 'react';
import { G, FONTS, TIER_COLORS } from '@data/guides/guide-styles';

// Lila-branded map style — muted, warm, minimal labels
const MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#f0ece4' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8a8278' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#faf8f4' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#e0d8cc' }] },
  { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#eae4da' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.park', stylers: [{ visibility: 'on' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#d4dcc8' }] },
  { featureType: 'poi.park', elementType: 'labels', stylers: [{ visibility: 'simplified' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#e8e2d9' }] },
  { featureType: 'road', elementType: 'labels', stylers: [{ visibility: 'simplified' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#ddd6ca' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c4d4dc' }] },
  { featureType: 'water', elementType: 'labels', stylers: [{ visibility: 'off' }] },
];

function getPinColor(item) {
  if (item.tier && TIER_COLORS[item.tier]) return TIER_COLORS[item.tier].color;
  if (item.lilaPick) return G.goldenAmber;
  return G.oceanTeal;
}

export default function MapView({ items, onSelectItem }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const [selectedId, setSelectedId] = useState(null);
  const [mapsLoaded, setMapsLoaded] = useState(!!window.google?.maps);

  // Load Google Maps script
  useEffect(() => {
    if (window.google?.maps) { setMapsLoaded(true); return; }
    const existing = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existing) {
      existing.addEventListener('load', () => setMapsLoaded(true));
      return;
    }

    // Use the same API key approach — load via a proxy or env
    // For now, load directly with the key from the Vercel env
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_KEY || ''}&libraries=marker`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapsLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Filter items with coordinates
  const mappableItems = items.filter(item => item.lat && item.lng);

  // Initialize map
  useEffect(() => {
    if (!mapsLoaded || !mapRef.current || mappableItems.length === 0) return;

    const bounds = new window.google.maps.LatLngBounds();
    mappableItems.forEach(item => bounds.extend({ lat: item.lat, lng: item.lng }));

    const map = new window.google.maps.Map(mapRef.current, {
      center: bounds.getCenter(),
      zoom: 12,
      styles: MAP_STYLES,
      disableDefaultUI: true,
      zoomControl: true,
      zoomControlOptions: { position: window.google.maps.ControlPosition.RIGHT_TOP },
      gestureHandling: 'greedy',
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    map.fitBounds(bounds, { top: 60, bottom: 80, left: 40, right: 40 });
    mapInstance.current = map;

    // Create markers
    const markers = mappableItems.map((item) => {
      const color = getPinColor(item);
      const marker = new window.google.maps.Marker({
        position: { lat: item.lat, lng: item.lng },
        map,
        title: item.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: color,
          fillOpacity: 1,
          strokeColor: '#fff',
          strokeWeight: 2,
        },
      });

      marker.addListener('click', () => {
        setSelectedId(item.id || item.name);
      });

      return { marker, item };
    });

    markersRef.current = markers;

    return () => {
      markers.forEach(({ marker }) => marker.setMap(null));
    };
  }, [mapsLoaded, mappableItems.length]);

  const selectedItem = selectedId ? mappableItems.find(i => (i.id || i.name) === selectedId) : null;

  if (!mapsLoaded) {
    return (
      <div style={{
        height: 400, background: G.panel, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontFamily: FONTS.body, fontSize: 12, color: G.ink40,
      }}>
        Loading map...
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', margin: '16px 0 28px' }}>
      <div
        ref={mapRef}
        style={{ width: '100%', height: 450, borderRadius: 8, overflow: 'hidden' }}
      />

      {/* Selected item card */}
      {selectedItem && (
        <div
          onClick={() => { if (onSelectItem) onSelectItem(selectedItem); }}
          style={{
            position: 'absolute', bottom: 16, left: 16, right: 16,
            background: G.warmWhite, padding: '14px 16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            borderRadius: 8, cursor: onSelectItem ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', gap: 12,
            animation: 'fadeIn 0.2s ease',
          }}
        >
          {selectedItem.thumbnail && (
            <img
              src={selectedItem.thumbnail}
              alt=""
              style={{ width: 56, height: 56, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }}
            />
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: FONTS.body, fontSize: 14, fontWeight: 700, color: G.darkInk, marginBottom: 2 }}>
              {selectedItem.name}
            </div>
            {selectedItem.detail && (
              <div style={{ fontFamily: FONTS.body, fontSize: 12, color: G.inkDetail, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {selectedItem.detail}
              </div>
            )}
          </div>
          <span style={{ fontFamily: FONTS.body, fontSize: 11, color: G.ink25, flexShrink: 0 }}>→</span>
        </div>
      )}

      {/* Dismiss selected */}
      {selectedItem && (
        <button
          onClick={(e) => { e.stopPropagation(); setSelectedId(null); }}
          style={{
            position: 'absolute', top: 12, right: 12,
            width: 28, height: 28, borderRadius: '50%',
            background: 'rgba(255,255,255,0.9)', border: 'none',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: FONTS.body, fontSize: 13, color: G.ink40,
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
          }}
          aria-label="Dismiss"
        >✕</button>
      )}

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
