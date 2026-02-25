/**
 * Findhelp API Integration
 * Re-exports all types and client functions
 */

// Types
export type {
  AuthRequest,
  AuthResponse,
  ServiceTag,
  ServiceTagsResponse,
  AttributeTag,
  AttributeTagsResponse,
  OfficeLocation,
  OfficeHours,
  OpenNowInfo,
  Office,
  NextStepChannel,
  NextStep,
  Availability,
  FreeOrReduced,
  Grain,
  AgeRuleAttribute,
  ProgramLite,
  Program,
  SearchParams,
  AttributeTagCount,
  ProgramsLiteResponse,
  FindhelpError,
  FindhelpResponse,
  SavedProgram,
} from './types';

// Client functions
export {
  getServiceTags,
  searchPrograms,
  getProgramDetails,
  isConfigured,
} from './client';

// Utility functions
export {
  cleanDescriptionInline,
  cleanDescriptionBlock,
  getAvailabilityInfo,
  getFreeReducedText,
  getOpenStatus,
  getPrimaryContact,
  formatOfficeHours,
  formatAddress,
  matchesOpenNowFilter,
  formatEligibilityLine,
  escapeHTML,
} from './utils';
