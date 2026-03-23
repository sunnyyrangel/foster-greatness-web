import { supabaseAdmin, isAdminConfigured } from '@/lib/supabase/admin';

export interface FeedbackSummary {
  totalResourceFeedback: number;
  totalToolFeedback: number;
  avgResourceRating: number;
  avgToolRating: number;

  belongingPulse: {
    confidentFindHelp: { avg: number; count: number };
    feelLessAlone: { avg: number; count: number };
  };

  connectionImpact: {
    avg: number;
    count: number;
  };

  resourceRatings: {
    helpful: number;
    neutral: number;
    notHelpful: number;
  };

  topRatedPrograms: Array<{
    name: string;
    avgRating: number;
    count: number;
    source: string;
  }>;

  lowestRatedPrograms: Array<{
    name: string;
    avgRating: number;
    count: number;
    source: string;
  }>;

  recentComments: Array<{
    comment: string;
    rating: number;
    programName: string | null;
    source: string | null;
    consentToShare: boolean;
    createdAt: string;
    type: 'resource' | 'tool';
  }>;

  categoryRatings: Array<{
    category: string;
    avgRating: number;
    count: number;
  }>;

  followUpRequests: Array<{
    name: string;
    email: string;
    comment: string | null;
    type: 'resource' | 'tool';
    createdAt: string;
  }>;
}

function emptyResult(): FeedbackSummary {
  return {
    totalResourceFeedback: 0,
    totalToolFeedback: 0,
    avgResourceRating: 0,
    avgToolRating: 0,
    belongingPulse: {
      confidentFindHelp: { avg: 0, count: 0 },
      feelLessAlone: { avg: 0, count: 0 },
    },
    connectionImpact: { avg: 0, count: 0 },
    resourceRatings: { helpful: 0, neutral: 0, notHelpful: 0 },
    topRatedPrograms: [],
    lowestRatedPrograms: [],
    recentComments: [],
    categoryRatings: [],
    followUpRequests: [],
  };
}

