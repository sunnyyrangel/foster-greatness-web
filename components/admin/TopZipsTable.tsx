interface TopZipsTableProps {
  data: Array<{ zip: string; count: number }>;
}

export default function TopZipsTable({ data }: TopZipsTableProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-fg-navy mb-4">Top ZIP Codes</h3>
        <p className="text-gray-400 text-sm">No search data yet</p>
      </div>
    );
  }

  const max = data[0].count;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-fg-navy mb-4">Top ZIP Codes</h3>
      <div className="space-y-3">
        {data.map((item, i) => (
          <div key={item.zip} className="flex items-center gap-3">
            <span className="text-xs text-gray-400 w-5 text-right">{i + 1}</span>
            <span className="text-sm font-mono w-14">{item.zip}</span>
            <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
              <div
                className="bg-fg-blue h-full rounded-full transition-all"
                style={{ width: `${(item.count / max) * 100}%` }}
              />
            </div>
            <span className="text-sm text-gray-600 w-10 text-right">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
