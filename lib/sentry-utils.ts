import type { ErrorEvent, EventHint } from '@sentry/nextjs';

/**
 * Sentry Utility Functions
 *
 * These functions help filter noise and add context to error reports.
 * They respect Foster Greatness privacy policies by not capturing PII.
 */

/**
 * Determines if an error should be ignored by Sentry
 * Returns true if the error should NOT be sent to Sentry
 */
export function shouldIgnoreError(event: ErrorEvent, hint: EventHint): boolean {
  const error = hint.originalException;

  // Ignore browser extension errors
  if (error && typeof error === 'object' && 'stack' in error) {
    const stack = String(error.stack || '');
    if (
      stack.includes('chrome-extension://') ||
      stack.includes('moz-extension://') ||
      stack.includes('safari-extension://')
    ) {
      return true;
    }
  }

  // Ignore certain error messages
  const errorMessage = getErrorMessage(error);
  const ignoredPatterns = [
    'Non-Error promise rejection',
    'Script error',
    'Timeout',
    'Loading chunk',
    'ChunkLoadError',
  ];

  for (const pattern of ignoredPatterns) {
    if (errorMessage.includes(pattern)) {
      return true;
    }
  }

  // Ignore cancelled/aborted requests
  if (error && typeof error === 'object') {
    if ('name' in error && error.name === 'AbortError') {
      return true;
    }
    if ('code' in error && (error.code === 'ERR_CANCELED' || error.code === 'ECONNABORTED')) {
      return true;
    }
  }

  return false;
}

/**
 * Filters and enriches events before sending to Sentry
 * Removes PII and adds Foster Greatness-specific context
 */
export function beforeSendFilter(event: ErrorEvent, hint: EventHint): ErrorEvent | null {
  // Remove PII from event
  if (event.user) {
    // Keep only non-PII user data
    const { id, username, ...pii } = event.user;
    event.user = { id: id ? 'anonymized' : undefined };
  }

  // Remove sensitive data from request
  if (event.request) {
    // Remove cookies and auth headers
    if (event.request.cookies) {
      delete event.request.cookies;
    }
    if (event.request.headers) {
      delete event.request.headers.cookie;
      delete event.request.headers.authorization;
    }
  }

  // Remove query strings that might contain sensitive data
  if (event.request?.url) {
    try {
      const url = new URL(event.request.url);
      // Remove specific sensitive query params
      const sensitiveParams = ['token', 'key', 'secret', 'password', 'api_key'];
      sensitiveParams.forEach(param => url.searchParams.delete(param));
      event.request.url = url.toString();
    } catch {
      // Invalid URL, keep as is
    }
  }

  // Add Foster Greatness context
  event.tags = {
    ...event.tags,
    project: 'foster-greatness-website',
    platform: typeof window !== 'undefined' ? 'browser' : 'server',
  };

  // Add campaign context if available (from URL)
  if (typeof window !== 'undefined') {
    const path = window.location.pathname;
    if (path.includes('holiday-gift-drive')) {
      event.tags.campaign = 'holiday-gift-drive-2025';
    } else if (path.includes('gingerbread')) {
      event.tags.campaign = 'gingerbread-contest';
    } else if (path.includes('storytellers')) {
      event.tags.campaign = 'storytellers-collective';
    }

    // Add page context
    event.contexts = {
      ...event.contexts,
      page: {
        path: window.location.pathname,
        title: document.title,
      },
    };
  }

  return event;
}

/**
 * Sets user context for Sentry
 * Only use this with anonymized or non-PII data
 */
export function setSentryUser(userId?: string, userType?: 'member' | 'visitor' | 'donor') {
  if (typeof window === 'undefined') return;

  const Sentry = require('@sentry/nextjs');
  Sentry.setUser({
    id: userId ? `user_${userId.substring(0, 8)}` : undefined, // Anonymize ID
    type: userType,
  });
}

/**
 * Adds campaign context to Sentry events
 */
export function setCampaignContext(campaignId: string, campaignName: string) {
  if (typeof window === 'undefined') return;

  const Sentry = require('@sentry/nextjs');
  Sentry.setContext('campaign', {
    id: campaignId,
    name: campaignName,
  });
}

/**
 * Adds a breadcrumb for tracking user actions
 */
export function addSentryBreadcrumb(
  message: string,
  category: string,
  level: 'info' | 'warning' | 'error' = 'info',
  data?: Record<string, any>
) {
  if (typeof window === 'undefined') return;

  const Sentry = require('@sentry/nextjs');
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
    timestamp: Date.now() / 1000,
  });
}

/**
 * Manually capture an exception with context
 */
export function captureException(error: Error, context?: Record<string, any>) {
  const Sentry = require('@sentry/nextjs');

  if (context) {
    Sentry.withScope((scope: any) => {
      Object.entries(context).forEach(([key, value]) => {
        scope.setContext(key, value);
      });
      Sentry.captureException(error);
    });
  } else {
    Sentry.captureException(error);
  }
}

/**
 * Manually capture a message with context
 */
export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', context?: Record<string, any>) {
  const Sentry = require('@sentry/nextjs');

  if (context) {
    Sentry.withScope((scope: any) => {
      Object.entries(context).forEach(([key, value]) => {
        scope.setContext(key, value);
      });
      Sentry.captureMessage(message, level);
    });
  } else {
    Sentry.captureMessage(message, level);
  }
}

// Helper function to extract error message
function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  return String(error);
}
