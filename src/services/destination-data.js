/**
 * Lila Trips — Destination Data Service
 * 
 * Gathers curated content + live data for a destination,
 * then assembles the full context for the Claude API call.
 * 
 * This runs on your backend (Vercel serverless function).
 */

import fs from 'fs';
import path from 'path';
import { generateMatchingInstructions } from './preference-mapping.js';

// ============================================================
// CONFIGURATION
// ============================================================

const NPS_API_KEY = process.env.NPS_API_KEY; // Get free key at developer.nps.gov
const NPS_BASE_URL = 'https://developer.nps.gov/api/v1';

// Park codes for each Lila Trips destination
const PARK_CODES = {
  zion: 'zion',
  'bryce-canyon': 'brca',
  'capitol-reef': 'care',
  'joshua-tree': 'jotr',
  'death-valley': 'deva',
  'mojave-preserve': 'moja',
  'big-sur': null, // Not an NPS unit — no NPS API data
  'olympic-peninsula': 'olym',
  kauai: null, // State parks, not NPS
  'vancouver-island': null, // Parks Canada, not NPS
};

// Corridor parks associated with each primary destination
const CORRIDOR_PARKS = {
  zion: ['bryce-canyon', 'capitol-reef'],
  'joshua-tree': ['death-valley', 'mojave-preserve'],
};

// Open-Meteo coordinates and timezones for weather/celestial forecasts
const DESTINATION_COORDS = {
  zion: { lat: 37.2982, lon: -113.0263, tz: 'America/Denver' },
  'joshua-tree': { lat: 33.8734, lon: -115.9010, tz: 'America/Los_Angeles' },
  'big-sur': { lat: 36.2704, lon: -121.8081, tz: 'America/Los_Angeles' },
  'olympic-peninsula': { lat: 47.8021, lon: -123.6044, tz: 'America/Los_Angeles' },
  kauai: { lat: 22.0964, lon: -159.5261, tz: 'Pacific/Honolulu' },
  'vancouver-island': { lat: 49.1557, lon: -125.9066, tz: 'America/Vancouver' },
};


// ============================================================
// STATIC CONTENT — Your curated, vetted destination guides
// ============================================================

/**
 * Load the curated destination guide (markdown file).
 * This is YOUR editorial content — the single source of truth.
 */
function loadGuide(destination) {
  const guidePath = path.join(process.cwd(), 'src', 'data', 'destinations', `${destination}.md`);

  if (!fs.existsSync(guidePath)) {
    throw new Error(`No guide found for destination: ${destination}`);
  }

  return fs.readFileSync(guidePath, 'utf-8');
}

/**
 * Load permit/reservation data for a destination (JSON file).
 * Returns null if no permit data exists for the destination.
 */
function loadPermits(destination) {
  const permitPath = path.join(process.cwd(), 'src', 'data', 'permits', `${destination}.json`);

  if (!fs.existsSync(permitPath)) return null;

  try {
    return JSON.parse(fs.readFileSync(permitPath, 'utf-8'));
  } catch {
    console.error(`Failed to parse permits for ${destination}`);
    return null;
  }
}

/**
 * Format permit data into a readable block for the Claude prompt.
 */
function formatPermitsForPrompt(permits) {
  if (!permits || permits.length === 0) return null;

  return permits.map(p => {
    let block = `**${p.activity}** (${p.permitType} permit)\n`;
    block += `- ${p.description}\n`;
    block += `- Where: ${p.where}${p.url ? ` — ${p.url}` : ''}\n`;
    block += `- Cost: ${p.cost}\n`;
    block += `- When required: ${p.seasonalWindow.required}`;
    if (p.seasonalWindow.notes) block += ` (${p.seasonalWindow.notes})`;
    block += '\n';
    block += `- Tips: ${p.tips.slice(0, 3).join(' ')}`;
    return block;
  }).join('\n\n');
}


// ============================================================
// LIVE DATA — NPS API
// ============================================================

/**
 * Fetch current alerts (closures, dangers, cautions) from NPS API.
 * Returns human-readable summary for the Claude prompt.
 */
async function fetchNPSAlerts(destination) {
  const parkCode = PARK_CODES[destination];
  if (!parkCode || !NPS_API_KEY) return null;

  try {
    const response = await fetch(
      `${NPS_BASE_URL}/alerts?parkCode=${parkCode}&limit=20`,
      { headers: { 'X-Api-Key': NPS_API_KEY } }
    );

    if (!response.ok) return null;

    const data = await response.json();
    const alerts = data.data;

    if (!alerts || alerts.length === 0) {
      return 'No current alerts or closures.';
    }

    return alerts.map(alert => 
      `[${alert.category.toUpperCase()}] ${alert.title}: ${alert.description}`
    ).join('\n\n');
  } catch (error) {
    console.error('NPS Alerts fetch failed:', error);
    return null;
  }
}

/**
 * Fetch campground info from NPS API.
 */
