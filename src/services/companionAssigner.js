/**
 * companionAssigner.js — Bridges practicesService → Day Cards
 * ════════════════════════════════════════════════════════════
 * 
 * Takes the output of getPracticesForItinerary(formData) and the
 * itinerary days array, and assigns one teaching + one practice
 * to each day based on the day's character and position in the trip.
 * 
 * USAGE:
 *   import { assignCompanions } from './companionAssigner';
 *   import { getPracticesForItinerary, TRADITIONS } from './practicesService';
 * 
 *   const practiceResults = getPracticesForItinerary(formData);
 *   const daysWithCompanions = assignCompanions(itinerary.days, practiceResults);
 *   // Each day now has a `companion` field with teaching + practice
 */

import { TRADITIONS } from './practicesService';
import { CARDS } from '@data/cardDeck';

/**
 * Day archetypes based on position in the trip.
 * These help match practices to the natural rhythm of a journey.
 */
const DAY_ARCHETYPES = {
  arrival:   { keywords: ['arrival', 'arrive', 'check in', 'settle', 'orient', 'grounding'], principles: ['presence', 'reverence', 'compassion'], energy: 'gentle' },
  summit:    { keywords: ['landing', 'summit', 'climb', 'strenuous', 'challenging', 'dawn', 'edge'], principles: ['presence', 'flow'], energy: 'adventurous' },
  explore:   { keywords: ['explore', 'discover', 'wander', 'narrows', 'river', 'canyon'], principles: ['flow', 'oneness'], energy: 'moderate' },
  rest:      { keywords: ['rest', 'recovery', 'gentle', 'slow', 'spa', 'soak'], principles: ['flow', 'reverence', 'compassion'], energy: 'gentle' },
  departure: { keywords: ['departure', 'depart', 'farewell', 'final', 'last', 'closing', 'home'], principles: ['reverence', 'oneness', 'compassion'], energy: 'gentle' },
};

/**
 * Detect the archetype of a day based on its content and position.
 */
function detectDayArchetype(day, dayIndex, totalDays) {
  const text = `${day.title} ${day.intro || ''} ${day.snapshot || ''}`.toLowerCase();

  // First day is almost always arrival
  if (dayIndex === 0) return 'arrival';

  // Last day is almost always departure
  if (dayIndex === totalDays - 1) return 'departure';

  // Check keywords for middle days
  for (const [archetype, config] of Object.entries(DAY_ARCHETYPES)) {
    if (archetype === 'arrival' || archetype === 'departure') continue;
    for (const kw of config.keywords) {
      if (text.includes(kw)) return archetype;
    }
  }

  // Default middle days to explore
  return 'explore';
}

/**
 * Score how well a practice/teaching fits a specific day archetype.
 * Entries with a matching destination variant get a boost.
 */
function scoreFit(entry, archetype, destination) {
  const config = DAY_ARCHETYPES[archetype];
  if (!config) return 0;

  let score = 0;

  // Principle alignment
  for (const p of entry.principles || []) {
    if (config.principles.includes(p)) score += 3;
  }

  // Trip context keyword matching
  const context = (entry.tripContext || '').toLowerCase();
  if (archetype === 'arrival' && (context.includes('first') || context.includes('arrival') || context.includes('settle'))) score += 4;
  if (archetype === 'summit' && (context.includes('summit') || context.includes('before') || context.includes('intensity'))) score += 4;
  if (archetype === 'departure' && (context.includes('last') || context.includes('final') || context.includes('closing'))) score += 4;
  if (archetype === 'rest' && (context.includes('recovery') || context.includes('rest') || context.includes('afternoon'))) score += 4;

  // Time-of-day alignment
  if (archetype === 'summit' && (entry.timeOfDay === 'dawn' || entry.timeOfDay === 'morning')) score += 2;
  if (archetype === 'arrival' && entry.timeOfDay !== 'dawn') score += 1; // arrival days don't have early starts
  if (archetype === 'departure' && entry.timeOfDay === 'morning') score += 2;

  // Practice level — gentler practices for arrival/departure
  if ((archetype === 'arrival' || archetype === 'departure') && entry.practiceLevel === 0) score += 2;

  // Destination variant boost — prefer entries with landscape-specific versions
  if (destination && entry.destinationVariants?.[destination]) score += 5;

  return score;
}

