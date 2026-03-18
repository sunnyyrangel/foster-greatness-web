import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import type { ResourceRow, CommunityResource, InformationalResourceRow, InformationalResource } from './types';
import { toCommunityResource, toInformationalResource } from './types';

// Cache ZIP → state lookups to avoid redundant RPC calls
const zipStateCache = new Map<string, string | null>();

/**
 * Resolve a ZIP code to its US state abbreviation.
 * Uses an in-memory cache so repeated lookups for the same ZIP are instant.
 */
export async function resolveZipToState(zip: string): Promise<string | null> {
  if (zipStateCache.has(zip)) {
    return zipStateCache.get(zip)!;
  }
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }
  const { data: userState } = await supabase.rpc('zip_to_state', { zip });
  zipStateCache.set(zip, userState ?? null);
  return userState ?? null;
}

export interface SearchResourcesParams {
  zip: string;
  category: string; // Findhelp category label like "Education" or "Housing"
}

export interface SearchResourcesResult {
  resources: CommunityResource[];
  count: number;
}

/**
 * Search community resources by ZIP and category.
 * Runs 3 parallel queries to find local, state-level, and national resources,
 * then combines results in order: local → state → national.
 * Returns empty result if Supabase is not configured.
 */
export async function searchResources(
  params: SearchResourcesParams
): Promise<SearchResourcesResult> {
  if (!isSupabaseConfigured || !supabase) {
    return { resources: [], count: 0 };
  }

  // Derive user's state from ZIP (cached after first call)
  const userState = await resolveZipToState(params.zip);

  // Run 3 queries in parallel: local, state-level, national
  const [localResult, stateResult, nationalResult] = await Promise.all([
    // 1. Local: exact ZIP match
    supabase
      .from('resources')
      .select('*')
      .eq('coverage_level', 'local')
      .eq('zip', params.zip)
      .eq('status', 'approved')
      .contains('service_tags', [params.category]),

    // 2. State-level: statewide or multi_state containing user's state
    userState
      ? supabase
          .from('resources')
          .select('*')
          .in('coverage_level', ['statewide', 'multi_state'])
          .contains('states', [userState])
          .eq('status', 'approved')
          .contains('service_tags', [params.category])
      : Promise.resolve({ data: [] as ResourceRow[], error: null }),

    // 3. National
    supabase
      .from('resources')
      .select('*')
      .eq('coverage_level', 'national')
      .eq('status', 'approved')
      .contains('service_tags', [params.category]),
  ]);

  if (localResult.error) throw new Error(`Supabase query failed: ${localResult.error.message}`);
  if (stateResult.error) throw new Error(`Supabase query failed: ${stateResult.error.message}`);
  if (nationalResult.error) throw new Error(`Supabase query failed: ${nationalResult.error.message}`);

  // Combine in order: local → state → national, deduplicate by ID
  const seen = new Set<string>();
  const allRows: ResourceRow[] = [];

  for (const row of [
    ...(localResult.data as ResourceRow[]),
    ...(stateResult.data as ResourceRow[]),
    ...(nationalResult.data as ResourceRow[]),
  ]) {
    if (!seen.has(row.id)) {
      seen.add(row.id);
      allRows.push(row);
    }
  }

  const resources = allRows.map(toCommunityResource);

  return { resources, count: resources.length };
}

// ============================================================================
// Informational Resources
// ============================================================================

export interface SearchInformationalParams {
  category: string;     // Findhelp category label like "Legal" or "Care"
  zip?: string;         // Optional ZIP for geography filtering
}

export interface SearchInformationalResult {
  resources: InformationalResource[];
  count: number;
}

/**
 * Search informational resources via Supabase RPC.
 * Calls search_informational_resources() with geography filtering,
 * then filters by category client-side.
 * Returns empty result if Supabase is not configured.
 */
export async function searchInformationalResources(
  params: SearchInformationalParams
): Promise<SearchInformationalResult> {
  if (!isSupabaseConfigured || !supabase) {
    return { resources: [], count: 0 };
  }

  // Derive state from ZIP (cached after first call for the same ZIP)
  const userState = params.zip ? await resolveZipToState(params.zip) : null;

  // Call the search RPC (no text search — just geography filtering)
  const { data, error } = await supabase.rpc('search_informational_resources', {
    search_text: null,
    user_state: userState,
  });

  if (error) {
    throw new Error(`Supabase RPC failed: ${error.message}`);
  }

  // Filter by category post-RPC using keyword matching
  const lowerCategory = params.category.toLowerCase();
  const filtered = (data as InformationalResourceRow[])
    .filter((row) => {
      const rowCat = row.category.toLowerCase();
      return rowCat.includes(lowerCategory) ||
        lowerCategory.includes(rowCat) ||
        rowCat.split(/\s+/).some(word => word.length > 3 && lowerCategory.includes(word));
    });

  const resources = filtered.map(toInformationalResource);

  return { resources, count: resources.length };
}
