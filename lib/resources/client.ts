import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import type { ResourceRow, CommunityResource, InformationalResourceRow, InformationalResource } from './types';
import { toCommunityResource, toInformationalResource } from './types';

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
 * Returns empty result if Supabase is not configured or no categories map.
 */
export async function searchResources(
  params: SearchResourcesParams
): Promise<SearchResourcesResult> {
  if (!isSupabaseConfigured || !supabase) {
    return { resources: [], count: 0 };
  }

  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('zip', params.zip)
    .eq('status', 'approved')
    .contains('service_tags', [params.category]);

  if (error) {
    throw new Error(`Supabase query failed: ${error.message}`);
  }

  const resources = (data as ResourceRow[]).map(toCommunityResource);

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

  // Derive state from ZIP using the zip_to_state() RPC
  let userState: string | null = null;
  if (params.zip) {
    const { data: stateData } = await supabase.rpc('zip_to_state', { zip: params.zip });
    userState = stateData ?? null;
  }

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
