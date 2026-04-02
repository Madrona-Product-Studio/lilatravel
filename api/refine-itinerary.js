/**
 * Lila Trips — Itinerary Refinement API Route
 *
 * Vercel serverless function.
 * File location: /api/refine-itinerary.js
 *
 * POST /api/refine-itinerary
 * Body: { itinerary, lockedItems, swappedActivities, dayFeedback, pulse, overallNote, formData }
 *
 * Accepts the current itinerary + user feedback and returns
 * a revised itinerary via the Claude API.
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { checkOrigin } from './_utils.js';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const systemPrompt = fs.readFileSync(
  path.join(process.cwd(), 'prompts', 'system-prompt.md'),
  'utf-8'
);

/**
 * Build the per-day feedback summary for the refinement prompt.
 * Only includes days that have feedback — approved or adjust.
 */
function buildFeedbackSummary(dayFeedback, days) {
  if (!dayFeedback || Object.keys(dayFeedback).length === 0) return '';

  const lines = Object.entries(dayFeedback).map(([index, fb]) => {
    const i = Number(index);
    const dayLabel = days?.[i]?.label || `Day ${i + 1}`;
    const dayTitle = days?.[i]?.title || '';

    // Support both legacy status-based and current reaction-based feedback
    const isApproved = fb.status === 'approved' || fb.reaction === 'spot-on';
    const isAdjust = fb.status === 'adjust' || fb.reaction === 'needs-work';

    if (isApproved) {
      return `- **${dayLabel}** ("${dayTitle}"): APPROVED — traveler is happy, preserve this day as-is.`;
    }
    if (isAdjust) {
      return `- **${dayLabel}** ("${dayTitle}"): ADJUST${fb.note ? ` — traveler note: "${fb.note}"` : ''}`;
    }
    // If there's a note but no explicit reaction, still include it
    if (fb.note) {
      return `- **${dayLabel}** ("${dayTitle}"): traveler note: "${fb.note}"`;
    }
    return null;
  }).filter(Boolean);

  return lines.join('\n');
}

/**
 * Build the locked-items summary for the refinement prompt.
 * lockedItems is a map of { [thumbId]: { source, bookingType? } }.
 * Keys look like day_0_timeline_2 or day_1_pick_0.
 */
function buildLockedItemsSummary(lockedItems, days) {
  if (!lockedItems || Object.keys(lockedItems).length === 0) return '';

  const lines = Object.keys(lockedItems).map(key => {
    const match = key.match(/^day_(\d+)_(timeline|pick)_(\d+)$/);
    if (!match) return null;
    const [, dayIdx, type, itemIdx] = match;
    const day = days?.[Number(dayIdx)];
    const dayLabel = day?.label || `Day ${Number(dayIdx) + 1}`;

    let itemName = '';
    if (type === 'timeline') {
      itemName = day?.timeline?.[Number(itemIdx)]?.title || `activity ${Number(itemIdx) + 1}`;
    } else {
      const pick = day?.picks?.[Number(itemIdx)];
      itemName = pick?.pick?.name || `${pick?.category || 'pick'} ${Number(itemIdx) + 1}`;
    }

    return `- **${dayLabel}**, ${itemName}: LOCKED — do not remove, reschedule, or replace`;
  }).filter(Boolean);

  return lines.join('\n');
}

/**
 * Build the swapped-activities summary for the refinement prompt.
 * swappedActivities is a map of { [thumbId]: { from, to, toSummary, note } }.
 */
function buildSwappedSummary(swappedActivities, days) {
  if (!swappedActivities || Object.keys(swappedActivities).length === 0) return '';

  const lines = Object.entries(swappedActivities).map(([key, swap]) => {
    const match = key.match(/^day_(\d+)_(timeline|pick)_(\d+)$/);
    if (!match) return null;
    const [, dayIdx] = match;
    const day = days?.[Number(dayIdx)];
    const dayLabel = day?.label || `Day ${Number(dayIdx) + 1}`;

    let line = `- **${dayLabel}**: Replace "${swap.from}" with "${swap.to}"`;
    if (swap.note) line += ` — traveler note: "${swap.note}"`;
    return line;
  }).filter(Boolean);

  return lines.join('\n');
}

