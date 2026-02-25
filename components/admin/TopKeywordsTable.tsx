interface TopKeywordsTableProps {
  data: Array<{ term: string; count: number }>;
}

export default function TopKeywordsTable({ data }: TopKeywordsTableProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-fg-navy mb-4">Top Keywords</h3>
        <p className="text-gray-400 text-sm">No keyword data yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-fg-navy mb-4">Top Keywords</h3>
      <div className="space-y-2">
        {data.map((item, i) => (
          <div key={item.term} className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 w-5 text-right">{i + 1}</span>
              <span className="text-sm text-fg-navy">{item.term}</span>
            </div>
            <span className="text-sm text-gray-500">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
