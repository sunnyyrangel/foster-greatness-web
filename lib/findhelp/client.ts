/**
 * Findhelp (Aunt Bertha) API Server-Side Client
 * Handles authentication, token management, and API requests
 */

import type {
  AuthResponse,
  ServiceTagsResponse,
  ProgramsLiteResponse,
  Program,
  ProgramLite,
  SearchParams,
  Office,
} from './types';

// Base URLs for different API versions
const AUTH_BASE_URL = 'https://api.auntbertha.com/v3';
const PROGRAMS_BASE_URL = 'https://api.auntbertha.com/v2';

// Token cache (module-level, persists across requests in serverless)
let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

// Buffer time before expiry to refresh token (5 minutes)
const TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1000;

/**
 * Get environment credentials with validation
 */
function getCredentials(): { username: string; password: string; apiKey: string } {
  const username = process.env.FINDHELP_USERNAME;
  const password = process.env.FINDHELP_PASSWORD;
  const apiKey = process.env.FINDHELP_API_KEY;

  if (!username || !password || !apiKey) {
    throw new Error('Missing Findhelp API credentials. Please set FINDHELP_USERNAME, FINDHELP_PASSWORD, and FINDHELP_API_KEY environment variables.');
  }

  return { username, password, apiKey };
}

/**
 * Authenticate with Findhelp API and get JWT token
 */
async function authenticate(): Promise<string> {
  const { username, password, apiKey } = getCredentials();

  const response = await fetch(`${AUTH_BASE_URL}/authenticate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
      api_key: apiKey,
      expiration: 3600, // 1 hour
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Findhelp authentication failed: ${response.status} - ${errorText}`);
  }

  const data: AuthResponse = await response.json();

  if (!data.success || !data.data?.token) {
    throw new Error(`Findhelp authentication failed: ${data.error || 'Unknown error'}`);
  }

  // Cache token with expiry (1 hour from now)
  cachedToken = data.data.token;
  tokenExpiry = Date.now() + 3600 * 1000;

  return data.data.token;
}

/**
 * Get valid token, refreshing if necessary
 */
async function getToken(): Promise<string> {
  // Check if we have a valid cached token
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry - TOKEN_REFRESH_BUFFER_MS) {
    return cachedToken;
  }

  // Token missing or expired, get new one
  return authenticate();
}

/**
 * Invalidate the current token (used after 401 errors)
 */
function invalidateToken(): void {
  cachedToken = null;
  tokenExpiry = null;
}

/**
 * Make authenticated request to Findhelp API with 401 retry
 */