/**
 * Build the bookings summary for the refinement prompt.
 * Formats flights/rentals/accommodations into readable constraints.
 */
function buildBookingsSummary(tripLogistics) {
  if (!tripLogistics) return '';
  const { flights = [], rentals = [], accommodations = [], reservations = [] } = tripLogistics;
  if (flights.length === 0 && rentals.length === 0 && accommodations.length === 0 && reservations.length === 0) return '';

  const lines = [];

  flights.forEach((f, i) => {
    const label = flights.length === 2 ? (i === 0 ? 'Outbound flight' : 'Return flight') : `Flight ${i + 1}`;
    const parts = [f.airline, f.flightNumber].filter(Boolean).join(' ');
    const route = f.departureAirport && f.arrivalAirport ? `${f.departureAirport} → ${f.arrivalAirport}` : '';
    const timing = [f.date, f.departureTime ? `departs ${f.departureTime}` : '', f.arrivalTime ? `arrives ${f.arrivalTime}` : ''].filter(Boolean).join(', ');
    lines.push(`- **${label}**: ${[parts, route, timing].filter(Boolean).join(' · ')}`);
  });

  rentals.forEach((r, i) => {
    const label = rentals.length > 1 ? `Rental ${i + 1}` : 'Rental car';
    const parts = [r.company, r.confirmationNumber ? `Conf: ${r.confirmationNumber}` : ''].filter(Boolean).join(' · ');
    const dates = [r.pickupDate, r.returnDate].filter(Boolean).join(' → ');
    lines.push(`- **${label}**: ${[parts, r.pickupLocation, dates].filter(Boolean).join(' · ')}`);
  });

  accommodations.forEach((a, i) => {
    const label = accommodations.length > 1 ? `Accommodation ${i + 1}` : 'Accommodation';
    const dates = a.checkIn && a.checkOut ? `${a.checkIn} → ${a.checkOut}` : '';
    lines.push(`- **${label}**: ${[a.name, dates, a.confirmationNumber ? `Conf: ${a.confirmationNumber}` : ''].filter(Boolean).join(' · ')}`);
  });

  reservations.forEach((r, i) => {
    const label = reservations.length > 1 ? `Reservation ${i + 1}` : 'Reservation';
    const details = [r.name, r.type, r.date, r.time, r.notes].filter(Boolean).join(' · ');
    lines.push(`- **${label}**: ${details}`);
  });

  // Conditional context: airport → destination drive note
  if (flights.length > 0) {
    const outbound = flights[0];
    const arrivalAirport = outbound.arrivalAirport;
    if (arrivalAirport) {
      lines.push(`- ⚠ The arrival airport (${arrivalAirport}) may require a significant drive to the destination area. Factor this drive into Day 1's timeline as the opening arc.`);
    }
  }

  // Conditional context: multi-property transition note
  if (accommodations.length >= 2) {
    const hasDates = accommodations.some(a => a.checkIn || a.checkOut);
    if (hasDates) {
      lines.push(`- ⚠ Multiple accommodations are booked. On each changeover day (check-out from one → check-in to next), include the transition as a timeline event: pack up, drive, check in, settle in.`);
    }
  }

  // Conditional context: reservations are fixed events
  if (reservations.length > 0) {
    const datedReservations = reservations.filter(r => r.date);
    if (datedReservations.length > 0) {
      lines.push(`- ⚠ The traveler has ${datedReservations.length} confirmed reservation(s) on specific dates/times. These are FIXED timeline events — build the rest of the day around them, not the reverse.`);
    }
  }

  return lines.join('\n');
}

/**
 * Known drive time estimates between common location pairs (minutes).
 * Keys are normalized "from|to" pairs. Checked bidirectionally.
 */
