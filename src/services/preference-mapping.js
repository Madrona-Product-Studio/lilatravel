/**
 * Lila Trips — Preference-to-Content Mapping Schema
 * 
 * This file defines the formal contract between three things:
 * 1. What the onboarding flow COLLECTS (traveler profile)
 * 2. What the destination guide CONTAINS (tagged content)
 * 3. How Claude MATCHES them (selection logic)
 * 
 * Every field the onboarding captures must map to filterable
 * tags in the destination guide. If the onboarding asks about it,
 * the guide must have content tagged for it.
 */


// ============================================================
// PART 1: TRAVELER PROFILE SCHEMA
// What the "Plan My Trip" onboarding flow produces
// ============================================================

/**
 * @typedef {Object} TravelerProfile
 * 
 * This is the output of your 9-step onboarding flow.
 * Every field here must map to content tags in the destination guide.
 */
export const TravelerProfileSchema = {
  // Step 1: Who are you?
  name: '',                    // string — Traveler's first name

  // Step 2: Where are you going?
  destination: '',             // string — 'zion' | 'joshua-tree' | 'big-sur' | etc.

  // Step 3: When are you going?
  dates: {
    start: '',                 // ISO date string — '2026-09-20'
    end: '',                   // ISO date string — '2026-09-24'
    flexible: false,           // boolean — Can they shift dates for better timing?
  },
  month: '',                   // string — 'january' through 'december' (from month selector)
                               // Used when exact dates aren't set yet. If dates are provided,
                               // month is derived from dates.start automatically.

  // Step 4: Who's coming?
  groupType: '',               // 'solo' | 'couple' | 'friends' | 'family'
  groupSize: 1,                // number — Total travelers

  // Step 5: What draws you? (multi-select — maps to guide categories)
  interests: [],               // Array of InterestTag values (see below)

  // Step 6: How do you want to move? (energy / pace)
  energy: '',                  // 'gentle' | 'moderate' | 'adventurous'

  // Step 7: Where do you want to stay? (accommodation tier)
  stayStyle: '',               // 'elemental' | 'rooted' | 'premium'

  // Step 8: What's your budget range?
  budget: '',                  // 'mindful' | 'balanced' | 'premium' | 'noLimits'

  // Step 9: What's your intention? (free text)
  intention: '',               // string — "I want to disconnect and find stillness"
};


// ============================================================
// PART 2: INTEREST TAGS
// The multi-select options from Step 5 of onboarding.
// Each tag maps DIRECTLY to a section/subsection in the guide.
// ============================================================

