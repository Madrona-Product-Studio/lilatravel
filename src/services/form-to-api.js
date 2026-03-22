// ═══════════════════════════════════════════════════════════════════════════════
// FORM → API TRANSLATION
//
// Converts PlanMyTrip form data into the shape that
// /api/generate-itinerary expects.
//
// File: src/services/form-to-api.js
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Translate the PlanMyTrip form state into the API request body.
 *
 * Form data shape (from PlanMyTrip.jsx):
 * {
 *   destination: 'zion',
 *   groupType: 'solo',          // solo | couple | friends | family
 *   groupSize: 1,               // 1-8
 *   month: 'october',           // from month selector step
 *   dateStart: '2026-10-15',    // optional — exact dates
 *   dateEnd: '2026-10-19',      // optional — exact dates
 *   intentions: ['reconnect'],
 *   movement: 50,               // slider 0-100
 *   pacing: 50,                 // slider 0-100
 *   range: 35,                  // slider 0-100
 *   duration: 4,
 *   budget: 'balanced',
 *   practiceLevel: 1,           // 0-3
 *   practices: ['yoga','breathwork'],
 * }
 *
 * API expects:
 * {
 *   destination: 'zion',
 *   preferences: {
 *     name, month, dates, groupType, groupSize,
 *     interests, energy, stayStyle, budget, intention
 *   }
 * }
 */

// Map destination IDs from the form to destination slugs the API understands
const DESTINATION_MAP = {
  zion: 'zion',
  bigSur: 'big-sur',
  joshuaTree: 'joshua-tree',
  olympic: 'olympic-peninsula',
  kauai: 'kauai',
  vancouver: 'vancouver-island',
};

// Map movement slider (0-100) to energy level
function movementToEnergy(movement = 50) {
  if (movement < 30) return 'gentle';
  if (movement < 70) return 'moderate';
  return 'adventurous';
}

// Map range slider (0-100) to exploration territory label
function rangeToTerritory(range = 35) {
  if (range < 25) return 'rooted';
  if (range < 50) return 'flexible';
  if (range < 75) return 'nomadic';
  return 'full-drift';
}

// Map budget ID to API budget tier
function budgetToApi(budget) {
  const map = {
    mindful: 'mindful',
    balanced: 'balanced',
    premium: 'open',
    noLimits: 'open',
  };
  return map[budget] || 'balanced';
}

// Map practices array to interests array for the API
function practicesToInterests(practices = [], intentions = [], movement = 50) {
  const interests = [];

  // From practices selection
  const practiceMap = {
    yoga: 'yoga',
    breathwork: 'breathwork',
    coldPlunge: 'water',
    meditation: 'mindfulness',
    hiking: 'hiking',
    stargazing: 'stargazing',
    localFarms: 'food',
    soundBath: 'spa',
    sauna: 'spa',
    massage: 'spa',
  };

  practices.forEach(p => {
    const mapped = practiceMap[p];
    if (mapped && !interests.includes(mapped)) {
      interests.push(mapped);
    }
  });

  // Always include hiking if movement is moderate or above
  if (movement >= 30 && !interests.includes('hiking')) {
    interests.push('hiking');
  }

  // Add dining by default — everyone needs to eat
  if (!interests.includes('dining')) {
    interests.push('dining');
  }

  return interests;
}

// Map intentions to a human-readable intention string
function intentionsToString(intentions = []) {
  const intentionMap = {
    reconnect: 'reconnect with others and feel part of something bigger',
    tune_in: 'get quiet enough to hear myself again',
    slow_down: 'slow down and stop rushing',
    light_up: 'chase the moments that make me feel alive',
  };

  if (intentions.length === 0) return 'Experience something meaningful.';

  const phrases = intentions.map(id => intentionMap[id]).filter(Boolean);
  if (phrases.length === 1) return `I want to ${phrases[0]}.`;
  if (phrases.length === 2) return `I want to ${phrases[0]} and ${phrases[1]}.`;
  return `I want to ${phrases.slice(0, -1).join(', ')}, and ${phrases[phrases.length - 1]}.`;
}

/**
 * Main translation function.
 *
 * @param {Object} formData - The state from PlanMyTrip.jsx
 * @param {string} [userName] - Optional traveler name (for future use)
 * @returns {Object} - The request body for POST /api/generate-itinerary
 */
export function translateFormToApi(formData, userName = 'Traveler') {
  return {
    destination: DESTINATION_MAP[formData.destination] || formData.destination,
    preferences: {
      name: userName,
      month: formData.month || null,
      dates: {
        start: formData.dateStart || null,
        end: formData.dateEnd || null,
        flexible: !formData.dateStart,
      },
      groupType: formData.groupType || 'solo',
      groupSize: formData.groupSize || 1,
      interests: practicesToInterests(
        formData.practices,
        formData.intentions,
        formData.movement
      ),
      energy: movementToEnergy(formData.movement),
      stayStyle: formData.stayStyle || 'rooted',
      territory: rangeToTerritory(formData.range),
      budget: budgetToApi(formData.budget),
      intention: intentionsToString(formData.intentions),
      intentionIds: formData.intentions || [],
      // Pass through raw form data for additional context
      duration: formData.duration || 4,
      practiceLevel: formData.practiceLevel ?? 1,
      practicesRaw: formData.practices || [],
      pacing: formData.pacing ?? 50,
    },
  };
}
