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
  'joshua-tree': 'jotr',
  'big-sur': null, // Not an NPS unit — no NPS API data
  'olympic-peninsula': 'olym',
  kauai: null, // State parks, not NPS
};

// Open-Meteo coordinates for weather forecasts
const DESTINATION_COORDS = {
  zion: { lat: 37.2982, lon: -113.0263 },
  'joshua-tree': { lat: 33.8734, lon: -115.9010 },
  'big-sur': { lat: 36.2704, lon: -121.8081 },
  'olympic-peninsula': { lat: 47.8021, lon: -123.6044 },
  kauai: { lat: 22.0964, lon: -159.5261 },
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
      `&timezone=America/Denver`
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
  if (!weatherData) return 'Weather forecast not available. Suggest traveler check closer to trip dates.';
  
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
      `&timezone=America/Denver`
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
        sunrise: formatTime(daily.sunrise[i]),
        sunset: formatTime(daily.sunset[i]),
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
function formatTime(isoString) {
  if (!isoString) return null;
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/Denver',
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
  if (!celestialData) return 'Celestial data not available.';

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
  
  const [alerts, weather, campgrounds, celestial] = await Promise.all([
    fetchNPSAlerts(destination),
    hasExactDates 
      ? fetchWeather(destination, userPreferences.dates.start, userPreferences.dates.end)
      : Promise.resolve(null), // No weather fetch if only month selected
    fetchNPSCampgrounds(destination),
    hasExactDates
      ? fetchCelestial(destination, userPreferences.dates.start, userPreferences.dates.end)
      : Promise.resolve(null),
  ]);

  // 3. Generate matching instructions from preferences
  const matchingInstructions = generateMatchingInstructions(userPreferences);

  // 4. Assemble the context block that goes into the Claude prompt
  const context = {
    guide,
    permits: formatPermitsForPrompt(permits),
    liveData: {
      alerts: alerts || 'No alert data available.',
      weather: formatWeatherForPrompt(weather),
      celestial: formatCelestialForPrompt(celestial),
      celestialRaw: celestial,
      weatherRaw: weather,
      campgrounds: campgrounds ? JSON.stringify(campgrounds, null, 2) : null,
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
  const userMessage = `
## Destination Guide (ONLY recommend from this content)

${context.guide}

---

## Live Data

### Current Park Alerts
${context.liveData.alerts}

### Weather Forecast for Travel Dates
${context.liveData.weather}

### Celestial Data
${context.liveData.celestial}

${context.liveData.campgrounds ? `### Campground Data\n${context.liveData.campgrounds}` : ''}

${context.permits ? `### Permits & Reservations\nThe following activities require permits or advance reservations. When recommending any of these, ALWAYS mention the permit requirement, where to get it, and advise the traveler to book in advance.\n\n${context.permits}` : ''}

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

  return {
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 12000,
    system: systemPrompt,
    messages: [
      { role: 'user', content: userMessage }
    ],
  };
}