async function fetchNPSCampgrounds(destination) {
  const parkCode = PARK_CODES[destination];
  if (!parkCode || !NPS_API_KEY) return null;

  try {
    const response = await fetch(
      `${NPS_BASE_URL}/campgrounds?parkCode=${parkCode}&limit=20`,
      { headers: { 'X-Api-Key': NPS_API_KEY } }
    );

    if (!response.ok) return null;

    const data = await response.json();
    return data.data.map(cg => ({
      name: cg.name,
      description: cg.description,
      reservationType: cg.reservationInfo,
      totalSites: cg.campsites?.totalSites,
      amenities: cg.amenities,
    }));
  } catch (error) {
    console.error('NPS Campgrounds fetch failed:', error);
    return null;
  }
}


// ============================================================
// LIVE DATA — Weather (Open-Meteo, free, no API key needed)
// ============================================================

/**
 * Fetch weather forecast for specific travel dates.
 * Open-Meteo provides 16-day forecasts for free.
 * If dates are beyond 16 days, returns historical averages note.
 */
async function fetchWeather(destination, startDate, endDate) {
  const coords = DESTINATION_COORDS[destination];
  if (!coords) return null;

  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?` +
      `latitude=${coords.lat}&longitude=${coords.lon}` +
      `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode` +
      `&temperature_unit=fahrenheit` +
      `&start_date=${startDate}&end_date=${endDate}` +
      `&timezone=${coords.tz || 'America/Denver'}`
    );

    if (!response.ok) return null;

    const data = await response.json();
    const daily = data.daily;

    if (!daily || !daily.time) return null;

    return daily.time.map((date, i) => ({
      date,
      high: Math.round(daily.temperature_2m_max[i]),
      low: Math.round(daily.temperature_2m_min[i]),
      precipChance: daily.precipitation_probability_max[i],
      code: daily.weathercode[i],
    }));
  } catch (error) {
    console.error('Weather fetch failed:', error);
    return null;
  }
}

/**
 * Convert weather code to human-readable description.
 */
function weatherDescription(code) {
  const descriptions = {
    0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Depositing rime fog',
    51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
    61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
    71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow',
    80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers',
    95: 'Thunderstorm', 96: 'Thunderstorm with hail',
  };
  return descriptions[code] || 'Unknown';
}

/**
 * Format weather data into a readable summary for the Claude prompt.
 */
function formatWeatherForPrompt(weatherData) {
  if (!weatherData) return null;
  
  return weatherData.map(day => 
    `${day.date}: High ${day.high}°F / Low ${day.low}°F — ${weatherDescription(day.code)} (${day.precipChance}% precip chance)`
  ).join('\n');
}


// ============================================================
// LIVE DATA — Celestial (Sunrise/Sunset, Moon Phase via Open-Meteo)
// ============================================================

/**
 * Fetch sunrise/sunset times and daylight info for the trip dates.
 * Uses Open-Meteo's free API.
 */
async function fetchCelestial(destination, startDate, endDate) {
  const coords = DESTINATION_COORDS[destination];
  if (!coords || !startDate || !endDate) return null;

  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?` +
      `latitude=${coords.lat}&longitude=${coords.lon}` +
      `&daily=sunrise,sunset` +
      `&start_date=${startDate}&end_date=${endDate}` +
      `&timezone=${coords.tz || 'America/Denver'}`
    );

    if (!response.ok) return null;

    const data = await response.json();
    const daily = data.daily;

    if (!daily || !daily.time) return null;

    // Calculate moon phase for first day of trip
    const moonPhase = getMoonPhase(new Date(startDate));

    return {
      days: daily.time.map((date, i) => ({
        date,
        sunrise: formatTime(daily.sunrise[i], coords.tz),
        sunset: formatTime(daily.sunset[i], coords.tz),
      })),
      moonPhase,
    };
  } catch (error) {
    console.error('Celestial fetch failed:', error);
    return null;
  }
}

/**
 * Format ISO datetime to just the time portion (e.g., "6:42 AM")
 */
function formatTime(isoString, tz) {
  if (!isoString) return null;
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: tz || 'America/Denver',
    });
  } catch {
    return null;
  }
}

/**
 * Calculate moon phase based on date.
 * Returns { name, emoji, illumination (0-1) }
 * Uses a simplified synodic calculation.
 */
