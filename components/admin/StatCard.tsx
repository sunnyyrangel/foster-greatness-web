import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
}

export default function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
      <div className="p-3 bg-fg-navy/10 rounded-lg">
        <Icon className="w-6 h-6 text-fg-navy" />
      </div>
      <div>
        <p className="text-2xl font-bold text-fg-navy">{value.toLocaleString()}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}
