/**
 * Shared utilities for API routes.
 */

// ─── Rate Limiting ──────────────────────────────────────────────────────────
// In-memory per-instance rate limiter. Vercel keeps instances warm for ~15min,
// so this catches sustained abuse from a single IP within that window.
// Not perfect (resets on cold start) but dramatically better than nothing.

const rateLimitStore = new Map();

const RATE_LIMITS = {
  // endpoint key → { maxRequests, windowMs }
  'generate-itinerary':      { maxRequests: 5,  windowMs: 60 * 60 * 1000 },  // 5/hour
  'refine-itinerary':        { maxRequests: 10, windowMs: 60 * 60 * 1000 },  // 10/hour
  'generate-alternatives':   { maxRequests: 15, windowMs: 60 * 60 * 1000 },  // 15/hour
  'generate-card-connections': { maxRequests: 10, windowMs: 60 * 60 * 1000 }, // 10/hour
  'extract-booking':         { maxRequests: 20, windowMs: 60 * 60 * 1000 },  // 20/hour
  'send-trip-email':         { maxRequests: 10, windowMs: 60 * 60 * 1000 },  // 10/hour
  'send-contact-email':      { maxRequests: 5,  windowMs: 60 * 60 * 1000 },  // 5/hour
  'places-search':           { maxRequests: 60, windowMs: 60 * 60 * 1000 },  // 60/hour
  'place-photo':             { maxRequests: 120, windowMs: 60 * 60 * 1000 }, // 120/hour
  'wildlife-lookup':         { maxRequests: 60, windowMs: 60 * 60 * 1000 },  // 60/hour
  'astronomy':               { maxRequests: 30, windowMs: 60 * 60 * 1000 },  // 30/hour
};

/**
 * Check rate limit for the given endpoint. Returns true if allowed, false if blocked.
 * Sets 429 status and Retry-After header when blocked.
 */
export function checkRateLimit(req, res, endpointKey) {
  const config = RATE_LIMITS[endpointKey];
  if (!config) return true; // no limit configured

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
           || req.headers['x-real-ip']
           || req.socket?.remoteAddress
           || 'unknown';
  const key = `${endpointKey}:${ip}`;
  const now = Date.now();

  let entry = rateLimitStore.get(key);
  if (!entry || now - entry.windowStart > config.windowMs) {
    // New window
    entry = { windowStart: now, count: 0 };
  }

  entry.count++;
  rateLimitStore.set(key, entry);

  // Cleanup old entries periodically (every 100 checks)
  if (rateLimitStore.size > 500) {
    for (const [k, v] of rateLimitStore) {
      if (now - v.windowStart > config.windowMs) rateLimitStore.delete(k);
    }
  }

  if (entry.count > config.maxRequests) {
    const retryAfter = Math.ceil((config.windowMs - (now - entry.windowStart)) / 1000);
    res.setHeader('Retry-After', String(retryAfter));
    res.status(429).json({
      error: 'Too many requests. Please try again later.',
      retryAfter,
    });
    return false;
  }

  return true;
}

const ALLOWED_ORIGINS = [
  'https://www.lilatrips.com',
  'https://lilatrips.com',
  'https://lilatravel.vercel.app',
];

// Allow localhost in development
if (process.env.NODE_ENV !== 'production' && process.env.VERCEL_ENV !== 'production') {
  ALLOWED_ORIGINS.push('http://localhost:5173', 'http://localhost:3000');
}

/**
 * Validate request origin. Returns true if allowed, false otherwise.
 * Also sets CORS headers on the response.
 */
export function checkOrigin(req, res) {
  const origin = req.headers.origin || req.headers.referer;

  // Allow same-origin requests (no Origin header, e.g. server-to-server)
  if (!origin) {
    // For GET endpoints (e.g. shared trips), allow without origin
    if (req.method === 'GET') return true;
    // For POST endpoints, require an origin header
    res.status(403).json({ error: 'Forbidden' });
    return false;
  }

  const allowed = ALLOWED_ORIGINS.some(ao => origin.startsWith(ao));
  if (!allowed) {
    res.status(403).json({ error: 'Forbidden' });
    return false;
  }

  res.setHeader('Access-Control-Allow-Origin', origin);
  return true;
}

/**
 * Escape HTML special characters to prevent injection in email templates.
 */
export function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Validate email format (basic RFC-compatible check).
 */
export function isValidEmail(str) {
  if (!str || typeof str !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
}

/**
 * Validate that a URL is a safe HTTP(S) URL (not javascript:, data:, etc.)
 */
export function isSafeUrl(url) {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}