const DRIVE_TIMES = {
  'oakland|monterey': 130, 'oak|monterey': 130,
  'san francisco|monterey': 140, 'sfo|monterey': 140,
  'san jose|monterey': 80, 'sjc|monterey': 80,
  'monterey|big sur': 90, 'monterey|big sur area': 90,
  'monterey|carmel': 10, 'carmel|big sur': 75,
  'las vegas|zion': 170, 'las|zion': 170, 'las|springdale': 170,
  'las vegas|springdale': 170,
  'lax|joshua tree': 160, 'ont|joshua tree': 100,
  'lax|twentynine palms': 170, 'ont|twentynine palms': 110,
  'ogg|kauai': null, // inter-island flight, not a drive
  'lih|poipu': 35, 'lih|princeville': 45, 'lih|kapaa': 20,
  'sea|olympic peninsula': 150, 'sea|port angeles': 160,
  'sfo|big sur': 180, 'oak|big sur': 190, 'sjc|big sur': 150,
  'monterey|pacific grove': 10, 'big sur|san simeon': 60,
  'yvr|tofino': 300, 'yvr|ucluelet': 290, 'yvr|victoria': 90,
  'victoria|tofino': 240,
};

function lookupDriveTime(from, to) {
  if (!from || !to) return null;
  const a = from.toLowerCase().trim();
  const b = to.toLowerCase().trim();
  // Try both directions
  const key1 = `${a}|${b}`;
  const key2 = `${b}|${a}`;
  if (DRIVE_TIMES[key1] !== undefined) return DRIVE_TIMES[key1];
  if (DRIVE_TIMES[key2] !== undefined) return DRIVE_TIMES[key2];
  // Try partial matching: check if either location contains a key token
  for (const [k, v] of Object.entries(DRIVE_TIMES)) {
    const [kA, kB] = k.split('|');
    if ((a.includes(kA) || kA.includes(a)) && (b.includes(kB) || kB.includes(b))) return v;
    if ((a.includes(kB) || kB.includes(a)) && (b.includes(kA) || kA.includes(b))) return v;
  }
  return null;
}

function formatDriveTime(minutes) {
  if (!minutes) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `~${m} min`;
  if (m === 0) return `~${h} hr${h > 1 ? 's' : ''}`;
  return `~${h}.${Math.round(m / 6)}–${h + 1} hrs`;
}

/**
 * Extract a city name from an accommodation's address or name.
 * Tries address first (looks for "City, State" pattern), falls back to
 * extracting location hints from the hotel name.
 */
function extractCity(accommodation) {
  if (!accommodation) return null;
  const addr = accommodation.address || '';
  // Try "City, ST" or "City, State" pattern from address
  const cityStateMatch = addr.match(/,\s*([A-Za-z\s]+),\s*[A-Z]{2}\b/);
  if (cityStateMatch) return cityStateMatch[1].trim();
  // Try last component before ZIP
  const beforeZip = addr.match(/,\s*([A-Za-z\s]+)\s+\d{5}/);
  if (beforeZip) return beforeZip[1].trim();
  // Extract from name — common patterns like "Hotel Name, City" or "Hotel Name - City"
  const nameParts = (accommodation.name || '').split(/[,\-–—·]/).map(s => s.trim());
  if (nameParts.length > 1) {
    const lastPart = nameParts[nameParts.length - 1];
    // If the last part looks like a city (not too long, no numbers)
    if (lastPart.length < 30 && !/\d/.test(lastPart)) return lastPart;
  }
  return null;
}

/**
 * Map airport codes to city names for known airports.
 */
const AIRPORT_CITIES = {
  OAK: 'Oakland', SFO: 'San Francisco', SJC: 'San Jose',
  LAX: 'Los Angeles', ONT: 'Ontario', BUR: 'Burbank', LGB: 'Long Beach', SNA: 'Orange County',
  LAS: 'Las Vegas', OGG: 'Kahului (Maui)', LIH: 'Lihue (Kauai)',
  SEA: 'Seattle', PDX: 'Portland', YVR: 'Vancouver', BLI: 'Bellingham',
  SLC: 'Salt Lake City', PHX: 'Phoenix', DEN: 'Denver',
  JFK: 'New York', EWR: 'Newark', LGA: 'New York',
  ORD: 'Chicago', ATL: 'Atlanta', DFW: 'Dallas', IAH: 'Houston',
  MCI: 'Kansas City', MSP: 'Minneapolis', DTW: 'Detroit', BOS: 'Boston',
};

function airportCity(code) {
  if (!code) return null;
  return AIRPORT_CITIES[code.toUpperCase().trim()] || code;
}

