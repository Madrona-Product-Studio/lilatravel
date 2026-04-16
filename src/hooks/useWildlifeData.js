import { useState, useEffect } from 'react';

/**
 * Fetches iNaturalist taxon data for a wildlife species.
 * Returns photo, scientific name, conservation status, Wikipedia summary, and observation counts.
 *
 * @param {{ name: string, lat: number, lng: number }} opts
 */
export default function useWildlifeData({ name, lat, lng } = {}) {
  const [state, setState] = useState({
    photo: null,
    photoAttribution: null,
    commonName: null,
    scientificName: null,
    iconicTaxon: null,
    wikipediaSummary: null,
    conservationStatus: null,
    observationCount: null,
    localObservations: null,
    inatUrl: null,
    wikipediaUrl: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    const empty = { photo: null, photoAttribution: null, commonName: null, scientificName: null, iconicTaxon: null, wikipediaSummary: null, conservationStatus: null, observationCount: null, localObservations: null, inatUrl: null, wikipediaUrl: null, loading: false, error: null };
    if (!name) { setState(empty); return; }

    const controller = new AbortController();
    setState({ ...empty, loading: true });

    const params = new URLSearchParams({ name });
    if (lat && lng) { params.set('lat', lat); params.set('lng', lng); }

    fetch(`/api/wildlife-lookup?${params}`, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(`Wildlife lookup failed: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (controller.signal.aborted) return;
        setState({
          photo: data.photo,
          photoAttribution: data.photoAttribution,
          commonName: data.commonName,
          scientificName: data.scientificName,
          iconicTaxon: data.iconicTaxon,
          wikipediaSummary: data.wikipediaSummary,
          conservationStatus: data.conservationStatus,
          observationCount: data.observationCount,
          localObservations: data.localObservations,
          inatUrl: data.inatUrl,
          wikipediaUrl: data.wikipediaUrl,
          loading: false,
          error: null,
        });
      })
      .catch(err => {
        if (controller.signal.aborted) return;
        console.warn('useWildlifeData:', err.message);
        setState(prev => ({ ...prev, loading: false, error: err.message }));
      });

    return () => controller.abort();
  }, [name, lat, lng]);

  return state;
}
