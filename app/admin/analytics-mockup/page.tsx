'use client';

import { Search, Eye, Bookmark, Download } from 'lucide-react';
import StatCard from '@/components/admin/StatCard';
import TopZipsTable from '@/components/admin/TopZipsTable';
import CategoryBreakdown from '@/components/admin/CategoryBreakdown';
import TimelineChart from '@/components/admin/TimelineChart';
import TopProgramsTable from '@/components/admin/TopProgramsTable';
import ContactClickBreakdown from '@/components/admin/ContactClickBreakdown';
import BoardExportsCard from '@/components/admin/BoardExportsCard';
import TopKeywordsTable from '@/components/admin/TopKeywordsTable';
import ChannelBreakdown from '@/components/admin/ChannelBreakdown';
import ActivityHeatmap from '@/components/admin/ActivityHeatmap';

// ─── Realistic mockup data ───────────────────────────────────────

const eventCounts = {
  searches: 2847,
  views: 6312,
  saves: 1189,
  exports: 342,
};

const topZips = [
  { zip: '90011', count: 187 },
  { zip: '90044', count: 154 },
  { zip: '77084', count: 128 },
  { zip: '60629', count: 115 },
  { zip: '90003', count: 98 },
  { zip: '30318', count: 87 },
  { zip: '85281', count: 76 },
  { zip: '28208', count: 68 },
  { zip: '19132', count: 61 },
  { zip: '48228', count: 54 },
];

const categoryBreakdown = [
  { category: 'Housing & Shelter', count: 892 },
  { category: 'Food & Nutrition', count: 734 },
  { category: 'Healthcare', count: 521 },
  { category: 'Employment & Income', count: 487 },
  { category: 'Education', count: 356 },
  { category: 'Legal Services', count: 298 },
  { category: 'Family & Childcare', count: 214 },
  { category: 'Transportation', count: 163 },
];

const topPrograms = [
  { name: 'LA County Housing Authority - Section 8', views: 245, saves: 89 },
  { name: 'CalFresh Food Assistance', views: 198, saves: 72 },
  { name: 'Medi-Cal Enrollment Center', views: 176, saves: 61 },
  { name: 'Covenant House - Youth Shelter', views: 154, saves: 58 },
  { name: 'Goodwill Career Services', views: 143, saves: 45 },
  { name: 'Legal Aid Foundation of LA', views: 128, saves: 42 },
  { name: 'Second Harvest Food Bank', views: 117, saves: 38 },
  { name: 'PATH - People Assisting The Homeless', views: 109, saves: 35 },
  { name: 'Workforce Innovation Center', views: 96, saves: 31 },
  { name: 'Community Health Alliance', views: 88, saves: 27 },
];

const contactClicks = [
  { type: 'website', count: 1842 },
  { type: 'call', count: 967 },
  { type: 'directions', count: 534 },
  { type: 'email', count: 312 },
];

const boardExports = [
  { method: 'email', count: 156 },
  { method: 'share', count: 118 },
  { method: 'print', count: 68 },
];

const topKeywords = [
  { term: 'housing assistance', count: 234 },
  { term: 'food stamps', count: 187 },
  { term: 'free therapy', count: 156 },
  { term: 'job training', count: 134 },
  { term: 'rental help', count: 121 },
  { term: 'GED program', count: 98 },
  { term: 'utility assistance', count: 87 },
  { term: 'legal aid', count: 76 },
  { term: 'childcare voucher', count: 64 },
  { term: 'free dental', count: 52 },
];

const channelBreakdown = { web: 8234, embed: 2417 };

// Generate 90 days of timeline data with realistic patterns
function generateTimeline() {
  const data = [];
  const today = new Date();
  for (let i = 89; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dayOfWeek = d.getDay();
    // Weekdays are busier, weekends quieter, with general upward trend
    const trendFactor = 1 + (90 - i) * 0.008;
    const weekdayFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.4 : 1;
    const noise = 0.6 + Math.random() * 0.8;
    const searches = Math.round(28 * weekdayFactor * trendFactor * noise);
    const views = Math.round(searches * (1.8 + Math.random() * 0.8));
    data.push({
      date: d.toISOString().slice(0, 10),
      searches,
      views,
    });
  }
  return data;
}

// Generate heatmap data from timeline
function generateHeatmap() {
  const timeline = generateTimeline();
  return timeline.map((d) => ({
    date: d.date,
    count: d.searches + d.views,
  }));
}

const timeline = generateTimeline();
const heatmapData = generateHeatmap();

// ─── Component ───────────────────────────────────────────────────

export default function AnalyticsMockup() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-fg-navy font-poppins">
            Resource Finder Analytics
          </h2>
          <p className="text-sm text-gray-500 mt-1">Foster Greatness — Last 90 Days</p>
        </div>
        <div className="flex gap-1 bg-white rounded-lg shadow-sm p-1">
          {['Today', '7 Days', '30 Days', 'All Time'].map((label, i) => (
            <button
              key={label}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                i === 2
                  ? 'bg-fg-navy text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Searches" value={eventCounts.searches} icon={Search} />
          <StatCard label="Programs Viewed" value={eventCounts.views} icon={Eye} />
          <StatCard label="Programs Saved" value={eventCounts.saves} icon={Bookmark} />
          <StatCard label="Board Exports" value={eventCounts.exports} icon={Download} />
        </div>

        {/* Activity Heatmap */}
        <ActivityHeatmap data={heatmapData} />

        {/* Top ZIPs + Category Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopZipsTable data={topZips} />
          <CategoryBreakdown data={categoryBreakdown} />
        </div>

        {/* Timeline */}
        <TimelineChart data={timeline} />

        {/* Top Programs + Contact Clicks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopProgramsTable data={topPrograms} />
          <ContactClickBreakdown data={contactClicks} />
        </div>

        {/* Board Exports + Top Keywords */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BoardExportsCard data={boardExports} />
          <TopKeywordsTable data={topKeywords} />
        </div>

        {/* Channel Breakdown */}
        <ChannelBreakdown data={channelBreakdown} />
      </div>
    </div>
  );
}
