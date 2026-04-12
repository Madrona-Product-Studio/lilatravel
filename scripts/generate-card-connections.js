#!/usr/bin/env node
/**
 * generate-card-connections.js
 * ────────────────────────────
 * Generates one static cardConnection per card in src/data/cardDeck.js.
 * Each card is paired with its best-fit destination, and Claude writes
 * a 2-3 sentence connection tying the teaching to that specific terrain.
 *
 * Usage: npm run generate:connections
 *        (or: node scripts/generate-card-connections.js)
 *
 * Requires ANTHROPIC_API_KEY in .env or environment.
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ── Load .env if present ────────────────────────────────────────────────────
try {
  const envPath = path.join(ROOT, '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
      const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/);
      if (m) process.env[m[1]] = m[2];
    }
  }
} catch { /* ignore */ }

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── Destination → card mapping ──────────────────────────────────────────────

const DEST_MAP = {
  // Canyon / desert / river → Zion
  yamas: 'zion', pranayama: 'zion', vipassana: 'zion', samadhi: 'zion',
  'atman-brahman': 'zion', sympatheia: 'zion', 'amor-fati': 'zion',
  'memento-mori': 'zion', 'yin-yang': 'zion', apranihita: 'zion',

  // Forest / nature immersion → Olympic Peninsula
  'shinrin-yoku': 'olympic-peninsula', li: 'olympic-peninsula',
  'wu-wei': 'olympic-peninsula', satoyama: 'olympic-peninsula',
  sunyata: 'olympic-peninsula', 'the-tao': 'olympic-peninsula',
  musubi: 'olympic-peninsula',

  // Coastal / ocean → Big Sur or Kauai
  'mono-no-aware': 'big-sur', 'ichi-go-ichi-e': 'big-sur',
  misogi: 'kauai', metta: 'kauai', tonglen: 'big-sur', ubuntu: 'kauai',

  // Desert / stark → Joshua Tree
  shoshin: 'joshua-tree', mushin: 'joshua-tree',
  bodhicitta: 'joshua-tree', niyamas: 'joshua-tree',

  // Remaining → best fit
  bhakti: 'kauai', seva: 'zion',
  'surya-namaskar': 'joshua-tree',
};

const DEST_NAMES = {
  zion: 'Zion Canyon, Utah',
  'olympic-peninsula': 'Olympic Peninsula, Washington',
  'big-sur': 'Big Sur, California',
  kauai: 'Kaua\u02BBi, Hawai\u02BBi',
  'joshua-tree': 'Joshua Tree, California',
};

// ── Load terrain summaries ──────────────────────────────────────────────────

function loadTerrain(destSlug) {
  const filenames = {
    zion: 'zion.md',
    'olympic-peninsula': 'olympic-peninsula.md',
    'big-sur': 'big-sur.md',
    kauai: 'kauai.md',
    'joshua-tree': 'joshua-tree.md',
  };
  const fp = path.join(ROOT, 'src/data/destinations', filenames[destSlug]);
  const md = fs.readFileSync(fp, 'utf-8');
  // Extract Sense of Place section (~400 chars)
  const match = md.match(/## Sense of Place\s*\n([\s\S]*?)(?=\n---|\n## )/);
  if (!match) return '';
  return match[1].trim().slice(0, 500);
}

const TERRAINS = {};
for (const slug of Object.keys(DEST_NAMES)) {
  TERRAINS[slug] = loadTerrain(slug);
}

// ── System prompt ────────────────────────────────────────────────────────��──

const SYSTEM = `You write short evocative connections between ancient practice cards and specific travel destinations. 2-3 sentences. Apply the card's teaching to the specific terrain, landscape, and activities of this destination. Reference actual places, conditions, or experiences. Do not explain the card — apply it. Plain declarative language, no editorializing.

Example:
"The Narrows puts Ahimsa in motion with every step — the water, the canyon walls, the creatures sharing this corridor all ask for conscious passage. Move as a guest."`;

// ── Generate connections ────────────────────────────────────────────────────

async function generateOne(card, destSlug) {
  const destName = DEST_NAMES[destSlug];
  const terrain = TERRAINS[destSlug];

  const userMsg = `Card: ${card.name}
Principle: ${card.principle}
Tradition: ${card.tradition}
Teaching: ${card.teaching}

Destination: ${destName}
Terrain: ${terrain}

Write a 2-3 sentence connection.`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 300,
    system: SYSTEM,
    messages: [{ role: 'user', content: userMsg }],
  });

  return (response.content?.[0]?.text || '').trim();
}

async function main() {
  // Dynamically import the card data (ESM)
  const deckPath = path.join(ROOT, 'src/data/cardDeck.js');
  const deckModule = await import(deckPath);
  const cards = deckModule.CARDS;

  const results = {};
  const BATCH = 5;

  for (let i = 0; i < cards.length; i += BATCH) {
    const batch = cards.slice(i, i + BATCH);
    const promises = batch.map(async (card) => {
      const dest = DEST_MAP[card.id] || 'zion';
      const destLabel = DEST_NAMES[dest]?.split(',')[0] || dest;
      try {
        const connection = await generateOne(card, dest);
        results[card.id] = connection;
        console.log(`[${i + batch.indexOf(card) + 1}/30] ${card.name} (${destLabel}) → done`);
      } catch (e) {
        console.error(`[${i + batch.indexOf(card) + 1}/30] ${card.name} (${destLabel}) → ERROR: ${e.message}`);
        results[card.id] = '';
      }
    });
    await Promise.all(promises);
    // Delay between batches
    if (i + BATCH < cards.length) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  // ── Write results into cardDeck.js ──────────────────────────────────────
  let source = fs.readFileSync(deckPath, 'utf-8');

  for (const card of cards) {
    const conn = results[card.id] || '';
    // Escape for JS string
    const escaped = conn.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, ' ');

    // Insert connection field after avoidWhen line for each card
    const avoidPattern = new RegExp(
      `(    id: '${card.id}',[\\s\\S]*?avoidWhen: \\[[^\\]]*\\],)\\n  \\}`
    );
    const match = source.match(avoidPattern);
    if (match) {
      source = source.replace(
        match[0],
        `${match[1]}\n    connection: '${escaped}',\n  }`
      );
    } else {
      console.warn(`Could not find insertion point for ${card.id}`);
    }
  }

  fs.writeFileSync(deckPath, source, 'utf-8');
  console.log('\n✓ All connections written to src/data/cardDeck.js');
}

main().catch(e => {
  console.error('Fatal:', e);
  process.exit(1);
});
