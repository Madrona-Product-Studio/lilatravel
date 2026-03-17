/**
 * Shared utilities for API routes.
 */

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
