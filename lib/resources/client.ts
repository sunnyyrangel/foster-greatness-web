import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import type { ResourceRow, CommunityResource, InformationalResourceRow, InformationalResource } from './types';
import { toCommunityResource, getResourceCategoriesForSDOH, toInformationalResource } from './types';

export interface SearchResourcesParams {
  zip: string;
  sdohCategory: string; // SDOH label like "Education" or "Housing & Shelter"
}

export interface SearchResourcesResult {
  resources: CommunityResource[];
  count: number;
}

/**
 * Search community resources by ZIP and SDOH category.
 * Returns empty result if Supabase is not configured or no categories map.
 */
export async function searchResources(
  params: SearchResourcesParams
): Promise<SearchResourcesResult> {
  if (!isSupabaseConfigured || !supabase) {
    return { resources: [], count: 0 };
  }

  const categories = getResourceCategoriesForSDOH(params.sdohCategory);
  if (categories.length === 0) {
    return { resources: [], count: 0 };
  }

  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('zip', params.zip)
    .in('category', categories);

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
  category: string;     // SDOH label like "Legal Services"
  zip?: string;         // Optional ZIP for geography filtering
}

export interface SearchInformationalResult {
  resources: InformationalResource[];
  count: number;
}

/**
 * Search informational resources via Supabase RPC.
 * Calls search_informational_resources() with geography filtering,
 * then filters by SDOH category client-side.
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

  // DEBUG: temporary logging
  console.log('[informational] zip_to_state result:', userState);
  console.log('[informational] RPC error:', error);
  console.log('[informational] RPC data type:', typeof data, 'isArray:', Array.isArray(data), 'length:', Array.isArray(data) ? data.length : 'N/A');
  if (Array.isArray(data) && data.length > 0) {
    console.log('[informational] first row category:', data[0].category);
  }

  if (error) {
    throw new Error(`Supabase RPC failed: ${error.message}`);
  }

  // Filter by category post-RPC
  const filtered = (data as InformationalResourceRow[])
    .filter((row) => row.category === params.category);

  console.log('[informational] filter category:', params.category, 'pre-filter:', (data as InformationalResourceRow[]).length, 'post-filter:', filtered.length);

  const resources = filtered.map(toInformationalResource);

  return { resources, count: resources.length };
}
