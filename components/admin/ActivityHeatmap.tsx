'use client';

interface ActivityHeatmapProps {
  data: Array<{ date: string; count: number }>;
}

export default function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-fg-navy mb-4">Activity Heatmap</h3>
        <p className="text-gray-400 text-sm">No activity data yet</p>
      </div>
    );
  }

  // Build a map of date -> count
  const countMap = new Map<string, number>();
  for (const d of data) {
    countMap.set(d.date, d.count);
  }

  // Generate last 90 days
  const days: Array<{ date: string; count: number; dayOfWeek: number }> = [];
  const today = new Date();
  for (let i = 89; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({
      date: key,
      count: countMap.get(key) ?? 0,
      dayOfWeek: d.getDay(),
    });
  }

  const max = Math.max(...days.map((d) => d.count), 1);

  function getColor(count: number): string {
    if (count === 0) return '#f3f4f6';
    const ratio = count / max;
    if (ratio < 0.25) return '#dbeafe';
    if (ratio < 0.5) return '#93c5fd';
    if (ratio < 0.75) return '#3b82f6';
    return '#1a2949';
  }

  // Group into weeks (columns)
  const weeks: Array<typeof days> = [];
  let currentWeek: typeof days = [];
  for (const day of days) {
    if (day.dayOfWeek === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(day);
  }
  if (currentWeek.length > 0) weeks.push(currentWeek);

  // Month labels
  const monthLabels: Array<{ label: string; weekIndex: number }> = [];
  let lastMonth = '';
  weeks.forEach((week, wi) => {
    const firstDay = week[0];
    const month = new Date(firstDay.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' });
    if (month !== lastMonth) {
      monthLabels.push({ label: month, weekIndex: wi });
      lastMonth = month;
    }
  });

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-fg-navy">Activity Heatmap</h3>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>Less</span>
          {[0, 0.25, 0.5, 0.75, 1].map((r) => (
            <div
              key={r}
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: getColor(r * max) }}
            />
          ))}
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-flex gap-0.5">
          {/* Day labels */}
          <div className="flex flex-col gap-0.5 mr-1 pt-5">
            {dayLabels.map((label, i) => (
              <div key={i} className="h-3 flex items-center">
                {i % 2 === 1 && (
                  <span className="text-[10px] text-gray-400 leading-none">{label}</span>
                )}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div>
            {/* Month labels */}
            <div className="flex gap-0.5 mb-1 h-4">
              {weeks.map((_, wi) => {
                const ml = monthLabels.find((m) => m.weekIndex === wi);
                return (
                  <div key={wi} className="w-3 flex items-end">
                    {ml && (
                      <span className="text-[10px] text-gray-400 leading-none whitespace-nowrap">
                        {ml.label}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Heatmap cells */}
            <div className="flex gap-0.5">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-0.5">
                  {/* Pad first week if it doesn't start on Sunday */}
                  {wi === 0 &&
                    Array.from({ length: week[0].dayOfWeek }).map((_, pi) => (
                      <div key={`pad-${pi}`} className="w-3 h-3" />
                    ))}
                  {week.map((day) => (
                    <div
                      key={day.date}
                      className="w-3 h-3 rounded-sm cursor-default"
                      style={{ backgroundColor: getColor(day.count) }}
                      title={`${day.date}: ${day.count} events`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
