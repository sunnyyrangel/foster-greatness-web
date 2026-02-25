'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface TimelineChartProps {
  data: Array<{ date: string; searches: number; views: number }>;
}

export default function TimelineChart({ data }: TimelineChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-fg-navy mb-4">Activity Timeline</h3>
        <p className="text-gray-400 text-sm">No timeline data yet</p>
      </div>
    );
  }

  const formatted = data.map((d) => ({
    ...d,
    date: new Date(d.date + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
  }));

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-fg-navy mb-4">Activity Timeline</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formatted} margin={{ left: 0, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="searches"
              stroke="#0067a2"
              fill="#0067a2"
              fillOpacity={0.2}
              name="Searches"
            />
            <Area
              type="monotone"
              dataKey="views"
              stroke="#00c8b7"
              fill="#00c8b7"
              fillOpacity={0.2}
              name="Views"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