export async function getFeedbackSummary(
  since: Date
): Promise<FeedbackSummary> {
  if (!isAdminConfigured || !supabaseAdmin) {
    return emptyResult();
  }

  const sinceISO = since.toISOString();

  // Run all queries in parallel
  const [resourceFeedback, toolFeedback] = await Promise.all([
    supabaseAdmin
      .from('resource_feedback')
      .select('*')
      .gte('created_at', sinceISO),
    supabaseAdmin
      .from('tool_feedback')
      .select('*')
      .gte('created_at', sinceISO),
  ]);

  const resourceRows = resourceFeedback.data ?? [];
  const toolRows = toolFeedback.data ?? [];

  // Total counts
  const totalResourceFeedback = resourceRows.length;
  const totalToolFeedback = toolRows.length;

  // Average resource rating (1-3 scale)
  const avgResourceRating =
    totalResourceFeedback > 0
      ? resourceRows.reduce((sum, r) => sum + (r.rating ?? 0), 0) /
        totalResourceFeedback
      : 0;

  // Average tool rating (1-5 scale)
  const avgToolRating =
    totalToolFeedback > 0
      ? toolRows.reduce((sum, r) => sum + (r.rating ?? 0), 0) / totalToolFeedback
      : 0;

  // Belonging pulse (tool feedback)
  const confidentRows = toolRows.filter(
    (r) => r.confident_find_help != null
  );
  const aloneRows = toolRows.filter((r) => r.feel_less_alone != null);

  const belongingPulse = {
    confidentFindHelp: {
      avg:
        confidentRows.length > 0
          ? confidentRows.reduce(
              (sum, r) => sum + r.confident_find_help,
              0
            ) / confidentRows.length
          : 0,
      count: confidentRows.length,
    },
    feelLessAlone: {
      avg:
        aloneRows.length > 0
          ? aloneRows.reduce((sum, r) => sum + r.feel_less_alone, 0) /
            aloneRows.length
          : 0,
      count: aloneRows.length,
    },
  };

  // Connection impact (resource feedback)
  const connectionRows = resourceRows.filter(
    (r) => r.connection_rating != null
  );
  const connectionImpact = {
    avg:
      connectionRows.length > 0
        ? connectionRows.reduce(
            (sum, r) => sum + r.connection_rating,
            0
          ) / connectionRows.length
        : 0,
    count: connectionRows.length,
  };

  // Resource ratings breakdown
  const resourceRatings = {
    helpful: resourceRows.filter((r) => r.rating === 3).length,
    neutral: resourceRows.filter((r) => r.rating === 2).length,
    notHelpful: resourceRows.filter((r) => r.rating === 1).length,
  };

  // Program ratings: group by program_name
  const programMap = new Map<
    string,
    { totalRating: number; count: number; source: string }
  >();
  for (const row of resourceRows) {
    if (row.program_name) {
      const existing = programMap.get(row.program_name) ?? {
        totalRating: 0,
        count: 0,
        source: row.source ?? 'unknown',
      };
      existing.totalRating += row.rating ?? 0;
      existing.count++;
      programMap.set(row.program_name, existing);
    }
  }

  const allProgramRatings = [...programMap.entries()]
    .map(([name, data]) => ({
      name,
      avgRating: data.count > 0 ? data.totalRating / data.count : 0,
      count: data.count,
      source: data.source,
    }))
    .filter((p) => p.count >= 2);

  const topRatedPrograms = [...allProgramRatings]
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 10);

  const lowestRatedPrograms = [...allProgramRatings]
    .filter((p) => p.avgRating < 2.5)
    .sort((a, b) => a.avgRating - b.avgRating)
    .slice(0, 10);

  // Recent comments: union from both tables
  const recentComments: FeedbackSummary['recentComments'] = [];

  for (const row of resourceRows) {
    if (row.comment) {
      recentComments.push({
        comment: row.comment,
        rating: row.rating ?? 0,
        programName: row.program_name ?? null,
        source: row.source ?? null,
        consentToShare: row.consent_to_share ?? false,
        createdAt: row.created_at,
        type: 'resource',
      });
    }
  }

  for (const row of toolRows) {
    if (row.comment) {
      recentComments.push({
        comment: row.comment,
        rating: row.rating ?? 0,
        programName: null,
        source: null,
        consentToShare: row.consent_to_share ?? false,
        createdAt: row.created_at,
        type: 'tool',
      });
    }
  }

  recentComments.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  recentComments.splice(20);

  // Category ratings
  const categoryMap = new Map<
    string,
    { totalRating: number; count: number }
  >();
  for (const row of resourceRows) {
    if (row.category) {
      const existing = categoryMap.get(row.category) ?? {
        totalRating: 0,
        count: 0,
      };
      existing.totalRating += row.rating ?? 0;
      existing.count++;
      categoryMap.set(row.category, existing);
    }
  }
  const categoryRatings = [...categoryMap.entries()]
    .map(([category, data]) => ({
      category,
      avgRating: data.count > 0 ? data.totalRating / data.count : 0,
      count: data.count,
    }))
    .sort((a, b) => b.count - a.count);

  // Follow-up requests
  const followUpRequests: FeedbackSummary['followUpRequests'] = [];

  for (const row of resourceRows) {
    if (row.contact_email) {
      followUpRequests.push({
        name: row.contact_name ?? '',
        email: row.contact_email,
        comment: row.comment ?? null,
        type: 'resource',
        createdAt: row.created_at,
      });
    }
  }

  for (const row of toolRows) {
    if (row.contact_email) {
      followUpRequests.push({
        name: row.contact_name ?? '',
        email: row.contact_email,
        comment: row.comment ?? null,
        type: 'tool',
        createdAt: row.created_at,
      });
    }
  }

  followUpRequests.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return {
    totalResourceFeedback,
    totalToolFeedback,
    avgResourceRating,
    avgToolRating,
    belongingPulse,
    connectionImpact,
    resourceRatings,
    topRatedPrograms,
    lowestRatedPrograms,
    recentComments,
    categoryRatings,
    followUpRequests,
  };
}
