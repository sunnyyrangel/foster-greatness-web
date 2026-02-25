import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export interface AnalyticsSummary {
  eventCounts: {
    searches: number;
    views: number;
    saves: number;
    exports: number;
  };
  topZips: Array<{ zip: string; count: number }>;
  categoryBreakdown: Array<{ category: string; count: number }>;
  topPrograms: Array<{ name: string; views: number; saves: number }>;
  contactClicks: Array<{ type: string; count: number }>;
  boardExports: Array<{ method: string; count: number }>;
  timeline: Array<{ date: string; searches: number; views: number }>;
  topKeywords: Array<{ term: string; count: number }>;
  channelBreakdown: { web: number; embed: number };
}

function emptyResult(): AnalyticsSummary {
  return {
    eventCounts: { searches: 0, views: 0, saves: 0, exports: 0 },
    topZips: [],
    categoryBreakdown: [],
    topPrograms: [],
    contactClicks: [],
    boardExports: [],
    timeline: [],
    topKeywords: [],
    channelBreakdown: { web: 0, embed: 0 },
  };
}

export async function getAnalyticsSummary(
  since: Date
): Promise<AnalyticsSummary> {
  if (!isSupabaseConfigured || !supabase) {
    return emptyResult();
  }

  const sinceISO = since.toISOString();

  // Run all queries in parallel
  const [
    searchEvents,
    viewEvents,
    saveEvents,
    exportEvents,
    contactEvents,
    keywordEvents,
    categoryEvents,
    allEvents,
  ] = await Promise.all([
    supabase
      .from('service_events')
      .select('zip, created_at')
      .eq('event_name', 'service_search')
      .gte('created_at', sinceISO),
    supabase
      .from('service_events')
      .select('program_name, created_at')
      .eq('event_name', 'service_program_view')
      .gte('created_at', sinceISO),
    supabase
      .from('service_events')
      .select('program_name')
      .eq('event_name', 'service_program_save')
      .gte('created_at', sinceISO),
    supabase
      .from('service_events')
      .select('properties')
      .eq('event_name', 'service_board_export')
      .gte('created_at', sinceISO),
    supabase
      .from('service_events')
      .select('properties')
      .eq('event_name', 'service_contact_click')
      .gte('created_at', sinceISO),
    supabase
      .from('service_events')
      .select('properties')
      .eq('event_name', 'service_keyword_search')
      .gte('created_at', sinceISO),
    supabase
      .from('service_events')
      .select('category')
      .eq('event_name', 'service_category_select')
      .gte('created_at', sinceISO),
    supabase
      .from('service_events')
      .select('properties')
      .gte('created_at', sinceISO),
  ]);

  // Event counts
  const eventCounts = {
    searches: searchEvents.data?.length ?? 0,
    views: viewEvents.data?.length ?? 0,
    saves: saveEvents.data?.length ?? 0,
    exports: exportEvents.data?.length ?? 0,
  };

  // Top ZIPs
  const zipCounts = new Map<string, number>();
  for (const row of searchEvents.data ?? []) {
    if (row.zip) {
      zipCounts.set(row.zip, (zipCounts.get(row.zip) ?? 0) + 1);
    }
  }
  const topZips = [...zipCounts.entries()]
    .map(([zip, count]) => ({ zip, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Category breakdown
  const catCounts = new Map<string, number>();
  for (const row of categoryEvents.data ?? []) {
    if (row.category) {
      catCounts.set(row.category, (catCounts.get(row.category) ?? 0) + 1);
    }
  }
  const categoryBreakdown = [...catCounts.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  // Top programs (views + saves cross-referenced)
  const programViews = new Map<string, number>();
  for (const row of viewEvents.data ?? []) {
    if (row.program_name) {
      programViews.set(
        row.program_name,
        (programViews.get(row.program_name) ?? 0) + 1
      );
    }
  }
  const programSaves = new Map<string, number>();
  for (const row of saveEvents.data ?? []) {
    if (row.program_name) {
      programSaves.set(
        row.program_name,
        (programSaves.get(row.program_name) ?? 0) + 1
      );
    }
  }
  const allPrograms = new Set([
    ...programViews.keys(),
    ...programSaves.keys(),
  ]);
  const topPrograms = [...allPrograms]
    .map((name) => ({
      name,
      views: programViews.get(name) ?? 0,
      saves: programSaves.get(name) ?? 0,
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  // Contact clicks by type
  const contactCounts = new Map<string, number>();
  for (const row of contactEvents.data ?? []) {
    const type =
      (row.properties as Record<string, unknown>)?.type as string | undefined;
    if (type) {
      contactCounts.set(type, (contactCounts.get(type) ?? 0) + 1);
    }
  }
  const contactClicks = [...contactCounts.entries()]
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);

  // Board exports by method
  const exportCounts = new Map<string, number>();
  for (const row of exportEvents.data ?? []) {
    const method =
      (row.properties as Record<string, unknown>)?.method as string | undefined;
    if (method) {
      exportCounts.set(method, (exportCounts.get(method) ?? 0) + 1);
    }
  }
  const boardExports = [...exportCounts.entries()]
    .map(([method, count]) => ({ method, count }))
    .sort((a, b) => b.count - a.count);

  // Timeline (daily buckets)
  const dayBuckets = new Map<string, { searches: number; views: number }>();
  for (const row of searchEvents.data ?? []) {
    const day = (row.created_at as string).slice(0, 10);
    const bucket = dayBuckets.get(day) ?? { searches: 0, views: 0 };
    bucket.searches++;
    dayBuckets.set(day, bucket);
  }
  for (const row of viewEvents.data ?? []) {
    const day = (row.created_at as string).slice(0, 10);
    const bucket = dayBuckets.get(day) ?? { searches: 0, views: 0 };
    bucket.views++;
    dayBuckets.set(day, bucket);
  }
  const timeline = [...dayBuckets.entries()]
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Top keywords
  const termCounts = new Map<string, number>();
  for (const row of keywordEvents.data ?? []) {
    const terms =
      (row.properties as Record<string, unknown>)?.terms as string | undefined;
    if (terms) {
      termCounts.set(terms, (termCounts.get(terms) ?? 0) + 1);
    }
  }
  const topKeywords = [...termCounts.entries()]
    .map(([term, count]) => ({ term, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Channel breakdown
  let webCount = 0;
  let embedCount = 0;
  for (const row of allEvents.data ?? []) {
    const channel =
      (row.properties as Record<string, unknown>)?.channel as string | undefined;
    if (channel === 'embed') {
      embedCount++;
    } else {
      webCount++;
    }
  }
  const channelBreakdown = { web: webCount, embed: embedCount };

  return {
    eventCounts,
    topZips,
    categoryBreakdown,
    topPrograms,
    contactClicks,
    boardExports,
    timeline,
    topKeywords,
    channelBreakdown,
  };
}
