/**
 * Client-side analytics tracking via Supabase
 *
 * Drop-in replacement for @vercel/analytics track() —
 * sends events to /api/analytics/track using sendBeacon (survives page navigations)
 * with a fetch fallback. Fire-and-forget, never blocks UI.
 */

type EventProperties = Record<string, string | number | boolean | undefined>;

// Google Ads conversion tracking
// Replace 'CONVERSION_LABEL' with actual labels from Google Ads when available
const GOOGLE_ADS_ID = 'AW-11440847917';

export const CONVERSION_LABELS = {
  service_search: 'Ydl3CJScsYwcEK34tc8q',
  community_join: 'dy69CMuBoIwcEK34tc8q',
} as const;

/**
 * Fire a Google Ads conversion event.
 * Safe to call even if gtag hasn't loaded — silently no-ops.
 */
export function trackGoogleConversion(label: string): void {
  try {
    const w = window as unknown as { gtag?: (...args: unknown[]) => void };
    if (typeof w.gtag === 'function') {
      w.gtag('event', 'conversion', {
        send_to: `${GOOGLE_ADS_ID}/${label}`,
      });
    }
  } catch {
    // Silently swallow — ads tracking should never affect UX
  }
}

/**
 * Track a custom event to Supabase.
 *
 * @param eventName - The event name (e.g. 'service_search', 'service_contact_click')
 * @param properties - Event properties (zip, category, program_name, etc.)
 */
export function trackEvent(eventName: string, properties: EventProperties = {}): void {
  try {
    // Skip tracking for admin users (fg_admin cookie set on admin login)
    if (typeof document !== 'undefined' && document.cookie.includes('fg_admin=1')) {
      return;
    }

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
