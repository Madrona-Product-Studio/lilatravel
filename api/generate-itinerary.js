/**
 * Lila Trips — Itinerary Generation API Route
 * 
 * Vercel serverless function.
 * File location: /api/generate-itinerary.js
 * 
 * POST /api/generate-itinerary
 * Body: { destination, preferences }
 * 
 * This is the endpoint your React frontend calls after
 * the user completes the onboarding flow.
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { assembleContext, buildClaudeMessage } from '../src/services/destination-data.js';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Load the system prompt once at startup
const systemPrompt = fs.readFileSync(
  path.join(process.cwd(), 'prompts', 'system-prompt.md'),
  'utf-8'
);

export default async function handler(req, res) {
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const t0 = Date.now();
    const { destination, preferences } = req.body;

    // Validate required fields
    if (!destination || !preferences) {
      return res.status(400).json({
        error: 'Missing required fields: destination, preferences'
      });
    }

    if (!preferences.dates?.start && !preferences.month) {
      return res.status(400).json({
        error: 'Missing required fields: either preferences.dates or preferences.month'
      });
    }

    // 1. Assemble all context (static guide + live data)
    const context = await assembleContext(destination, preferences);
    const t1 = Date.now();

    // 2. Build the Claude API message (Pass 1: skip alternatives for faster response)
    const messagePayload = buildClaudeMessage(context, systemPrompt, { skipAlternatives: true });
    const t2 = Date.now();

    // 3. Call Claude
    const response = await anthropic.messages.create(messagePayload);
    const t3 = Date.now();

    // 4. Extract the text response
    const itinerary = response.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('\n');

    // Timing breakdown
    const timing = {
      contextAssemblyMs: t1 - t0,
      messageBuildMs: t2 - t1,
      claudeApiMs: t3 - t2,
      totalMs: t3 - t0,
    };
    console.log('[TIMING]', JSON.stringify(timing));
    console.log('[USAGE]', JSON.stringify(response.usage));

    // 5. Return the itinerary
    return res.status(200).json({
      success: true,
      itinerary,
      metadata: {
        destination,
        dates: preferences.dates,
        model: messagePayload.model,
        hasAlerts: !!context.liveData.alerts,
        hasWeather: !!context.liveData.weatherRaw,
        celestial: context.liveData.celestialRaw || null,
        weather: context.liveData.weatherRaw || null,
        timing,
        usage: response.usage,
      }
    });

  } catch (error) {
    console.error('Itinerary generation failed:', error);

    // Handle specific errors
    if (error.message?.includes('No guide found')) {
      return res.status(404).json({ 
        error: `Destination guide not available yet. We're working on it!` 
      });
    }

    return res.status(500).json({ 
      error: 'Something went wrong generating your itinerary. Please try again.' 
    });
  }
}


// ============================================================
// STREAMING VARIANT (for real-time display)
// ============================================================

/**
 * If you want the itinerary to stream in real-time (like a chat),
 * use this variant instead. It sends Server-Sent Events (SSE).
 * 
 * File location: /api/generate-itinerary-stream.js
 * 
 * Your React frontend would use:
 *   const response = await fetch('/api/generate-itinerary-stream', { ... });
 *   const reader = response.body.getReader();
 *   // Read chunks and append to display
 */

export async function streamHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { destination, preferences } = req.body;
    const context = await assembleContext(destination, preferences);
    const messagePayload = buildClaudeMessage(context, systemPrompt);

    // Set up SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Stream from Claude
    const stream = await anthropic.messages.stream(messagePayload);

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta?.text) {
        res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();

  } catch (error) {
    console.error('Stream failed:', error);
    res.write(`data: ${JSON.stringify({ error: 'Generation failed' })}\n\n`);
    res.end();
  }
}
