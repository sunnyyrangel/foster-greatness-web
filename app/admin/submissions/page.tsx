'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ResourceRow } from '@/lib/resources/types';
import SubmissionReviewPanel from '@/components/admin/SubmissionReviewPanel';

type StatusFilter = 'pending' | 'approved' | 'rejected';

const STATUS_TABS: { value: StatusFilter; label: string; color: string }[] = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'approved', label: 'Approved', color: 'bg-green-100 text-green-800' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' },
];

export default function SubmissionsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending');
  const [submissions, setSubmissions] = useState<ResourceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<ResourceRow | null>(null);

  const fetchSubmissions = useCallback(async (status: StatusFilter) => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/submissions?status=${status}`);
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = '/admin/login';
          return;
        }
        throw new Error('Failed to fetch');
      }
      const json = await res.json();
      setSubmissions(json.data ?? []);
    } catch {
      setError('Failed to load submissions.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubmissions(statusFilter);
  }, [statusFilter, fetchSubmissions]);

  function handleRefresh() {
    fetchSubmissions(statusFilter);
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-fg-navy font-poppins">
          Resource Submissions
        </h2>
        <div className="flex gap-2">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                statusFilter === tab.value
                  ? tab.color
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="text-center py-10">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-fg-navy text-white rounded-md hover:bg-fg-navy/90 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-4 h-16 animate-pulse">
              <div className="flex gap-4">
                <div className="bg-gray-200 rounded h-4 w-24" />
                <div className="bg-gray-200 rounded h-4 w-48" />
                <div className="bg-gray-200 rounded h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          No {statusFilter} submissions found.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Program</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Organization</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Category</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">ZIP</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Submitted</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Role</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub) => (
                <tr
                  key={sub.id}
                  onClick={() => setSelectedSubmission(sub)}
                  className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      sub.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      sub.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">{sub.program_name}</td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{sub.provider_name}</td>
                  <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">{sub.service_tags?.[0] ?? sub.category}</td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{sub.zip}</td>
                  <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">
                    {new Date(sub.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-xs text-gray-500">
                      {sub.submitted_by_role?.replace(/_/g, ' ')}
                    </span>
                    {sub.submitted_by_is_community_member && (
                      <span className="ml-1 text-xs text-fg-blue font-medium">FG</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Review Panel */}
      {selectedSubmission && (
        <SubmissionReviewPanel
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          onUpdate={handleRefresh}
        />
      )}
    </div>
  );
}
