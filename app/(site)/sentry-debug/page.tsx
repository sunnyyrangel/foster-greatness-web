'use client';

import { useEffect, useState } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function SentryDebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const info = {
      sentryLoaded: typeof Sentry !== 'undefined',
      sentryAvailable: typeof Sentry.captureException === 'function',
      hasCaptureException: !!Sentry.captureException,
      hasCaptureMessage: !!Sentry.captureMessage,
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || 'NOT SET',
      nodeEnv: process.env.NODE_ENV,
    };
    setDebugInfo(info);
  }, []);

  const testError = () => {
    try {
      Sentry.captureException(new Error('Test error from debug page'));
      alert('Error sent to Sentry! Check your dashboard.');
    } catch (e) {
      alert('Failed to send error: ' + e);
    }
  };

  const testMessage = () => {
    try {
      Sentry.captureMessage('Test message from debug page', 'info');
      alert('Message sent to Sentry! Check your dashboard.');
    } catch (e) {
      alert('Failed to send message: ' + e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Sentry Debug Page</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Sentry Status</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Sentry</h2>
          <div className="space-y-3">
            <button
              onClick={testError}
              className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Test Error Capture
            </button>
            <button
              onClick={testMessage}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Test Message Capture
            </button>
            <button
              onClick={() => {
                throw new Error('Unhandled error test');
              }}
              className="w-full bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
            >
              Test Unhandled Error (will crash page)
            </button>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> This is a temporary debug page. Delete it before deploying to production.
          </p>
        </div>
      </div>
    </div>
  );
}
