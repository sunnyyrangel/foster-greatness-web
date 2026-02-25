/**
 * Community Resource Types
 *
 * Types and utilities for community-recommended resources stored in Supabase.
 * These resources display alongside Findhelp programs in the services search.
 */

// ============================================================================
// Database Row Type (Supabase)
// ============================================================================

/**
 * Raw row shape from the Supabase `resources` table.
 */
export interface ResourceRow {
  id: string;
  program_name: string;
  category: string;
  phone: string | null;
  website: string | null;
  state: string | null;
  address: string | null;
  description: string | null;
  zip: string | null;
  submitted_at: string;
  created_at: string;
}

// ============================================================================
// Normalized Display Type
// ============================================================================

/**
 * Normalized community resource shape for display alongside Findhelp programs.
 * The `source` discriminator distinguishes these from Findhelp `ProgramLite` results.
 */
export interface CommunityResource {
  id: string;
  source: 'community';
  name: string;
  provider_name: string;
  description: string;
  phone?: string;
  website_url?: string;
  address?: string;
  state?: string;
  zip?: string;
  category: string;
}

// ============================================================================
// SDOH Category Mapping
// ============================================================================

/**
 * Maps keyword patterns to Supabase `resources` table category values.
 * When a Findhelp tag label contains any keyword, the corresponding
 * resource categories are included in the search.
 */
const KEYWORD_TO_RESOURCE_CATEGORIES: Array<{ keywords: string[]; categories: string[] }> = [
  { keywords: ['education', 'school', 'tutor', 'ged', 'college', 'literacy'], categories: ['Education support', 'Education & Training'] },
  { keywords: ['housing', 'shelter', 'rent', 'homeless'], categories: ['Housing'] },
  { keywords: ['family', 'child', 'parent', 'youth', 'foster', 'mentor'], categories: ['Child care', 'Foster Care Support', 'Mentorship and social support'] },
  { keywords: ['food', 'meal', 'nutrition', 'snap', 'pantry', 'hunger'], categories: ['Food assistance'] },
];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Returns the Supabase category values that correspond to a Findhelp tag label.
 * Uses keyword matching so it works with both SDOH labels and Findhelp tag labels.
 */
export function getResourceCategoriesForSDOH(tagLabel: string): string[] {
  const lower = tagLabel.toLowerCase();
  const matched = new Set<string>();

  for (const mapping of KEYWORD_TO_RESOURCE_CATEGORIES) {
    for (const keyword of mapping.keywords) {
      if (lower.includes(keyword)) {
        mapping.categories.forEach(c => matched.add(c));
        break;
      }
    }
  }

  return [...matched];
}

/**
 * Converts a raw Supabase ResourceRow into a normalized CommunityResource
 * for display in the services search UI.
 */
export function toCommunityResource(row: ResourceRow): CommunityResource {
  return {
    id: row.id,
    source: 'community',
    name: row.program_name,
    provider_name: row.program_name,
    description: row.description ?? '',
    ...(row.phone != null && { phone: row.phone }),
    ...(row.website != null && { website_url: row.website }),
    ...(row.address != null && { address: row.address }),
    ...(row.state != null && { state: row.state }),
    ...(row.zip != null && { zip: row.zip }),
    category: row.category,
  };
}

// ============================================================================
// Informational Resource Types (Supabase `informational_resources` table)
// ============================================================================

/**
 * Raw row shape from the Supabase `search_informational_resources()` RPC.
 */
export interface InformationalResourceRow {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
  resource_type: string;
  category: string;
  geography: string;
  languages: string[];
  audience: string[];
  source_org: string | null;
  tags: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  relevance: number;
}

/**
 * Normalized informational resource for display in the services search UI.
 * The `source` discriminator distinguishes these from Findhelp and community resources.
 */
export interface InformationalResource {
  id: string;
  source: 'informational';
  title: string;
  description: string;
  url: string | null;
  resource_type: string;
  category: string;
  geography: string;
  languages: string[];
  source_org: string;
  relevance: number;
}

/**
 * Converts a raw Supabase InformationalResourceRow into a normalized
 * InformationalResource for display in the services search UI.
 */
export function toInformationalResource(row: InformationalResourceRow): InformationalResource {
  return {
    id: row.id,
    source: 'informational',
    title: row.title,
    description: row.description ?? '',
    url: row.url,
    resource_type: row.resource_type,
    category: row.category,
    geography: row.geography,
    languages: row.languages ?? ['en'],
    source_org: row.source_org ?? '',
    relevance: row.relevance,
  };
}
