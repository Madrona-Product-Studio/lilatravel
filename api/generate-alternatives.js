/**
 * Lila Trips — Alternatives Generation API Route (Pass 2)
 *
 * Vercel serverless function.
 * File location: /api/generate-alternatives.js
 *
 * POST /api/generate-alternatives
 * Body: { destination, preferences, itinerary }
 *
 * Generates alternatives for an already-generated itinerary.
 * Called in the background after the main itinerary renders.
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { loadGuide } from '../src/services/destination-data.js';
import { checkOrigin, checkRateLimit } from './_utils.js';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Load the system prompt once at startup
const systemPrompt = fs.readFileSync(
  path.join(process.cwd(), 'prompts', 'system-prompt.md'),
  'utf-8'
);

const ALTERNATIVES_INSTRUCTION = `You are adding alternatives to an existing itinerary. You will receive the destination guide and the generated itinerary JSON.

Your task: Return a JSON object with alternatives for timeline items and picks. Follow the same rules from your system prompt for alternatives:

**Timeline alternatives**: Include at least 2 alternatives on EVERY activity EXCEPT logistics, check-in/check-out, drives, transit, and mindfulness items. This includes hikes, meals, wellness sessions, town visits, cultural stops, coffee/café stops, and any other substantive experience.
Each alternative: { "title": "string", "summary": "1 sentence", "timeOfDay": "same enum as parent" }
Alternatives should contrast with the primary: strenuous ↔ restorative, solitary ↔ social, active ↔ contemplative.
For early morning signature activities (before 9 AM), include a "Sleep in" alternative.

**Pick alternatives** (stay, eat, gear, wellness only — NOT mindfulness):
- Every "stay" pick MUST have at least 1 alternative.
- Every "eat" pick MUST have at least 1 alternative.
- Same structure as the pick: include name, why, vibe, and type-specific fields (priceRange, stayType, cuisine, etc.)
- Alternative names MUST come from the destination guide.
- "why" should contrast with the main pick in 1 sentence.
- No alternatives on mindfulness picks.

**Brevity rules**: summary = 1 sentence. why = 1 sentence. Do not be verbose.

Return ONLY this JSON structure (no markdown fences, no preamble):
{
  "days": [
    {
      "timelineAlts": [
        { "itemIndex": 3, "alternatives": [{ "title": "...", "summary": "...", "timeOfDay": "..." }] }
      ],
      "pickAlts": [
        { "pickIndex": 1, "alternatives": [{ "name": "...", "why": "...", "vibe": "...", ... }] }
      ]
    }
  ]
}

Each day entry corresponds to the same day index in the itinerary. Only include entries where alternatives are warranted. timelineAlts and pickAlts can be empty arrays for days with no alternatives.`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!checkOrigin(req, res)) return;
  if (!checkRateLimit(req, res, 'generate-alternatives')) return;

  // Map camelCase form IDs to kebab-case slugs
  const DEST_MAP = {
    bigSur: 'big-sur', joshuaTree: 'joshua-tree',
    olympic: 'olympic-peninsula', vancouver: 'vancouver-island',
  };

  try {
    const t0 = Date.now();
    const { destination: rawDest, preferences, itinerary, loadMore } = req.body;
    const destination = DEST_MAP[rawDest] || rawDest;

    if (!destination || !itinerary) {
      return res.status(400).json({
        error: 'Missing required fields: destination, itinerary',
      });
    }

    // Load the destination guide (benefits from prompt caching — same content as Pass 1)
    const guide = loadGuide(destination);
    const t1 = Date.now();

    const guideBlock = `## Destination Guide (ONLY recommend from this content)\n\n${guide}`;

    let extraInstruction = '';
    if (loadMore) {
      extraInstruction = `\n\nIMPORTANT: The user is requesting MORE alternatives. Generate DIFFERENT alternatives than what you would normally suggest — explore different styles, vibes, and difficulty levels. Aim for variety and surprise.`;
    }

    const userMessage = `Here is the generated itinerary (JSON). Add alternatives to it following the rules above.${extraInstruction}

${itinerary}`;

    const messagePayload = {
      model: 'claude-sonnet-4-6',
      max_tokens: 8000,
      system: [
        { type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } },
        { type: 'text', text: ALTERNATIVES_INSTRUCTION },
      ],
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: guideBlock, cache_control: { type: 'ephemeral' } },
            { type: 'text', text: userMessage },
          ],
        },
      ],
    };

    const t2 = Date.now();

    const response = await anthropic.messages.create(messagePayload);
    const t3 = Date.now();

    const rawText = response.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('\n');

    // Check for truncation
    if (response.stop_reason === 'max_tokens') {
      console.error(`[ALTERNATIVES] Output truncated — hit max_tokens (${messagePayload.max_tokens})`);
      return res.status(502).json({
        error: 'Alternatives response was truncated. Try again.',
      });
    }

    // Parse the alternatives JSON
    let alternatives;
    try {
      let cleaned = rawText.replace(/```(?:json)?\s*/gi, '');
      const firstBrace = cleaned.indexOf('{');
      const lastBrace = cleaned.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        cleaned = cleaned.slice(firstBrace, lastBrace + 1);
      }
      cleaned = cleaned.replace(/,\s*([}\]])/g, '$1');
      alternatives = JSON.parse(cleaned);
    } catch (e) {
      console.error('Alternatives JSON parse failed:', e.message);
      console.error('Raw text:', rawText.slice(0, 500));
      return res.status(500).json({
        error: 'Failed to parse alternatives response',
      });
    }

    const timing = {
      guideLoadMs: t1 - t0,
      messageBuildMs: t2 - t1,
      claudeApiMs: t3 - t2,
      totalMs: t3 - t0,
    };
    return res.status(200).json({
      success: true,
      alternatives,
      metadata: {
        timing,
        usage: response.usage,
      },
    });
  } catch (error) {
    console.error('Alternatives generation failed:', error);
    return res.status(500).json({
      error: 'Failed to generate alternatives.',
    });
  }
}
