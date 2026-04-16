/**
 * iNaturalist wildlife lookup proxy.
 * Fetches taxon data (photo, scientific name, conservation status, Wikipedia summary)
 * and local observation count for a species near a destination.
 *
 * GET /api/wildlife-lookup?name=California+Condor&lat=37.2&lng=-112.9
 * Returns: { taxonId, commonName, scientificName, photo, wikipediaSummary, conservationStatus, observationCount, inatUrl, wikipediaUrl }
 */

import { checkOrigin, checkRateLimit } from './_utils.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!checkOrigin(req, res)) return;
  if (!checkRateLimit(req, res, 'wildlife-lookup')) return;

  const { name, lat, lng } = req.query;
  if (!name || typeof name !== 'string' || name.length > 100) {
    return res.status(400).json({ error: 'Invalid or missing name parameter' });
  }

  try {
    // Step 1: Search for the taxon by common name
    const taxaUrl = `https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(name)}&rank=species,subspecies&per_page=1`;
    const taxaRes = await fetch(taxaUrl);
    const taxaData = await taxaRes.json();

    if (!taxaData.results?.length) {
      // Try broader search without rank filter (for things like "Desert Wildflowers")
      const broadUrl = `https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(name)}&per_page=1`;
      const broadRes = await fetch(broadUrl);
      const broadData = await broadRes.json();
      if (!broadData.results?.length) {
        return res.status(404).json({ error: 'Species not found' });
      }
      taxaData.results = broadData.results;
    }

    const taxon = taxaData.results[0];

    // Step 2: Get full taxon details (includes wikipedia_summary, conservation_statuses)
    const detailUrl = `https://api.inaturalist.org/v1/taxa/${taxon.id}`;
    const detailRes = await fetch(detailUrl);
    const detailData = await detailRes.json();
    const detail = detailData.results?.[0] || taxon;

    // Step 3: Get local observation count if lat/lng provided
    let observationCount = detail.observations_count || 0;
    let localCount = null;
    if (lat && lng) {
      try {
        const obsUrl = `https://api.inaturalist.org/v1/observations?taxon_id=${taxon.id}&lat=${lat}&lng=${lng}&radius=80&per_page=0`;
        const obsRes = await fetch(obsUrl);
        const obsData = await obsRes.json();
        localCount = obsData.total_results || 0;
      } catch (_) { /* local count is optional */ }
    }

    // Extract best conservation status
    let conservationStatus = null;
    const statuses = detail.conservation_statuses || [];
    // Prefer IUCN, then NatureServe, then any
    const iucn = statuses.find(s => s.authority === 'IUCN Red List');
    const preferred = iucn || statuses[0];
    if (preferred) {
      conservationStatus = {
        status: preferred.status,
        statusName: preferred.status_name || preferred.status,
        authority: preferred.authority,
      };
    }

    // Build photo URL (medium size)
    const photo = detail.default_photo?.medium_url || detail.default_photo?.url?.replace('square', 'medium') || null;
    const photoAttribution = detail.default_photo?.attribution || null;

    // Strip HTML from wikipedia summary
    const rawSummary = detail.wikipedia_summary || '';
    const wikipediaSummary = rawSummary.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').trim();

    res.setHeader('Cache-Control', 's-maxage=604800, stale-while-revalidate=86400');
    return res.json({
      taxonId: taxon.id,
      commonName: detail.preferred_common_name || taxon.preferred_common_name || name,
      scientificName: detail.name || taxon.name,
      iconicTaxon: detail.iconic_taxon_name || null,
      photo,
      photoAttribution,
      wikipediaSummary: wikipediaSummary.slice(0, 500),
      conservationStatus,
      observationCount,
      localObservations: localCount,
      inatUrl: `https://www.inaturalist.org/taxa/${taxon.id}`,
      wikipediaUrl: detail.wikipedia_url || null,
    });
  } catch (err) {
    console.error('Wildlife lookup error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch wildlife data' });
  }
}