/**
 * Format a practicesService entry into the companion card data structure.
 * When a destination variant exists, overlay its fields onto the base entry.
 */
function formatForCompanion(entry, type, destination) {
  if (!entry) return null;

  const tradition = TRADITIONS[entry.tradition];
  const variant = destination && entry.destinationVariants?.[destination];

  if (type === 'teaching') {
    return {
      title: variant?.name || entry.name,
      essence: variant?.summary || entry.summary,
      tradition: tradition?.shortName || '',
      slug: entry.id,
      // Available for the detail view
      deeper: entry.deeper || null,
      quote: entry.quote || null,
      sources: entry.sources || [],
      tripContext: variant?.tripContext || entry.tripContext || null,
      setting: variant?.setting || null,
      principles: entry.principles || [],
      isVariant: !!variant,
    };
  }

  if (type === 'practice') {
    return {
      title: variant?.name || entry.name,
      description: variant?.summary || entry.summary,
      tradition: tradition?.shortName || '',
      duration: entry.duration || null,
      when: variant?.tripContext || entry.tripContext || null,
      howTo: entry.howTo || null,
      slug: entry.id,
      // Available for the detail view
      deeper: entry.deeper || null,
      quote: entry.quote || null,
      sources: entry.sources || [],
      setting: variant?.setting || entry.setting || null,
      principles: entry.principles || [],
      isVariant: !!variant,
    };
  }

  return null;
}

/**
 * Main assignment function.
 *
 * @param {Array} days — itinerary days array from the AI-generated itinerary
 * @param {Object} practiceResults — output of getPracticesForItinerary(formData)
 * @param {string} [destination] — destination slug (e.g. 'zion') for variant selection
 * @returns {Array} days with `companion` field added to each
 */
export function assignCompanions(days, practiceResults, destination) {
  if (!days || !practiceResults) return days;

  const { dailyTeaching = [], allRelevant = [], morningPractice, eveningPractice } = practiceResults;
  const totalDays = days.length;

  // Get all available teachings and practices from the ranked results
  const availableTeachings = allRelevant.filter(e => e.type === 'teaching');
  const availablePractices = allRelevant.filter(e => e.type === 'practice');

  // Track what's been used to avoid repeats
  const usedTeachingIds = new Set();
  const usedPracticeIds = new Set();

  return days.map((day, i) => {
    const archetype = detectDayArchetype(day, i, totalDays);

    // ── Assign teaching ──────────────────────────────
    // Score all unused teachings for this day's archetype
    const teachingCandidates = availableTeachings
      .filter(t => !usedTeachingIds.has(t.id))
      .map(t => ({ ...t, fitScore: scoreFit(t, archetype, destination) + (t.score || 0) }))
      .sort((a, b) => b.fitScore - a.fitScore);

    const selectedTeaching = teachingCandidates[0] || null;
    if (selectedTeaching) usedTeachingIds.add(selectedTeaching.id);

    // ── Assign practice ──────────────────────────────
    // Score all unused practices for this day's archetype
    const practiceCandidates = availablePractices
      .filter(p => !usedPracticeIds.has(p.id))
      .map(p => ({ ...p, fitScore: scoreFit(p, archetype, destination) + (p.score || 0) }))
      .sort((a, b) => b.fitScore - a.fitScore);

    const selectedPractice = practiceCandidates[0] || null;
    if (selectedPractice) usedPracticeIds.add(selectedPractice.id);

    // ── Build companion ──────────────────────────────
    const companion = {
      teaching: formatForCompanion(selectedTeaching, 'teaching', destination),
      practice: formatForCompanion(selectedPractice, 'practice', destination),
      archetype,
    };

    return {
      ...day,
      companion: (companion.teaching || companion.practice) ? companion : null,
    };
  });
}

/**
 * Convenience: get companion data without mutating the days array.
 * Returns a map of dayIndex → companion data.
 *
 * @param {Array} days — itinerary days
 * @param {Object} formData — from the questionnaire
 * @param {Function} getPracticesForItinerary — from practicesService
 * @returns {Object} { [dayIndex]: companion }
 */
