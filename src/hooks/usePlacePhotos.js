import { useState, useEffect } from 'react';

/**
 * Fetches Google Places data (photos, rating) for a given place name + location.
 * All API calls go through /api/ serverless proxies — no client-side key exposure.
 *
 * @param {{ name: string, location: string }} opts
 * @returns {{ photos: string[], rating: number|null, userRatingsTotal: number|null, address: string|null, phone: string|null, placeId: string|null, loading: boolean, error: string|null }}
 */
export default function usePlacePhotos({ name, location } = {}) {
  const [state, setState] = useState({
    photos: [],
    rating: null,
    userRatingsTotal: null,
    address: null,
    phone: null,
    placeId: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    const empty = { photos: [], rating: null, userRatingsTotal: null, address: null, phone: null, placeId: null, loading: false, error: null };
    if (!name) { setState(empty); return; }

    const controller = new AbortController();
    const query = location ? `${name} ${location}` : name;

    setState({ ...empty, loading: true });

    fetch(`/api/places-search?query=${encodeURIComponent(query)}`, {
      signal: controller.signal,
    })
      .then(res => {
        if (!res.ok) throw new Error(`Places search failed: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (controller.signal.aborted) return;

        const photos = (data.photoRefs || []).slice(0, 6).map(
          ref => `/api/place-photo?ref=${encodeURIComponent(ref)}&maxwidth=800`
        );

        setState({
          photos,
          rating: data.rating ?? null,
          userRatingsTotal: data.userRatingsTotal ?? null,
          address: data.address ?? null,
          phone: data.phone ?? null,
          placeId: data.placeId ?? null,
          loading: false,
          error: null,
        });
      })
      .catch(err => {
        if (controller.signal.aborted) return;
        console.warn('usePlacePhotos:', err.message);
        setState(prev => ({ ...prev, loading: false, error: err.message }));
      });

    return () => controller.abort();
  }, [name, location]);

  return state;
}
