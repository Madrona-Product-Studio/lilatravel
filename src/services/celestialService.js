// ═══════════════════════════════════════════════════════════════════════════════
// CELESTIAL SERVICE — live conditions for the Celestial Snapshot sidebar
// ═══════════════════════════════════════════════════════════════════════════════
//
// Aggregates weather, sun, moon, night sky, river level, celestial events,
// and NPS alerts into a single snapshot object. Uses Promise.allSettled so
// partial API failures degrade gracefully (null sections are hidden in the UI).
//

import { CELESTIAL_CONFIG } from '@data/celestialConfig';


// ─── Weather Code Labels ─────────────────────────────────────────────────────

const WEATHER_LABELS = {
  0: "Clear", 1: "Mostly Clear", 2: "Partly Cloudy", 3: "Overcast",
  45: "Foggy", 48: "Freezing Fog",
  51: "Light Drizzle", 53: "Drizzle", 55: "Heavy Drizzle",
  61: "Light Rain", 63: "Rain", 65: "Heavy Rain",
  71: "Light Snow", 73: "Snow", 75: "Heavy Snow",
  80: "Showers", 81: "Mod. Showers", 82: "Heavy Showers",
  95: "Thunderstorm", 96: "Thunderstorm + Hail",
};


// ─── Celestial Events Calendar ───────────────────────────────────────────────

const CELESTIAL_EVENTS = [
  { month: 1, day: 3, name: "Quadrantid Meteor Shower", detail: "Up to 120 meteors/hr. Best before dawn." },
  { month: 3, day: 20, name: "Spring Equinox", detail: "Equal day and night. Sacred transition point." },
  { month: 4, day: 22, name: "Lyrid Meteor Shower", detail: "Up to 20 meteors/hr at peak. Best after midnight." },
  { month: 5, day: 6, name: "Eta Aquariid Meteor Shower", detail: "Debris from Halley's Comet. Best before dawn." },
  { month: 6, day: 20, name: "Summer Solstice", detail: "Longest day. Canyon light at its most dramatic." },
  { month: 7, day: 28, name: "Delta Aquariid Meteor Shower", detail: "Up to 25 meteors/hr. Warm night viewing." },
  { month: 8, day: 12, name: "Perseid Meteor Shower", detail: "The year's best — up to 100 meteors/hr. Peak viewing after 10 PM." },
  { month: 9, day: 22, name: "Autumn Equinox", detail: "Light shifts. Cottonwoods begin to turn." },
  { month: 10, day: 21, name: "Orionid Meteor Shower", detail: "Up to 20 meteors/hr. Another gift from Halley's Comet." },
  { month: 12, day: 13, name: "Geminid Meteor Shower", detail: "Up to 150 meteors/hr. Best show of the year — dress warm." },
  { month: 12, day: 21, name: "Winter Solstice", detail: "Shortest day. Most dramatic canyon light of the year." },
];


// ─── Sky Quality Labels ──────────────────────────────────────────────────────

const QUALITY_LABELS = { 5: "Extraordinary", 4: "Exceptional", 3: "Good", 2: "Fair", 1: "Washed Out" };


// ─── Milky Way Windows (Zion-specific rough estimates) ───────────────────────

const MW_WINDOWS = {
  3: "4:00 AM – 5:30 AM", 4: "2:30 AM – 5:00 AM", 5: "12:30 AM – 4:30 AM",
  6: "10:30 PM – 3:30 AM", 7: "9:30 PM – 2:30 AM", 8: "9:00 PM – 1:30 AM",
  9: "8:30 PM – 12:30 AM", 10: "8:00 PM – 10:30 PM",
};


// ─── Weather (Open-Meteo) ────────────────────────────────────────────────────

async function fetchWeather(lat, lon, timezone = "America/Denver") {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: "temperature_2m,weather_code,wind_speed_10m",
    daily: "temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset",
    temperature_unit: "fahrenheit",
    wind_speed_unit: "mph",
    timezone,
    forecast_days: 1,
  });
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!res.ok) throw new Error("Weather fetch failed");
  return res.json();
}


// ─── Sun (extracted from Open-Meteo response) ───────────────────────────────

