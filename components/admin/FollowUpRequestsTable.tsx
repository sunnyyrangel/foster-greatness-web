interface FollowUpRequest {
  name: string;
  email: string;
  comment: string | null;
  type: 'resource' | 'tool';
  createdAt: string;
}

interface FollowUpRequestsTableProps {
  data: FollowUpRequest[];
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function TypeBadge({ type }: { type: 'resource' | 'tool' }) {
  if (type === 'resource') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
        Resource
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">
      Tool
    </span>
  );
}

export default function FollowUpRequestsTable({
  data,
}: FollowUpRequestsTableProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-fg-navy mb-4">
          Follow-Up Requests
        </h3>
        <p className="text-gray-400 text-sm">No follow-up requests yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-fg-navy mb-4">
        Follow-Up Requests
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 text-gray-500 font-medium">Date</th>
              <th className="text-left py-2 text-gray-500 font-medium">Name</th>
              <th className="text-left py-2 text-gray-500 font-medium">Email</th>
              <th className="text-left py-2 text-gray-500 font-medium">
                Comment
              </th>
              <th className="text-left py-2 text-gray-500 font-medium">Type</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-2 text-gray-500 whitespace-nowrap">
                  {formatDate(item.createdAt)}
                </td>
                <td className="py-2 text-fg-navy font-medium">
                  {item.name || '--'}
                </td>
                <td className="py-2">
                  <a
                    href={`mailto:${item.email}`}
                    className="text-fg-blue hover:underline"
                  >
                    {item.email}
                  </a>
                </td>
                <td className="py-2 text-gray-600 max-w-[200px] truncate">
                  {item.comment || '--'}
                </td>
                <td className="py-2">
                  <TypeBadge type={item.type} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
