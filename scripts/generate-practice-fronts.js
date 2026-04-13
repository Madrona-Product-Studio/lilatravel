#!/usr/bin/env node
/**
 * generate-practice-fronts.js
 * ───────────────────────────
 * Generates practiceTitle + frontParagraph for each card in cardDeck.js.
 * Uses the Anthropic SDK. Process in batches of 5 with 1s delay.
 *
 * Usage: npm run generate:fronts
 *        (or: ANTHROPIC_API_KEY=sk-... node scripts/generate-practice-fronts.js)
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

const TITLE_SYSTEM = `You write short, invitational practice titles for mindfulness cards. The title should feel like an invitation, not a label. It names what the person will actually DO or NOTICE. Short — 3-6 words. Imperative but gentle. No jargon.

Good examples:
- Pick a Yama.
- Follow your breath.
- Move without forcing.
- Let the passing matter.
- Trace everything back.

Bad examples (too abstract/academic):
- Explore Wu Wei.
- Contemplate Impermanence.
- Practice Mettā.`;

const PARA_SYSTEM = `You write the front face paragraph for mindfulness practice cards used by adventure travelers.

The paragraph should be ONE continuous sentence or 2-3 short sentences that flow together. It must include:
1. What the concept is (brief, accessible)
2. Where it comes from (tradition)
3. An invitation to carry it today
4. One concrete, nature-grounded example of how it shows up — using 'notice' language

Target: 40-60 words total.
Tone: calm, observational, invitational.
No jargon. No academic language.
Plain sentences. No bullet points.`;

async function generateTitle(card) {
  const res = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 50,
    system: TITLE_SYSTEM,
    messages: [{ role: 'user', content: `Card: ${card.name}\nPrinciple: ${card.principle}\nTradition: ${card.tradition}\nTeaching: ${card.teaching}\n\nWrite a practice title. Return only the title, nothing else.` }],
  });
  return (res.content?.[0]?.text || '').trim();
}

async function generateParagraph(card) {
  const res = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 200,
    system: PARA_SYSTEM,
    messages: [{ role: 'user', content: `Card: ${card.name}\nPrinciple: ${card.principle}\nTradition: ${card.tradition}\nTeaching: ${card.teaching}\nSubtitle: ${card.subtitle}\n\nWrite the front paragraph. Return only the paragraph, nothing else.` }],
  });
  return (res.content?.[0]?.text || '').trim();
}

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
      try {
        const title = await generateTitle(card);
        const para = await generateParagraph(card);
        const titleEsc = title.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
        const paraEsc = para.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

        // Replace practiceTitle
        const tp = new RegExp(`(id: '${card.id}',[\\s\\S]*?practiceTitle: ')([^']*)(')`)
        const tm = source.match(tp);
        if (tm) source = source.substring(0, tm.index) + source.substring(tm.index).replace(tm[2], titleEsc);

        // Replace frontParagraph
        const fp = new RegExp(`(id: '${card.id}',[\\s\\S]*?frontParagraph: ')([^']*)(')`)
        const fm = source.match(fp);
        if (fm) source = source.substring(0, fm.index) + source.substring(fm.index).replace(fm[2], paraEsc);

        console.log(`[${idx}/30] ${card.name} — practiceTitle done, frontParagraph done`);
      } catch (e) {
        console.error(`[${idx}/30] ${card.name} — ERROR: ${e.message}`);
      }
    }));
    if (i + BATCH < cards.length) await new Promise(r => setTimeout(r, 1000));
  }

  fs.writeFileSync(deckPath, source, 'utf-8');
  console.log('\n✓ All fronts written to src/data/cardDeck.js');
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
