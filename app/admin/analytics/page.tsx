'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Eye, Bookmark, Download } from 'lucide-react';
import type { AnalyticsSummary } from '@/lib/admin/queries';
import StatCard from '@/components/admin/StatCard';
import DateRangeFilter from '@/components/admin/DateRangeFilter';
import TopZipsTable from '@/components/admin/TopZipsTable';
import CategoryBreakdown from '@/components/admin/CategoryBreakdown';
import TimelineChart from '@/components/admin/TimelineChart';
import TopProgramsTable from '@/components/admin/TopProgramsTable';
import ContactClickBreakdown from '@/components/admin/ContactClickBreakdown';
import BoardExportsCard from '@/components/admin/BoardExportsCard';
import TopKeywordsTable from '@/components/admin/TopKeywordsTable';
import ChannelBreakdown from '@/components/admin/ChannelBreakdown';

export default function AnalyticsDashboard() {
  const [range, setRange] = useState('30d');
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async (r: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/analytics?range=${r}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      setData(json.data);
    } catch {
      setError('Failed to load analytics data.');
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
          Analytics Dashboard
        </h2>
        <DateRangeFilter value={range} onChange={handleRangeChange} />
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 h-24 animate-pulse">
                <div className="bg-gray-200 rounded h-4 w-20 mb-2" />
                <div className="bg-gray-200 rounded h-6 w-16" />
              </div>
            ))}
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 h-64 animate-pulse" />
        </div>
      ) : data ? (
        <div className="space-y-6">
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Searches" value={data.eventCounts.searches} icon={Search} />
            <StatCard label="Programs Viewed" value={data.eventCounts.views} icon={Eye} />
            <StatCard label="Programs Saved" value={data.eventCounts.saves} icon={Bookmark} />
            <StatCard label="Board Exports" value={data.eventCounts.exports} icon={Download} />
          </div>

          {/* Top ZIPs + Category Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopZipsTable data={data.topZips} />
            <CategoryBreakdown data={data.categoryBreakdown} />
          </div>

          {/* Timeline */}
          <TimelineChart data={data.timeline} />

          {/* Top Programs + Contact Clicks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopProgramsTable data={data.topPrograms} />
            <ContactClickBreakdown data={data.contactClicks} />
          </div>

          {/* Board Exports + Top Keywords */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BoardExportsCard data={data.boardExports} />
            <TopKeywordsTable data={data.topKeywords} />
          </div>

          {/* Channel Breakdown */}
          <ChannelBreakdown data={data.channelBreakdown} />
        </div>
      ) : null}
    </div>
  );
}
