import { Globe, Code } from 'lucide-react';

interface ChannelBreakdownProps {
  data: { web: number; embed: number };
}

export default function ChannelBreakdown({ data }: ChannelBreakdownProps) {
  const total = data.web + data.embed;

  const items = [
    { label: 'Website', value: data.web, icon: Globe, color: 'bg-fg-blue' },
    { label: 'Embed', value: data.embed, icon: Code, color: 'bg-fg-orange' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-fg-navy mb-4">Traffic by Channel</h3>
      {total === 0 ? (
        <p className="text-gray-400 text-sm">No channel data yet</p>
      ) : (
        <div className="space-y-4">
          {items.map(({ label, value, icon: Icon, color }) => {
            const pct = total > 0 ? Math.round((value / total) * 100) : 0;
            return (
              <div key={label} className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-gray-400 shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-fg-navy">{label}</span>
                    <span className="text-gray-500">
                      {value.toLocaleString()} ({pct}%)
                    </span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`${color} h-full rounded-full transition-all`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
