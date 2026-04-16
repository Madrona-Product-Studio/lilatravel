import { useState, useEffect } from 'react';

// ─── Meteor Shower Data ──────────────────────────────────────────────────────
const SHOWERS = [
  { name: 'Perseids', peak: { month: 8, day: 12 }, rate: '100/hr', note: 'Best of the year.' },
  { name: 'Geminids', peak: { month: 12, day: 13 }, rate: '120/hr', note: 'Brightest shower.' },
  { name: 'Leonids', peak: { month: 11, day: 17 }, rate: '15/hr', note: 'Fast, bright streaks.' },
  { name: 'Lyrids', peak: { month: 4, day: 22 }, rate: '20/hr', note: 'First spring shower.' },
  { name: 'Orionids', peak: { month: 10, day: 21 }, rate: '25/hr', note: "Halley's Comet debris." },
];

// ─── Local Calculation Helpers ───────────────────────────────────────────────

function toJulian(date) { return date / 86400000 + 2440587.5; }

function moonPhase(date) {
  const jd = toJulian(date);
  const cycle = 29.53058867;
  const age = ((jd - 2451550.1) % cycle + cycle) % cycle;
  const illum = (1 - Math.cos(2 * Math.PI * age / cycle)) / 2;
  let name;
  if (age < 1.85) name = 'New Moon';
  else if (age < 7.38) name = 'Waxing Crescent';
  else if (age < 9.22) name = 'First Quarter';
  else if (age < 14.77) name = 'Waxing Gibbous';
  else if (age < 16.61) name = 'Full Moon';
  else if (age < 22.15) name = 'Waning Gibbous';
  else if (age < 23.99) name = 'Last Quarter';
  else name = 'Waning Crescent';
  return { age, illum, name };
}

function siderealTime(date, lon) {
  const jd = toJulian(date);
  let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545);
  return ((gmst + lon) % 360 + 360) % 360;
}

function raDecToAltAz(ra, dec, lat, lst) {
  const ha = (lst - ra * 15 + 360) % 360;
  const haR = ha * Math.PI / 180, decR = dec * Math.PI / 180, latR = lat * Math.PI / 180;
  const sinAlt = Math.sin(decR) * Math.sin(latR) + Math.cos(decR) * Math.cos(latR) * Math.cos(haR);
  const alt = Math.asin(Math.max(-1, Math.min(1, sinAlt))) * 180 / Math.PI;
  const cosAz = (Math.sin(decR) - sinAlt * Math.sin(latR)) / (Math.cos(Math.asin(sinAlt)) * Math.cos(latR));
  let az = Math.acos(Math.max(-1, Math.min(1, cosAz))) * 180 / Math.PI;
  if (Math.sin(haR) > 0) az = 360 - az;
  return { alt: Math.round(alt), az: Math.round(az) };
}

function azToDir(az) {
  return ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(az / 45) % 8];
}

function getPlanets(date) {
  const t = (toJulian(date) - 2451545) / 36525;
  return [
    { name: 'Venus', ra: 2.5 + t * 12, dec: 14 + t * 5, mag: -4.5 },
    { name: 'Mars', ra: 7.2 + t * 6, dec: 22 + t * 2, mag: 1.1 },
    { name: 'Jupiter', ra: 5.8 + t * 1, dec: 23 - t * 2, mag: -2.1 },
    { name: 'Saturn', ra: 22.4 + t * 0.4, dec: -12 + t * 1.5, mag: 0.8 },
  ];
}

function milkyWayScore(date, illum) {
  const m = date.getMonth() + 1;
  if (m < 4 || m > 10) return 0;
  const seasonal = Math.max(0, 10 - Math.abs(m - 7) * 1.5);
  return Math.max(0, Math.round(seasonal - illum * 7));
}

function daysToNextNew(date) {
  const jd = toJulian(date);
  const cycle = 29.53058867;
  const age = ((jd - 2451550.1) % cycle + cycle) % cycle;
  return Math.round(cycle - age);
}

function nextNewMoonDate(date) {
  const days = daysToNextNew(date);
  const d = new Date(date.getTime() + days * 86400000);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}

// ─── Derived Helpers ─────────────────────────────────────────────────────────

function computePlanets(date, lat = 37.2, lon = -112.9) {
  const lst = siderealTime(date, lon);
  const raw = getPlanets(date);
  return raw.map(p => {
    const { alt, az } = raDecToAltAz(p.ra, p.dec, lat, lst);
    return {
      name: p.name,
      altitude: alt,
      azimuth: az,
      direction: azToDir(az),
      visible: alt > 0,
      bright: p.mag < -1,
    };
  });
}

function computeMilkyWay(date, illum) {
  const score = milkyWayScore(date, illum);
  const m = date.getMonth() + 1;
  const seasonal = m >= 4 && m <= 10;
  let status, note;
  if (!seasonal) {
    status = 'Below Horizon';
    note = 'The galactic core is not visible this time of year.';
  } else if (score >= 7) {
    status = 'Excellent';
    note = 'The Milky Way core will be vivid and striking tonight.';
  } else if (score >= 4) {
    status = 'Good';
    note = 'Core visible but moonlight may wash out faint detail.';
  } else {
    status = 'Faint';
    note = 'Bright moonlight will obscure most of the core tonight.';
  }
  return { score, status, note, seasonal };
}

