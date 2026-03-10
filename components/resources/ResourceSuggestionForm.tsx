'use client';

import { useState, FormEvent, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SDOH_CATEGORIES, COVERAGE_LEVELS, US_STATES } from '@/lib/resources/types';
import type { CoverageLevel } from '@/lib/resources/types';

const ROLE_OPTIONS = [
  { value: 'nonprofit_staff', label: 'Nonprofit / organization staff' },
  { value: 'community_member', label: 'Community member' },
  { value: 'lived_experience', label: 'Person with lived experience' },
  { value: 'other', label: 'Other' },
] as const;

function ResourceSuggestionFormInner() {
  const searchParams = useSearchParams();

  const [role, setRole] = useState('');
  const [isCommunityMember, setIsCommunityMember] = useState(false);
  const [providerName, setProviderName] = useState('');
  const [programName, setProgramName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [coverageLevel, setCoverageLevel] = useState<CoverageLevel>('local');
  const [zip, setZip] = useState(searchParams.get('zip') ?? '');
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [category, setCategory] = useState(searchParams.get('category') ?? '');
  const [usedService, setUsedService] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [submitterName, setSubmitterName] = useState('');
  const [submitterEmail, setSubmitterEmail] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/resources/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          program_name: programName,
          provider_name: providerName,
          description,
          website_url: websiteUrl || undefined,
          phone: phone || undefined,
          coverage_level: coverageLevel,
          zip: coverageLevel === 'local' ? zip : undefined,
          states: ['statewide', 'multi_state'].includes(coverageLevel) ? selectedStates : [],
          category,
          submitted_by_role: role,
          submitted_by_name: submitterName,
          submitted_by_email: submitterEmail,
          submitted_by_is_community_member: isCommunityMember,
          submitted_by_used_service: usedService,
          submitted_by_feedback: feedback || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setSuccess(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
        <div className="text-4xl mb-4">🎉</div>
        <h2 className="text-xl font-semibold text-fg-navy font-poppins mb-2">
          Thank you!
        </h2>
        <p className="text-gray-600 mb-6">
          Your resource suggestion has been submitted for review. We&apos;ll add it to
          our directory after verification so more community members can find the support
          they need.
        </p>
        <a
          href="/services"
          className="inline-block px-5 py-2.5 bg-fg-navy text-white rounded-md hover:bg-fg-navy/90 transition-colors font-medium text-sm"
        >
          Back to Resource Finder
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6">
      {/* Role */}
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1.5">
          I am a... <span className="text-red-500">*</span>
        </label>
        <select
          id="role"
          required
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fg-blue focus:border-transparent"
        >
          <option value="">Select your role</option>
          {ROLE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Community member */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={isCommunityMember}
          onClick={() => setIsCommunityMember(!isCommunityMember)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
            isCommunityMember ? 'bg-fg-blue' : 'bg-gray-200'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              isCommunityMember ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
        <span className="text-sm text-gray-700">
          I am a Foster Greatness community member
        </span>
      </div>

      <hr className="border-gray-100" />

      {/* Organization name */}
      <div>
        <label htmlFor="providerName" className="block text-sm font-medium text-gray-700 mb-1.5">
          Organization name <span className="text-red-500">*</span>
        </label>
        <input
          id="providerName"
          type="text"
          required
          maxLength={200}
          value={providerName}
          onChange={(e) => setProviderName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fg-blue focus:border-transparent"
          placeholder="e.g., LA County Housing Authority"
        />
      </div>

      {/* Program name */}
      <div>
        <label htmlFor="programName" className="block text-sm font-medium text-gray-700 mb-1.5">
          Program / service name <span className="text-red-500">*</span>
        </label>
        <input
          id="programName"
          type="text"
          required
          maxLength={200}
          value={programName}
          onChange={(e) => setProgramName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fg-blue focus:border-transparent"
          placeholder="e.g., Rapid Re-Housing Program"
        />
      </div>

      {/* Website + Phone (side by side on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700 mb-1.5">
            Website URL
          </label>
          <input
            id="websiteUrl"
            type="url"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fg-blue focus:border-transparent"
            placeholder="https://..."
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
            Phone number
          </label>
          <input
            id="phone"
            type="tel"
            maxLength={20}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fg-blue focus:border-transparent"
            placeholder="(555) 123-4567"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
          Brief description of services <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          required
          maxLength={500}
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fg-blue focus:border-transparent resize-none"
          placeholder="What does this program offer? Who does it serve?"
        />
        <p className="mt-1 text-xs text-gray-400">{description.length}/500</p>
      </div>

      {/* Coverage level + Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="coverageLevel" className="block text-sm font-medium text-gray-700 mb-1.5">
            Area served <span className="text-red-500">*</span>
          </label>
          <select
            id="coverageLevel"
            required
            value={coverageLevel}
            onChange={(e) => {
              const val = e.target.value as CoverageLevel;
              setCoverageLevel(val);
              if (val !== 'local') setZip('');
              if (!['statewide', 'multi_state'].includes(val)) setSelectedStates([]);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fg-blue focus:border-transparent"
          >
            {COVERAGE_LEVELS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1.5">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fg-blue focus:border-transparent"
          >
            <option value="">Select a category</option>
            {SDOH_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ZIP code — only for local coverage */}
      {coverageLevel === 'local' && (
        <div>
          <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1.5">
            ZIP code served <span className="text-red-500">*</span>
          </label>
          <input
            id="zip"
            type="text"
            required
            inputMode="numeric"
            pattern="\d{5}"
            maxLength={5}
            value={zip}
            onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
            className="w-full max-w-[200px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fg-blue focus:border-transparent"
            placeholder="90210"
          />
        </div>
      )}

      {/* Single state dropdown — for statewide coverage */}
      {coverageLevel === 'statewide' && (
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1.5">
            State <span className="text-red-500">*</span>
          </label>
          <select
            id="state"
            required
            value={selectedStates[0] ?? ''}
            onChange={(e) => setSelectedStates(e.target.value ? [e.target.value] : [])}
            className="w-full max-w-[300px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fg-blue focus:border-transparent"
          >
            <option value="">Select a state</option>
            {US_STATES.map((s) => (
              <option key={s.code} value={s.code}>{s.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Multi-state checkbox list — for multi_state coverage */}
      {coverageLevel === 'multi_state' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            States served <span className="text-red-500">*</span>
          </label>
          <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-md p-3 grid grid-cols-2 sm:grid-cols-3 gap-1">
            {US_STATES.map((s) => (
              <label key={s.code} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer py-0.5">
                <input
                  type="checkbox"
                  checked={selectedStates.includes(s.code)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedStates((prev) => [...prev, s.code]);
                    } else {
                      setSelectedStates((prev) => prev.filter((c) => c !== s.code));
                    }
                  }}
                  className="rounded border-gray-300 text-fg-blue focus:ring-fg-blue"
                />
                {s.code}
              </label>
            ))}
          </div>
          {selectedStates.length > 0 && (
            <p className="mt-1 text-xs text-gray-400">{selectedStates.length} state{selectedStates.length !== 1 ? 's' : ''} selected</p>
          )}
        </div>
      )}

      <hr className="border-gray-100" />

      {/* Used this service */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={usedService}
          onClick={() => setUsedService(!usedService)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
            usedService ? 'bg-fg-blue' : 'bg-gray-200'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              usedService ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
        <span className="text-sm text-gray-700">
          I have used this service
        </span>
      </div>

      {/* Feedback (conditional) */}
      {usedService && (
        <div>
          <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1.5">
            Tell us about your experience
          </label>
          <textarea
            id="feedback"
            maxLength={500}
            rows={3}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fg-blue focus:border-transparent resize-none"
            placeholder="How was your experience with this program?"
          />
          <p className="mt-1 text-xs text-gray-400">{feedback.length}/500</p>
        </div>
      )}

      <hr className="border-gray-100" />

      {/* Submitter info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="submitterName" className="block text-sm font-medium text-gray-700 mb-1.5">
            Your name <span className="text-red-500">*</span>
          </label>
          <input
            id="submitterName"
            type="text"
            required
            maxLength={100}
            value={submitterName}
            onChange={(e) => setSubmitterName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fg-blue focus:border-transparent"
            placeholder="Jane Doe"
          />
        </div>
        <div>
          <label htmlFor="submitterEmail" className="block text-sm font-medium text-gray-700 mb-1.5">
            Your email <span className="text-red-500">*</span>
          </label>
          <input
            id="submitterEmail"
            type="email"
            required
            value={submitterEmail}
            onChange={(e) => setSubmitterEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fg-blue focus:border-transparent"
            placeholder="jane@example.com"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-md">{error}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-fg-navy text-white py-3 px-6 rounded-md hover:bg-fg-navy/90 transition-colors disabled:opacity-50 font-medium text-sm"
      >
        {submitting ? 'Submitting...' : 'Submit Suggestion'}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Your contact information is only used for follow-up questions about this suggestion.
      </p>
    </form>
  );
}

export default function ResourceSuggestionForm() {
  return (
    <Suspense fallback={<div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 animate-pulse h-96" />}>
      <ResourceSuggestionFormInner />
    </Suspense>
  );
}
