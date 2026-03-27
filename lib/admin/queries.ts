import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export interface AnalyticsSummary {
  eventCounts: {
    searches: number;
    views: number;
    saves: number;
    exports: number;
  };
  previousEventCounts: {
    searches: number;
    views: number;
  };
  totalContacts: number;
  connectionRate: number;
  uniqueZips: number;
  topStates: Array<{ state: string; count: number; pct: number }>;
  topZips: Array<{ zip: string; count: number }>;
  categoryBreakdown: Array<{ category: string; count: number }>;
  topPrograms: Array<{ name: string; views: number; saves: number }>;
  contactClicks: Array<{ type: string; count: number }>;
  boardExports: Array<{ method: string; count: number }>;
  timeline: Array<{ date: string; searches: number; views: number }>;
  topKeywords: Array<{ term: string; count: number }>;
  channelBreakdown: { web: number; embed: number };
  activityHeatmap: Array<{ dayOfWeek: number; hour: number; count: number }>;
}

function emptyResult(): AnalyticsSummary {
  return {
    eventCounts: { searches: 0, views: 0, saves: 0, exports: 0 },
    previousEventCounts: { searches: 0, views: 0 },
    totalContacts: 0,
    connectionRate: 0,
    uniqueZips: 0,
    topStates: [],
    topZips: [],
    categoryBreakdown: [],
    topPrograms: [],
    contactClicks: [],
    boardExports: [],
    timeline: [],
    topKeywords: [],
    channelBreakdown: { web: 0, embed: 0 },
    activityHeatmap: [],
  };
}

