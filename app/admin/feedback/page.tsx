'use client';

import { useState, useEffect, useCallback } from 'react';
import type { FeedbackSummary } from '@/lib/admin/feedback-queries';
import DateRangeFilter from '@/components/admin/DateRangeFilter';
import FeedbackStatCards from '@/components/admin/FeedbackStatCards';
import BelongingPulseCard from '@/components/admin/BelongingPulseCard';
import FeedbackCommentsTable from '@/components/admin/FeedbackCommentsTable';
import ProgramRatingsTable from '@/components/admin/ProgramRatingsTable';
import FollowUpRequestsTable from '@/components/admin/FollowUpRequestsTable';

function ConnectionImpactCard({
  avg,
  count,
}: {
  avg: number;
  count: number;
}) {
  const pct = avg > 0 ? (avg / 4) * 100 : 0;

  function getBarColor(val: number): string {
    if (val >= 3) return 'bg-green-500';
    if (val >= 2) return 'bg-yellow-500';
    return 'bg-orange-500';
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-fg-navy mb-4">
        Connection Impact
      </h3>
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-700 font-medium">
            Felt connected to support
          </span>
          <span className="text-gray-500">
            {count > 0 ? avg.toFixed(1) : '--'} / 4{' '}
            <span className="text-gray-400">
              ({count.toLocaleString()} responses)
            </span>
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${count > 0 ? getBarColor(avg) : 'bg-gray-200'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function FeedbackDashboard() {
  const [range, setRange] = useState('30d');
  const [data, setData] = useState<FeedbackSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async (r: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/feedback?range=${r}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      setData(json.data);
    } catch {
      setError('Failed to load feedback data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(range);
  }, [range, fetchData]);

  function handleRangeChange(newRange: string) {
    setRange(newRange);
  }

  if (error) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="text-center py-16">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => fetchData(range)}
            className="px-4 py-2 bg-fg-navy text-white rounded-md hover:bg-fg-navy/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h2 className="text-2xl font-bold text-fg-navy font-poppins">
          Feedback Dashboard
        </h2>
        <DateRangeFilter value={range} onChange={handleRangeChange} />
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm p-6 h-24 animate-pulse"
              >
                <div className="bg-gray-200 rounded h-4 w-20 mb-2" />
                <div className="bg-gray-200 rounded h-6 w-16" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6 h-40 animate-pulse" />
            <div className="bg-white rounded-lg shadow-sm p-6 h-40 animate-pulse" />
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 h-64 animate-pulse" />
        </div>
      ) : data ? (
        <div className="space-y-6">
          {/* Stat cards */}
          <FeedbackStatCards
            totalResource={data.totalResourceFeedback}
            totalTool={data.totalToolFeedback}
            resourceRatings={data.resourceRatings}
            avgToolRating={data.avgToolRating}
          />

          {/* Belonging Pulse + Connection Impact */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BelongingPulseCard
              confidentFindHelp={data.belongingPulse.confidentFindHelp}
              feelLessAlone={data.belongingPulse.feelLessAlone}
            />
            <ConnectionImpactCard
              avg={data.connectionImpact.avg}
              count={data.connectionImpact.count}
            />
          </div>

          {/* Program Ratings */}
          <ProgramRatingsTable
            topRated={data.topRatedPrograms}
            lowestRated={data.lowestRatedPrograms}
          />

          {/* Comments */}
          <FeedbackCommentsTable data={data.recentComments} />

          {/* Follow-up Requests */}
          <FollowUpRequestsTable data={data.followUpRequests} />
        </div>
      ) : null}
    </div>
  );
}
