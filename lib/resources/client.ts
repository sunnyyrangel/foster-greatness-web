import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import type { ResourceRow, CommunityResource } from './types';
import { toCommunityResource, getResourceCategoriesForSDOH } from './types';

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