export function getCompanionsForTrip(days, formData, getPracticesForItinerary) {
  const practiceResults = getPracticesForItinerary(formData);
  const destination = formData.destination || null;
  const enrichedDays = assignCompanions(days, practiceResults, destination);

  const companions = {};
  enrichedDays.forEach((day, i) => {
    if (day.companion) {
      companions[i] = day.companion;
    }
  });

  return {
    companions,
    meta: {
      principles: practiceResults.principles,
      practiceLevel: practiceResults.practiceLevel,
      totalAvailable: practiceResults.allRelevant?.length || 0,
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// CARD DECK ASSIGNMENT — selects one card per day from src/data/cardDeck.js
// ═══════════════════════════════════════════════════════════════════════════════

const ARCHETYPE_TO_BESTFOR = {
  arrival:   ['arrival', 'transition', 'threshold'],
  summit:    ['challenge', 'awe', 'threshold'],
  explore:   ['awe', 'uncertainty', 'solo'],
  rest:      ['rest', 'fatigue', 'gratitude'],
  departure: ['departure', 'closure', 'gratitude'],
};

/**
 * Score a single card against today's day-archetype and the trip's formData.
 * Returns -1 if the card is ineligible (already used, or above the user's level).
 */
function scoreCard(card, formData, dayArchetype, usedIds) {
  if (usedIds.has(card.id)) return -1;

  const maxLevel = formData?.practiceLevel || 2;
  if (card.practiceLevel > maxLevel) return -1;

  let score = 0;

  // Archetype principle alignment
  const archetypePrinciples = DAY_ARCHETYPES[dayArchetype]?.principles || [];
  if (archetypePrinciples.includes(card.principle)) score += 4;

  // Setting alignment — formData.terrain is an array of strings (optional)
  const terrains = Array.isArray(formData?.terrain) ? formData.terrain : [];
  if (card.setting?.includes('any') || card.setting?.some(s => terrains.includes(s))) {
    score += 2;
  }

  // Energy alignment to archetype
  if (dayArchetype === 'rest' && card.energy?.some(e => e === 'restorative' || e === 'reflective')) score += 2;
  if (dayArchetype === 'summit' && card.energy?.some(e => e === 'active' || e === 'grounding')) score += 2;
  if (dayArchetype === 'arrival' && card.energy?.some(e => e === 'grounding' || e === 'opening')) score += 1;
  if (dayArchetype === 'departure' && card.energy?.some(e => e === 'reflective' || e === 'devotional')) score += 1;

  // bestFor overlap with archetype
  const dayBestFor = ARCHETYPE_TO_BESTFOR[dayArchetype] || [];
  score += (card.bestFor || []).filter(b => dayBestFor.includes(b)).length;

  return score;
}

/**
 * Pick the best card for a single day. Mutates `usedIds` to enforce no-repeat.
 *
 * @param {Object} day — itinerary day object (used for archetype detection)
 * @param {number} dayIndex — 0-based index in the days array
 * @param {number} totalDays — total day count for the trip
 * @param {Object} formData — questionnaire data
 * @param {Set<string>} usedIds — accumulator of card ids already assigned
 * @returns {Object|null} the selected card, or null if no eligible card
 */
export function assignCardToDay(day, dayIndex, totalDays, formData, usedIds = new Set()) {
  const archetype = detectDayArchetype(day, dayIndex, totalDays);

  const scored = CARDS
    .map(card => ({ card, score: scoreCard(card, formData, archetype, usedIds) }))
    .filter(({ score }) => score >= 0)
    .sort((a, b) => b.score - a.score);

  if (!scored.length) return null;
  const selected = scored[0].card;
  usedIds.add(selected.id);
  return selected;
}

/**
 * Walk the days array and attach `companion.card` (and archetype) to each day.
 * Card content carries everything needed by the teaser + modal; per-trip
 * cardPrompt / cardConnection are generated by the itinerary API and live on
 * the day object alongside the timeline.
 */
export function assignCardsToDays(days, formData) {
  if (!days || !days.length) return days;
  const usedIds = new Set();
  const total = days.length;

  return days.map((day, i) => {
    const archetype = detectDayArchetype(day, i, total);
    const card = assignCardToDay(day, i, total, formData, usedIds);
    if (!card) return day;

    return {
      ...day,
      companion: {
        ...(day.companion || {}),
        card,
        archetype,
      },
    };
  });
}