function getMoonPhase(date) {
  // Known new moon: January 6, 2000 18:14 UTC
  const knownNew = new Date('2000-01-06T18:14:00Z');
  const synodicMonth = 29.53058770576; // days
  const daysSinceKnown = (date - knownNew) / (1000 * 60 * 60 * 24);
  const phase = ((daysSinceKnown % synodicMonth) + synodicMonth) % synodicMonth;
  const normalized = phase / synodicMonth; // 0 to 1

  const phases = [
    { name: 'New Moon',        emoji: '🌑', min: 0,     max: 0.0625 },
    { name: 'Waxing Crescent', emoji: '🌒', min: 0.0625, max: 0.1875 },
    { name: 'First Quarter',   emoji: '🌓', min: 0.1875, max: 0.3125 },
    { name: 'Waxing Gibbous',  emoji: '🌔', min: 0.3125, max: 0.4375 },
    { name: 'Full Moon',       emoji: '🌕', min: 0.4375, max: 0.5625 },
    { name: 'Waning Gibbous',  emoji: '🌖', min: 0.5625, max: 0.6875 },
    { name: 'Last Quarter',    emoji: '🌗', min: 0.6875, max: 0.8125 },
    { name: 'Waning Crescent', emoji: '🌘', min: 0.8125, max: 0.9375 },
    { name: 'New Moon',        emoji: '🌑', min: 0.9375, max: 1.001 },
  ];

  const current = phases.find(p => normalized >= p.min && normalized < p.max) || phases[0];
  // Approximate illumination: 0 at new, 1 at full
  const illumination = Math.round((1 - Math.cos(normalized * 2 * Math.PI)) / 2 * 100);

  return {
    name: current.name,
    emoji: current.emoji,
    illumination,
    stargazing: illumination < 30 ? 'excellent' : illumination < 60 ? 'good' : 'moderate',
  };
}

/**
 * Format celestial data for the Claude prompt.
 */
function formatCelestialForPrompt(celestialData) {
  if (!celestialData) return null;

  const firstDay = celestialData.days[0];
  const lastDay = celestialData.days[celestialData.days.length - 1];
  const moon = celestialData.moonPhase;

  let summary = `Sunrise: ${firstDay?.sunrise || 'N/A'} | Sunset: ${firstDay?.sunset || 'N/A'} (day 1)`;
  if (celestialData.days.length > 1) {
    summary += `\nSunrise: ${lastDay?.sunrise || 'N/A'} | Sunset: ${lastDay?.sunset || 'N/A'} (last day)`;
  }
  summary += `\nMoon Phase: ${moon.emoji} ${moon.name} (${moon.illumination}% illumination)`;
  summary += `\nStargazing conditions: ${moon.stargazing}`;

  return summary;
}


// ============================================================
// LIVE DATA — Tides (NOAA CO-OPS, free, no API key needed)
// ============================================================

// NOAA tide stations for coastal destinations (null = no tides relevant)
const TIDE_STATIONS = {
  zion: null,
  'joshua-tree': null,
  'big-sur': { id: '9413450', name: 'Monterey, CA' },
  'olympic-peninsula': { id: '9444900', name: 'Port Townsend, WA' },
  kauai: { id: '1611400', name: 'Nawiliwili Harbor, HI' },
  'vancouver-island': null, // Canadian tides — not available via NOAA API
};

/**
 * Fetch tide predictions from NOAA CO-OPS API for the travel dates.
 * Returns high/low tide times or null if not a coastal destination.
 *
 * API docs: https://api.tidesandcurrents.noaa.gov/api/prod/
 */
async function fetchTideData(destination, startDate, endDate) {
  const station = TIDE_STATIONS[destination];
  if (!station) return null;

  // NOAA date format: YYYYMMDD
  const fmtDate = (iso) => iso.replace(/-/g, '');

  try {
    const response = await fetch(
      `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter` +
      `?begin_date=${fmtDate(startDate)}&end_date=${fmtDate(endDate)}` +
      `&station=${station.id}` +
      `&product=predictions&datum=MLLW&units=english` +
      `&time_zone=lst_ldt&interval=hilo&format=json`
    );

    if (!response.ok) return null;

    const data = await response.json();

    if (!data.predictions || data.predictions.length === 0) return null;

    return {
      station: station.name,
      predictions: data.predictions.map(p => ({
        time: p.t,       // "YYYY-MM-DD HH:MM"
        height: parseFloat(p.v),  // feet above MLLW
        type: p.type === 'H' ? 'high' : 'low',
      })),
    };
  } catch (error) {
    console.error('Tide fetch failed:', error);
    return null;
  }
}

/**
 * Format tide data into a readable summary for the Claude prompt.
 * Groups by day and shows high/low times.
 */
function formatTidesForPrompt(tideData) {
  if (!tideData) return null;

  const byDay = {};
  for (const p of tideData.predictions) {
    const day = p.time.slice(0, 10); // "YYYY-MM-DD"
    if (!byDay[day]) byDay[day] = [];
    // Format time: "2026-03-15 14:32" → "2:32 PM"
    const [, timePart] = p.time.split(' ');
    const [h, m] = timePart.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    const timeStr = `${h12}:${String(m).padStart(2, '0')} ${period}`;
    byDay[day].push(`${p.type === 'high' ? 'High' : 'Low'} ${timeStr} (${p.height.toFixed(1)} ft)`);
  }

  const lines = [`Station: ${tideData.station}`];
  for (const [day, tides] of Object.entries(byDay)) {
    lines.push(`${day}: ${tides.join(' · ')}`);
  }

  lines.push('');
  lines.push('USE THIS DATA: When recommending beach activities, tidepooling, coastal hikes, or kayaking, mention the tide conditions. Suggest low tide windows for tidepooling and beach exploration. Warn about high tide timing for coastal trail sections that may be impassable. If a very low tide coincides with the trip, highlight it as a special opportunity.');

  return lines.join('\n');
}


