'use client';

import { useState, useRef, useEffect } from 'react';
import { Star } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

interface ToolFeedbackProps {
  zip: string;
  category: string;
}

const LIKERT_OPTIONS = [
  { label: 'Strongly disagree', value: 1 },
  { label: 'Disagree', value: 2 },
  { label: 'Agree', value: 3 },
  { label: 'Strongly agree', value: 4 },
] as const;

function storageKey(zip: string, category: string) {
  return `fg-tool-feedback-${zip}-${category}`;
}

export default function ToolFeedback({ zip, category }: ToolFeedbackProps) {
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [confidentFindHelp, setConfidentFindHelp] = useState<number | null>(null);
  const [feelLessAlone, setFeelLessAlone] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [wantFollowUp, setWantFollowUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [shareConsent, setShareConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const step2Ref = useRef<HTMLDivElement>(null);

  // Check sessionStorage on mount
  useEffect(() => {
    try {
      if (sessionStorage.getItem(storageKey(zip, category))) {
        setSubmitted(true);
      }
    } catch {
      // sessionStorage unavailable
    }
  }, [zip, category]);

  const handleSubmit = async () => {
    if (rating === 0 || isSubmitting) return;
    setIsSubmitting(true);

    const payload = {
      zip,
      category,
      rating,
      confident_find_help: confidentFindHelp,
      feel_less_alone: feelLessAlone,
      comment: comment.trim() || null,
      want_follow_up: wantFollowUp,
      name: wantFollowUp ? name.trim() || null : null,
      email: wantFollowUp ? email.trim() || null : null,
      share_consent: shareConsent,
    };

    // Fire-and-forget
    try {
      fetch('/api/feedback/tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    } catch {
      // silently swallow
    }

    trackEvent('tool_feedback_submit', { zip, category, rating });

    try {
      sessionStorage.setItem(storageKey(zip, category), '1');
    } catch {
      // sessionStorage unavailable
    }

    setSubmitted(true);
    setIsSubmitting(false);
  };

  // Thank-you state
  if (submitted) {
    return (
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 text-center">
        <p className="text-fg-navy font-semibold mb-4">
          Thank you — your voice helps shape our community.
        </p>
        <div className="text-sm text-gray-600 space-y-1">
          <p className="font-medium text-gray-700">Support is always available:</p>
          <p>988 Suicide &amp; Crisis Lifeline — call or text <strong>988</strong></p>
          <p>Crisis Text Line — text <strong>HOME</strong> to <strong>741741</strong></p>
        </div>
      </div>
    );
  }

  const displayStars = hoveredStar || rating;

  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 space-y-5">
      {/* Step 1 — Star Rating */}
      <div>
        <p className="text-sm font-semibold text-fg-navy mb-3">How helpful was this search?</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              onClick={() => setRating(star)}
              className="p-0.5 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-fg-blue rounded"
              aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
            >
              <Star
                className={`w-8 h-8 transition-colors ${
                  star <= displayStars
                    ? 'fill-current text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Step 2 — Belonging Pulse (slides open after rating) */}
      <div
        ref={step2Ref}
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{
          maxHeight: rating > 0 ? '800px' : '0px',
          opacity: rating > 0 ? 1 : 0,
        }}
      >
        <div className="space-y-5 pt-1">
          <p className="text-xs text-gray-500">
            Two quick questions to help us understand our impact — skip either if you&apos;d like.
          </p>

          {/* Belonging item 1 */}
          <div>
            <p className="text-sm text-fg-navy mb-2">
              After using this tool, I feel more confident I can find help when I need it.
            </p>
            <div className="flex flex-wrap gap-2">
              {LIKERT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setConfidentFindHelp(opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                    confidentFindHelp === opt.value
                      ? 'border-fg-blue bg-fg-blue/10 text-fg-blue ring-2 ring-fg-blue/30'
                      : confidentFindHelp !== null
                        ? 'border-gray-200 bg-white text-gray-400'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setConfidentFindHelp(null)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                  confidentFindHelp === null && confidentFindHelp !== 0
                    ? 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    : 'border-gray-200 bg-white text-gray-400'
                }`}
              >
                Skip
              </button>
            </div>
          </div>

          {/* Belonging item 2 */}
          <div>
            <p className="text-sm text-fg-navy mb-2">
              Knowing these resources exist, I feel less alone.
            </p>
            <div className="flex flex-wrap gap-2">
              {LIKERT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFeelLessAlone(opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                    feelLessAlone === opt.value
                      ? 'border-fg-blue bg-fg-blue/10 text-fg-blue ring-2 ring-fg-blue/30'
                      : feelLessAlone !== null
                        ? 'border-gray-200 bg-white text-gray-400'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setFeelLessAlone(null)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                  feelLessAlone === null && feelLessAlone !== 0
                    ? 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    : 'border-gray-200 bg-white text-gray-400'
                }`}
              >
                Skip
              </button>
            </div>
          </div>

          {/* Step 3 — Optional comment */}
          <div>
            <label htmlFor="tool-feedback-comment" className="block text-sm text-fg-navy mb-2">
              How could we make this tool better for you? <span className="text-gray-400">(optional)</span>
            </label>
            <textarea
              id="tool-feedback-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 1000))}
              rows={3}
              maxLength={1000}
              placeholder="Share your thoughts..."
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-fg-blue focus:ring-2 focus:ring-fg-blue/20 outline-none resize-none transition-colors"
            />
            <p className="text-xs text-gray-400 text-right mt-1">{comment.length}/1000</p>
          </div>

          {/* Step 4 — Contact opt-in */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={wantFollowUp}
                onChange={(e) => setWantFollowUp(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-fg-blue focus:ring-fg-blue/30"
              />
              <span className="text-sm text-fg-navy">Want us to follow up?</span>
            </label>

            <div
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{
                maxHeight: wantFollowUp ? '200px' : '0px',
                opacity: wantFollowUp ? 1 : 0,
              }}
            >
              <div className="space-y-3 pt-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-fg-blue focus:ring-2 focus:ring-fg-blue/20 outline-none transition-colors"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-fg-blue focus:ring-2 focus:ring-fg-blue/20 outline-none transition-colors"
                />
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shareConsent}
                    onChange={(e) => setShareConsent(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-fg-blue focus:ring-fg-blue/30 mt-0.5"
                  />
                  <span className="text-xs text-gray-500">
                    It&apos;s okay to share my words on the Foster Greatness website
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
            className="px-6 py-2.5 bg-fg-navy text-white text-sm font-semibold rounded-lg hover:bg-fg-navy/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Share Feedback'}
          </button>
        </div>
      </div>
    </div>
  );
}
