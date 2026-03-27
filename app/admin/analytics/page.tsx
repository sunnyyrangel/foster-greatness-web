'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Eye, Bookmark, Download, TrendingUp, ArrowUpRight, Phone, MapPin, Heart, Users } from 'lucide-react';
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
import ActivityHeatmap from '@/components/admin/ActivityHeatmap';
import ZipCodeHeatmap from '@/components/admin/ZipCodeHeatmap';

function growthPct(current: number, previous: number): number | null {
  if (previous === 0) return current > 0 ? 100 : null;
  return Math.round(((current - previous) / previous) * 100);
}

function GrowthBadge({ value }: { value: number | null }) {
  if (value === null) return null;
  const positive = value >= 0;
  return (
    <div className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold ${
      positive ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'
    }`}>
      {positive && <ArrowUpRight className="w-3.5 h-3.5" />}
      <span>{positive ? '+' : ''}{value}%</span>
    </div>
  );
}

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
          <div className="bg-gradient-to-r from-fg-navy to-fg-blue rounded-2xl p-8 h-32 animate-pulse" />
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

          {/* Impact Summary Banner */}
          <div className="bg-gradient-to-r from-fg-navy via-fg-blue to-fg-navy rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white/70 mb-6 uppercase tracking-wide">Impact at a Glance</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-5 h-5 text-fg-yellow" />
                    <span className="text-3xl font-bold">{data.eventCounts.searches.toLocaleString()}</span>
                  </div>
                  <p className="text-white/60 text-sm">People searched for resources</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Phone className="w-5 h-5 text-fg-teal" />
                    <span className="text-3xl font-bold">{data.totalContacts.toLocaleString()}</span>
                  </div>
                  <p className="text-white/60 text-sm">Contact actions taken</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Heart className="w-5 h-5 text-fg-orange" />
                    <span className="text-3xl font-bold">{data.eventCounts.saves.toLocaleString()}</span>
                  </div>
                  <p className="text-white/60 text-sm">Programs saved to boards</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-5 h-5 text-fg-light-blue" />
                    <span className="text-3xl font-bold">{data.uniqueZips.toLocaleString()}</span>
                  </div>
                  <p className="text-white/60 text-sm">ZIP codes reached</p>
                </div>
              </div>
            </div>
          </div>

          {/* Growth + Connection Rate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">Searches</p>
                <GrowthBadge value={growthPct(data.eventCounts.searches, data.previousEventCounts.searches)} />
              </div>
              <p className="text-2xl font-bold text-fg-navy">{data.eventCounts.searches.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">vs. {data.previousEventCounts.searches.toLocaleString()} prev period</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">Program Views</p>
                <GrowthBadge value={growthPct(data.eventCounts.views, data.previousEventCounts.views)} />
              </div>
              <p className="text-2xl font-bold text-fg-navy">{data.eventCounts.views.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">vs. {data.previousEventCounts.views.toLocaleString()} prev period</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">Connection Rate</p>
                <TrendingUp className="w-4 h-4 text-fg-blue" />
              </div>
              <p className="text-2xl font-bold text-fg-navy">{data.connectionRate}%</p>
              <p className="text-xs text-gray-400 mt-1">Searches that led to contact</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">Programs Saved</p>
                <Bookmark className="w-4 h-4 text-fg-blue" />
              </div>
              <p className="text-2xl font-bold text-fg-navy">{data.eventCounts.saves.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">{data.eventCounts.exports.toLocaleString()} board exports</p>
            </div>
          </div>

          {/* Conversion Funnel */}
          {data.eventCounts.searches > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-fg-navy mb-6">User Journey Funnel</h3>
              <div className="flex flex-col md:flex-row items-stretch gap-0">
                {[
                  { label: 'Searches', value: data.eventCounts.searches, color: '#1a2949' },
                  { label: 'Programs Viewed', value: data.eventCounts.views, color: '#0067a2' },
                  { label: 'Programs Saved', value: data.eventCounts.saves, color: '#00c8b7' },
                  { label: 'Contact Actions', value: data.totalContacts, color: '#fa8526' },
                  { label: 'Board Exports', value: data.eventCounts.exports, color: '#faca2c' },
                ].map((step, i, arr) => (
                  <div key={step.label} className="flex-1 flex flex-col items-center relative">
                    <div
                      className="w-full rounded-xl py-5 px-3 text-center text-white font-bold relative"
                      style={{
                        backgroundColor: step.color,
                        clipPath: i < arr.length - 1
                          ? 'polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%, 10% 50%)'
                          : 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 10% 50%)',
                        marginLeft: i > 0 ? '-12px' : '0',
                        paddingLeft: i > 0 ? '24px' : '12px',
                      }}
                    >
                      <div className="text-2xl">{step.value.toLocaleString()}</div>
                      <div className="text-xs text-white/80 mt-0.5">{step.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Searches" value={data.eventCounts.searches} icon={Search} />
            <StatCard label="Programs Viewed" value={data.eventCounts.views} icon={Eye} />
            <StatCard label="Programs Saved" value={data.eventCounts.saves} icon={Bookmark} />
            <StatCard label="Board Exports" value={data.eventCounts.exports} icon={Download} />
          </div>

          {/* Activity Heatmap */}
          <ActivityHeatmap data={data.activityHeatmap} />

          {/* ZIP Code Heatmap */}
          <ZipCodeHeatmap data={data.topZips} />

          {/* Top ZIPs + Category Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopZipsTable data={data.topZips} />
            <CategoryBreakdown data={data.categoryBreakdown} />
          </div>

          {/* Timeline */}
          <TimelineChart data={data.timeline} />

          {/* Top States */}
          {data.topStates.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-fg-navy mb-4">Top States Reached</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {data.topStates.map((s, i) => (
                  <div key={s.state} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <span className="text-xs text-gray-400 font-bold w-5 text-right">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-fg-navy truncate">{s.state}</p>
                      <p className="text-xs text-gray-400">{s.count.toLocaleString()} searches</p>
                    </div>
                    <span className="text-xs font-bold text-fg-blue">{s.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

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