// ============================================================
// NIGHT SKY SERVICE — Milky Way, Meteor Showers, Dark Sky Data
// ============================================================

// ─── Dark Sky Data (static per destination) ─────────────────

const DARK_SKY_DATA = {
  zion: {
    bortle: 2,
    designation: 'International Dark Sky Park',
    bestSpots: ['Kolob Terrace Road', 'Lava Point overlook', 'Pa\'rus Trail (after dark)', 'Watchman Campground amphitheater'],
    notes: 'Designated Dark Sky Park since 2021. Canyon floor has some light from Springdale; drive up Kolob Terrace Road for the darkest skies. Lava Point (7,890 ft) offers 360° unobstructed views. Rangers lead night sky programs spring through fall.',
  },
  'joshua-tree': {
    bortle: 2,
    designation: 'International Dark Sky Park',
    bestSpots: ['Keys View', 'Jumbo Rocks campground', 'Cap Rock', 'Skull Rock area'],
    notes: 'One of the best dark sky parks in the lower 48. Low humidity and high elevation (4,000+ ft) create exceptional transparency. Keys View faces south — ideal for Milky Way core. Avoid full moon weekends; the park gets crowded with astrophotographers on new moon.',
  },
  'big-sur': {
    bortle: 3,
    designation: null,
    bestSpots: ['Pfeiffer Beach', 'Andrew Molera State Park', 'Nacimiento-Fergusson Road pullouts', 'Kirk Creek Campground bluff'],
    notes: 'No official designation but genuinely dark. Ocean horizon to the west is pitch black. Fog can roll in and ruin visibility — check marine layer forecast. Best months are August-October when fog is least frequent. South-facing beaches are best for Milky Way core.',
  },
  'olympic-peninsula': {
    bortle: 2,
    designation: null,
    bestSpots: ['Hurricane Ridge', 'Kalaloch Beach', 'Rialto Beach', 'Second Beach at La Push'],
    notes: 'Some of the darkest skies in the contiguous US. Hurricane Ridge (5,242 ft) rises above low clouds. Coastal beaches offer unobstructed ocean horizons. Cloud cover is the main challenge — check forecasts carefully. July-September has the best chance of clear skies.',
  },
  kauai: {
    bortle: 3,
    designation: null,
    bestSpots: ['Polihale State Park', 'Waimea Canyon lookout', 'Kalalau Trail overlook', 'Salt Pond Beach Park'],
    notes: 'Polihale on the west side is the darkest — no development for miles. Waimea Canyon at 3,400 ft gets above some atmospheric moisture. Trade wind clouds are common; leeward (west/south) side clears more often. Southern latitude (22°N) gives better Milky Way core visibility than mainland US.',
  },
  'vancouver-island': {
    bortle: 3,
    designation: null,
    bestSpots: ['Long Beach (Pacific Rim)', 'Chesterman Beach', 'Ucluelet headland', 'Strathcona alpine'],
    notes: 'No IDA designation. Coastal cloud cover is the primary challenge — clear nights are uncommon but extraordinary when they happen. Long Beach and Chesterman offer open Pacific horizons. Strathcona\'s alpine zone rises above marine layer. Best chance of clear skies: July-September. Check Clear Outside before committing.',
  },
};

// ─── Meteor Shower Calendar (static) ────────────────────────

const METEOR_SHOWERS = [
  { name: 'Quadrantids',   peakMonth: 0,  peakDay: 3,  endDay: 4,  rate: 120, radiant: 'NE sky',    parent: 'Asteroid 2003 EH1', notes: 'Sharp peak — only ~6 hours of strong activity. Best after midnight. Often missed due to narrow window and winter weather.' },
  { name: 'Lyrids',        peakMonth: 3,  peakDay: 22, endDay: 23, rate: 20,  radiant: 'E sky',     parent: 'Comet Thatcher', notes: 'Reliable spring shower. Occasional surprise outbursts of 100+/hr. Best after midnight when Vega is high.' },
  { name: 'Eta Aquariids',  peakMonth: 4,  peakDay: 5,  endDay: 6,  rate: 50,  radiant: 'SE sky',    parent: 'Comet Halley', notes: 'Better from southern latitudes. In the northern hemisphere, best in the pre-dawn hour. Fast meteors that leave persistent trains.' },
  { name: 'Perseids',      peakMonth: 7,  peakDay: 12, endDay: 13, rate: 100, radiant: 'NE sky',    parent: 'Comet Swift-Tuttle', notes: 'The most popular meteor shower. Warm summer nights, high rates, bright fireballs. Active Jul 17 – Aug 24 with broad peak. Best after midnight but visible from 10 PM.' },
  { name: 'Orionids',      peakMonth: 9,  peakDay: 21, endDay: 22, rate: 20,  radiant: 'SE sky',    parent: 'Comet Halley', notes: 'Fast meteors (66 km/s) that often leave glowing trains. Broad peak over several nights. Best after midnight.' },
  { name: 'Leonids',       peakMonth: 10, peakDay: 17, endDay: 18, rate: 15,  radiant: 'E sky',     parent: 'Comet Tempel-Tuttle', notes: 'Usually modest but produces legendary storms every ~33 years (next potential: 2031-2032). Best after midnight.' },
  { name: 'Geminids',      peakMonth: 11, peakDay: 13, endDay: 14, rate: 150, radiant: 'overhead',  parent: 'Asteroid Phaethon', notes: 'King of meteor showers. Highest rates of any annual shower. Visible from 9-10 PM — no need to stay up late. Bright, slow meteors. Bundle up.' },
  { name: 'Ursids',        peakMonth: 11, peakDay: 22, endDay: 23, rate: 10,  radiant: 'N sky',     parent: 'Comet Tuttle', notes: 'Minor shower near winter solstice. Low rates but occasionally surprises. Best after midnight.' },
];

