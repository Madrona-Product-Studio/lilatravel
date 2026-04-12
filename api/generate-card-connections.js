/**
 * Lila Trips — Card Connection Generation (Pass 2)
 *
 * Vercel serverless function.
 * File location: /api/generate-card-connections.js
 *
 * POST /api/generate-card-connections
 * Body: { destination, days }
 *
 * Receives assembled days with their assigned practice cards
 * and returns cardPrompt + cardConnection for each day.
 * Called in the background after the main itinerary renders.
 */

import Anthropic from '@anthropic-ai/sdk';
import { checkOrigin } from './_utils.js';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are writing short contextual connections between ancient practice cards and specific travel days.

For each day you receive a day title, terrain description, activities, and an assigned practice card. Write:

1. cardPrompt — one evocative line (8-12 words) connecting the card to this specific day. Plain declarative language, no editorializing. Example: "Today, let the river set the pace."

2. cardConnection — 2-3 sentences applying the card's teaching to today's specific landscape, conditions, and day shape. Reference actual terrain and activity. Do not explain the card — apply it to the day. Example: "The Narrows puts Ahimsa in motion with every step — the water, the canyon walls, the creatures sharing this corridor all ask for conscious passage."

Return ONLY a JSON array, no markdown fences, no preamble:
[
  { "dayIndex": 0, "cardPrompt": "...", "cardConnection": "..." },
  ...
]`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!checkOrigin(req, res)) return;

  try {
    const { destination, days } = req.body;

    if (!days || !Array.isArray(days) || days.length === 0) {
      return res.status(400).json({ error: 'Missing or empty days array' });
    }

    // Build the user message from assembled days
    const lines = [`Destination: ${destination || 'Unknown'}\n`];

    days.forEach((d, i) => {
      const activities = (d.timeline || [])
        .map(t => t.title)
        .filter(Boolean)
        .join(', ');
      const terrain = d.intro || (d.timeline?.[0]?.summary) || '';

      lines.push(`Day ${i + 1}: ${d.title || `Day ${i + 1}`}`);
      if (terrain) lines.push(`Terrain: ${terrain}`);
      if (activities) lines.push(`Activities: ${activities}`);
      if (d.cardName) {
        lines.push(`Assigned card: ${d.cardName} (${d.cardPrinciple} · ${d.cardTradition})`);
        if (d.cardTeaching) lines.push(`Card teaching: ${d.cardTeaching}`);
      }
      lines.push('---');
    });

    const userMessage = lines.join('\n');

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    });

    const text = response.content?.[0]?.text || '';

    // Parse JSON — strip any accidental markdown fences
    const cleaned = text.replace(/```json?\s*/g, '').replace(/```\s*/g, '').trim();
    const connections = JSON.parse(cleaned);

    if (!Array.isArray(connections)) {
      return res.status(500).json({ error: 'Unexpected response format' });
    }

    return res.status(200).json({ connections });
  } catch (e) {
    console.error('generate-card-connections failed:', e.message || e);
    return res.status(500).json({ error: 'Card connection generation failed' });
  }
}
