interface TopProgramsTableProps {
  data: Array<{ name: string; views: number; saves: number }>;
}

export default function TopProgramsTable({ data }: TopProgramsTableProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-fg-navy mb-4">Top Programs</h3>
        <p className="text-gray-400 text-sm">No program data yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-fg-navy mb-4">Top Programs</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 text-gray-500 font-medium">#</th>
              <th className="text-left py-2 text-gray-500 font-medium">Program</th>
              <th className="text-right py-2 text-gray-500 font-medium">Views</th>
              <th className="text-right py-2 text-gray-500 font-medium">Saves</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={item.name} className="border-b border-gray-100">
                <td className="py-2 text-gray-400">{i + 1}</td>
                <td className="py-2 text-fg-navy font-medium max-w-[200px] truncate">
                  {item.name}
                </td>
                <td className="py-2 text-right text-gray-600">{item.views}</td>
                <td className="py-2 text-right text-gray-600">{item.saves}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