export const InterestTags = {

  // ── Sacred Terrain (Hikes & Landscapes) ──────────────────
  hiking: {
    label: 'Hiking & Trails',
    guideSection: 'Sacred Terrain',
    description: 'Canyon hikes, ridge walks, river trails',
    icon: '⛰️',
  },
  scenicDrives: {
    label: 'Scenic Drives',
    guideSection: 'Self-Guided Experiences',
    description: 'Road trips through dramatic landscapes',
    icon: '🛣️',
  },
  stargazing: {
    label: 'Stargazing & Dark Skies',
    guideSection: 'Self-Guided Experiences',
    description: 'Night sky experiences, Milky Way viewing',
    icon: '✨',
  },

  // ── Living Practice (Wellness) ───────────────────────────
  yoga: {
    label: 'Yoga & Movement',
    guideSection: 'Living Practice',
    description: 'Studio classes, outdoor yoga, mindful movement',
    icon: '🧘',
  },
  breathwork: {
    label: 'Breathwork & Meditation',
    guideSection: 'Living Practice',
    description: 'Guided breathwork, meditation, contemplative practice',
    icon: '🌬️',
  },
  spa: {
    label: 'Spa & Recovery',
    guideSection: 'Living Practice',
    description: 'Massage, body treatments, hot springs, recovery',
    icon: '💆',
  },
  mindfulness: {
    label: 'Mindfulness & Presence',
    guideSection: 'Living Practice',
    description: 'Walking meditation, river grounding, forest bathing',
    icon: '🌿',
  },

  // ── Nourish (Food & Drink) ───────────────────────────────
  dining: {
    label: 'Local Dining',
    guideSection: 'Nourish',
    description: 'Curated restaurants, farm-to-table, local favorites',
    icon: '🍽️',
  },
  farmMarkets: {
    label: 'Farms & Markets',
    guideSection: 'Nourish',
    description: 'Farm stands, farmers markets, local provisions',
    icon: '🌾',
  },
  coffee: {
    label: 'Coffee & Cafes',
    guideSection: 'Nourish',
    description: 'Best morning coffee spots, post-hike fuel',
    icon: '☕',
  },

  // ── Discover (Culture & Exploration) ─────────────────────
  galleries: {
    label: 'Galleries & Art',
    guideSection: 'Discover',
    description: 'Local art galleries, photography, artisan studios',
    icon: '🎨',
  },
  shopping: {
    label: 'Local Shops & Finds',
    guideSection: 'Discover',
    description: 'Unique shops, bookstores, local goods',
    icon: '🛍️',
  },
  history: {
    label: 'History & Culture',
    guideSection: 'Discover',
    description: 'Museums, indigenous heritage, geological history',
    icon: '📜',
  },

  // ── Gather (Community & Events) ──────────────────────────
  festivals: {
    label: 'Festivals & Events',
    guideSection: 'Gather',
    description: 'Seasonal events, community gatherings, music',
    icon: '🎭',
  },

  // ── Water & River ────────────────────────────────────────
  water: {
    label: 'Water & River Time',
    guideSection: 'Self-Guided Experiences',
    description: 'River walks, canyoneering, swimming holes',
    icon: '💧',
  },
};


// ============================================================
// PART 3: GUIDE CONTENT TAGS
// Every item in the destination guide (zion.md) should be
// tagged with these values so Claude can match them to profiles.
// ============================================================

/**
 * Tags that go on individual items in the destination guide.
 * These are the "handles" that let Claude grab the right content.
 */
export const ContentTags = {

  // Energy Level — matches Step 6
  energy: {
    gentle:      'Easy trails, flat walks, recovery activities, spa, gentle yoga',
    moderate:    'Moderate hikes (3-6 mi), active yoga, balanced pacing',
    adventurous: 'Strenuous hikes, early starts, long days, high elevation',
  },

  // Stay Style — matches Step 7
  stayStyle: {
    elemental: 'Camping, glamping, Under Canvas — immersed in landscape',
    rooted:    'Boutique lodges, locally-owned inns, mid-range comfort',
    premium:   'Luxury resorts, design properties, elevated experiences',
  },

  // Budget — matches Step 8 (synced with BUDGET_TIERS in PlanMyTrip.jsx)
  budget: {
    mindful:  'Free/low-cost options: camping, free trails, picnic provisions, self-guided',
    balanced: 'Mid-range: boutique lodging, sit-down restaurants, some guided experiences',
    premium:  'Elevated: luxury stays, fine dining, private guides, full spa treatments',
    noLimits: 'The extraordinary: top-tier resorts, private chefs, helicopter access, bespoke experiences',
  },

  // Group Type — matches Step 4
  groupType: {
    solo:    'Solo-friendly, contemplative, self-paced, safe alone',
    couple:  'Romantic, shareable moments, dinner-for-two, couples wellness',
    friends: 'Social, group-friendly, shared adventure, communal dining',
    family:  'Kid-friendly, accessible, paved trails, shorter distances, educational',
  },

  // Time of Day — for itinerary pacing
  timeOfDay: {
    sunrise:   'Best at or before sunrise',
    morning:   'Ideal morning activity',
    midday:    'Good for midday',
    afternoon: 'Afternoon activity',
    sunset:    'Best at golden hour / sunset',
    evening:   'Evening / after-dark activity',
    anytime:   'Flexible timing',
  },
};