export async function getAnalyticsSummary(
  since: Date
): Promise<AnalyticsSummary> {
  if (!isSupabaseConfigured || !supabase) {
    return emptyResult();
  }

  const sinceISO = since.toISOString();

  // Calculate previous period for comparison
  const now = new Date();
  const periodMs = now.getTime() - since.getTime();
  const prevStart = new Date(since.getTime() - periodMs);
  const prevStartISO = prevStart.toISOString();

  // Run all queries in parallel (including previous period counts)
  const [
    searchEvents,
    viewEvents,
    saveEvents,
    exportEvents,
    contactEvents,
    keywordEvents,
    categoryEvents,
    allEvents,
    prevSearches,
    prevViews,
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
    // Previous period searches
    supabase
      .from('service_events')
      .select('id', { count: 'exact', head: true })
      .eq('event_name', 'service_search')
      .gte('created_at', prevStartISO)
      .lt('created_at', sinceISO),
    // Previous period views
    supabase
      .from('service_events')
      .select('id', { count: 'exact', head: true })
      .eq('event_name', 'service_program_view')
      .gte('created_at', prevStartISO)
      .lt('created_at', sinceISO),
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
    .sort((a, b) => (b.views + b.saves) - (a.views + a.saves))
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

  // Activity heatmap (day-of-week x hour-of-day)
  const heatmapKey = (dow: number, hour: number) => `${dow}-${hour}`;
  const heatmapCounts = new Map<string, number>();
  for (const row of searchEvents.data ?? []) {
    const d = new Date(row.created_at as string);
    const key = heatmapKey(d.getDay(), d.getHours());
    heatmapCounts.set(key, (heatmapCounts.get(key) ?? 0) + 1);
  }
  for (const row of viewEvents.data ?? []) {
    const d = new Date(row.created_at as string);
    const key = heatmapKey(d.getDay(), d.getHours());
    heatmapCounts.set(key, (heatmapCounts.get(key) ?? 0) + 1);
  }
  const activityHeatmap = [...heatmapCounts.entries()].map(([key, count]) => {
    const [dow, hour] = key.split('-').map(Number);
    return { dayOfWeek: dow, hour, count };
  });

  // Previous period counts
  const previousEventCounts = {
    searches: prevSearches.count ?? 0,
    views: prevViews.count ?? 0,
  };

  // Total contact actions
  const totalContacts = contactClicks.reduce((sum, c) => sum + c.count, 0);

  // Connection rate (contacts / searches)
  const connectionRate = eventCounts.searches > 0
    ? Math.round((totalContacts / eventCounts.searches) * 100)
    : 0;

  // Unique ZIPs
  const uniqueZips = zipCounts.size;

  // Top states (derived from ZIP prefixes)
  // First 3 digits of ZIP → state mapping (simplified, covers major areas)
  const zipToState: Record<string, string> = {
    '900': 'California', '901': 'California', '902': 'California', '903': 'California',
    '904': 'California', '905': 'California', '906': 'California', '907': 'California',
    '908': 'California', '910': 'California', '911': 'California', '912': 'California',
    '913': 'California', '914': 'California', '915': 'California', '916': 'California',
    '917': 'California', '918': 'California', '919': 'California', '920': 'California',
    '921': 'California', '922': 'California', '923': 'California', '924': 'California',
    '925': 'California', '926': 'California', '927': 'California', '928': 'California',
    '930': 'California', '931': 'California', '932': 'California', '933': 'California',
    '934': 'California', '935': 'California', '936': 'California', '937': 'California',
    '938': 'California', '939': 'California', '940': 'California', '941': 'California',
    '942': 'California', '943': 'California', '944': 'California', '945': 'California',
    '946': 'California', '947': 'California', '948': 'California', '949': 'California',
    '950': 'California', '951': 'California', '952': 'California', '953': 'California',
    '954': 'California', '955': 'California', '956': 'California', '957': 'California',
    '958': 'California', '959': 'California', '960': 'California', '961': 'California',
    '770': 'Texas', '771': 'Texas', '772': 'Texas', '773': 'Texas', '774': 'Texas',
    '775': 'Texas', '776': 'Texas', '777': 'Texas', '778': 'Texas', '779': 'Texas',
    '750': 'Texas', '751': 'Texas', '752': 'Texas', '753': 'Texas', '754': 'Texas',
    '755': 'Texas', '756': 'Texas', '757': 'Texas', '758': 'Texas', '759': 'Texas',
    '760': 'Texas', '761': 'Texas', '762': 'Texas', '763': 'Texas', '764': 'Texas',
    '765': 'Texas', '766': 'Texas', '767': 'Texas', '768': 'Texas', '769': 'Texas',
    '780': 'Texas', '781': 'Texas', '782': 'Texas', '783': 'Texas', '784': 'Texas',
    '785': 'Texas', '786': 'Texas', '787': 'Texas', '788': 'Texas', '789': 'Texas',
    '790': 'Texas', '791': 'Texas', '792': 'Texas', '793': 'Texas', '794': 'Texas',
    '795': 'Texas', '796': 'Texas', '797': 'Texas', '798': 'Texas', '799': 'Texas',
    '606': 'Illinois', '607': 'Illinois', '608': 'Illinois', '609': 'Illinois',
    '610': 'Illinois', '611': 'Illinois', '612': 'Illinois', '613': 'Illinois',
    '614': 'Illinois', '615': 'Illinois', '616': 'Illinois', '617': 'Illinois',
    '618': 'Illinois', '619': 'Illinois', '620': 'Illinois', '622': 'Illinois',
    '623': 'Illinois', '624': 'Illinois', '625': 'Illinois', '626': 'Illinois',
    '627': 'Illinois', '628': 'Illinois', '629': 'Illinois',
    '300': 'Georgia', '301': 'Georgia', '302': 'Georgia', '303': 'Georgia',
    '304': 'Georgia', '305': 'Georgia', '306': 'Georgia', '307': 'Georgia',
    '308': 'Georgia', '309': 'Georgia', '310': 'Georgia', '311': 'Georgia',
    '312': 'Georgia', '313': 'Georgia', '314': 'Georgia', '315': 'Georgia',
    '316': 'Georgia', '317': 'Georgia', '318': 'Georgia', '319': 'Georgia',
    '850': 'Arizona', '851': 'Arizona', '852': 'Arizona', '853': 'Arizona',
    '855': 'Arizona', '856': 'Arizona', '857': 'Arizona', '859': 'Arizona',
    '860': 'Arizona', '863': 'Arizona', '864': 'Arizona', '865': 'Arizona',
    '100': 'New York', '101': 'New York', '102': 'New York', '103': 'New York',
    '104': 'New York', '105': 'New York', '106': 'New York', '107': 'New York',
    '108': 'New York', '109': 'New York', '110': 'New York', '111': 'New York',
    '112': 'New York', '113': 'New York', '114': 'New York', '115': 'New York',
    '116': 'New York', '117': 'New York', '118': 'New York', '119': 'New York',
    '120': 'New York', '121': 'New York', '122': 'New York', '123': 'New York',
    '124': 'New York', '125': 'New York', '126': 'New York', '127': 'New York',
    '128': 'New York', '129': 'New York', '130': 'New York', '131': 'New York',
    '132': 'New York', '133': 'New York', '134': 'New York', '135': 'New York',
    '136': 'New York', '137': 'New York', '138': 'New York', '139': 'New York',
    '140': 'New York', '141': 'New York', '142': 'New York', '143': 'New York',
    '144': 'New York', '145': 'New York', '146': 'New York', '147': 'New York',
    '148': 'New York', '149': 'New York',
    '190': 'Pennsylvania', '191': 'Pennsylvania', '192': 'Pennsylvania',
    '193': 'Pennsylvania', '194': 'Pennsylvania', '195': 'Pennsylvania',
    '196': 'Pennsylvania',
    '150': 'Pennsylvania', '151': 'Pennsylvania', '152': 'Pennsylvania',
    '153': 'Pennsylvania', '154': 'Pennsylvania', '155': 'Pennsylvania',
    '156': 'Pennsylvania', '157': 'Pennsylvania', '158': 'Pennsylvania',
    '159': 'Pennsylvania', '160': 'Pennsylvania', '161': 'Pennsylvania',
    '162': 'Pennsylvania', '163': 'Pennsylvania', '164': 'Pennsylvania',
    '165': 'Pennsylvania', '166': 'Pennsylvania', '167': 'Pennsylvania',
    '168': 'Pennsylvania', '169': 'Pennsylvania', '170': 'Pennsylvania',
    '171': 'Pennsylvania', '172': 'Pennsylvania', '173': 'Pennsylvania',
    '174': 'Pennsylvania', '175': 'Pennsylvania', '176': 'Pennsylvania',
    '280': 'North Carolina', '281': 'North Carolina', '282': 'North Carolina',
    '283': 'North Carolina', '284': 'North Carolina', '285': 'North Carolina',
    '286': 'North Carolina', '287': 'North Carolina', '288': 'North Carolina',
    '289': 'North Carolina', '270': 'North Carolina', '271': 'North Carolina',
    '272': 'North Carolina', '273': 'North Carolina', '274': 'North Carolina',
    '275': 'North Carolina', '276': 'North Carolina', '277': 'North Carolina',
    '278': 'North Carolina', '279': 'North Carolina',
    '330': 'Florida', '331': 'Florida', '332': 'Florida', '333': 'Florida',
    '334': 'Florida', '335': 'Florida', '336': 'Florida', '337': 'Florida',
    '338': 'Florida', '339': 'Florida', '340': 'Florida', '341': 'Florida',
    '342': 'Florida', '344': 'Florida', '346': 'Florida', '347': 'Florida',
    '349': 'Florida', '320': 'Florida', '321': 'Florida', '322': 'Florida',
    '323': 'Florida', '324': 'Florida', '325': 'Florida', '326': 'Florida',
    '327': 'Florida', '328': 'Florida', '329': 'Florida',
    '480': 'Michigan', '481': 'Michigan', '482': 'Michigan', '483': 'Michigan',
    '484': 'Michigan', '485': 'Michigan', '486': 'Michigan', '487': 'Michigan',
    '488': 'Michigan', '489': 'Michigan', '490': 'Michigan', '491': 'Michigan',
    '492': 'Michigan', '493': 'Michigan', '494': 'Michigan', '495': 'Michigan',
    '496': 'Michigan', '497': 'Michigan', '498': 'Michigan', '499': 'Michigan',
    '430': 'Ohio', '431': 'Ohio', '432': 'Ohio', '433': 'Ohio', '434': 'Ohio',
    '435': 'Ohio', '436': 'Ohio', '437': 'Ohio', '438': 'Ohio', '439': 'Ohio',
    '440': 'Ohio', '441': 'Ohio', '442': 'Ohio', '443': 'Ohio', '444': 'Ohio',
    '445': 'Ohio', '446': 'Ohio', '447': 'Ohio', '448': 'Ohio', '449': 'Ohio',
    '450': 'Ohio', '451': 'Ohio', '452': 'Ohio', '453': 'Ohio', '454': 'Ohio',
    '455': 'Ohio', '456': 'Ohio', '457': 'Ohio', '458': 'Ohio',
    '980': 'Washington', '981': 'Washington', '982': 'Washington',
    '983': 'Washington', '984': 'Washington', '985': 'Washington',
    '986': 'Washington', '988': 'Washington', '989': 'Washington',
    '990': 'Washington', '991': 'Washington', '992': 'Washington',
    '993': 'Washington', '994': 'Washington',
    '970': 'Oregon', '971': 'Oregon', '972': 'Oregon', '973': 'Oregon',
    '974': 'Oregon', '975': 'Oregon', '976': 'Oregon', '977': 'Oregon',
    '889': 'Nevada', '890': 'Nevada', '891': 'Nevada',
    '800': 'Colorado', '801': 'Colorado', '802': 'Colorado', '803': 'Colorado',
    '804': 'Colorado', '805': 'Colorado', '806': 'Colorado', '807': 'Colorado',
    '808': 'Colorado', '809': 'Colorado', '810': 'Colorado', '811': 'Colorado',
    '812': 'Colorado', '813': 'Colorado', '814': 'Colorado', '815': 'Colorado',
    '816': 'Colorado',
  };

  const stateCounts = new Map<string, number>();
  for (const [zip, count] of zipCounts) {
    const prefix = zip.slice(0, 3);
    const state = zipToState[prefix];
    if (state) {
      stateCounts.set(state, (stateCounts.get(state) ?? 0) + count);
    }
  }
  const totalSearches = eventCounts.searches || 1;
  const topStates = [...stateCounts.entries()]
    .map(([state, count]) => ({
      state,
      count,
      pct: Math.round((count / totalSearches) * 1000) / 10,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  return {
    eventCounts,
    previousEventCounts,
    totalContacts,
    connectionRate,
    uniqueZips,
    topStates,
    topZips,
    categoryBreakdown,
    topPrograms,
    contactClicks,
    boardExports,
    timeline,
    topKeywords,
    channelBreakdown,
    activityHeatmap,
  };
}