/**
 * Build a day-by-day location scaffold from logistics + itinerary data.
 * This gives Claude explicit geographic anchoring for each day.
 */
function buildLocationScaffold(tripLogistics, parsedItinerary) {
  if (!tripLogistics) return '';
  const { flights = [], accommodations = [], rentals = [], reservations = [] } = tripLogistics;
  const numDays = parsedItinerary?.days?.length || 0;
  if (numDays === 0) return '';
  if (flights.length === 0 && accommodations.length === 0 && reservations.length === 0) return '';

  // Sort accommodations by check-in date
  const sortedAccom = [...accommodations]
    .filter(a => a.name)
    .sort((a, b) => {
      if (!a.checkIn) return 1;
      if (!b.checkIn) return -1;
      return new Date(a.checkIn) - new Date(b.checkIn);
    });

  if (sortedAccom.length === 0 && flights.length === 0 && reservations.length === 0) return '';

  const lines = [];
  lines.push('## ITINERARY STRUCTURE — TREAT AS HARD CONSTRAINTS\n');
  lines.push('The following day-by-day location scaffold is derived from the traveler\'s confirmed bookings. **Each day\'s activities MUST be anchored to the location specified below.** Do not place activities in a different city than where the traveler is staying that night. Confirmed reservations and bookings are FIXED events — schedule other activities around them, not the reverse.\n');
  lines.push('**IMPORTANT:** When a hotel/accommodation city is not explicitly listed, use your knowledge of the property to determine its geographic location (city/area) and anchor that day\'s activities accordingly. For example, "Asilomar Conference Grounds" is in Pacific Grove near Monterey, "Glen Oaks Big Sur" is in Big Sur, etc.\n');

  // Determine arrival info
  const outbound = flights.length > 0 ? flights[0] : null;
  const returnFlight = flights.length >= 2 ? flights[1] : null;
  const arrivalAirport = outbound?.arrivalAirport || null;
  const arrivalAirportCity = airportCity(arrivalAirport);
  const departureAirport = returnFlight?.departureAirport || outbound?.departureAirport || arrivalAirport;
  const departureAirportCity = airportCity(departureAirport);

  // Build accommodation schedule: which hotel covers which days
  // If we have dates, use them. Otherwise, split days evenly.
  const hotel1 = sortedAccom[0] || null;
  const hotel2 = sortedAccom.length >= 2 ? sortedAccom[1] : null;
  const hotel1City = extractCity(hotel1);
  const hotel2City = hotel2 ? extractCity(hotel2) : null;

  // Determine transition day index (0-based)
  let transitionDayIndex = null;
  if (hotel1 && hotel2 && hotel1.checkOut) {
    // Find which itinerary day matches the check-out date of hotel 1
    const checkOutDate = new Date(hotel1.checkOut);
    const days = parsedItinerary?.days || [];
    for (let i = 0; i < days.length; i++) {
      const dayDate = days[i]?.date ? new Date(days[i].date) : null;
      if (dayDate && dayDate.toDateString() === checkOutDate.toDateString()) {
        transitionDayIndex = i;
        break;
      }
    }
    // Fallback: if dates don't match, use hotel2 checkIn
    if (transitionDayIndex === null && hotel2.checkIn) {
      const checkInDate = new Date(hotel2.checkIn);
      for (let i = 0; i < days.length; i++) {
        const dayDate = days[i]?.date ? new Date(days[i].date) : null;
        if (dayDate && dayDate.toDateString() === checkInDate.toDateString()) {
          transitionDayIndex = i;
          break;
        }
      }
    }
    // Last fallback: estimate from date difference relative to trip length
    if (transitionDayIndex === null && hotel1.checkIn && hotel1.checkOut) {
      const start = new Date(hotel1.checkIn);
      const end = new Date(hotel1.checkOut);
      const nightsAtHotel1 = Math.round((end - start) / (1000 * 60 * 60 * 24));
      if (nightsAtHotel1 > 0 && nightsAtHotel1 < numDays) {
        transitionDayIndex = nightsAtHotel1;
      }
    }
  }

  // --- Day 1 (arrival) ---
  lines.push(`**Day 1 (arrival day):**`);
  if (arrivalAirport) {
    lines.push(`- Flight lands at ${arrivalAirport} (${arrivalAirportCity})`);
    if (hotel1) {
      const cityLabel = hotel1City || null;
      const driveMin = cityLabel ? (lookupDriveTime(arrivalAirport, cityLabel) || lookupDriveTime(arrivalAirportCity, cityLabel)) : null;
      const driveStr = formatDriveTime(driveMin);
      lines.push(`- Drive from ${arrivalAirportCity} (${arrivalAirport}) to ${hotel1.name}${cityLabel ? ` in ${cityLabel}` : ''}${driveStr ? ` (${driveStr})` : ''}`);
      if (!driveStr) {
        lines.push(`  → Estimate the drive time from ${arrivalAirportCity} to ${hotel1.name} using your knowledge and include it in the timeline`);
      }
    }
    if (outbound?.arrivalTime) {
      lines.push(`- Flight arrives at ${outbound.arrivalTime} — do not schedule activities before realistic arrival at hotel`);
    }
  }
  // Rental car pickup
  const rental = rentals[0] || null;
  if (rental && rental.pickupLocation) {
    const pickupDiffersFromAirport = arrivalAirport && !rental.pickupLocation.toUpperCase().includes(arrivalAirport);
    if (pickupDiffersFromAirport) {
      lines.push(`- Pick up rental car at ${rental.pickupLocation} (NOTE: different from arrival airport)`);
    } else {
      lines.push(`- Pick up rental car at airport`);
    }
  }
  if (hotel1) {
    lines.push(`- Check in at ${hotel1.name}`);
    if (hotel1City) {
      lines.push(`- Remaining Day 1 activities must be in or near **${hotel1City}**`);
      lines.push(`- Day 1 title must reflect the arrival city: **${hotel1City}**`);
    } else {
      lines.push(`- Determine the city/area for "${hotel1.name}" from your knowledge. All remaining Day 1 activities must be in or near that area.`);
      lines.push(`- Day 1 title must reflect the actual arrival area (NOT a generic destination name like "Carmel" or "Big Sur" unless that's where the hotel actually is)`);
    }
  }
  lines.push('');

  // --- Middle days at hotel 1 ---
  {
    const lastHotel1Day = transitionDayIndex !== null ? transitionDayIndex : numDays;
    if (lastHotel1Day > 1) {
      const endDay = hotel2 ? lastHotel1Day : (returnFlight ? numDays - 1 : numDays);
      if (endDay > 1) {
        lines.push(`**Days 2–${endDay}${hotel2 ? '' : (returnFlight ? ' (pre-departure)' : '')}:**`);
        lines.push(`- Traveler is based at ${hotel1.name}${hotel1City ? `, ${hotel1City}` : ''}`);
        lines.push(`- All activities must be within reach of ${hotel1City ? `**${hotel1City}**` : `the area where "${hotel1.name}" is located`}`);
        lines.push(`- Use "${hotel1.name}" as the stay pick name`);
        lines.push('');
      }
    }
  }

  // --- Transition day ---
  if (hotel2 && transitionDayIndex !== null) {
    const transitionDay = transitionDayIndex + 1; // 1-indexed
    const driveMin = (hotel1City && hotel2City) ? lookupDriveTime(hotel1City, hotel2City) : null;
    const driveStr = formatDriveTime(driveMin);
    lines.push(`**Day ${transitionDay} (hotel transition):**`);
    lines.push(`- Check out of ${hotel1.name}${hotel1City ? ` (${hotel1City})` : ''}`);
    lines.push(`- Drive from ${hotel1.name} to ${hotel2.name}${driveStr ? ` (${driveStr})` : ''}`);
    if (!driveStr) {
      lines.push(`  → Estimate the drive time between these two properties using your knowledge`);
    }
    lines.push(`- Check in at ${hotel2.name}`);
    if (hotel2City) {
      lines.push(`- Remaining activities on this day must be in or near **${hotel2City}**`);
    } else {
      lines.push(`- Remaining activities on this day must be in or near the area where "${hotel2.name}" is located`);
    }
    lines.push('');

    // --- Days at hotel 2 ---
    const hotel2StartDay = transitionDay + 1;
    const hotel2EndDay = returnFlight ? numDays - 1 : numDays;
    if (hotel2StartDay <= hotel2EndDay) {
      lines.push(`**Days ${hotel2StartDay}–${hotel2EndDay}:**`);
      lines.push(`- Traveler is based at ${hotel2.name}${hotel2City ? `, ${hotel2City}` : ''}`);
      lines.push(`- All activities must be within reach of ${hotel2City ? `**${hotel2City}**` : `the area where "${hotel2.name}" is located`}`);
      lines.push(`- Use "${hotel2.name}" as the stay pick name`);
      lines.push('');
    }
  }

  // --- Departure day ---
  // Fire if there's a return flight OR an outbound flight (they need to get back to the arrival airport)
  if (returnFlight || (outbound && departureAirport)) {
    lines.push(`**Day ${numDays} (departure day):**`);
    const lastHotel = hotel2 || hotel1;
    const lastHotelCity = hotel2City || hotel1City;
    if (lastHotel && departureAirport) {
      const driveMin = lastHotelCity ? (lookupDriveTime(lastHotelCity, departureAirport) || lookupDriveTime(lastHotelCity, departureAirportCity)) : null;
      const driveStr = formatDriveTime(driveMin);
      lines.push(`- Drive from ${lastHotel.name}${lastHotelCity ? ` (${lastHotelCity})` : ''} to ${departureAirport} airport${driveStr ? ` (${driveStr})` : ''}`);
      if (!driveStr) {
        lines.push(`  → Estimate the drive time from ${lastHotel.name} to ${departureAirport} airport using your knowledge`);
      }
    }
    // Rental car return
    if (rental) {
      const returnLocation = rental.returnLocation || rental.pickupLocation;
      if (returnLocation) {
        lines.push(`- Return rental car at ${returnLocation}`);
      }
    }
    if (returnFlight?.departureTime) {
      lines.push(`- Flight departs at ${returnFlight.departureTime} — wrap up all activities with enough time for the drive + car return + 2 hrs buffer`);
    } else {
      lines.push(`- The traveler must reach ${departureAirport} airport for their return flight. Wrap up destination activities by early afternoon to allow time for the drive + car return.`);
    }
    lines.push('');
  }

  // --- Confirmed reservations (pinned timeline events) ---
  const datedReservations = reservations.filter(r => r.name && r.date);
  if (datedReservations.length > 0) {
    lines.push('**Confirmed Reservations (FIXED timeline events):**');
    lines.push('These are non-negotiable. Schedule the rest of each day\'s activities around these, not the reverse.\n');

    // Try to match each reservation to a day index
    const days = parsedItinerary?.days || [];
    datedReservations.forEach(r => {
      const resDate = new Date(r.date);
      let dayLabel = r.date;
      for (let i = 0; i < days.length; i++) {
        const dayDate = days[i]?.date ? new Date(days[i].date) : null;
        if (dayDate && dayDate.toDateString() === resDate.toDateString()) {
          dayLabel = `Day ${i + 1} (${r.date})`;
          break;
        }
      }
      const time = r.time ? ` at ${r.time}` : '';
      const type = r.type ? ` (${r.type})` : '';
      const notes = r.notes ? ` — ${r.notes}` : '';
      lines.push(`- **${dayLabel}**: ${r.name}${type}${time}${notes}`);
    });

    // Also include undated reservations as general constraints
    const undatedReservations = reservations.filter(r => r.name && !r.date);
    undatedReservations.forEach(r => {
      const type = r.type ? ` (${r.type})` : '';
      const notes = r.notes ? ` — ${r.notes}` : '';
      lines.push(`- **Date TBD**: ${r.name}${type}${notes} — fit this into the itinerary on the most appropriate day`);
    });
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Build the overall pulse section for the refinement prompt.
 */
function buildPulseSummary(pulse, overallNote) {
  if (!pulse) return '';

  const labels = {
    love: 'The traveler loves this itinerary overall.',
    close: 'The traveler says it\'s almost there but needs a few tweaks.',
    rethink: 'The traveler wants to rethink the trip — a different direction.',
  };

  let summary = labels[pulse] || '';
  if (overallNote) {
    summary += `\nTheir overall note: "${overallNote}"`;
  }
  return summary;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!checkOrigin(req, res)) return;

  try {
    const { itinerary, lockedItems, swappedActivities, dayFeedback, pulse, overallNote, formData, tripLogistics } = req.body;

    if (!itinerary) {
      return res.status(400).json({ error: 'Missing required field: itinerary' });
    }

    // Parse the current itinerary so we can reference day labels/titles
    let parsedItinerary = null;
    try {
      let cleaned = itinerary;
      const firstBrace = cleaned.indexOf('{');
      const lastBrace = cleaned.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        cleaned = cleaned.slice(firstBrace, lastBrace + 1);
      }
      parsedItinerary = JSON.parse(cleaned);
    } catch {
      // If we can't parse, we still send the raw string to Claude
    }

    const feedbackSummary = buildFeedbackSummary(dayFeedback, parsedItinerary?.days);
    const lockedSummary = buildLockedItemsSummary(lockedItems, parsedItinerary?.days);
    const swappedSummary = buildSwappedSummary(swappedActivities, parsedItinerary?.days);
    const pulseSummary = buildPulseSummary(pulse, overallNote);
    const bookingsSummary = buildBookingsSummary(tripLogistics);
    const locationScaffold = buildLocationScaffold(tripLogistics, parsedItinerary);

    const hasDayFeedback = feedbackSummary.length > 0;
    const hasLockedItems = lockedSummary.length > 0;
    const hasSwaps = swappedSummary.length > 0;
    const hasPulse = pulseSummary.length > 0;
    const hasBookings = bookingsSummary.length > 0;
    const hasScaffold = locationScaffold.length > 0;

    if (!hasDayFeedback && !hasLockedItems && !hasSwaps && !hasPulse && !hasBookings && !hasScaffold) {
      return res.status(400).json({ error: 'No feedback provided to refine against' });
    }

    // Build the refinement prompt
    const userMessage = `
## Current Itinerary

Below is the traveler's current itinerary as JSON. This is what they are reviewing:

${itinerary}

---

## Traveler Feedback

${hasLockedItems ? `### Locked Activities\n\nThe traveler locked these in — do not remove, reschedule, or replace:\n\n${lockedSummary}` : ''}

${hasSwaps ? `### Swapped Activities\n\nThe traveler chose alternatives for these activities — use the replacement:\n\n${swappedSummary}` : ''}

${hasDayFeedback ? `### Per-Day Notes\n\n${feedbackSummary}` : ''}

${hasPulse ? `### Overall Trip Feeling\n\n${pulseSummary}` : ''}

${hasBookings ? `### Confirmed Bookings\n\nThe traveler has these confirmed bookings — treat as hard constraints:\n\n${bookingsSummary}` : ''}

${hasScaffold ? `---\n\n${locationScaffold}` : ''}

---

## Refinement Instructions

You are revising this itinerary based on the traveler's feedback. Follow these rules:

1. **Honor locked activities.** Activities the traveler locked in must be preserved exactly — same title, same time slot, same details. Do not remove, reschedule, or replace them.

2. **Apply swaps.** Where the traveler chose an alternative, replace the original activity with the chosen replacement. Use the replacement title and summary provided.

3. **Preserve days whose activities are all locked.** If every activity on a day is locked with no swaps, keep that day unchanged.

4. **Respect per-day notes.** If the traveler left a note on a day, follow their direction. If they say "less hiking, more town time" — replace strenuous trail activities with town-based or gentle alternatives from the destination guide.

5. **Days without feedback** can be lightly revised if the overall pulse suggests changes, but keep them mostly stable. The traveler didn't flag them — don't surprise them with big changes.

6. **Honor the overall pulse:**
   - "Almost there" (close) → make targeted tweaks only, preserve the overall structure
   - "Rethink it" (rethink) → feel free to make larger structural changes (reorder days, swap major activities), but still preserve any locked activities

7. **Maintain the same JSON structure** as the original. Same fields, same format. The frontend depends on this structure.

8. **All recommendations must still come from the destination guide** in your system prompt context. Do not invent new places.

9. **Keep the same number of days** unless the overall note explicitly asks to add or remove days.

10. **Respect confirmed bookings as hard structural constraints:**

    **Arrival day:**
    - The traveler arrives at the airport listed in their outbound flight. If that airport is NOT in the destination itself (e.g., LAS for Zion, LAX/ONT for Joshua Tree, OGG for Kauai), the drive from airport to the destination area IS the first arc of Day 1. Include it as a timeline event with an estimated drive time. Do not schedule trailhead activities before the traveler has realistically arrived and checked in.
    - Do not schedule activities before flight arrival time + airport-to-destination drive time + 1 hour buffer.
    - If the traveler has a rental car pickup, the first timeline event should be: arrive → pick up rental car → drive to destination.

    **Accommodations:**
    - Use the confirmed hotel/lodge name as the "stay" pick for every night the traveler is booked there. Do NOT suggest alternatives.
    - If multiple accommodations are booked on different date ranges, the changeover day must include a transition arc in the timeline: check out of Property A → drive to Property B → check in. Treat this as a real event with time allocated, not a footnote.
    - Build check-in (typically mid-afternoon) and check-out (typically late morning) into the daily rhythm. Suggest a mellow arrival-evening activity after a late check-in, not a full day of hiking.

    **Departure day:**
    - The traveler must reach their departure airport for the return flight. If the airport is far from the destination, the drive back IS the closing arc of the final day. Include it as a timeline event.
    - Wrap up all destination activities at least airport-drive-time + 2 hours before departure flight time.

    **Rental car:**
    - Rental pickup/return should align with flight arrivals/departures.
    - If the rental pickup location differs from the airport, note this in the timeline.

${formData ? `
---

## Original Traveler Profile (for reference)

- **Destination**: ${formData.destination || 'Not specified'}
- **Energy**: ${formData.energy || 'Not specified'}
- **Budget**: ${formData.budget || 'Not specified'}
- **Interests**: ${formData.interests?.join(', ') || 'Not specified'}
- **Intention**: ${formData.intention || 'Not specified'}
` : ''}

Please return the revised itinerary as a complete JSON object. Follow the same output format rules from your system prompt — respond with ONLY the JSON, no markdown fences, no preamble.

**IMPORTANT — add a "changes" field** at the top level of your JSON response (alongside "title", "days", etc.):
"changes": an array of 2–4 short plain-language strings summarising the main adjustments you made in this refinement. Focus on things the traveller will notice: swapped activities, new logistics accommodated, restructured days, added or removed stops. Keep each item under 12 words. Examples:
- "Routed Day 1 through Oakland arrival with drive to Monterey"
- "Added hotel transition day from Monterey to Big Sur"
- "Swapped afternoon hike for a closer trail near hotel"
- "Incorporated dinner reservation at Nepenthe on Day 3"
`.trim();

    // Scale token budget with trip length (same formula as generate endpoint)
    const numDays = parsedItinerary?.days?.length || 5;
    const refinementMaxTokens = Math.min(1500 + numDays * 2600, 20000);

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: refinementMaxTokens,
      system: [
        { type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } },
      ],
      messages: [
        { role: 'user', content: userMessage },
      ],
    });

    const revisedItinerary = response.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('\n');

    // Check if output was truncated
    if (response.stop_reason === 'max_tokens') {
      console.error(`[REFINE] Output truncated — hit max_tokens (${refinementMaxTokens}) for ${numDays}-day trip`);
    }

    // Extract changes array from the response if present
    let changes = [];
    try {
      const firstBrace = revisedItinerary.indexOf('{');
      const lastBrace = revisedItinerary.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        const parsed = JSON.parse(revisedItinerary.slice(firstBrace, lastBrace + 1));
        if (Array.isArray(parsed.changes)) {
          changes = parsed.changes.filter(c => typeof c === 'string').slice(0, 6);
        }
      }
    } catch {
      // If parsing fails, changes stays empty — no error
    }

    return res.status(200).json({
      success: true,
      itinerary: revisedItinerary,
      changes,
    });

  } catch (error) {
    console.error('Itinerary refinement failed:', error);

    return res.status(500).json({
      error: 'Something went wrong refining your itinerary. Please try again.',
    });
  }
}
