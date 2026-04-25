// ═══════════════════════════════════════════════════════════════════════════════
// DATA LOOKUP — matches itinerary item names to curated JSON data entries
// ═══════════════════════════════════════════════════════════════════════════════
//
// Used by ItineraryResults to enrich generated itinerary items with the same
// rich detail views (NPS data, photos, ExternalLinkButton CTAs) that appear
// in the destination guide detail sheets.
//

// ─── Import all data files ──────────────────────────────────────────────────

import zionEat from '@data/restaurants/zion-eat.json';
import zionMove from '@data/restaurants/zion-move.json';
import zionBreathe from '@data/restaurants/zion-breathe.json';
import zionExperience from '@data/restaurants/zion-experience.json';
import zionSleep from '@data/accommodations/zion.json';

import bigSurEat from '@data/restaurants/big-sur-eat.json';
import bigSurMove from '@data/restaurants/big-sur-move.json';
import bigSurBreathe from '@data/restaurants/big-sur-breathe.json';
import bigSurExperience from '@data/restaurants/big-sur-experience.json';
import bigSurSleep from '@data/accommodations/big-sur.json';

import joshuaTreeEat from '@data/restaurants/joshua-tree-eat.json';
import joshuaTreeMove from '@data/restaurants/joshua-tree-move.json';
import joshuaTreeBreathe from '@data/restaurants/joshua-tree-breathe.json';
import joshuaTreeExperience from '@data/restaurants/joshua-tree-experience.json';
import joshuaTreeSleep from '@data/accommodations/joshua-tree.json';

import kauaiEat from '@data/restaurants/kauai-eat.json';
import kauaiMove from '@data/restaurants/kauai-move.json';
import kauaiBreathe from '@data/restaurants/kauai-breathe.json';
import kauaiExperience from '@data/restaurants/kauai-experience.json';
import kauaiSleep from '@data/accommodations/kauai.json';

import olympicEat from '@data/restaurants/olympic-peninsula-eat.json';
import olympicMove from '@data/restaurants/olympic-peninsula-move.json';
import olympicBreathe from '@data/restaurants/olympic-peninsula-breathe.json';
import olympicExperience from '@data/restaurants/olympic-peninsula-experience.json';
import olympicSleep from '@data/accommodations/olympic-peninsula.json';

import vancouverEat from '@data/restaurants/vancouver-island-eat.json';
import vancouverMove from '@data/restaurants/vancouver-island-move.json';
import vancouverBreathe from '@data/restaurants/vancouver-island-breathe.json';
import vancouverExperience from '@data/restaurants/vancouver-island-experience.json';
import vancouverSleep from '@data/accommodations/vancouver-island.json';

// ─── Normalize name for fuzzy matching ──────────────────────────────────────

function normalize(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/['']/g, '')       // curly quotes
    .replace(/[^\w\s]/g, '')    // punctuation
    .replace(/\s+/g, ' ')       // collapse whitespace
    .trim();
}

// ─── Build the index ────────────────────────────────────────────────────────

function buildIndex() {
  const index = new Map();

  const allData = [
    // Eat
    ...zionEat, ...bigSurEat, ...joshuaTreeEat, ...kauaiEat, ...olympicEat, ...vancouverEat,
    // Move
    ...zionMove, ...bigSurMove, ...joshuaTreeMove, ...kauaiMove, ...olympicMove, ...vancouverMove,
    // Breathe
    ...zionBreathe, ...bigSurBreathe, ...joshuaTreeBreathe, ...kauaiBreathe, ...olympicBreathe, ...vancouverBreathe,
    // Experience
    ...zionExperience, ...bigSurExperience, ...joshuaTreeExperience, ...kauaiExperience, ...olympicExperience, ...vancouverExperience,
    // Sleep
    ...zionSleep.map(a => ({ ...a, _section: 'stay' })),
    ...bigSurSleep.map(a => ({ ...a, _section: 'stay' })),
    ...joshuaTreeSleep.map(a => ({ ...a, _section: 'stay' })),
    ...kauaiSleep.map(a => ({ ...a, _section: 'stay' })),
    ...olympicSleep.map(a => ({ ...a, _section: 'stay' })),
    ...vancouverSleep.map(a => ({ ...a, _section: 'stay' })),
  ];

  for (const entry of allData) {
    const key = normalize(entry.name);
    if (key && !index.has(key)) {
      // Build the item shape that GuideDetailSheet expects
      const item = {
        ...entry,
        type: entry._section === 'stay' ? 'stay' : 'list',
        detail: entry.highlights?.[0] || '',
        featured: entry.lilaPick || false,
        url: entry.links?.website || entry.links?.booking || null,
        links: entry.links || {},
      };

      // For accommodations, map stayStyle to tier
      if (entry._section === 'stay') {
        item.tier = entry.stayStyle;
        item.context = entry.location;
      }

      index.set(key, item);
    }
  }

  return index;
}

const DATA_INDEX = buildIndex();

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Look up an itinerary item name in the curated data.
 * Returns the matched item shaped for GuideDetailSheet, or null.
 */
export function lookupItem(name) {
  if (!name) return null;

  const key = normalize(name);

  // Exact match
  if (DATA_INDEX.has(key)) return DATA_INDEX.get(key);

  // Partial match — check if any index key starts with or contains the search
  for (const [indexKey, item] of DATA_INDEX) {
    if (indexKey.includes(key) || key.includes(indexKey)) {
      return item;
    }
  }

  return null;
}
