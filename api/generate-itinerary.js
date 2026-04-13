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
import { checkOrigin, checkRateLimit } from './_utils.js';

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
  if (!checkOrigin(req, res)) return;
  if (!checkRateLimit(req, res, 'generate-itinerary')) return;

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

    // 3. Stream from Claude with keepalive pings to prevent mobile timeouts
    //    The client receives chunked data but only parses the final JSON line.
    res.setHeader('Content-Type', 'application/x-ndjson');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('X-Accel-Buffering', 'no'); // disable nginx buffering

    // Send an initial keepalive immediately so the connection is established
    res.write('\n');

    // Keepalive: send a newline every 15s to prevent carrier/browser timeouts
    const keepalive = setInterval(() => { try { res.write('\n'); } catch {} }, 15000);

    let response, itinerary;
    try {
      response = await anthropic.messages.create(messagePayload);
      itinerary = response.content
        .filter(block => block.type === 'text')
        .map(block => block.text)
        .join('\n');
    } finally {
      clearInterval(keepalive);
    }
    const t3 = Date.now();

    // Fail fast if output was truncated
    if (response.stop_reason === 'max_tokens') {
      console.error(`[GENERATE] Output truncated — hit max_tokens (${messagePayload.max_tokens}) for ${destination}`);
      clearInterval(keepalive);
      const errMsg = 'The itinerary was too long and got cut off. Try a shorter trip duration or simpler preferences, then try again.';
      if (res.headersSent) {
        res.write(JSON.stringify({ success: false, error: errMsg }) + '\n');
        return res.end();
      }
      return res.status(502).json({ error: errMsg });
    }

    // Validate response is parseable JSON with days array
    try {
      const firstBrace = itinerary.indexOf('{');
      const lastBrace = itinerary.lastIndexOf('}');
      if (firstBrace === -1 || lastBrace === -1) throw new Error('No JSON object found');
      const parsed = JSON.parse(itinerary.slice(firstBrace, lastBrace + 1));
      if (!parsed.days || !Array.isArray(parsed.days)) throw new Error('Missing days array');
    } catch (parseErr) {
      console.error(`[GENERATE] Response failed JSON validation: ${parseErr.message}`);
      console.error(`[GENERATE] Raw response (first 500 chars): ${itinerary.slice(0, 500)}`);
      const errMsg = 'The itinerary response was malformed. Please try again — this usually resolves on retry.';
      if (res.headersSent) {
        res.write(JSON.stringify({ success: false, error: errMsg }) + '\n');
        return res.end();
      }
      return res.status(502).json({ error: errMsg });
    }

    // Sanitize URLs — strip hallucinated or staging URLs from the response
    const BLOCKED_URL_PATTERNS = [
      /wpengine\.com/i,
      /\.staging\./i,
      /\.dev\./i,
      /localhost/i,
      /127\.0\.0\.1/i,
      /example\.com/i,
    ];
    const sanitizeUrls = (obj) => {
      if (!obj || typeof obj !== 'object') return obj;
      if (Array.isArray(obj)) return obj.map(sanitizeUrls);
      const result = { ...obj };
      for (const key of Object.keys(result)) {
        if (key === 'url' || key === 'npsUrl') {
          if (typeof result[key] === 'string' && BLOCKED_URL_PATTERNS.some(p => p.test(result[key]))) {
            console.warn(`[SANITIZE] Removed blocked URL: ${result[key]}`);
            delete result[key];
          }
        } else if (typeof result[key] === 'object') {
          result[key] = sanitizeUrls(result[key]);
        }
      }
      return result;
    };
    try {
      const parsed = JSON.parse(itinerary.slice(itinerary.indexOf('{'), itinerary.lastIndexOf('}') + 1));
      const sanitized = sanitizeUrls(parsed);
      itinerary = JSON.stringify(sanitized);
    } catch (e) {
      // If sanitization fails, proceed with original — validation already passed above
    }

    // Timing breakdown
    const timing = {
      contextAssemblyMs: t1 - t0,
      messageBuildMs: t2 - t1,
      claudeApiMs: t3 - t2,
      totalMs: t3 - t0,
    };
    console.log('[TIMING]', JSON.stringify(timing));
    console.log('[USAGE]', JSON.stringify(response.usage));

    // Send the full result as the final line and close
    res.write(JSON.stringify({
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
    }) + '\n');
    return res.end();

  } catch (error) {
    console.error('Itinerary generation failed:', error);

    const msg = error.message?.includes('No guide found')
      ? `Destination guide not available yet. We're working on it!`
      : 'Something went wrong generating your itinerary. Please try again.';
    const status = error.message?.includes('No guide found') ? 404 : 500;

    // If headers already sent (keepalive started), write error as NDJSON line
    if (res.headersSent) {
      res.write(JSON.stringify({ success: false, error: msg }) + '\n');
      return res.end();
    }
    return res.status(status).json({ error: msg });
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
