'use client';

import { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary - Catches JavaScript errors in child components
 *
 * Usage:
 *   <ErrorBoundary>
 *     <ComponentThatMightFail />
 *   </ErrorBoundary>
 *
 *   <ErrorBoundary fallback={<p>Something went wrong</p>}>
 *     <ComponentThatMightFail />
 *   </ErrorBoundary>
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
          <p className="text-sm text-gray-500">
            Unable to load this section. Please try refreshing the page.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * SectionErrorFallback - A nicer fallback for homepage sections
 */
export function SectionErrorFallback({ sectionName }: { sectionName?: string }) {
  return (
    <div className="p-6 rounded-2xl bg-fg-navy/5 border border-fg-navy/10 text-center">
      <p className="text-fg-navy/60 text-sm">
        {sectionName ? `Unable to load ${sectionName}.` : 'Unable to load this section.'}{' '}
        Please try refreshing the page.
      </p>
    </div>
  );
}
