'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Frown, Meh, Smile } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

interface ResourceFeedbackProps {
  programId: string;
  programName: string;
  source: 'findhelp' | 'community';
  category: string;
  zip: string;
}

const STORAGE_PREFIX = 'fg-feedback-';

const CONNECTION_OPTIONS = [
  { value: 1, label: 'Not at all' },
  { value: 2, label: 'A little' },
  { value: 3, label: 'Quite a bit' },
  { value: 4, label: 'Very much' },
  { value: null, label: 'Prefer not to answer' },
] as const;

const RATING_OPTIONS = [
  { value: 1, icon: Frown, label: 'Not really' },
  { value: 2, icon: Meh, label: "It's okay" },
  { value: 3, icon: Smile, label: 'Yes, helpful' },
] as const;

export default function ResourceFeedback({
  programId,
  programName,
  source,
  category,
  zip,
}: ResourceFeedbackProps) {
  const [alreadySubmitted, setAlreadySubmitted] = useState<boolean | null>(null);
  const [visible, setVisible] = useState(true);
  const [rating, setRating] = useState<number | null>(null);
  const [connectionRating, setConnectionRating] = useState<number | null | undefined>(undefined);
  const [comment, setComment] = useState('');
  const [wantFollowUp, setWantFollowUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [shareConsent, setShareConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const step2Ref = useRef<HTMLDivElement>(null);

  // Check localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_PREFIX}${programId}`);
      setAlreadySubmitted(!!stored);
    } catch {
      setAlreadySubmitted(false);
    }
  }, [programId]);


  const handleSubmit = useCallback(() => {
    if (rating === null) return;

    const payload = {
      program_id: programId,
      program_name: programName,
      source,
      category,
      zip,
      rating,
      connection_rating: connectionRating === undefined ? null : connectionRating,
      comment: comment.trim() || null,
      want_follow_up: wantFollowUp,
      name: wantFollowUp && name.trim() ? name.trim() : null,
      email: wantFollowUp && email.trim() ? email.trim() : null,
      share_consent: wantFollowUp ? shareConsent : false,
    };

    // Fire-and-forget POST
    fetch('/api/feedback/resource', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});

    // Track analytics event
    trackEvent('resource_feedback_submit', {
      program_id: programId,
      source,
      rating,
      zip,
    });

    // Save to localStorage
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${programId}`, Date.now().toString());
    } catch {
      // Silently swallow
    }

    setSubmitted(true);
  }, [
    programId,
    programName,
    source,
    category,
    zip,
    rating,
    connectionRating,
    comment,
    wantFollowUp,
    name,
    email,
    shareConsent,
  ]);

  // Already submitted — subtle acknowledgment
  if (alreadySubmitted === true) {
    return (
      <div className="border-t border-gray-100 pt-4 mt-6">
        <p className="text-sm text-gray-400 text-center">
          You shared feedback on this — thank you!
        </p>
      </div>
    );
  }

  // Still checking localStorage
  if (alreadySubmitted === null) {
    return null;
  }

  // Thank-you state
  if (submitted) {
    return (
      <div className="border-t border-gray-100 pt-6 mt-6">
        <div className="bg-gray-50 rounded-xl p-5 text-center space-y-3">
          <p className="text-fg-navy font-medium">
            Thank you — your voice helps shape our community.
          </p>
          <div className="text-xs text-gray-400 space-y-1">
            <p>Support is always available:</p>
            <p>988 Suicide &amp; Crisis Lifeline — call or text 988</p>
            <p>Crisis Text Line — text HOME to 741741</p>
          </div>
        </div>
      </div>
    );
  }

  const hasRating = rating !== null;
  const step2Open = hasRating;
  const step3Open = connectionRating !== undefined;
  const step4Open = step3Open;

  return (
    <div className="border-t border-gray-100 pt-6 mt-6">
      <div className="bg-gray-50 rounded-xl p-5 space-y-5">
        {/* Step 1 — Reaction */}
        <div>
          <p className="text-sm font-medium text-fg-navy mb-3">Was this resource helpful?</p>
          <div className="flex gap-2">
            {RATING_OPTIONS.map(({ value, icon: Icon, label }) => {
              const isSelected = rating === value;
              const hasSelection = rating !== null;
              return (
                <button
                  key={value}
                  onClick={() => setRating(value)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all min-h-[44px] ${
                    isSelected
                      ? 'bg-white ring-2 ring-fg-blue text-fg-navy shadow-sm'
                      : hasSelection
                        ? 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
                        : 'bg-white text-gray-600 hover:bg-white hover:shadow-sm'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-fg-blue' : ''}`} />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2 — Connection (animated) */}
        <div
          ref={step2Ref}
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            step2Open ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="pt-1">
            <p className="text-sm font-medium text-fg-navy mb-3">
              Did this resource help you feel more connected or supported?
            </p>
            <div className="flex flex-wrap gap-2">
              {CONNECTION_OPTIONS.map(({ value, label }) => {
                const isSelected = connectionRating === value;
                const hasSelection = connectionRating !== undefined;
                return (
                  <button
                    key={label}
                    onClick={() => setConnectionRating(value)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-all min-h-[44px] ${
                      isSelected
                        ? 'bg-white ring-2 ring-fg-blue text-fg-navy shadow-sm'
                        : hasSelection
                          ? 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
                          : 'bg-white text-gray-600 hover:bg-white hover:shadow-sm'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Step 3 — Comment (animated) */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            step3Open ? 'max-h-[250px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="pt-1">
            <p className="text-sm font-medium text-fg-navy mb-2">
              Anything else you&apos;d like to share? <span className="text-gray-400 font-normal">(optional)</span>
            </p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 1000))}
              placeholder="Your thoughts help us improve..."
              rows={3}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-fg-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fg-blue/40 focus:border-fg-blue resize-none"
            />
            <p className="text-xs text-gray-400 text-right mt-1">{comment.length}/1000</p>
          </div>
        </div>

        {/* Step 4 — Contact opt-in (animated) */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            step4Open ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="pt-1">
            <button
              onClick={() => setWantFollowUp(!wantFollowUp)}
              className="text-sm text-fg-blue hover:underline font-medium min-h-[44px]"
            >
              {wantFollowUp ? 'Never mind, skip contact info' : 'Want us to follow up?'}
            </button>

            <div
              className={`overflow-hidden transition-all duration-200 ease-in-out ${
                wantFollowUp ? 'max-h-[250px] opacity-100 mt-3' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="space-y-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-fg-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fg-blue/40 focus:border-fg-blue"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-fg-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fg-blue/40 focus:border-fg-blue"
                />
                <label className="flex items-start gap-2 cursor-pointer min-h-[44px]">
                  <input
                    type="checkbox"
                    checked={shareConsent}
                    onChange={(e) => setShareConsent(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-fg-blue focus:ring-fg-blue/40"
                  />
                  <span className="text-xs text-gray-500">
                    It&apos;s okay to share my words on the Foster Greatness website
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Submit button (shown once rating is selected) */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            hasRating ? 'max-h-[60px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <button
            onClick={handleSubmit}
            disabled={!hasRating}
            className="w-full py-3 bg-fg-navy text-white font-medium rounded-xl hover:bg-fg-navy/90 transition-colors min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Share Feedback
          </button>
        </div>
      </div>
    </div>
  );
}
