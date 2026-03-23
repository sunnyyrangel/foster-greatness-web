import { MessageSquare, Wrench, ThumbsUp, Star } from 'lucide-react';

interface FeedbackStatCardsProps {
  totalResource: number;
  totalTool: number;
  resourceRatings: {
    helpful: number;
    neutral: number;
    notHelpful: number;
  };
  avgToolRating: number;
}

export default function FeedbackStatCards({
  totalResource,
  totalTool,
  resourceRatings,
  avgToolRating,
}: FeedbackStatCardsProps) {
  const totalRatings =
    resourceRatings.helpful + resourceRatings.neutral + resourceRatings.notHelpful;
  const helpfulPct =
    totalRatings > 0
      ? Math.round((resourceRatings.helpful / totalRatings) * 100)
      : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
        <div className="p-3 bg-fg-navy/10 rounded-lg">
          <MessageSquare className="w-6 h-6 text-fg-navy" />
        </div>
        <div>
          <p className="text-2xl font-bold text-fg-navy">
            {totalResource.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">Resource Feedback</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
        <div className="p-3 bg-fg-navy/10 rounded-lg">
          <Wrench className="w-6 h-6 text-fg-navy" />
        </div>
        <div>
          <p className="text-2xl font-bold text-fg-navy">
            {totalTool.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">Tool Feedback</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
        <div className="p-3 bg-green-100 rounded-lg">
          <ThumbsUp className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <p className="text-2xl font-bold text-fg-navy">
            {totalRatings > 0 ? `${helpfulPct}%` : '--'}
          </p>
          <p className="text-sm text-gray-500">Found Helpful</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
        <div className="p-3 bg-yellow-100 rounded-lg">
          <Star className="w-6 h-6 text-yellow-600" />
        </div>
        <div>
          <p className="text-2xl font-bold text-fg-navy">
            {avgToolRating > 0 ? `${avgToolRating.toFixed(1)} / 5` : '--'}
          </p>
          <p className="text-sm text-gray-500">Avg Tool Rating</p>
        </div>
      </div>
    </div>
  );
}