// ============================================================
// PART 4: THE MATCHING LOGIC
// How onboarding outputs map to guide content selection.
// This is what Claude uses to personalize the itinerary.
// ============================================================

/**
 * Given a traveler profile, generate the matching instructions
 * that get appended to the Claude prompt. This tells Claude
 * exactly how to interpret preferences against the guide content.
 */
export function generateMatchingInstructions(profile) {
  const instructions = [];

  // Interest mapping
  if (profile.interests?.length > 0) {
    const sections = [...new Set(
      profile.interests.map(tag => InterestTags[tag]?.guideSection).filter(Boolean)
    )];
    instructions.push(
      `PRIORITIZE content from these guide sections: ${sections.join(', ')}. ` +
      `These are the traveler's stated interests. Build the itinerary around them.`
    );
  }

  // Energy mapping
  if (profile.energy) {
    instructions.push(
      `ENERGY LEVEL: ${profile.energy}. ${ContentTags.energy[profile.energy]}. ` +
      `Only recommend activities matching this energy level. ` +
      `${profile.energy === 'gentle' ? 'Avoid strenuous hikes and early starts unless specifically requested.' : ''}` +
      `${profile.energy === 'adventurous' ? 'Include the signature challenging experiences. Early starts are welcome.' : ''}` +
      `${profile.energy === 'moderate' ? 'Mix active and restorative. No more than one strenuous activity per day.' : ''}`
    );
  }

  // Territory / exploration range mapping
  if (profile.territory) {
    const territoryInstructions = {
      rooted:
        `TERRITORY: Rooted. The traveler wants to go deep in one area rather than cover ground. ` +
        `Keep all activities within a tight radius. Prioritize depth over breadth — revisit the same trail at different times of day, explore one neighborhood thoroughly.`,
      flexible:
        `TERRITORY: Flexible. The traveler is open to exploring moderately beyond a home base. ` +
        `Include some variety in locations but don't require long drives between activities.`,
      nomadic:
        `TERRITORY: Nomadic. The traveler wants to cover ground and see different areas. ` +
        `Include scenic drives, multiple zones of the park/region, and variety in landscapes across the trip.`,
      'full-drift':
        `TERRITORY: Full Drift. The traveler wants maximum geographic range. ` +
        `Design the trip to move through the full breadth of the destination. Include the far-flung spots most visitors skip.`,
    };
    if (territoryInstructions[profile.territory]) {
      instructions.push(territoryInstructions[profile.territory]);
    }
  }

  // Stay style mapping
  if (profile.stayStyle) {
    instructions.push(
      `ACCOMMODATION: Recommend "${profile.stayStyle}" tier stays. ` +
      `${ContentTags.stayStyle[profile.stayStyle]}. ` +
      `Only suggest accommodations from this tier in the guide.`
    );
  }

  // Budget mapping
  if (profile.budget) {
    instructions.push(
      `BUDGET: "${profile.budget}" level. ${ContentTags.budget[profile.budget]}. ` +
      `Match dining, activities, and experience recommendations to this budget tier.`
    );
  }

  // Group type mapping
  if (profile.groupType) {
    instructions.push(
      `GROUP: ${profile.groupType}${profile.groupSize > 1 ? ` (${profile.groupSize} people)` : ''}. ` +
      `${ContentTags.groupType[profile.groupType]}. ` +
      `Tailor activity selection and tone to this travel style.`
    );
  }

  // Date-based timing
  if (profile.dates?.start) {
    const startDate = new Date(profile.dates.start);
    const month = startDate.toLocaleString('en-US', { month: 'long' }).toLowerCase();
    const tripLength = Math.ceil(
      (new Date(profile.dates.end) - new Date(profile.dates.start)) / (1000 * 60 * 60 * 24)
    ) + 1;

    instructions.push(
      `DATES: ${profile.dates.start} to ${profile.dates.end} (${tripLength} days). ` +
      `MONTH: ${month.charAt(0).toUpperCase() + month.slice(1)}. ` +
      `Consult the Monthly Guide section for ${month.charAt(0).toUpperCase() + month.slice(1)} to understand what the destination ` +
      `feels like, what's open, what's closed, what to prioritize, and what to pack. ` +
      `Only recommend trails and activities that have availability in this month ` +
      `(check each item's "Months" tag). ` +
      `Also check the Magic Windows section for any special timing that overlaps with these dates.`
    );

    // Flexible dates advisory
    if (profile.dates.flexible) {
      instructions.push(
        `The traveler has indicated flexible dates. If shifting by a few days would ` +
        `align with a Magic Window or avoid known issues, suggest it.`
      );
    }
  } else if (profile.month) {
    // Month provided without exact dates
    const monthName = profile.month.charAt(0).toUpperCase() + profile.month.slice(1);
    instructions.push(
      `MONTH: ${monthName} (exact dates not yet set). ` +
      `Consult the Monthly Guide section for ${monthName} to understand what the destination ` +
      `feels like, what's open, what's closed, what to prioritize, and what to pack. ` +
      `Only recommend trails and activities that have availability in this month ` +
      `(check each item's "Months" tag). ` +
      `Check the Magic Windows section for any special timing in ${monthName}. ` +
      `If ${monthName} overlaps with a Threshold Trip, mention it. ` +
      `Build a sample itinerary for a typical ${monthName} visit (suggest ideal trip length for this month).`
    );
  }

  // Duration — how many days to generate
  if (profile.duration) {
    instructions.push(
      `TRIP LENGTH: ${profile.duration} days. ` +
      `Generate exactly ${profile.duration} days in the itinerary. ` +
      `Day 1 should begin with arrival/settling in. The final day should end with a contemplative closing, not exhaustion.`
    );
  }

  // Pacing — how packed each day should be
  if (profile.pacing != null) {
    const p = profile.pacing;
    let pacingInstruction;
    if (p < 25) {
      pacingInstruction =
        `PACING: Spacious. This traveler wants open, unhurried days. ` +
        `Limit to 2–3 scheduled activities per day. Include long unstructured blocks, late mornings, and extended meals. ` +
        `Leave breathing room between activities — white space is a feature, not a bug.`;
    } else if (p < 50) {
      pacingInstruction =
        `PACING: Unhurried. This traveler prefers a relaxed rhythm with moderate structure. ` +
        `Plan 3–4 activities per day with comfortable transitions. Include at least one open block per day for spontaneity or rest.`;
    } else if (p < 75) {
      pacingInstruction =
        `PACING: Balanced. A comfortable mix of activity and downtime. ` +
        `Plan 4–5 activities per day. Keep transitions reasonable but the day can be full. Include one restful period per day.`;
    } else {
      pacingInstruction =
        `PACING: Full. This traveler wants packed, maximized days. ` +
        `Plan 5–6 activities per day. Early starts are welcome. Fill the schedule — they came to do as much as possible.`;
    }
    instructions.push(pacingInstruction);
  }

  // Practice level — wellness experience depth
  if (profile.practiceLevel != null && profile.practiceLevel > 0) {
    const levels = [
      null,
      `PRACTICE LEVEL: Dabbler. The traveler has some exposure to wellness practices but is not deeply experienced. ` +
      `Keep wellness recommendations approachable and well-explained. Avoid jargon. Guided sessions are preferred over self-directed.`,
      `PRACTICE LEVEL: Regular practitioner. The traveler has an established wellness practice. ` +
      `Recommend substantive experiences — longer meditation sits, intermediate-level yoga, meaningful breathwork sessions. They don't need hand-holding but appreciate depth.`,
      `PRACTICE LEVEL: Dedicated practitioner. Wellness is central to this traveler's life. ` +
      `Recommend advanced and immersive experiences — silent retreats, challenging pranayama, extended practice sessions, teachers over classes. They want the real thing, not the tourist version.`,
    ];
    if (levels[profile.practiceLevel]) {
      instructions.push(levels[profile.practiceLevel]);
    }
  }

  // Intention — structured mapping with behavioral signals
  if (profile.intention) {
    instructions.push(
      `INTENTION: The traveler described their intention as: "${profile.intention}". ` +
      `Let this shape the overall tone, pacing, and emphasis of the itinerary. ` +
      `Weave this intention into the narrative naturally.`
    );
  }

  // Structured intention signals (from raw intention IDs if available)
  if (profile.intentionIds?.length > 0) {
    const signals = {
      reconnect:
        `RECONNECT signal: Prioritize shared and communal experiences — group yoga, shared meals, partner hikes, community gatherings. ` +
        `Choose lodging that encourages togetherness. Less solitary, more face-to-face.`,
      tune_in:
        `TUNE IN signal: Prioritize contemplative, awareness-oriented activities — guided meditation, journaling prompts, mindful silent hikes, sound baths, stargazing. ` +
        `Build in pauses and moments of observation. The itinerary should feel reflective.`,
      slow_down:
        `SLOW DOWN signal: Prioritize spacious pacing — fewer activities per day, late mornings, long meals, spa/hot springs, gentle walks, open unscheduled blocks. ` +
        `Give breathing room in the structure. Resist the urge to fill every hour.`,
      light_up:
        `LIGHT UP signal: Prioritize peak experiences and intensity — big hikes, sunrise breathwork, cold plunges, packed days with high-effort/high-reward moments. ` +
        `Bring the "go for it" energy. Early starts, sunset finishes.`,
    };
    const activeSignals = profile.intentionIds
      .map(id => signals[id])
      .filter(Boolean);
    if (activeSignals.length > 0) {
      instructions.push(activeSignals.join('\n\n'));
    }
    // Combination guidance
    if (profile.intentionIds.length > 1) {
      instructions.push(
        `The traveler selected multiple intentions. Combine them thoughtfully — ` +
        `e.g. Tune In + Light Up = intense but contemplative (solo summit push → meditation at the top). ` +
        `Reconnect + Slow Down = unhurried togetherness. Let both signals shape each day.`
      );
    }
  }

  return instructions.join('\n\n');
}