async function makeAuthenticatedRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getToken();

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  // Handle 401 - invalidate token and retry once
  if (response.status === 401) {
    invalidateToken();
    const newToken = await getToken();

    const retryResponse = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${newToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!retryResponse.ok) {
      const errorText = await retryResponse.text();
      throw new Error(`Findhelp API error after retry: ${retryResponse.status} - ${errorText}`);
    }

    return retryResponse.json();
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Findhelp API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

/**
 * Filter out administrative offices from office array
 * Administrative offices are not seeker-facing and should be hidden
 */
function filterAdministrativeOffices(offices: Office[]): Office[] {
  return offices.filter(office => !office.is_administrative);
}

/**
 * Attribute tags that indicate a program is relevant to foster youth.
 * If ANY of these appear, the program is kept regardless of other tags.
 */
const INCLUSIVE_TAGS = [
  // Direct match
  'foster youth',
  // Age groups that overlap with foster youth (teens & young adults)
  'teens',
  'young adults',
  'adults',
  'school-aged children',
  'children',
  // General
  'anyone in need',
  // Household
  'families',
  'single parent',
  'with children',
  'individuals',
  // Housing
  'homeless',
  'near homeless',
  // Income
  'low-income',
  'benefit recipients',
  // Education
  'students',
  'dropouts',
  // Employment
  'unemployed',
  // Justice
  'criminal justice history',
  // Survivors
  'abuse or neglect survivors',
  'domestic violence survivors',
  'human trafficking survivors',
  'trauma survivors',
  // Insurance
  'uninsured',
  'underinsured',
  // Identity
  'lgbtqia+',
  // Mental health
  'all mental health',
  'anxiety',
  'ptsd',
  // Substance
  'substance dependency',
  // Urgency
  'emergency',
  'in crisis',
  // Disability (foster youth may have disabilities)
  'all disabilities',
];

/**
 * Attribute tags that indicate a program targets populations
 * NOT relevant to foster youth. Only used when NO inclusive tags are present.
 */
const EXCLUSIVE_TAGS = [
  // Armed Forces
  'veterans',
  'active duty',
  'national guard',
  // Age groups too young or too old
  'infants',
  'toddlers',
  'preschoolers',
  'seniors',
  'retirement',
  // Immigration-specific
  'refugees',
  'undocumented',
  // Cancer-specific
  'cancer',
  'all cancer types',
  'adult cancer survivors',
  'all cancer survivors',
  'childhood cancer survivors',
  'young adult cancer survivors',
];

/**
 * Check if a program should be excluded from results.
 *
 * Logic: If ANY inclusive tag is present, KEEP the program (even if it also
 * serves veterans, seniors, etc.). Only exclude if the program's tags are
 * exclusively from the non-relevant set.
 */
function isExcludedPopulation(program: ProgramLite | Program): boolean {
  const allTags = [
    ...(program.attribute_tags || []),
    ...(program.rule_attributes || []),
  ].map(t => t.toLowerCase());

  // If any inclusive tag is present, always keep the program
  for (const tag of allTags) {
    for (const inclusive of INCLUSIVE_TAGS) {
      if (tag.includes(inclusive)) {
        return false;
      }
    }
  }

  // No inclusive tags found — check for exclusive-only targeting
  for (const tag of allTags) {
    for (const exclusive of EXCLUSIVE_TAGS) {
      if (tag.includes(exclusive)) {
        return true;
      }
    }
  }

  // Check age rules — exclude if minimum age is 55+
  const rules = program.rules || [];
  for (const rule of rules) {
    if (rule.min_age && rule.min_age >= 55) {
      return true;
    }
  }

  return false;
}

/**
 * Filter programs to remove those targeting excluded populations
 */
function filterExcludedPopulations<T extends ProgramLite | Program>(programs: T[]): T[] {
  return programs.filter(program => !isExcludedPopulation(program));
}

// ============================================================================
// Public API Methods
// ============================================================================

/**
 * Get service tags available for a ZIP code
 * These can be cached (per Findhelp ToS)
 */
export async function getServiceTags(postal: string): Promise<ServiceTagsResponse> {
  const url = `${PROGRAMS_BASE_URL}/zipcodes/${postal}/serviceTags`;
  return makeAuthenticatedRequest<ServiceTagsResponse>(url);
}

/**
 * Search programs by ZIP code and filters
 * Results CANNOT be cached (per Findhelp ToS)
 */
export async function searchPrograms(params: SearchParams): Promise<ProgramsLiteResponse> {
  const { postal, ...queryParams } = params;

  // Build query string
  const searchParams = new URLSearchParams();
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  const url = `${PROGRAMS_BASE_URL}/zipcodes/${postal}/programsLite?${searchParams.toString()}`;
  const response = await makeAuthenticatedRequest<ProgramsLiteResponse>(url);

  // Filter out excluded populations and administrative offices
  const filteredPrograms = filterExcludedPopulations(response.programs)
    .map(program => ({
      ...program,
      offices: filterAdministrativeOffices(program.offices),
    }));

  return {
    ...response,
    programs: filteredPrograms,
    // Update count to reflect filtered results
    count: filteredPrograms.length,
  };
}

/**
 * Get full program details
 * Results CANNOT be cached (per Findhelp ToS)
 */
export async function getProgramDetails(postal: string, programId: string): Promise<Program> {
  const url = `${PROGRAMS_BASE_URL}/zipcodes/${postal}/programs/${programId}`;
  const program = await makeAuthenticatedRequest<Program>(url);

  // Filter administrative offices
  return {
    ...program,
    offices: filterAdministrativeOffices(program.offices),
  };
}

/**
 * Verify API credentials are configured
 * Useful for health checks
 */
export function isConfigured(): boolean {
  try {
    getCredentials();
    return true;
  } catch {
    return false;
  }
}
