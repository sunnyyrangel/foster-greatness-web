'use client';

import { Search, Eye, Bookmark, Download, TrendingUp, ArrowUpRight, Phone, Globe, MapPin, Mail, Users, Heart } from 'lucide-react';
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
import ZipCodeHeatmap from '@/components/admin/ZipCodeHeatmap';

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

const allZipSearches = [
  ...topZips,
  { zip: '90201', count: 48 }, { zip: '77036', count: 45 }, { zip: '75217', count: 42 },
  { zip: '60639', count: 39 }, { zip: '30310', count: 37 }, { zip: '85033', count: 35 },
  { zip: '10456', count: 33 }, { zip: '33012', count: 31 }, { zip: '44105', count: 29 },
  { zip: '98003', count: 27 }, { zip: '93706', count: 25 }, { zip: '92114', count: 24 },
  { zip: '11212', count: 22 }, { zip: '78521', count: 21 }, { zip: '90026', count: 20 },
  { zip: '43207', count: 19 }, { zip: '89101', count: 18 }, { zip: '80219', count: 17 },
  { zip: '97233', count: 16 }, { zip: '33142', count: 15 }, { zip: '60618', count: 14 },
  { zip: '30344', count: 13 }, { zip: '19134', count: 12 }, { zip: '75211', count: 11 },
  { zip: '95122', count: 10 }, { zip: '77449', count: 9 }, { zip: '28205', count: 8 },
  { zip: '48227', count: 7 }, { zip: '32210', count: 6 }, { zip: '90006', count: 15 },
  { zip: '85035', count: 14 }, { zip: '60617', count: 12 }, { zip: '30349', count: 11 },
  { zip: '10467', count: 10 }, { zip: '94544', count: 9 }, { zip: '79936', count: 8 },
  { zip: '11226', count: 7 }, { zip: '98168', count: 6 }, { zip: '33054', count: 5 },
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

const totalContacts = 1842 + 967 + 534 + 312; // 3,655
const connectionRate = Math.round((totalContacts / eventCounts.searches) * 100); // ~128% (multiple contacts per search)

const topStates = [
  { state: 'California', searches: 687, pct: 24.1 },
  { state: 'Texas', searches: 398, pct: 14.0 },
  { state: 'Illinois', searches: 267, pct: 9.4 },
  { state: 'Georgia', searches: 214, pct: 7.5 },
  { state: 'Arizona', searches: 178, pct: 6.3 },
  { state: 'New York', searches: 156, pct: 5.5 },
  { state: 'Pennsylvania', searches: 134, pct: 4.7 },
  { state: 'North Carolina', searches: 121, pct: 4.3 },
  { state: 'Florida', searches: 108, pct: 3.8 },
  { state: 'Michigan', searches: 96, pct: 3.4 },
  { state: 'Ohio', searches: 82, pct: 2.9 },
  { state: 'Washington', searches: 67, pct: 2.4 },
];

// Generate 90 days of timeline data with realistic patterns
function generateTimeline() {
  const data = [];
  const today = new Date();
  for (let i = 89; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dayOfWeek = d.getDay();
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

function generateDayTimeHeatmap() {
  const data: Array<{ dayOfWeek: number; hour: number; count: number }> = [];
  const hourWeights = [3, 3, 8, 42, 82, 95, 88, 72, 38, 32, 16, 12];
  const dayWeights = [0.15, 0.85, 0.7, 0.75, 0.8, 0.55, 0.18];
  for (let dow = 0; dow < 7; dow++) {
    for (let slot = 0; slot < 12; slot++) {
      const base = hourWeights[slot] * dayWeights[dow];
      const noise = 0.7 + Math.random() * 0.6;
      const count = Math.round(base * noise);
      data.push({ dayOfWeek: dow, hour: slot * 2, count });
    }
  }
  return data;
}

const timeline = generateTimeline();
const heatmapData = generateDayTimeHeatmap();

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

        {/* ── Impact Summary Banner ── */}
        <div className="bg-gradient-to-r from-fg-navy via-fg-blue to-fg-navy rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-fg-teal/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
          <div className="relative z-10">
            <h3 className="text-lg font-semibold text-white/70 mb-6 uppercase tracking-wide">Impact at a Glance</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-5 h-5 text-fg-yellow" />
                  <span className="text-3xl font-bold">2,847</span>
                </div>
                <p className="text-white/60 text-sm">People searched for resources</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Phone className="w-5 h-5 text-fg-teal" />
                  <span className="text-3xl font-bold">3,655</span>
                </div>
                <p className="text-white/60 text-sm">Contact actions taken</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="w-5 h-5 text-fg-orange" />
                  <span className="text-3xl font-bold">1,189</span>
                </div>
                <p className="text-white/60 text-sm">Programs saved to boards</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-5 h-5 text-fg-light-blue" />
                  <span className="text-3xl font-bold">38</span>
                </div>
                <p className="text-white/60 text-sm">ZIP codes reached nationwide</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Growth + Connection Rate ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Searches This Quarter</p>
              <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span className="text-xs font-bold">+34%</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-fg-navy">2,847</p>
            <p className="text-xs text-gray-400 mt-1">vs. 2,124 last quarter</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Program Views</p>
              <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span className="text-xs font-bold">+41%</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-fg-navy">6,312</p>
            <p className="text-xs text-gray-400 mt-1">vs. 4,476 last quarter</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Connection Rate</p>
              <TrendingUp className="w-4 h-4 text-fg-blue" />
            </div>
            <p className="text-2xl font-bold text-fg-navy">{connectionRate}%</p>
            <p className="text-xs text-gray-400 mt-1">Searches that led to contact</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Avg. Daily Users</p>
              <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span className="text-xs font-bold">+28%</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-fg-navy">32</p>
            <p className="text-xs text-gray-400 mt-1">vs. 25 last quarter</p>
          </div>
        </div>

        {/* ── Conversion Funnel ── */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-fg-navy mb-6">User Journey Funnel</h3>
          <div className="flex flex-col md:flex-row items-stretch gap-0">
            {[
              { label: 'Searches', value: 2847, color: '#1a2949', pct: 100 },
              { label: 'Programs Viewed', value: 6312, color: '#0067a2', pct: 100 },
              { label: 'Programs Saved', value: 1189, color: '#00c8b7', pct: 41.8 },
              { label: 'Contact Actions', value: 3655, color: '#fa8526', pct: 128.4 },
              { label: 'Board Exports', value: 342, color: '#faca2c', pct: 12.0 },
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
          <p className="text-xs text-gray-400 text-center mt-4">
            Users average 2.2 program views per search · 1.3 contact actions per search
          </p>
        </div>

        {/* ── Original Stat cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Searches" value={eventCounts.searches} icon={Search} />
          <StatCard label="Programs Viewed" value={eventCounts.views} icon={Eye} />
          <StatCard label="Programs Saved" value={eventCounts.saves} icon={Bookmark} />
          <StatCard label="Board Exports" value={eventCounts.exports} icon={Download} />
        </div>

        {/* Activity Heatmap */}
        <ActivityHeatmap data={heatmapData} />

        {/* ZIP Code Heatmap */}
        <ZipCodeHeatmap data={allZipSearches} />

        {/* Top ZIPs + Category Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopZipsTable data={topZips} />
          <CategoryBreakdown data={categoryBreakdown} />
        </div>

        {/* Timeline */}
        <TimelineChart data={timeline} />

        {/* ── Top States Reached ── */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-fg-navy mb-4">Top States Reached</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {topStates.map((s, i) => (
              <div key={s.state} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="text-xs text-gray-400 font-bold w-5 text-right">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-fg-navy truncate">{s.state}</p>
                  <p className="text-xs text-gray-400">{s.searches.toLocaleString()} searches</p>
                </div>
                <span className="text-xs font-bold text-fg-blue">{s.pct}%</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4 text-center">
            Reaching foster youth across <span className="font-semibold text-fg-navy">12 states</span> and growing
          </p>
        </div>

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
