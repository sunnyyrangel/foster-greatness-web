'use client';

import { useState } from 'react';
import { Check, Minus } from 'lucide-react';

interface Comment {
  comment: string;
  rating: number;
  programName: string | null;
  source: string | null;
  consentToShare: boolean;
  createdAt: string;
  type: 'resource' | 'tool';
}

interface FeedbackCommentsTableProps {
  data: Comment[];
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

function CommentCell({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > 120;

  return (
    <td className="py-2 text-gray-600 max-w-[300px]">
      <p className={expanded ? '' : 'line-clamp-2'}>{text}</p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-fg-blue text-xs mt-1 hover:underline"
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </td>
  );
}

export default function FeedbackCommentsTable({
  data,
}: FeedbackCommentsTableProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-fg-navy mb-4">
          Recent Comments
        </h3>
        <p className="text-gray-400 text-sm">No comments yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-fg-navy mb-4">
        Recent Comments
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 text-gray-500 font-medium">Date</th>
              <th className="text-left py-2 text-gray-500 font-medium">Type</th>
              <th className="text-left py-2 text-gray-500 font-medium">Rating</th>
              <th className="text-left py-2 text-gray-500 font-medium">Comment</th>
              <th className="text-center py-2 text-gray-500 font-medium">
                Consent
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-2 text-gray-500 whitespace-nowrap">
                  {formatDate(item.createdAt)}
                </td>
                <td className="py-2">
                  <TypeBadge type={item.type} />
                </td>
                <td className="py-2 text-gray-600">{item.rating}</td>
                <CommentCell text={item.comment} />
                <td className="py-2 text-center">
                  {item.consentToShare ? (
                    <Check className="w-4 h-4 text-green-500 mx-auto" />
                  ) : (
                    <Minus className="w-4 h-4 text-gray-300 mx-auto" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
