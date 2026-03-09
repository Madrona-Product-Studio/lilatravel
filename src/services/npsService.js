// ═══════════════════════════════════════════════════════════════════════════════
// NPS SERVICE — Things to Do + Events from the National Park Service API
// ═══════════════════════════════════════════════════════════════════════════════
//
// Fetches and caches NPS "Things to Do" and Events data for trail enrichment.
// Uses VITE_NPS_API_KEY environment variable for authentication.
// Uses Promise.allSettled for graceful degradation (matches celestialService).
// If no API key is set or fetches fail, returns empty arrays — the guide
// works exactly as before.
//

// ─── In-Memory Cache ─────────────────────────────────────────────────────────

const cache = {};
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

function getCached(key) {
  const entry = cache[key];
  if (entry && Date.now() - entry.ts < CACHE_TTL) return entry.data;
  return null;
}

function setCache(key, data) {
  cache[key] = { data, ts: Date.now() };
}


// ─── NPS API Fetchers ────────────────────────────────────────────────────────

async function fetchThingsToDo(parkCode) {
  const apiKey = import.meta.env.VITE_NPS_API_KEY;
  if (!apiKey) return [];
  const res = await fetch(
    `https://developer.nps.gov/api/v1/thingstodo?parkCode=${parkCode}&limit=50&api_key=${apiKey}`
  );
  if (!res.ok) throw new Error(`NPS Things to Do fetch failed for ${parkCode}`);
  const data = await res.json();
  return data.data || [];
}

async function fetchEvents(parkCode) {
  const apiKey = import.meta.env.VITE_NPS_API_KEY;
  if (!apiKey) return [];
  const res = await fetch(
    `https://developer.nps.gov/api/v1/events?parkCode=${parkCode}&limit=20&api_key=${apiKey}`
  );
  if (!res.ok) throw new Error(`NPS Events fetch failed for ${parkCode}`);
  const data = await res.json();
  return data.data || [];
}


// ─── Name Matching ───────────────────────────────────────────────────────────

function normalize(name) {
  return name
    .toLowerCase()
    .replace(/['\u2018\u2019]/g, "'")
    .replace(/[^a-z0-9' ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// NPS titles often start with "Hike Angels Landing", "Explore The Narrows", etc.
function stripVerbPrefix(title) {
  return title.replace(
    /^(hike|visit|explore|drive|take|walk|bike|ride|kayak|climb|discover|photograph|watch|attend|join|experience)\s+/i,
    ''
  );
}

export function buildNPSLookup(items) {
  const lookup = new Map();
  for (const item of items) {
    const norm = normalize(item.title);
    lookup.set(norm, item);
    // Also index without verb prefix
    const stripped = normalize(stripVerbPrefix(item.title));
    if (stripped !== norm) lookup.set(stripped, item);
  }
  return lookup;
}

export function findNPSMatch(name, lookup) {
  if (!lookup || lookup.size === 0) return null;
  const norm = normalize(name);

  // Exact match
  if (lookup.has(norm)) return lookup.get(norm);

  // Substring match — our name appears in NPS title or vice versa
  for (const [key, item] of lookup) {
    if (key.includes(norm) || norm.includes(key)) return item;
  }

  return null;
}


// ─── Orchestrator ────────────────────────────────────────────────────────────

export async function getNPSData(parkCodes) {
  const codes = Array.isArray(parkCodes) ? parkCodes : [parkCodes];
  const cacheKey = `nps:${codes.sort().join(',')}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  // Fire all fetches in parallel
  const thingsPromises = codes.map(pc => fetchThingsToDo(pc));
  const eventsPromises = codes.map(pc => fetchEvents(pc));
  const results = await Promise.allSettled([...thingsPromises, ...eventsPromises]);

  const thingsToDo = [];
  const events = [];

  codes.forEach((_, i) => {
    if (results[i].status === 'fulfilled') thingsToDo.push(...results[i].value);
  });
  codes.forEach((_, i) => {
    const idx = codes.length + i;
    if (results[idx].status === 'fulfilled') events.push(...results[idx].value);
  });

  // Sort events by date, keep only upcoming
  const now = new Date();
  const upcomingEvents = events
    .filter(e => {
      const end = e.dateEnd || e.dateStart;
      return end && new Date(end) >= now;
    })
    .sort((a, b) => new Date(a.dateStart) - new Date(b.dateStart));

  const data = { thingsToDo, events: upcomingEvents };
  setCache(cacheKey, data);
  return data;
}
