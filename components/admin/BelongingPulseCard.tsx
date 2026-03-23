interface BelongingPulseCardProps {
  confidentFindHelp: { avg: number; count: number };
  feelLessAlone: { avg: number; count: number };
}

function getBarColor(avg: number): string {
  if (avg >= 3) return 'bg-green-500';
  if (avg >= 2) return 'bg-yellow-500';
  return 'bg-orange-500';
}

function PulseRow({
  label,
  avg,
  count,
  max,
}: {
  label: string;
  avg: number;
  count: number;
  max: number;
}) {
  const pct = max > 0 ? (avg / max) * 100 : 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-700 font-medium">{label}</span>
        <span className="text-gray-500">
          {count > 0 ? avg.toFixed(1) : '--'} / {max}{' '}
          <span className="text-gray-400">({count.toLocaleString()} responses)</span>
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all ${count > 0 ? getBarColor(avg) : 'bg-gray-200'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function BelongingPulseCard({
  confidentFindHelp,
  feelLessAlone,
}: BelongingPulseCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-fg-navy mb-4">Belonging Pulse</h3>
      <div className="space-y-4">
        <PulseRow
          label="Confident finding help"
          avg={confidentFindHelp.avg}
          count={confidentFindHelp.count}
          max={4}
        />
        <PulseRow
          label="Feel less alone"
          avg={feelLessAlone.avg}
          count={feelLessAlone.count}
          max={4}
        />
      </div>
    </div>
  );
}
