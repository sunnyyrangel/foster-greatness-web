import { Mail, Share2, Printer } from 'lucide-react';

interface BoardExportsCardProps {
  data: Array<{ method: string; count: number }>;
}

export default function BoardExportsCard({ data }: BoardExportsCardProps) {
  const getCount = (method: string) =>
    data.find((d) => d.method === method)?.count ?? 0;

  const items = [
    { method: 'email', icon: Mail, label: 'Email' },
    { method: 'share', icon: Share2, label: 'Share' },
    { method: 'print', icon: Printer, label: 'Print' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-fg-navy mb-4">Board Exports</h3>
      <div className="flex gap-6">
        {items.map(({ method, icon: Icon, label }) => (
          <div key={method} className="flex items-center gap-3">
            <Icon className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xl font-bold text-fg-navy">{getCount(method)}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
