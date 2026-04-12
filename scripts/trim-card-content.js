#!/usr/bin/env node
/**
 * trim-card-content.js
 * ────────────────────
 * Trims practice and connection fields on cards that exceed word limits.
 * Uses the Anthropic SDK to preserve voice while cutting length.
 *
 * Targets:
 *   practice:   65 words max
 *   connection:  42 words max
 *
 * Usage: npm run trim:cards
 *        (or: ANTHROPIC_API_KEY=sk-... node scripts/trim-card-content.js)
 *
 * Requires ANTHROPIC_API_KEY in .env.local or environment.
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Load env
try {
  for (const f of ['.env', '.env.local']) {
    const fp = path.join(ROOT, f);
    if (fs.existsSync(fp)) {
      const lines = fs.readFileSync(fp, 'utf-8').split('\n');
      for (const line of lines) {
        const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/);
        if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
      }
    }
  }
} catch { /* ignore */ }

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const LIMITS = { practice: 65, connection: 42 };

const SYSTEM = `You are editing practice card content for a mindfulness card deck. Trim the following text to fit the target word count. Preserve the core instruction and most evocative language. Cut anything redundant or secondary. Do not add any new content. Return only the trimmed text with no preamble, quotes, or explanation.`;

async function trimField(text, target) {
  const res = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 400,
    system: SYSTEM,
    messages: [{ role: 'user', content: `Trim to ${target} words maximum.\n\n${text}` }],
  });
  return (res.content?.[0]?.text || text).trim();
}

const wc = s => s ? s.trim().split(/\s+/).length : 0;

async function main() {
  const deckPath = path.join(ROOT, 'src/data/cardDeck.js');
  const mod = await import(deckPath);
  const cards = mod.CARDS;
  let source = fs.readFileSync(deckPath, 'utf-8');
  const BATCH = 5;

  for (let i = 0; i < cards.length; i += BATCH) {
    const batch = cards.slice(i, i + BATCH);
    await Promise.all(batch.map(async (card, bi) => {
      const idx = i + bi + 1;
      const pWc = wc(card.practice);
      const cWc = wc(card.connection);
      const parts = [];

      if (pWc > LIMITS.practice) {
        const trimmed = await trimField(card.practice, LIMITS.practice);
        const escaped = trimmed.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
        const oldEscaped = card.practice.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        source = source.replace(new RegExp(oldEscaped), escaped);
        parts.push(`practice trimmed ${pWc}w → ${wc(trimmed)}w`);
      } else {
        parts.push(`practice OK (${pWc}w)`);
      }

      if (cWc > LIMITS.connection) {
        const trimmed = await trimField(card.connection, LIMITS.connection);
        const escaped = trimmed.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
        const oldEscaped = card.connection.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        source = source.replace(new RegExp(oldEscaped), escaped);
        parts.push(`connection trimmed ${cWc}w → ${wc(trimmed)}w`);
      } else if (cWc > 0) {
        parts.push(`connection OK (${cWc}w)`);
      }

      console.log(`[${idx}/30] ${card.name} — ${parts.join(', ')}`);
    }));

    if (i + BATCH < cards.length) await new Promise(r => setTimeout(r, 1000));
  }

  fs.writeFileSync(deckPath, source, 'utf-8');
  console.log('\n✓ All trims written to src/data/cardDeck.js');
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