function extractSunData(weatherResult, now, timezone = "America/Denver") {
  if (weatherResult.status !== "fulfilled") return null;
  const d = weatherResult.value.daily;
  const riseISO = d.sunrise[0]; // e.g. "2026-03-08T06:52"
  const setISO = d.sunset[0];   // e.g. "2026-03-08T18:25"

  // Parse directly — Open-Meteo already returns local times in the requested timezone
  const fmtDirect = (iso) => {
    const [, time] = iso.split("T");
    const [h, m] = time.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${h12}:${String(m).padStart(2, "0")} ${period}`;
  };

  // Daylight duration from raw hour/minute values
  const [rH, rM] = riseISO.split("T")[1].split(":").map(Number);
  const [sH, sM] = setISO.split("T")[1].split(":").map(Number);
  const diffMin = (sH * 60 + sM) - (rH * 60 + rM);
  const hours = Math.floor(diffMin / 60);
  const mins = diffMin % 60;

  // Progress through the day using current time in the destination timezone
  const nowLocal = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
  const nowMinutes = nowLocal.getHours() * 60 + nowLocal.getMinutes();
  const riseMinutes = rH * 60 + rM;
  const setMinutes = sH * 60 + sM;
  const progress = Math.max(0, Math.min(1, (nowMinutes - riseMinutes) / (setMinutes - riseMinutes)));

  return {
    rise: fmtDirect(riseISO),
    set: fmtDirect(setISO),
    daylight: `${hours}h ${mins}m`,
    progress,
  };
}


// ─── Moon Phase (synodic calculation) ────────────────────────────────────────

function getMoonPhase(date) {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  const day = date.getDate();

  if (month <= 2) { year--; month += 12; }
  const c = Math.floor(365.25 * year);
  const e = Math.floor(30.6001 * (month + 1));
  let jd = c + e + day - 694039.09;
  jd /= 29.5305882;
  const b = Math.floor(jd);
  jd -= b;
  const age = Math.round(jd * 29.5305882);
  const phase = Math.round((1 - Math.cos(jd * 2 * Math.PI)) / 2 * 100);

  const names = [
    "New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous",
    "Full Moon", "Waning Gibbous", "Last Quarter", "Waning Crescent",
  ];

  // Derive phase name from illumination + waxing/waning to stay consistent
  const isWaxing = jd < 0.5;
  let idx;
  if (phase <= 2)                     idx = 0; // New Moon
  else if (phase < 48 && isWaxing)    idx = 1; // Waxing Crescent
  else if (phase <= 52 && isWaxing)   idx = 2; // First Quarter
  else if (phase < 98 && isWaxing)    idx = 3; // Waxing Gibbous
  else if (phase >= 98)               idx = 4; // Full Moon
  else if (phase > 52 && !isWaxing)   idx = 5; // Waning Gibbous
  else if (phase >= 48 && !isWaxing)  idx = 6; // Last Quarter
  else                                idx = 7; // Waning Crescent

  return { phase, name: names[idx], age };
}


// ─── Night Sky Quality ───────────────────────────────────────────────────────

function getSkyQuality(bortleClass, moonIllumination, month) {
  const bortleScore = Math.max(1, 6 - bortleClass);
  const moonPenalty = (moonIllumination / 100) * 2;
  const quality = Math.max(1, Math.min(5, Math.round(bortleScore - moonPenalty)));

  const coreVisible = month >= 3 && month <= 10;
  const goodViewing = moonIllumination < 40;

  let milkyWay;
  if (!coreVisible) {
    milkyWay = { visible: false };
  } else if (!goodViewing) {
    milkyWay = { visible: true, note: "Moonlight may wash out fainter details" };
  } else {
    milkyWay = { visible: true, window: MW_WINDOWS[month] || null };
  }

  return {
    bortle: bortleClass,
    quality,
    label: QUALITY_LABELS[quality],
    milkyWayVisible: milkyWay.visible,
    milkyWayWindow: milkyWay.window || null,
    milkyWayNote: milkyWay.note || null,
  };
}


// ─── River Level (USGS Water Services) ───────────────────────────────────────

async function getRiverLevel(siteId = "09405500") {
  const url = `https://waterservices.usgs.gov/nwis/iv/?sites=${siteId}&parameterCd=00060,00010&format=json&period=P1D`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("USGS fetch failed");
  const data = await res.json();

  const series = data.value.timeSeries;
  const discharge = series.find(s => s.variable.variableCode[0].value === "00060");
  const temp = series.find(s => s.variable.variableCode[0].value === "00010");

  const cfs = parseFloat(discharge?.values[0]?.value[0]?.value || 0);
  const tempC = parseFloat(temp?.values[0]?.value[0]?.value || 0);
  const tempF = Math.round(tempC * 9 / 5 + 32);

  let level, label;
  if (cfs < 50) { level = "low"; label = "Low — Narrows ideal"; }
  else if (cfs < 150) { level = "moderate"; label = "Moderate — Narrows accessible"; }
  else if (cfs < 300) { level = "high"; label = "High — Narrows caution"; }
  else { level = "dangerous"; label = "Dangerous — Narrows closed"; }

  return { level, cfs: Math.round(cfs), label, tempF };
}


// ─── Next Celestial Event ────────────────────────────────────────────────────

function getNextCelestialEvent() {
  const now = new Date();
  const thisYear = now.getFullYear();

  for (const evt of CELESTIAL_EVENTS) {
    const date = new Date(thisYear, evt.month - 1, evt.day);
    if (date > now) {
      const daysAway = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
      const formatted = date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
      return { ...evt, date: formatted, daysAway };
    }
  }
  // Wrap to next year
  const first = CELESTIAL_EVENTS[0];
  const date = new Date(thisYear + 1, first.month - 1, first.day);
  const daysAway = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
  return { ...first, date: date.toLocaleDateString("en-US", { month: "long", day: "numeric" }), daysAway };
}


// ─── NPS Alerts ──────────────────────────────────────────────────────────────

async function fetchNPSAlerts(parkCode) {
  const res = await fetch(
    `/api/nps-proxy?endpoint=alerts&parkCode=${encodeURIComponent(parkCode)}`
  );
  if (!res.ok) throw new Error("NPS fetch failed");
  const data = await res.json();
  return (data.data || []).map(a => ({
    title: a.title,
    description: a.description || '',
    category: a.category || 'Information',
  }));
}


// ─── Season Labels ───────────────────────────────────────────────────────

const SEASON_LABELS = {
  1: "Deep Winter", 2: "Late Winter", 3: "Early Spring",
  4: "Spring", 5: "Late Spring", 6: "Early Summer",
  7: "High Summer", 8: "Late Summer", 9: "Early Autumn",
  10: "Autumn", 11: "Late Autumn", 12: "Early Winter",
};


// ─── Monthly Snapshot (pure — no API calls) ─────────────────────────────

export function getMonthlySnapshot(month, year) {
  if (!month || month < 1 || month > 12) return null;
  const yr = year || new Date().getFullYear();

  // Events happening this month
  const events = CELESTIAL_EVENTS.filter(e => e.month === month);

  // Find New Moon and Full Moon days by iterating the month
  const daysInMonth = new Date(yr, month, 0).getDate();
  let newMoon = null;
  let fullMoon = null;

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(yr, month - 1, d);
    const mp = getMoonPhase(date);
    if (!newMoon && mp.name === "New Moon") {
      newMoon = { day: d, label: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) };
    }
    if (!fullMoon && mp.name === "Full Moon") {
      fullMoon = { day: d, label: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) };
    }
  }

  // Milky Way window for the month
  const milkyWayWindow = MW_WINDOWS[month] || null;

  return {
    events,
    newMoon,
    fullMoon,
    milkyWayWindow,
    seasonLabel: SEASON_LABELS[month],
  };
}