function computeStargazingRating(illum) {
  if (illum < 0.25) return { label: 'Excellent', quality: 'good' };
  if (illum < 0.5) return { label: 'Good', quality: 'good' };
  if (illum < 0.75) return { label: 'Fair', quality: 'warn' };
  return { label: 'Poor — bright moon', quality: '' };
}

function computeBestWindow(illum) {
  if (illum < 0.3) return '9 PM – 4 AM';
  if (illum < 0.6) return '10 PM – 2 AM';
  return '11 PM – 3 AM';
}

function computeMoonrise(age) {
  // Rough estimate: moonrise shifts ~50 min later each day
  const baseHour = 6 + (age / 29.53) * 24;
  const hour = Math.floor(baseHour % 24);
  const min = Math.floor((baseHour % 1) * 60);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return `~${h12}:${String(min).padStart(2, '0')} ${ampm}`;
}

function getNextShower(date) {
  const year = date.getFullYear();
  const sorted = SHOWERS.map(s => {
    let peakDate = new Date(year, s.peak.month - 1, s.peak.day);
    if (peakDate < date) peakDate = new Date(year + 1, s.peak.month - 1, s.peak.day);
    const daysAway = Math.round((peakDate - date) / 86400000);
    return { ...s, daysAway };
  }).sort((a, b) => a.daysAway - b.daysAway);
  const next = sorted[0];
  const active = next.daysAway <= 3;
  return {
    next: {
      name: next.name,
      date: `${new Date(0, next.peak.month - 1).toLocaleString('en-US', { month: 'long' })} ${next.peak.day}`,
      rate: next.rate,
      note: next.note,
      daysAway: next.daysAway,
    },
    active,
  };
}

// ─── Build full local data ───────────────────────────────────────────────────

function buildLocalData(date, lat, lng) {
  const mp = moonPhase(date);
  const planets = computePlanets(date, lat, lng);
  const mw = computeMilkyWay(date, mp.illum);
  const rating = computeStargazingRating(mp.illum);
  const showers = getNextShower(date);

  return {
    moonPhase: {
      name: mp.name,
      illumination: Math.round(mp.illum * 100),
      age: mp.age,
      svgUrl: null,
    },
    planets,
    milkyWay: mw,
    nextNewMoon: {
      date: nextNewMoonDate(date),
      daysAway: daysToNextNew(date),
    },
    bestWindow: computeBestWindow(mp.illum),
    moonrise: computeMoonrise(mp.age),
    stargazingRating: rating,
    showers,
  };
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export default function useNightSky({ lat = 37.2, lng = -112.9 } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const cacheKey = `nightSky_${today}_${lat}_${lng}`;

    // Check sessionStorage cache
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        setData(JSON.parse(cached));
        setLoading(false);
        return;
      }
    } catch { /* ignore */ }

    // Compute local data immediately
    const local = buildLocalData(now, lat, lng);
    setData(local);
    setLoading(false);

    // Try API enrichment in background
    (async () => {
      let enriched = { ...local };
      let changed = false;

      try {
        const [moonRes, bodiesRes] = await Promise.allSettled([
          fetch(`/api/astronomy?type=moon-phase&lat=${lat}&lon=${lng}`).then(r => r.ok ? r.json() : null),
          fetch(`/api/astronomy?type=bodies&lat=${lat}&lon=${lng}`).then(r => r.ok ? r.json() : null),
        ]);

        // Enrich moon SVG
        if (moonRes.status === 'fulfilled' && moonRes.value?.data?.imageUrl) {
          enriched.moonPhase = { ...enriched.moonPhase, svgUrl: moonRes.value.data.imageUrl };
          changed = true;
        }

        // Enrich planet positions from API
        if (bodiesRes.status === 'fulfilled' && bodiesRes.value?.data?.table?.rows) {
          const rows = bodiesRes.value.data.table.rows;
          const apiPlanets = ['Venus', 'Mars', 'Jupiter', 'Saturn']
            .map(name => {
              const row = rows.find(r => r.entry?.name === name);
              if (!row) return null;
              const pos = row.cells?.[0]?.position?.horizontal;
              if (!pos) return null;
              const alt = Math.round(parseFloat(pos.altitude?.degrees || 0));
              const az = Math.round(parseFloat(pos.azimuth?.degrees || 0));
              return {
                name,
                altitude: alt,
                azimuth: az,
                direction: azToDir(az),
                visible: alt > 0,
                bright: name === 'Venus' || name === 'Jupiter',
              };
            })
            .filter(Boolean);

          if (apiPlanets.length > 0) {
            enriched.planets = apiPlanets;
            changed = true;
          }
        }
      } catch { /* API failed, keep local data */ }

      if (changed) {
        setData(enriched);
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify(enriched));
        } catch { /* ignore */ }
      } else {
        // Cache local data
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify(local));
        } catch { /* ignore */ }
      }
    })();
  }, [lat, lng]);

  if (!data) return { loading: true, moonPhase: null, planets: [], milkyWay: null, nextNewMoon: null, bestWindow: '', moonrise: '', stargazingRating: null, showers: null };

  return { loading, ...data };
}
