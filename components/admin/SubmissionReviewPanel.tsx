'use client';

import { useState } from 'react';
import type { ResourceRow } from '@/lib/resources/types';

interface SubmissionReviewPanelProps {
  submission: ResourceRow;
  onClose: () => void;
  onUpdate: () => void;
}

const POPULATION_OPTIONS = [
  'foster_youth', 'young_adults', 'low_income', 'homeless',
  'single_parents', 'families', 'students', 'lgbtq',
  'justice_involved', 'dv_survivors', 'immigrants', 'native_american', 'general',
];

export default function SubmissionReviewPanel({
  submission,
  onClose,
  onUpdate,
}: SubmissionReviewPanelProps) {
  const [enriching, setEnriching] = useState(false);
  const [enrichError, setEnrichError] = useState('');
  const [saving, setSaving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  // Editable enrichment fields
  const [eligibility, setEligibility] = useState(submission.eligibility ?? '');
  const [populations, setPopulations] = useState<string[]>(submission.populations ?? []);
  const [availability, setAvailability] = useState(submission.availability ?? 'available');
  const [freeOrReduced, setFreeOrReduced] = useState(submission.free_or_reduced ?? 'indeterminate');
  const [languages, setLanguages] = useState((submission.languages ?? ['en']).join(', '));
  const [address, setAddress] = useState(submission.address ?? '');
  const [city, setCity] = useState(submission.city ?? '');
  const [state, setState] = useState(submission.state ?? '');
  const [description, setDescription] = useState(submission.description ?? '');

  async function handleEnrich() {
    setEnriching(true);
    setEnrichError('');

    try {
      const res = await fetch('/api/admin/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resource_id: submission.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setEnrichError(data.error || 'Enrichment failed');
        return;
      }

      // Pre-fill fields from enrichment
      const enriched = data.data;
      if (enriched.eligibility) setEligibility(enriched.eligibility);
      if (enriched.populations) setPopulations(enriched.populations);
      if (enriched.availability) setAvailability(enriched.availability);
      if (enriched.free_or_reduced) setFreeOrReduced(enriched.free_or_reduced);
      if (enriched.languages) setLanguages(enriched.languages.join(', '));
      if (enriched.address) setAddress(enriched.address);
      if (enriched.city) setCity(enriched.city);
      if (enriched.state) setState(enriched.state);
      if (enriched.description_enhanced) setDescription(enriched.description_enhanced);
    } catch {
      setEnrichError('Something went wrong. Please try again.');
    } finally {
      setEnriching(false);
    }
  }

  async function handleApprove() {
    setSaving(true);

    try {
      const langArray = languages.split(',').map((l) => l.trim()).filter(Boolean);

      const res = await fetch(`/api/admin/submissions/${submission.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'approve',
          eligibility: eligibility || null,
          populations,
          availability,
          free_or_reduced: freeOrReduced,
          languages: langArray,
          address: address || null,
          city: city || null,
          state: state || null,
          description: description || null,
        }),
      });

      if (res.ok) {
        onUpdate();
        onClose();
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleReject() {
    setRejecting(true);

    try {
      const res = await fetch(`/api/admin/submissions/${submission.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reject',
          rejection_reason: rejectionReason,
        }),
      });

      if (res.ok) {
        onUpdate();
        onClose();
      }
    } finally {
      setRejecting(false);
    }
  }

  function togglePopulation(pop: string) {
    setPopulations((prev) =>
      prev.includes(pop) ? prev.filter((p) => p !== pop) : [...prev, pop]
    );
  }

  const isPending = submission.status === 'pending';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-fg-navy font-poppins">
              Review Submission
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              &times;
            </button>
          </div>

          {/* Status badge */}
          <div className="mb-6">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
              submission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              submission.status === 'approved' ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'
            }`}>
              {submission.status}
            </span>
          </div>

          {/* Submitter Info */}
          <section className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-semibold text-fg-navy mb-2">Submitter</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-medium">Name:</span> {submission.submitted_by_name}</p>
              <p><span className="font-medium">Email:</span> {submission.submitted_by_email}</p>
              <p>
                <span className="font-medium">Role:</span>{' '}
                {submission.submitted_by_role?.replace('_', ' ')}
              </p>
              {submission.submitted_by_is_community_member && (
                <p className="text-fg-blue font-medium">Foster Greatness community member</p>
              )}
            </div>
          </section>

          {/* Submitter Feedback */}
          {submission.submitted_by_used_service && submission.submitted_by_feedback && (
            <section className="mb-6 p-4 bg-teal-50 border border-teal-200 rounded-lg">
              <h3 className="text-sm font-semibold text-teal-800 mb-1">
                Submitter has used this service
              </h3>
              <p className="text-sm text-teal-700 italic">
                &ldquo;{submission.submitted_by_feedback}&rdquo;
              </p>
            </section>
          )}

          {/* Program Info */}
          <section className="mb-6">
            <h3 className="text-sm font-semibold text-fg-navy mb-3">Program Details</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Program Name</label>
                <p className="text-sm text-gray-800">{submission.program_name}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Organization</label>
                <p className="text-sm text-gray-800">{submission.provider_name}</p>
              </div>
              {submission.website_url && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Website</label>
                  <a href={submission.website_url} target="_blank" rel="noopener noreferrer" className="text-sm text-fg-blue hover:underline">
                    {submission.website_url}
                  </a>
                </div>
              )}
              {submission.phone && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
                  <p className="text-sm text-gray-800">{submission.phone}</p>
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">ZIP / Category</label>
                <p className="text-sm text-gray-800">
                  {submission.zip} &middot; {submission.service_tags?.[0] ?? submission.category}
                </p>
              </div>
            </div>
          </section>

          {/* Enrichment Section */}
          {isPending && (
            <section className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-fg-navy">Enrichment</h3>
                <button
                  onClick={handleEnrich}
                  disabled={enriching || !submission.website_url}
                  className="px-4 py-1.5 text-sm font-medium bg-fg-blue text-white rounded-md hover:bg-fg-blue/90 transition-colors disabled:opacity-50"
                >
                  {enriching ? 'Researching...' : 'Research'}
                </button>
              </div>

              {enrichError && (
                <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded mb-3">{enrichError}</p>
              )}

              {submission.enriched_at && !enriching && (
                <p className="text-xs text-gray-400 mb-3">
                  Last enriched: {new Date(submission.enriched_at).toLocaleString()}
                </p>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fg-blue focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Eligibility</label>
                  <textarea
                    rows={2}
                    value={eligibility}
                    onChange={(e) => setEligibility(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fg-blue focus:border-transparent resize-none"
                    placeholder="Who is eligible for this program?"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Availability</label>
                    <select
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fg-blue focus:border-transparent"
                    >
                      <option value="available">Available</option>
                      <option value="limited">Limited</option>
                      <option value="unavailable">Unavailable</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Cost</label>
                    <select
                      value={freeOrReduced}
                      onChange={(e) => setFreeOrReduced(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fg-blue focus:border-transparent"
                    >
                      <option value="free">Free</option>
                      <option value="reduced">Reduced cost</option>
                      <option value="indeterminate">Unknown</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Languages (comma-separated)</label>
                  <input
                    type="text"
                    value={languages}
                    onChange={(e) => setLanguages(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fg-blue focus:border-transparent"
                    placeholder="en, es"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fg-blue focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fg-blue focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">State</label>
                    <input
                      type="text"
                      maxLength={2}
                      value={state}
                      onChange={(e) => setState(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fg-blue focus:border-transparent"
                      placeholder="CA"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">Populations Served</label>
                  <div className="flex flex-wrap gap-2">
                    {POPULATION_OPTIONS.map((pop) => (
                      <button
                        key={pop}
                        type="button"
                        onClick={() => togglePopulation(pop)}
                        className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                          populations.includes(pop)
                            ? 'bg-fg-navy text-white border-fg-navy'
                            : 'bg-white text-gray-600 border-gray-300 hover:border-fg-navy'
                        }`}
                      >
                        {pop.replace(/_/g, ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Rejection reason (for rejected submissions) */}
          {submission.status === 'rejected' && submission.rejection_reason && (
            <section className="mb-6 p-4 bg-red-50 rounded-lg">
              <h3 className="text-sm font-semibold text-red-800 mb-1">Rejection Reason</h3>
              <p className="text-sm text-red-700">{submission.rejection_reason}</p>
            </section>
          )}

          {/* Action Buttons */}
          {isPending && (
            <div className="border-t pt-6 space-y-3">
              {showRejectForm ? (
                <div className="space-y-3">
                  <textarea
                    rows={2}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent resize-none"
                    placeholder="Reason for rejection..."
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleReject}
                      disabled={rejecting}
                      className="flex-1 px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      {rejecting ? 'Rejecting...' : 'Confirm Reject'}
                    </button>
                    <button
                      onClick={() => setShowRejectForm(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleApprove}
                    disabled={saving}
                    className="flex-1 px-4 py-2.5 text-sm font-medium bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Approving...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => setShowRejectForm(true)}
                    className="flex-1 px-4 py-2.5 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