// ============================================================
// PART 5: GUIDE CONTENT STRUCTURE
// Template for how each item in the destination guide
// should be tagged for optimal matching.
// ============================================================

/**
 * Example of a fully-tagged guide item.
 * When building destination guides (zion.md etc.), each
 * recommendation should include these tag dimensions.
 * 
 * In the markdown file, tags appear as bracketed values
 * at the end of each entry, e.g.:
 * 
 *   ### Angels Landing
 *   The trail that defines Zion...
 *   - **Tags**: [strenuous, permit-required, signature-experience, morning-start]
 *   - **Energy**: adventurous
 *   - **Group**: solo, couple, friends
 *   - **Budget**: mindful, balanced, premium, noLimits (free activity)
 *   - **Time**: sunrise, morning
 *   - **Interests**: hiking
 */
export const GuideItemTemplate = {
  name: '',
  section: '',           // 'Sacred Terrain' | 'Living Practice' | 'Nourish' | etc.
  description: '',       // Editorial description
  energy: [],            // ['gentle'] | ['moderate'] | ['adventurous'] | combo
  stayStyle: null,       // Only for accommodations: 'elemental' | 'rooted' | 'premium'
  budget: [],            // ['mindful'] | ['balanced'] | ['premium'] | ['noLimits'] | combo
  groupType: [],         // ['solo', 'couple'] | ['family'] | etc.
  timeOfDay: [],         // ['sunrise', 'morning'] | ['evening'] | etc.
  interests: [],         // ['hiking'] | ['yoga', 'mindfulness'] | etc.
  seasonal: null,        // Any seasonal restrictions or notes
  tags: [],              // Additional freeform tags
};
