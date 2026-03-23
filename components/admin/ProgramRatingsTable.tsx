interface ProgramRating {
  name: string;
  avgRating: number;
  count: number;
  source: string;
}

interface ProgramRatingsTableProps {
  topRated: ProgramRating[];
  lowestRated: ProgramRating[];
}

function SourceBadge({ source }: { source: string }) {
  const isComm =
    source === 'community' || source === 'Community';
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
        isComm
          ? 'bg-teal-100 text-teal-700'
          : 'bg-blue-100 text-blue-700'
      }`}
    >
      {isComm ? 'Community' : 'Findhelp'}
    </span>
  );
}

function RatingDisplay({ rating }: { rating: number }) {
  return (
    <span className="text-gray-600 font-medium">{rating.toFixed(1)}</span>
  );
}

function ProgramTable({
  title,
  data,
  emptyText,
}: {
  title: string;
  data: ProgramRating[];
  emptyText: string;
}) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-fg-navy mb-3">{title}</h4>
      {data.length === 0 ? (
        <p className="text-gray-400 text-sm">{emptyText}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 text-gray-500 font-medium">
                  Program
                </th>
                <th className="text-left py-2 text-gray-500 font-medium">
                  Source
                </th>
                <th className="text-right py-2 text-gray-500 font-medium">
                  Avg Rating
                </th>
                <th className="text-right py-2 text-gray-500 font-medium">
                  Count
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.name} className="border-b border-gray-100">
                  <td className="py-2 text-fg-navy font-medium max-w-[200px] truncate">
                    {item.name}
                  </td>
                  <td className="py-2">
                    <SourceBadge source={item.source} />
                  </td>
                  <td className="py-2 text-right">
                    <RatingDisplay rating={item.avgRating} />
                  </td>
                  <td className="py-2 text-right text-gray-600">
                    {item.count.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function ProgramRatingsTable({
  topRated,
  lowestRated,
}: ProgramRatingsTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-fg-navy mb-4">
        Program Ratings
      </h3>
      <div className="space-y-6">
        <ProgramTable
          title="Top Rated"
          data={topRated}
          emptyText="Not enough data yet (min 2 ratings per program)"
        />
        <ProgramTable
          title="Needs Attention"
          data={lowestRated}
          emptyText="No low-rated programs"
        />
      </div>
    </div>
  );
}
