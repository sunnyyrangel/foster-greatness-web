/**
 * Client-side analytics tracking via Supabase
 *
 * Drop-in replacement for @vercel/analytics track() —
 * sends events to /api/analytics/track using sendBeacon (survives page navigations)
 * with a fetch fallback. Fire-and-forget, never blocks UI.
 */

type EventProperties = Record<string, string | number | boolean | undefined>;

/**
 * Track a custom event to Supabase.
 *
 * @param eventName - The event name (e.g. 'service_search', 'service_contact_click')
 * @param properties - Event properties (zip, category, program_name, etc.)
 */
export function trackEvent(eventName: string, properties: EventProperties = {}): void {
  try {
    const payload = JSON.stringify({ event_name: eventName, properties });

    // Prefer sendBeacon — survives tel:/mailto: navigations
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' });
      const sent = navigator.sendBeacon('/api/analytics/track', blob);
      if (sent) return;
    }

    // Fallback to fetch with keepalive
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {
      // Silently swallow — analytics should never affect UX
    });
  } catch {
    // Silently swallow all errors
  }
}
