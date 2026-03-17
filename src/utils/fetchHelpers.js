/**
 * Safe JSON response parser.
 * Checks res.ok, wraps .json() in try-catch.
 * Returns { ok, data, error }.
 */
export async function safeJson(res) {
  try {
    const data = await res.json();
    if (!res.ok) {
      return { ok: false, data, error: data.error || `HTTP ${res.status}` };
    }
    return { ok: true, data, error: null };
  } catch {
    return { ok: false, data: null, error: `HTTP ${res.status} (invalid JSON)` };
  }
}

/**
 * Create an AbortController with a timeout.
 * Returns { controller, signal, clear }.
 * Call clear() after the fetch completes to prevent the timeout from firing.
 */
export function fetchWithTimeout(ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return {
    signal: controller.signal,
    clear: () => clearTimeout(timer),
  };
}
