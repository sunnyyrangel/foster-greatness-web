/**
 * Findhelp (Aunt Bertha) API TypeScript Types
 * Based on API documentation at api.auntbertha.com
 */

// ============================================================================
// Authentication Types
// ============================================================================

export interface AuthRequest {
  username: string;
  password: string;
  api_key: string;
  expiration?: number; // seconds, default 30 days
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user_id: number;
  };
  error?: string;
}

// ============================================================================
// Service Tags Types
// ============================================================================

export interface ServiceTag {
  id: string;
  label: string;
  count: string;
}

export interface ServiceTagsResponse {
  count: string;
  tags: ServiceTag[];
}

// ============================================================================
// Attribute Tags Types
// ============================================================================

export interface AttributeTag {
  id: string;
  label: string;
  programKeys?: string[];
}

export interface AttributeTagsResponse {
  count: number;
  tags: AttributeTag[];
}

// ============================================================================
// Office Types
// ============================================================================

export interface OfficeLocation {
  longitude: number;
  latitude: number;
}

export interface OfficeHours {
  timezone?: string;
  timezone_name?: string;
  // Day-specific fields
  monday_all_day?: boolean;
  monday_start?: string;
  monday_finish?: string;
  tuesday_all_day?: boolean;
  tuesday_start?: string;
  tuesday_finish?: string;
  wednesday_all_day?: boolean;
  wednesday_start?: string;
  wednesday_finish?: string;
  thursday_all_day?: boolean;
  thursday_start?: string;
  thursday_finish?: string;
  friday_all_day?: boolean;
  friday_start?: string;
  friday_finish?: string;
  saturday_all_day?: boolean;
  saturday_start?: string;
  saturday_finish?: string;
  sunday_all_day?: boolean;
  sunday_start?: string;
  sunday_finish?: string;
}

export interface OpenNowInfo {
  is_open?: boolean;
  opens_at?: string;
  closes_at?: string;
}

export interface Office {
  address1?: string;
  address2?: string;
  address3?: string;
  city?: string;
  state?: string;
  postal?: string;
  distance?: number;
  email?: string;
  fax_number?: string;
  hours?: OfficeHours;
  is_administrative: boolean;
  location?: OfficeLocation;
  name?: string;
  notes?: string;
  office_numeric_id?: string;
  office_type?: string;
  open_now_info?: OpenNowInfo;
  phone_number?: string;
  supported_languages?: string[];
  url_safe_key?: string;
  website_url?: string;
}

// ============================================================================
// Next Steps Types
// ============================================================================

export type NextStepChannel =
  | 'phone'
  | 'location'
  | 'phone_office'
  | 'website'
  | 'website_office'
  | 'email'
  | 'email_office'
  | 'external_apply'
  | 'internal_apply'
  | 'referral_ab';

export interface NextStep {
  channel: NextStepChannel;
  action: string; // e.g., "get more info", "get services", "apply"
  contact: string; // The contact value (phone number, URL, address, etc.)
}

// ============================================================================
// Program Types
// ============================================================================

export type Availability = 'available' | 'limited' | 'unavailable';
export type FreeOrReduced = 'free' | 'reduced' | 'indeterminate';
export type Grain = 'national' | 'regional' | 'local';

export interface AgeRuleAttribute {
  type?: string;
  min_age?: number;
  max_age?: number;
  description?: string;
}

/**
 * Program lite object returned from programsLite endpoint
 * Optimized for fast response times with limited fields
 */
export interface ProgramLite {
  id: string;
  name: string;
  provider_name: string;
  provider_numeric_id?: string;
  description: string;
  availability: Availability;
  distance?: number;
  free_or_reduced: FreeOrReduced;
  coverage_description?: string;
  directions?: string;
  entry_date?: string;
  grain?: Grain;
  grain_location?: string[];
  isOfficeAvailable?: string;
  next_steps: NextStep[];
  offices: Office[];
  rules?: AgeRuleAttribute[];
  rule_attributes?: string[];
  score?: string;
  service_tags: string[];
  attribute_tags?: string[];
  supported_languages?: string[];
  updated_date?: string;
  validation_date?: string;
  website_url?: string;
  wl_score?: string;
  accepts_referrals?: boolean;
}

/**
 * Full program object returned from programs/{id} endpoint
 * Includes all fields from ProgramLite plus additional details
 */
export interface Program extends ProgramLite {
  program_numeric_id?: string;
  twitter_id?: string;
  video_url?: string;
}

// ============================================================================
// Search Types
// ============================================================================

export interface SearchParams {
  postal: string;
  serviceTag?: string; // comma-delimited
  attributeTag?: string; // comma-delimited
  terms?: string; // comma-delimited keyword search
  st_operand?: 'and' | 'or'; // default 'or'
  at_operand?: 'and' | 'or'; // default 'or'
  cursor?: number; // pagination offset, default 0
  limit?: number; // max 50, default 50
  sort_by?: 'relevance' | 'distance';
  includeAttributeTags?: boolean;
  cookie?: string; // analytics identifier, max 32 chars
}

export interface AttributeTagCount {
  name: string;
  children?: string[];
  count: number;
}

export interface ProgramsLiteResponse {
  count: number;
  programs: ProgramLite[];
  attribute_tag_counts?: AttributeTagCount[];
}

// ============================================================================
// Error Types
// ============================================================================

export interface FindhelpError {
  success: false;
  error: string;
  status?: number;
}

// ============================================================================
// API Response Wrappers
// ============================================================================

export type FindhelpResponse<T> =
  | { success: true; data: T }
  | FindhelpError;

// ============================================================================
// Resource Board Types (Client-side)
// ============================================================================

export interface SavedProgram {
  id: string;
  name: string;
  provider: string;
  description?: string;
  phone?: string;
  address?: string;
  website?: string;
  savedAt: number; // timestamp
}
