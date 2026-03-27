'use client';

interface ActivityHeatmapProps {
  data: Array<{ dayOfWeek: number; hour: number; count: number }>;
}

const TIME_SLOTS = [
  '12–2 AM', '2–4 AM', '4–6 AM', '6–8 AM', '8–10 AM', '10 AM–12 PM',
  '12–2 PM', '2–4 PM', '4–6 PM', '6–8 PM', '8–10 PM', '10 PM–12 AM',
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-fg-navy mb-4">Popular Day & Time</h3>
        <p className="text-gray-400 text-sm">No activity data yet</p>
      </div>
    );
  }

  // Build grid: timeSlot (row) x dayOfWeek (col)
  const grid: number[][] = Array.from({ length: 12 }, () => Array(7).fill(0));
  for (const d of data) {
    const slotIndex = Math.floor(d.hour / 2);
    if (slotIndex >= 0 && slotIndex < 12 && d.dayOfWeek >= 0 && d.dayOfWeek < 7) {
      grid[slotIndex][d.dayOfWeek] += d.count;
    }
  }

  const max = Math.max(...grid.flat(), 1);

  function getCellStyle(count: number): { backgroundColor: string; color: string } {
    if (count === 0) return { backgroundColor: '#f8fafc', color: '#94a3b8' };
    const ratio = count / max;
    if (ratio < 0.15) return { backgroundColor: '#dbeafe', color: '#1e40af' };
    if (ratio < 0.3) return { backgroundColor: '#bfdbfe', color: '#1e40af' };
    if (ratio < 0.45) return { backgroundColor: '#93c5fd', color: '#1e3a8a' };
    if (ratio < 0.6) return { backgroundColor: '#60a5fa', color: '#fff' };
    if (ratio < 0.75) return { backgroundColor: '#3b82f6', color: '#fff' };
    if (ratio < 0.9) return { backgroundColor: '#2563eb', color: '#fff' };
    return { backgroundColor: '#1a2949', color: '#fff' };
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-fg-navy mb-6">Popular Day & Time</h3>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse" style={{ minWidth: 600 }}>
          <thead>
            <tr>
              <th className="w-28" />
              {DAYS.map((day) => (
                <th
                  key={day}
                  className="text-center text-sm font-medium text-gray-400 pb-3 px-1"
                  style={{ writingMode: 'initial' }}
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map((slot, si) => (
              <tr key={slot}>
                <td className="text-right pr-4 py-0 text-sm text-gray-400 whitespace-nowrap font-medium">
                  {slot}
                </td>
                {DAYS.map((_, di) => {
                  const count = grid[si][di];
                  const style = getCellStyle(count);
                  return (
                    <td key={di} className="p-0.5">
                      <div
                        className="rounded text-center py-1.5 text-xs font-semibold cursor-default"
                        style={{
                          backgroundColor: style.backgroundColor,
                          color: style.color,
                        }}
                      >
                        {count}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
