/**
 * Community Resource Types
 *
 * Types and utilities for community-recommended resources stored in Supabase.
 * These resources display alongside Findhelp programs in the services search.
 */

// ============================================================================
// Coverage Level Types
// ============================================================================

export type CoverageLevel = 'local' | 'statewide' | 'multi_state' | 'national';

export const COVERAGE_LEVELS: { value: CoverageLevel; label: string }[] = [
  { value: 'local', label: 'Local (single ZIP code)' },
  { value: 'statewide', label: 'Statewide (one state)' },
  { value: 'multi_state', label: 'Multi-state (several states)' },
  { value: 'national', label: 'National (all 50 states)' },
];

export const US_STATES: { code: string; name: string }[] = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
  { code: 'DC', name: 'District of Columbia' },
  { code: 'PR', name: 'Puerto Rico' },
];

// ============================================================================
// Database Row Type (Supabase)
// ============================================================================

/**
 * Raw row shape from the Supabase `resources` table.
 */
export interface ResourceRow {
  id: string;
  program_name: string;
  provider_name: string | null;
  description: string | null;
  website_url: string | null;
  zip: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  latitude: number | null;
  longitude: number | null;
  coverage_level: string;
  states: string[];
  service_tags: string[];
  availability: string;
  free_or_reduced: string;
  eligibility: string | null;
  populations: string[];
  languages: string[];
  phone: string | null;
  email: string | null;
  hours: Record<string, unknown> | null;
  status: string;
  submitted_by_role: string | null;
  submitted_by_name: string | null;
  submitted_by_email: string | null;
  submitted_by_is_community_member: boolean;
  submitted_by_used_service: boolean;
  submitted_by_feedback: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  enrichment_data: Record<string, unknown> | null;
  enriched_at: string | null;
  category: string; // Legacy column, kept for backwards compat
  created_at: string;
  updated_at: string;
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
  email?: string;
  website_url?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  latitude?: number;
  longitude?: number;
  coverage_level: CoverageLevel;
  states: string[];
  service_tags: string[];
  availability: string;
  free_or_reduced: string;
  eligibility?: string;
  populations: string[];
  languages: string[];
  hours?: Record<string, unknown>;
}

// ============================================================================
// SDOH Categories
// ============================================================================

/**
 * SDOH categories used by both ServiceTagSelector and the submission form.
 * These are the canonical labels stored in service_tags[].
 */
export const SDOH_CATEGORIES = [
  'Food & Nutrition',
  'Housing & Shelter',
  'Healthcare',
  'Employment & Income',
  'Education',
  'Transportation',
  'Legal Services',
  'Family & Childcare',
] as const;

export type SdohCategory = (typeof SDOH_CATEGORIES)[number];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Converts a raw Supabase ResourceRow into a normalized CommunityResource
 * for display in the services search UI.
 */
export function toCommunityResource(row: ResourceRow): CommunityResource {
  return {
    id: row.id,
    source: 'community',
    name: row.program_name,
    provider_name: row.provider_name ?? row.program_name,
    description: row.description ?? '',
    ...(row.phone != null && { phone: row.phone }),
    ...(row.email != null && { email: row.email }),
    ...(row.website_url != null && { website_url: row.website_url }),
    ...(row.address != null && { address: row.address }),
    ...(row.city != null && { city: row.city }),
    ...(row.state != null && { state: row.state }),
    ...(row.zip != null && { zip: row.zip }),
    ...(row.latitude != null && { latitude: row.latitude }),
    ...(row.longitude != null && { longitude: row.longitude }),
    coverage_level: (row.coverage_level as CoverageLevel) ?? 'local',
    states: row.states ?? [],
    service_tags: row.service_tags ?? [],
    availability: row.availability ?? 'available',
    free_or_reduced: row.free_or_reduced ?? 'indeterminate',
    ...(row.eligibility != null && { eligibility: row.eligibility }),
    populations: row.populations ?? [],
    languages: row.languages ?? ['en'],
    ...(row.hours != null && { hours: row.hours }),
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
