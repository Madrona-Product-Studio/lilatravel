/**
 * Lila Trips — GA4 Analytics Helper
 *
 * Thin wrapper around window.gtag. GA4 is initialized in index.html.
 * See ga4-event-schema.md for the full event taxonomy.
 */

export function trackEvent(name, params = {}) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, params);
  }
}
