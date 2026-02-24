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
 * Maps SDOH category labels (used in ServiceTagSelector) to Supabase
 * `resources` table category values. Empty arrays mean no community
 * resources exist for that SDOH category yet.
 */
export const SDOH_TO_RESOURCE_CATEGORIES: Record<string, string[]> = {
  'Education': ['Education support', 'Education & Training'],
  'Housing & Shelter': ['Housing'],
  'Family & Childcare': ['Child care', 'Foster Care Support', 'Mentorship and social support'],
  'Food & Nutrition': ['Food assistance'],
  'Healthcare': [],
  'Employment & Income': [],
  'Transportation': [],
  'Legal Services': [],
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Returns the Supabase category values that correspond to an SDOH category label.
 * Returns an empty array for unknown or unmapped SDOH categories.
 */
export function getResourceCategoriesForSDOH(sdohLabel: string): string[] {
  return SDOH_TO_RESOURCE_CATEGORIES[sdohLabel] ?? [];
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