/**
 * Get meteor showers that overlap with the trip dates.
 * Returns showers active within ±5 days of peak, with closeness to peak.
 */
function getActiveShowers(startDate, endDate) {
  if (!startDate || !endDate) return [];

  const start = new Date(startDate);
  const end = new Date(endDate);
  const year = start.getFullYear();
  const results = [];

  for (const shower of METEOR_SHOWERS) {
    // Build the peak date for the trip year
    const peakStart = new Date(year, shower.peakMonth, shower.peakDay);
    const peakEnd = new Date(year, shower.peakMonth, shower.endDay);

    // Active window: ±5 days around peak
    const windowStart = new Date(peakStart);
    windowStart.setDate(windowStart.getDate() - 5);
    const windowEnd = new Date(peakEnd);
    windowEnd.setDate(windowEnd.getDate() + 5);

    // Check overlap with trip dates
    if (start <= windowEnd && end >= windowStart) {
      // Calculate how close to peak the trip is
      const tripMid = new Date((start.getTime() + end.getTime()) / 2);
      const peakMid = new Date((peakStart.getTime() + peakEnd.getTime()) / 2);
      const daysFromPeak = Math.abs((tripMid - peakMid) / (1000 * 60 * 60 * 24));

      // Does the trip include the actual peak night?
      const includesPeak = start <= peakEnd && end >= peakStart;

      // Moon interference on peak night
      const moonOnPeak = getMoonPhase(peakStart);

      results.push({
        name: shower.name,
        peakDate: `${peakStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}–${peakEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
        rate: shower.rate,
        radiant: shower.radiant,
        notes: shower.notes,
        daysFromPeak: Math.round(daysFromPeak),
        includesPeak,
        moonInterference: moonOnPeak.illumination > 60 ? 'significant' : moonOnPeak.illumination > 30 ? 'moderate' : 'minimal',
        moonIllumination: moonOnPeak.illumination,
      });
    }
  }

  return results;
}

// ─── Milky Way Visibility ───────────────────────────────────

/**
 * Calculate Milky Way galactic core visibility for a given latitude and date.
 *
 * The galactic center sits at roughly RA 17h 46m, Dec -29°.
 * Visibility depends on:
 *   1. Whether the core rises above the horizon at this latitude
 *   2. Whether it's above the horizon during dark hours
 *   3. How high it gets (higher = better contrast)
 *
 * @param {number} latitude — degrees N (e.g., 37.3 for Zion)
 * @param {Date} date
 * @returns {{ visible, quality, bestViewingStart, bestViewingEnd, coreAltitude }}
 */
function getMilkyWayWindow(latitude, date) {
  const GC_RA = 17.767;   // hours (galactic center right ascension)
  const GC_DEC = -29.0;   // degrees (galactic center declination)
  const DEG = Math.PI / 180;

  // 1. Check if the core ever rises at this latitude
  //    Object rises if: -tan(lat) * tan(dec) is between -1 and 1
  const cosH = -Math.tan(latitude * DEG) * Math.tan(GC_DEC * DEG);

  if (cosH >= 1) {
    // Core never rises at this latitude
    return { visible: false, quality: 'not visible', bestViewingStart: null, bestViewingEnd: null, coreMaxAltitude: 0 };
  }

  // Half the time the core is above the horizon, in hours
  const H_rad = cosH <= -1 ? Math.PI : Math.acos(cosH);
  const H_hours = (H_rad / Math.PI) * 12;

  // Max altitude of galactic center
  const coreMaxAltitude = 90 - Math.abs(latitude - GC_DEC);

  // 2. Approximate Local Sidereal Time at midnight for this date
  const jan1 = new Date(date.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((date - jan1) / (1000 * 60 * 60 * 24));
  const lstMidnight = (dayOfYear * (24 / 365.25) + 6.6) % 24;

  // 3. Transit time of galactic center in local clock time
  let transitHour = ((GC_RA - lstMidnight) % 24 + 24) % 24;

  // Rise and set times (local clock hours, 0 = midnight)
  let riseHour = ((transitHour - H_hours) % 24 + 24) % 24;
  let setHour = ((transitHour + H_hours) % 24 + 24) % 24;

  // 4. Dark hours: approximate astronomical twilight
  //    Calibrated: summer ~10:20 PM – 3:35 AM, winter ~6:40 PM – 5:25 AM (at ~37°N)
  const dayAngle = ((dayOfYear - 172) / 365.25) * 2 * Math.PI; // 0 at summer solstice
  const darkStart = 20.5 + 2.0 * Math.cos(dayAngle);
  const darkEnd = 4.5 - 1.0 * Math.cos(dayAngle);

  // 5. Compute overlap of two circular intervals on a 24h clock
  //    Both "core above horizon" and "dark hours" may wrap around midnight.
  //    Unwrap each into a linear duration, then test offsets.
  const coreDur = ((setHour - riseHour) % 24 + 24) % 24 || 24;
  const darkDur = ((darkEnd - darkStart) % 24 + 24) % 24 || 24;

  let bestOverlap = 0;
  let bestOvStart = 0;
  let bestOvEnd = 0;

  for (const offset of [0, 24, -24]) {
    const cS = riseHour + offset;
    const cE = cS + coreDur;
    const dS = darkStart;
    const dE = darkStart + darkDur;

    const ovStart = Math.max(cS, dS);
    const ovEnd = Math.min(cE, dE);

    if (ovEnd > ovStart && (ovEnd - ovStart) > bestOverlap) {
      bestOverlap = ovEnd - ovStart;
      bestOvStart = ovStart;
      bestOvEnd = ovEnd;
    }
  }

  if (bestOverlap < 0.25) {
    return { visible: false, quality: 'not visible', bestViewingStart: null, bestViewingEnd: null, coreMaxAltitude: Math.round(coreMaxAltitude) };
  }

  const clockStart = ((bestOvStart % 24) + 24) % 24;
  const clockEnd = ((bestOvEnd % 24) + 24) % 24;

  // 6. Quality rating based on viewing window length and altitude
  let quality;
  if (bestOverlap >= 4 && coreMaxAltitude > 20) quality = 'peak';
  else if (bestOverlap >= 2 && coreMaxAltitude > 15) quality = 'good';
  else if (bestOverlap >= 0.5) quality = 'marginal';
  else quality = 'not visible';

  return {
    visible: true,
    quality,
    bestViewingStart: formatClockHour(clockStart),
    bestViewingEnd: formatClockHour(clockEnd),
    viewingHours: Math.round(bestOverlap * 10) / 10,
    coreMaxAltitude: Math.round(coreMaxAltitude),
  };
}

/** Format a decimal hour (0-24) as a clock string like "10:30 PM" */
function formatClockHour(h) {
  const hour24 = Math.floor(((h % 24) + 24) % 24);
  const minutes = Math.round((h % 1) * 60);
  const period = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  return `${hour12}:${String(minutes).padStart(2, '0')} ${period}`;
}

// ─── Combined Night Sky Conditions ──────────────────────────

/**
 * Assemble all night sky data for a destination and date range.
 * Combines dark sky data, moon phase, Milky Way, and meteor showers.
 */
function getNightSkyConditions(destination, startDate, endDate, moonPhase) {
  const darkSky = DARK_SKY_DATA[destination] || null;
  const coords = DESTINATION_COORDS[destination];

  // Milky Way — calculate for the middle of the trip
  let milkyWay = null;
  if (coords && startDate) {
    const tripStart = new Date(startDate);
    const tripEnd = endDate ? new Date(endDate) : tripStart;
    const midDate = new Date((tripStart.getTime() + tripEnd.getTime()) / 2);
    milkyWay = getMilkyWayWindow(coords.lat, midDate);

    // Factor in moon: if moon is bright, downgrade the Milky Way quality
    if (milkyWay.visible && moonPhase) {
      if (moonPhase.illumination > 70) {
        milkyWay.moonNote = 'Bright moon will wash out the Milky Way. Best viewing when moon is below horizon or in the hour before moonrise.';
        if (milkyWay.quality === 'peak') milkyWay.quality = 'good';
        else if (milkyWay.quality === 'good') milkyWay.quality = 'marginal';
      } else if (moonPhase.illumination > 40) {
        milkyWay.moonNote = 'Moderate moonlight — Milky Way visible but less dramatic. Wait for moon to set for best contrast.';
      }
    }
  }

  // Meteor showers
  const showers = getActiveShowers(startDate, endDate);

  return { darkSky, milkyWay, showers, moonPhase };
}

/**
 * Format night sky conditions into the Claude prompt block.
 */
function formatNightSkyForPrompt(nightSky) {
  if (!nightSky) return null;

  const lines = [];

  // Dark sky quality
  if (nightSky.darkSky) {
    const ds = nightSky.darkSky;
    const bortleDesc = ds.bortle <= 2 ? 'exceptional' : ds.bortle <= 3 ? 'excellent' : ds.bortle <= 4 ? 'good' : 'moderate';
    lines.push(`Dark sky quality: Bortle ${ds.bortle} (${bortleDesc})${ds.designation ? ` — ${ds.designation}` : ''}`);
    lines.push(`Best stargazing spots: ${ds.bestSpots.join(', ')}`);
    if (ds.notes) lines.push(`Notes: ${ds.notes}`);
  }

  // Moon (from existing celestial data)
  if (nightSky.moonPhase) {
    const m = nightSky.moonPhase;
    lines.push(`Moon: ${m.emoji} ${m.name}, ${m.illumination}% illumination — ${m.stargazing} stargazing conditions`);
  }

  // Milky Way
  if (nightSky.milkyWay) {
    const mw = nightSky.milkyWay;
    if (mw.visible) {
      lines.push(`Milky Way: Core visible, ${mw.quality} season. Best viewing ${mw.bestViewingStart} – ${mw.bestViewingEnd} (~${mw.viewingHours} hrs). Core reaches ${mw.coreMaxAltitude}° altitude.`);
      if (mw.moonNote) lines.push(`  ${mw.moonNote}`);
    } else {
      lines.push('Milky Way: Galactic core not visible during this period. Focus on constellations, planets, and any active meteor showers.');
    }
  }

  // Meteor showers
  if (nightSky.showers && nightSky.showers.length > 0) {
    for (const s of nightSky.showers) {
      let line = `Meteor shower: ${s.name} active (peak ${s.peakDate}).`;
      if (s.includesPeak) {
        line += ` Peak night falls during the trip! ~${s.rate} meteors/hr after midnight.`;
      } else {
        line += ` ~${Math.round(s.rate * 0.3)}-${Math.round(s.rate * 0.6)} meteors/hr (${s.daysFromPeak} days from peak).`;
      }
      line += ` Moon interference: ${s.moonInterference} (${s.moonIllumination}%). Best viewing: ${s.radiant}, after midnight.`;
      if (s.notes) line += ` ${s.notes}`;
      lines.push(line);
    }
  } else if (nightSky.milkyWay?.visible) {
    lines.push('Meteor showers: No major showers active during these dates.');
  }

  if (lines.length === 0) return null;

  // Add the instruction block
  lines.push('');
  lines.push('USE THIS DATA: When night sky conditions are good, suggest evening stargazing as an activity. Mention specific phenomena (Milky Way, meteor showers) by name. Reference the best spots from the list above. If moon is bright (>60% illumination), suggest moonlit activities instead (moonlit canyon walk, night photography of illuminated formations). If a meteor shower peaks during the trip, make it a highlight event.');

  return lines.join('\n');
}


// ============================================================
// MAIN: Assemble Full Context for Claude API Call
// ============================================================

/**
 * The main function. Call this from your API route.
 * 
 * @param {string} destination - e.g., 'zion'
 * @param {Object} userPreferences - From your onboarding flow
 * @param {string} userPreferences.dates.start - ISO date string
 * @param {string} userPreferences.dates.end - ISO date string
 * @param {string[]} userPreferences.wellness - e.g., ['yoga', 'breathwork', 'hiking']
 * @param {string} userPreferences.energy - 'gentle' | 'moderate' | 'adventurous'
 * @param {string} userPreferences.budget - 'budget' | 'mid-range' | 'premium'
 * @param {string} userPreferences.intention - Free text from onboarding
 * @param {string} userPreferences.groupType - 'solo' | 'couple' | 'friends' | 'family'
 * @param {string} userPreferences.name - Traveler's name
 */
export async function assembleContext(destination, userPreferences) {
  // 1. Load static curated content
  const guide = loadGuide(destination);
  const permits = loadPermits(destination);

  // 2. Fetch live data in parallel
  const hasExactDates = userPreferences.dates?.start && userPreferences.dates?.end;
  
  const [alerts, weather, celestial, tides] = await Promise.all([
    fetchNPSAlerts(destination),
    hasExactDates
      ? fetchWeather(destination, userPreferences.dates.start, userPreferences.dates.end)
      : Promise.resolve(null), // No weather fetch if only month selected
    hasExactDates
      ? fetchCelestial(destination, userPreferences.dates.start, userPreferences.dates.end)
      : Promise.resolve(null),
    hasExactDates
      ? fetchTideData(destination, userPreferences.dates.start, userPreferences.dates.end)
      : Promise.resolve(null),
  ]);

  // 3. Fetch corridor park alerts when territory suggests multi-park travel
  const corridorParks = CORRIDOR_PARKS[destination] || [];
  const shouldFetchCorridor = corridorParks.length > 0 &&
    ['flexible', 'nomadic', 'full-drift'].includes(userPreferences.territory) &&
    (userPreferences.duration || 4) >= 4;

  let corridorAlerts = null;
  if (shouldFetchCorridor) {
    const corridorResults = await Promise.all(
      corridorParks.map(async (park) => {
        const parkAlerts = await fetchNPSAlerts(park);
        return parkAlerts ? `**${park}**: ${parkAlerts}` : null;
      })
    );
    const validAlerts = corridorResults.filter(Boolean);
    corridorAlerts = validAlerts.length > 0 ? validAlerts.join('\n\n') : null;
  }

  // 4. Generate matching instructions from preferences
  const matchingInstructions = generateMatchingInstructions(userPreferences, destination);

  // 5. Compute night sky conditions (uses moon phase from celestial + static dark sky data)
  const moonPhase = celestial?.moonPhase || (hasExactDates ? null : getMoonPhase(new Date()));
  const nightSky = getNightSkyConditions(
    destination,
    hasExactDates ? userPreferences.dates.start : null,
    hasExactDates ? userPreferences.dates.end : null,
    moonPhase,
  );

  // 6. Assemble the context block that goes into the Claude prompt
  const context = {
    guide,
    permits: formatPermitsForPrompt(permits),
    nightSky: formatNightSkyForPrompt(nightSky),
    tides: formatTidesForPrompt(tides),
    liveData: {
      alerts: alerts || null,
      corridorAlerts,
      weather: formatWeatherForPrompt(weather),
      celestial: formatCelestialForPrompt(celestial),
      celestialRaw: celestial,
      weatherRaw: weather,
    },
    traveler: userPreferences,
    matchingInstructions,
  };

  return context;
}


// ============================================================
// BUILD THE CLAUDE API MESSAGE
// ============================================================

/**
 * Construct the full message payload for the Anthropic API.
 */
export function buildClaudeMessage(context, systemPrompt) {
  // Destination guide — static per destination, cached separately
  const guideBlock = `## Destination Guide (ONLY recommend from this content)\n\n${context.guide}`;

  // Live data + traveler profile — changes every call, not cached
  // Build live data sections, skipping any that are null/empty
  const liveSections = [];

  if (context.liveData.alerts) {
    liveSections.push(`### Current Park Alerts\n${context.liveData.alerts}`);
  }
  if (context.liveData.corridorAlerts) {
    liveSections.push(`### Corridor Park Alerts\n${context.liveData.corridorAlerts}`);
  }
  if (context.liveData.weather) {
    liveSections.push(`### Weather Forecast for Travel Dates\n${context.liveData.weather}`);
  }
  if (context.liveData.celestial) {
    liveSections.push(`### Celestial Data\n${context.liveData.celestial}`);
  }
  if (context.permits) {
    liveSections.push(`### Permits & Reservations\nThe following activities require permits or advance reservations. When recommending any of these, ALWAYS mention the permit requirement, where to get it, and advise the traveler to book in advance.\n\n${context.permits}`);
  }
  if (context.nightSky) {
    liveSections.push(`### Night Sky Conditions\n${context.nightSky}`);
  }
  if (context.tides) {
    liveSections.push(`### Tide Predictions\n${context.tides}`);
  }

  const liveMessage = `
## Live Data

${liveSections.join('\n\n')}

---

## Traveler Profile

- **Name**: ${context.traveler.name || 'Traveler'}
- **Dates**: ${context.traveler.dates?.start ? `${context.traveler.dates.start} to ${context.traveler.dates.end}` : `Month: ${context.traveler.month || 'Not specified'}`}
- **Trip length**: ${context.traveler.duration || 4} days
- **Wellness interests**: ${context.traveler.wellness?.join(', ') || context.traveler.interests?.map(i => i).join(', ') || 'Not specified'}
- **Energy level**: ${context.traveler.energy}
- **Pacing**: ${context.traveler.pacing != null ? (context.traveler.pacing < 25 ? 'Spacious (few activities, lots of open time)' : context.traveler.pacing < 50 ? 'Unhurried (moderate structure, built-in rest)' : context.traveler.pacing < 75 ? 'Balanced (mix of activity and downtime)' : 'Full (packed days, maximize every moment)') : 'Balanced'}
- **Practice level**: ${context.traveler.practiceLevel != null ? ['Curious beginner', 'Dabbler', 'Regular practitioner', 'Dedicated practitioner'][context.traveler.practiceLevel] || 'Curious beginner' : 'Not specified'}
- **Territory**: ${context.traveler.territory || 'rooted'}
- **Stay style**: ${context.traveler.stayStyle || 'Not specified'}
- **Budget**: ${context.traveler.budget}
- **Group**: ${context.traveler.groupType}${context.traveler.groupSize > 1 ? ` (${context.traveler.groupSize} people)` : ''}
- **Intention**: ${context.traveler.intention}

---

## Matching Instructions (follow these precisely)

${context.matchingInstructions || 'Use the traveler profile above to personalize recommendations from the guide.'}

---

Please create a personalized day-by-day itinerary for this traveler based on the destination guide above. Follow all rules in your system prompt. Only recommend places, trails, restaurants, and experiences that appear in the guide. Account for the weather forecast and any active alerts. Follow the matching instructions to select content that fits this specific traveler.
`.trim();

  // Scale token budget with trip length: ~2200 tokens per day + 1500 for framing
  const days = context.traveler.duration || 4;
  const max_tokens = Math.min(1500 + days * 2200, 16000);

  return {
    model: 'claude-sonnet-4-6',
    max_tokens,
    system: [
      { type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } },
    ],
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: guideBlock, cache_control: { type: 'ephemeral' } },
          { type: 'text', text: liveMessage },
        ],
      },
    ],
  };
}
