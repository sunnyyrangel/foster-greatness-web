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

  // Filter administrative offices (not seeker-facing)
  const programs = response.programs.map(program => ({
    ...program,
    offices: filterAdministrativeOffices(program.offices),
  }));

  return {
    ...response,
    programs,
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
