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

    if (fb.status === 'approved') {
      return `- **${dayLabel}** ("${dayTitle}"): APPROVED — traveler is happy, preserve this day as-is.`;
    }
    if (fb.status === 'adjust') {
      return `- **${dayLabel}** ("${dayTitle}"): ADJUST — traveler note: "${fb.note}"`;
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
  const { flights = [], rentals = [], accommodations = [] } = tripLogistics;
  if (flights.length === 0 && rentals.length === 0 && accommodations.length === 0) return '';

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

    const hasDayFeedback = feedbackSummary.length > 0;
    const hasLockedItems = lockedSummary.length > 0;
    const hasSwaps = swappedSummary.length > 0;
    const hasPulse = pulseSummary.length > 0;
    const hasBookings = bookingsSummary.length > 0;

    if (!hasDayFeedback && !hasLockedItems && !hasSwaps && !hasPulse && !hasBookings) {
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

10. **Respect confirmed bookings as hard constraints:**
    - Do not schedule activities before flight arrival time + 1.5 hours (travel from airport + check-in buffer).
    - Wrap up all activities at least 2.5 hours before a departure flight (drive to airport + security + buffer).
    - If the traveler has confirmed accommodation, use their confirmed hotel as the "stay" pick in the JSON output — set the stay pick's "name" to the confirmed hotel name. Do NOT suggest a different hotel. Build hotel check-in/check-out into the daily timeline naturally.
    - Rental car pickup/return times should align with flight arrivals/departures.

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
`.trim();

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 12000,
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

    return res.status(200).json({
      success: true,
      itinerary: revisedItinerary,
    });

  } catch (error) {
    console.error('Itinerary refinement failed:', error);

    return res.status(500).json({
      error: 'Something went wrong refining your itinerary. Please try again.',
    });
  }
}