// ─── Orchestrator ────────────────────────────────────────────────────────────

export async function getCelestialSnapshot(destinationKey = "zion") {
  const config = CELESTIAL_CONFIG[destinationKey];
  const now = new Date();

  const [weatherData, riverData, alertsData] = await Promise.allSettled([
    fetchWeather(config.lat, config.lon, config.timezone),
    getRiverLevel(config.usgsSiteId),
    fetchNPSAlerts(config.parkCode),
  ]);

  const moonData = getMoonPhase(now);
  const sunData = extractSunData(weatherData, now, config.timezone);
  const skyData = getSkyQuality(config.bortleClass, moonData.phase, now.getMonth() + 1);
  const nextEvent = getNextCelestialEvent();

  // Build weather return shape
  let weather = null;
  if (weatherData.status === "fulfilled") {
    const cur = weatherData.value.current;
    const daily = weatherData.value.daily;
    weather = {
      temp: Math.round(cur.temperature_2m),
      high: Math.round(daily.temperature_2m_max[0]),
      low: Math.round(daily.temperature_2m_min[0]),
      condition: WEATHER_LABELS[cur.weather_code] || "Unknown",
      wind: Math.round(cur.wind_speed_10m),
      weatherCode: cur.weather_code,
    };
  }

  return {
    destinationName: config.name,
    weather,
    sun: sunData,
    moon: moonData,
    sky: skyData,
    river: riverData.status === "fulfilled" ? riverData.value : null,
    nextEvent,
    alerts: alertsData.status === "fulfilled" ? alertsData.value : [],
    npsAlerts: alertsData.status === "fulfilled" ? alertsData.value : [],
    fetchedAt: now.toISOString(),
  };
}
