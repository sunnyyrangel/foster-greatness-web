/**
 * Seed Generator: Casey Trello Board → informational_resources SQL
 *
 * Parses the Casey Family Programs Trello board export and generates
 * SQL INSERT statements for the informational_resources table.
 *
 * Usage: npx tsx supabase/scripts/generate-seed.ts
 * Output: supabase/seed_informational_resources.sql
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

// ============================================================================
// Types
// ============================================================================

interface TrelloAttachment {
  name: string;
  url: string;
  fileName: string;
}

interface TrelloCard {
  id: string;
  name: string;
  desc: string;
  idList: string;
  url: string;
  attachments: TrelloAttachment[];
}

interface TrelloList {
  id: string;
  name: string;
}

interface TrelloBoard {
  lists: TrelloList[];
  cards: TrelloCard[];
}

type ResourceType =
  | 'guide'
  | 'fact_sheet'
  | 'toolkit'
  | 'training'
  | 'referral_tool'
  | 'policy_brief'
  | 'flyer'
  | 'poster'
  | 'video';

/**
 * Categories align with the SDOH categories used in ServiceTagSelector.tsx
 * so informational resources surface alongside Findhelp programs organically.
 */
type Category =
  | 'Legal Services'
  | 'Family & Childcare'
  | 'Education'
  | 'Healthcare';

interface InformationalResource {
  title: string;
  description: string | null;
  url: string | null;
  resource_type: ResourceType;
  category: Category;
  geography: string;
  languages: string[];
  audience: string[];
  source_org: string | null;
  tags: string[];
}

interface CardOverride {
  title?: string;
  description?: string;
  url?: string | null;
  resource_type: ResourceType;
  source_org: string;
  audience: string[];
  tags: string[];
  languages?: string[];
  geography?: string;
}

// ============================================================================
// Constants
// ============================================================================

const INPUT_PATH = resolve(
  __dirname,
  '../../caseytrello/mkh9LrZG - resources-for-undocumented-youth-families.json'
);
const OUTPUT_PATH = resolve(
  __dirname,
  '../seed_informational_resources.sql'
);

/** Trello list ID → SDOH category mapping (aligns with ServiceTagSelector.tsx) */
const LIST_CATEGORY_MAP: Record<string, Category> = {
  '67a293f55a6c6c9964840974': 'Legal Services',       // Know Your Rights Materials
  '67a2945e93b0b36a71a63a81': 'Legal Services',       // Native American Health Center...
  '67ae5005498da81cc78eed00': 'Legal Services',        // Resources for California's Immigrant Communities
  '67a2950b3365f26c658437e4': 'Legal Services',        // American Bar Association...
  '67a297f7a29ad2b71e20b3cd': 'Family & Childcare',   // Women's Refugee Commission...
  '67a29912c21a81ac142b50cc': 'Family & Childcare',   // The Center on Immigration and Child Welfare
  '67a2989a0946d9420a5732ed': 'Family & Childcare',   // Parental Tool Kit--Spanish
  '67a3cffc279b096eede28e38': 'Family & Childcare',   // Casey Family Programs--Resource List
  '67ae4ea58d7a183857b7147d': 'Legal Services',        // The Center for Law and Social Policy
};

/** CA-specific card IDs (geography = 'CA' instead of 'national') */
const CA_CARD_IDS = new Set([
  '67a53519c5e7116576456751', // CA Benefits Guide for Non-Citizens
  '67ae4968259e445911051db5', // CALIFORNIA RAPID RESPONSE NETWORKS
  '67a536805ad674c1cf75f461', // PRUCOL (LA County policy)
  '67ae552d3a3df8b0a8b5bc7e', // CA Access to Justice Commission
  '67ae500faedcd71f8333c4b8', // oag.ca.gov/immigrant/resources
]);

/** All cards in the CA-specific list also get CA geography */
const CA_LIST_IDS = new Set([
  '67ae5005498da81cc78eed00', // Resources for California's Immigrant Communities
]);

/** Curated per-card overrides — quality > automation with 24 cards */
const CARD_OVERRIDES: Record<string, CardOverride> = {
  // Card 1: Red Cards/Tarjetas Rojas
  '67a29415c84fee472de1417f': {
    description: 'All people in the United States, regardless of immigration status, have certain rights and protections under the U.S. Constitution. The ILRC\'s Red Cards help people assert their rights and defend themselves in many situations, such as when ICE agents go to a home.',
    resource_type: 'flyer',
    source_org: 'Immigrant Legal Resource Center (ILRC)',
    audience: ['foster_youth', 'caseworkers', 'families'],
    tags: ['ice', 'rights', 'red-card', 'enforcement', 'know-your-rights', 'bilingual'],
    languages: ['en', 'es'],
  },
  // Card 2: CA Benefits Guide for Non-Citizens
  '67a53519c5e7116576456751': {
    resource_type: 'guide',
    source_org: 'Immigrant Legal Resource Center (ILRC)',
    audience: ['foster_youth', 'caseworkers'],
    tags: ['benefits', 'california', 'noncitizens', 'public-benefits', 'bilingual'],
    languages: ['en', 'es'],
    geography: 'CA',
  },
  // Card 3: PRUCOL (original description is 3,600 chars of policy text — use curated summary)
  '67a536805ad674c1cf75f461': {
    description: 'Policy guide on PRUCOL (Person Residing Under the Color of Law) immigration status and eligibility for the Cash Assistance Program for Immigrants (CAPI). Covers qualified alien definitions, legal immigrant categories, and 11 specific non-citizen categories eligible under PRUCOL including those with deferred action status, approved I-130 petitions, and victims of trafficking or domestic violence.',
    resource_type: 'policy_brief',
    source_org: 'California Department of Social Services',
    audience: ['caseworkers'],
    tags: ['prucol', 'immigration-status', 'capi', 'eligibility', 'benefits', 'policy'],
    geography: 'CA',
  },
  // Card 4: Grounding the Immigration Narrative
  '67ab8b94414c7632cc8f7cb0': {
    url: '/assets/files/resources/young-center-immigration-messaging.pdf',
    resource_type: 'guide',
    source_org: 'Young Center for Immigrant Children\'s Rights',
    audience: ['caseworkers', 'advocates'],
    tags: ['narrative', 'messaging', 'children', 'families', 'immigration', 'advocacy'],
  },
  // Card 5: CALIFORNIA RAPID RESPONSE NETWORKS
  '67ae4968259e445911051db5': {
    resource_type: 'referral_tool',
    source_org: 'California Collaborative for Immigrant Justice (CCIJ)',
    audience: ['foster_youth', 'caseworkers', 'families'],
    tags: ['ice', 'detention', 'rapid-response', 'hotline', 'california', 'emergency'],
    geography: 'CA',
  },
  // Card 6: NCYL FAQs Caregiver Affidavit (no URL, no description)
  '67ae4d40f51b94173376fdb1': {
    title: 'NCYL FAQs: Caregiver Affidavit for Unaccompanied Immigrant Youth',
    description: 'Frequently asked questions from the National Center for Youth Law (NCYL) about using the Caregiver Affidavit as a non-relative or relative sponsor of unaccompanied immigrant youth. Covers legal responsibilities and processes for caregivers.',
    resource_type: 'guide',
    source_org: 'National Center for Youth Law (NCYL)',
    audience: ['caseworkers', 'families'],
    tags: ['caregiver', 'affidavit', 'unaccompanied-youth', 'sponsorship', 'legal', 'ncyl'],
  },
  // Card 7: KIND KYR Flyers (English) — Spanish version added as separate card in EXTRA_RESOURCES
  '67ae4d6a4a18b30cc164423c': {
    title: 'KIND Know Your Rights Flyer (English)',
    url: '/assets/files/resources/kind-know-your-rights-english.pdf',
    resource_type: 'flyer',
    source_org: 'Kids in Need of Defense (KIND)',
    audience: ['foster_youth'],
    tags: ['know-your-rights', 'youth', 'flyer', 'kind'],
    languages: ['en'],
  },
  // Card 8: Canva Design (URL-only — Native American Health Center poster)
  '67a2946f0c0a926de0b4bad6': {
    title: 'Native American Health Center: Know Your Rights Poster',
    description: 'Know Your Rights poster designed for display in community health centers and service agencies. Visual resource covering rights during immigration enforcement encounters.',
    resource_type: 'poster',
    source_org: 'Native American Health Center',
    audience: ['foster_youth', 'caseworkers'],
    tags: ['know-your-rights', 'poster', 'enforcement', 'visual-aid'],
  },
  // Card 9: State Benefit Map (description has embedded URL — use curated version)
  '67a535d4f6e80e3d41391c5f': {
    description: 'Interactive web tool from the National Immigrant Women\'s Advocacy Project (NIWAP) to help victim advocates, attorneys, judges, and other professionals screen and identify which immigrant survivors and children qualify for state or federally funded public benefits, programs, and services.',
    resource_type: 'referral_tool',
    source_org: 'National Immigrant Women\'s Advocacy Project (NIWAP)',
    audience: ['caseworkers', 'advocates'],
    tags: ['benefits', 'state-map', 'eligibility', 'screening', 'survivors', 'public-benefits'],
  },
  // Card 10: Brief Training — Supporting Unaccompanied Immigrant Youth (description has embedded URL)
  '67ae3c3e11a2e6eb11c0013b': {
    description: '24-minute video training on supporting unaccompanied immigrant youth (children 18 and younger) entering the United States from the Mexican border. Covers challenges this population faces and strategies to support these youth and their families.',
    resource_type: 'video',
    source_org: 'Casey Family Programs',
    audience: ['caseworkers'],
    tags: ['training', 'unaccompanied-youth', 'video', 'onboarding', 'border', 'support'],
  },
  // Card 11: Laken Riley Act & Juvenile Delinquency
  '67ae5462586d737358690648': {
    url: '/assets/files/resources/laken-riley-act-juvenile-delinquency.pdf',
    resource_type: 'policy_brief',
    source_org: 'Immigrant Legal Resource Center (ILRC)',
    audience: ['caseworkers', 'advocates'],
    tags: ['laken-riley', 'juvenile', 'delinquency', 'legislation', 'immigration', 'policy'],
  },
  // Card 12: Protected Areas Policies — Rescission
  '67ae54e26f762f52ef8d7169': {
    description: 'Analysis of the rescission of protected areas (sensitive locations) policies by the current administration and its impact on safety for immigrant communities.',
    url: '/assets/files/resources/protected-areas-policies.pdf',
    resource_type: 'policy_brief',
    source_org: 'Immigrant Legal Resource Center (ILRC)',
    audience: ['caseworkers', 'advocates'],
    tags: ['protected-areas', 'sensitive-locations', 'enforcement', 'policy', 'safety'],
  },
  // Card 13: CA Access to Justice Commission — Legal Aid Funding
  '67ae552d3a3df8b0a8b5bc7e': {
    description: 'California Access to Justice Commission (CALATJ) supplemental legal aid funding for vulnerable populations including immigrants and LGBTQ+ community. $4,875,000 available to nonprofits providing civil legal services. Grants range from $25,000-$150,000 per project. Priorities include protecting constitutional and legal rights of immigrants facing detention and strengthening cybersecurity for legal services programs.',
    resource_type: 'guide',
    source_org: 'California Access to Justice Commission (CALATJ)',
    audience: ['caseworkers', 'advocates'],
    tags: ['legal-aid', 'funding', 'grants', 'california', 'nonprofits', 'immigrants'],
    geography: 'CA',
  },
  // Card 14: oag.ca.gov/immigrant/resources (URL-only)
  '67ae500faedcd71f8333c4b8': {
    title: 'CA Attorney General: Immigrant Resources',
    description: 'Official California Attorney General resource page for immigrant communities. Includes know-your-rights information, complaint filing, and links to legal services.',
    resource_type: 'referral_tool',
    source_org: 'California Attorney General',
    audience: ['foster_youth', 'caseworkers', 'families'],
    tags: ['california', 'attorney-general', 'immigrant-resources', 'rights', 'legal-services'],
    geography: 'CA',
  },
  // Card 15: ABA Immigration Referral Tool
  '67a29515d1db1df0d06bcbc6': {
    url: '/assets/files/resources/aba-immigration-referral-tool.pdf',
    resource_type: 'referral_tool',
    source_org: 'American Bar Association (ABA)',
    audience: ['caseworkers'],
    tags: ['referral', 'immigration', 'caseworker-tool', 'legal-aid', 'aba'],
  },
  // Card 16: CICW — Center on Immigration and Child Welfare
  '67aced5da8b9a728c9acc3f0': {
    description: 'The Center on Immigration and Child Welfare (CICW) coordinates three professional networks: the Immigration and Child Welfare Practice Network, the Research Network, and the Legal Network. Facilitates collaboration among professionals across the U.S. working at the intersection of immigration and child welfare.',
    url: 'https://cimmcw.org/',
    resource_type: 'referral_tool',
    source_org: 'Center on Immigration and Child Welfare (CICW)',
    audience: ['caseworkers', 'advocates'],
    tags: ['child-welfare', 'immigration', 'network', 'collaboration', 'cicw'],
  },
  // Card 17: Make a plan — Women's Refugee Commission
  '67a297feb396c41ea33620a6': {
    url: '/assets/files/resources/make-a-plan-english.pdf',
    resource_type: 'toolkit',
    source_org: 'Women\'s Refugee Commission',
    audience: ['families'],
    tags: ['family-plan', 'separation', 'preparedness', 'parents', 'migrant-families'],
  },
  // Card 18: Guidance for Child Welfare Agencies — Trump 2.0
  '67a29944af215b589ef8ce5e': {
    url: '/assets/files/resources/trump-2-top-tips-fact-sheet.pdf',
    resource_type: 'fact_sheet',
    source_org: 'Center on Immigration and Child Welfare (CICW)',
    audience: ['caseworkers'],
    tags: ['child-welfare', 'agency-guidance', 'immigration-enforcement', 'preparedness'],
  },
  // Card 19: ICE Policies Fact Sheet — Detained Parents (only has Trello self-link, no external URL)
  '67c22a9818cec80bbaf4a72a': {
    description: 'Fact sheet for child welfare and guardianship stakeholders on ICE policies and standards related to detained parents and legal guardians. Covers processes for maintaining family connections during immigration detention.',
    url: null,
    resource_type: 'fact_sheet',
    source_org: 'Center on Immigration and Child Welfare (CICW)',
    audience: ['caseworkers', 'advocates'],
    tags: ['ice', 'detention', 'parents', 'guardianship', 'child-welfare', 'fact-sheet'],
  },
  // Card 20: ICE Online Detainee Locator System (attachment URL points to wrong PDF)
  '67c22b11bb4a8b751b776462': {
    description: 'Information about the ICE Online Detainee Locator System — a tool for locating individuals in immigration detention. Used by caseworkers and families to find detained parents or guardians.',
    url: 'https://locator.ice.gov/odls/#/index',
    resource_type: 'referral_tool',
    source_org: 'Center on Immigration and Child Welfare (CICW)',
    audience: ['caseworkers', 'families'],
    tags: ['ice', 'detainee-locator', 'detention', 'family-search', 'tool'],
  },
  // Card 21: Step-by-Step Family Preparedness Plan
  '67c22b619d3e30a97ab5c84f': {
    resource_type: 'toolkit',
    source_org: 'Immigrant Legal Resource Center (ILRC)',
    audience: ['families', 'foster_youth'],
    tags: ['family-plan', 'preparedness', 'step-by-step', 'separation', 'emergency'],
  },
  // Card 22: Parental Toolkit — Spanish
  '67a298a3b3dd8552b4147a61': {
    title: 'Parental Toolkit (Spanish)',
    url: '/assets/files/resources/parental-toolkit-spanish.pdf',
    resource_type: 'toolkit',
    source_org: 'Women\'s Refugee Commission',
    audience: ['families'],
    tags: ['parental-toolkit', 'spanish', 'family-plan', 'preparedness'],
    languages: ['es'],
  },
  // Card 23: Casey Family Programs — Child Welfare & Immigration
  '67a3d02928466f6c434a9efb': {
    url: '/assets/files/resources/casey-immigration-resources.pdf',
    resource_type: 'guide',
    source_org: 'Casey Family Programs',
    audience: ['caseworkers'],
    tags: ['child-welfare', 'detention', 'deportation', 'leadership', 'casey'],
  },
  // Card 24: CLASP Protecting Sensitive Locations Act (URL-only)
  '67ae4eb008870a748b94a6ef': {
    title: 'Protecting Sensitive Locations Act',
    description: 'Overview of the Protecting Sensitive Locations Act from the Center for Law and Social Policy (CLASP). Covers protections for schools, hospitals, churches, and other sensitive locations from immigration enforcement actions.',
    resource_type: 'policy_brief',
    source_org: 'Center for Law and Social Policy (CLASP)',
    audience: ['caseworkers', 'advocates'],
    tags: ['sensitive-locations', 'legislation', 'schools', 'hospitals', 'enforcement', 'clasp'],
  },
};

/** Extra resources not derived from a single Trello card (e.g., split multi-PDF cards) */
const EXTRA_RESOURCES: InformationalResource[] = [
  {
    title: 'KIND Know Your Rights Flyer (Spanish)',
    description: null,
    url: '/assets/files/resources/kind-know-your-rights-spanish.pdf',
    resource_type: 'flyer',
    category: 'Legal Services',
    geography: 'national',
    languages: ['es'],
    audience: ['foster_youth'],
    source_org: 'Kids in Need of Defense (KIND)',
    tags: ['know-your-rights', 'youth', 'flyer', 'spanish', 'kind'],
  },
];

// ============================================================================
// Pipeline Functions
// ============================================================================

/** Step 1: Read and parse the Trello JSON export */
function readTrelloJson(path: string): TrelloBoard {
  const raw = readFileSync(path, 'utf-8');
  return JSON.parse(raw) as TrelloBoard;
}

/** Step 2: Build list ID → name lookup map */
function buildListMap(lists: TrelloList[]): Map<string, string> {
  return new Map(lists.map((l) => [l.id, l.name]));
}

/** Step 3: Extract cards (filter out archived if any) */
function extractCards(cards: TrelloCard[]): TrelloCard[] {
  return cards.filter((c) => LIST_CATEGORY_MAP[c.idList] !== undefined);
}

/** Clean a URL by stripping Trello smartCard suffixes and trailing quotes */
function cleanUrl(url: string): string {
  return url
    .replace(/\s*"smartCard-inline"$/i, '')
    .replace(/\s*"[^"]*"$/, '')  // Any trailing quoted suffix
    .replace(/\{smartCard-inline\}/g, '')
    .trim();
}

/** Step 4: Get the best URL from a card */
function extractUrl(card: TrelloCard): string | null {
  // Priority 1: Non-Trello attachment URLs (external org links)
  for (const att of card.attachments) {
    if (att.url && !att.url.includes('trello.com')) {
      return cleanUrl(att.url);
    }
  }

  // Priority 2: Markdown links in description (first non-Trello URL)
  const markdownLinks = [...card.desc.matchAll(/\[.*?\]\((https?:\/\/[^)]+)\)/g)];
  for (const match of markdownLinks) {
    const url = cleanUrl(match[1]);
    if (!url.includes('trello.com')) {
      return url;
    }
  }

  // Priority 3: Bare URL in description (first non-Trello URL)
  const bareUrls = [...card.desc.matchAll(/(https?:\/\/\S+)/g)];
  for (const match of bareUrls) {
    const url = cleanUrl(match[1]);
    if (!url.includes('trello.com')) {
      return url;
    }
  }

  // Priority 4: Card name itself if it's a URL
  if (card.name.startsWith('http://') || card.name.startsWith('https://')) {
    return cleanUrl(card.name);
  }

  // No usable URL found
  return null;
}

/** Truncate PRUCOL description to ~500 chars at a meaningful boundary */
function truncateDescription(desc: string, maxLen: number): string {
  if (desc.length <= maxLen) return desc;
  const truncated = desc.slice(0, maxLen);
  const lastPeriod = truncated.lastIndexOf('.');
  const lastNewline = truncated.lastIndexOf('\n');
  const breakPoint = Math.max(lastPeriod, lastNewline);
  return breakPoint > maxLen * 0.5
    ? truncated.slice(0, breakPoint + 1).trim()
    : truncated.trim() + '...';
}

/** Clean description text for SQL insertion */
function cleanDescription(desc: string): string {
  let cleaned = desc
    // Remove markdown link syntax, keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove Trello smartCard references
    .replace(/\{smartCard-inline\}/g, '')
    // Remove bare URLs on their own line (the URL is stored in its own column)
    .replace(/^https?:\/\/\S+\s*\n?/gm, '')
    // Remove zero-width characters
    .replace(/[\u200B\u200C\u200D\uFEFF]/g, '')
    // Remove lines that are just dashes
    .replace(/^---+\s*$/gm, '')
    // Collapse multiple newlines
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return cleaned;
}

/** Step 5: Map a Trello card to an InformationalResource */
function mapToResource(
  card: TrelloCard,
  _listMap: Map<string, string>
): InformationalResource {
  const override = CARD_OVERRIDES[card.id];
  if (!override) {
    throw new Error(`No override found for card: ${card.id} — "${card.name}"`);
  }

  const category = LIST_CATEGORY_MAP[card.idList];

  // Determine geography
  let geography = 'national';
  if (override.geography) {
    geography = override.geography;
  } else if (CA_CARD_IDS.has(card.id) || CA_LIST_IDS.has(card.idList)) {
    geography = 'CA';
  }

  // Build title
  const title = override.title ?? card.name;

  // Build description
  let description: string | null = null;
  if (override.description) {
    description = override.description;
  } else if (card.desc.trim()) {
    const cleaned = cleanDescription(card.desc);
    description = cleaned || null;
  }

  // Extract URL (override takes precedence — use explicit null to force no URL)
  const url = override.url !== undefined ? override.url : extractUrl(card);

  // Languages
  const languages = override.languages ?? ['en'];

  return {
    title,
    description,
    url,
    resource_type: override.resource_type,
    category,
    geography,
    languages,
    audience: override.audience,
    source_org: override.source_org,
    tags: override.tags,
  };
}

// ============================================================================
// SQL Generation
// ============================================================================

/** Escape a string for SQL single quotes */
function sqlEscape(value: string): string {
  return value.replace(/'/g, "''");
}

/** Format a text[] PostgreSQL array literal */
function sqlArray(values: string[]): string {
  if (values.length === 0) return "'{}'";
  const escaped = values.map((v) => `"${sqlEscape(v)}"`).join(',');
  return `'{${escaped}}'`;
}

/** Format a nullable SQL string */
function sqlString(value: string | null): string {
  if (value === null) return 'NULL';
  return `'${sqlEscape(value)}'`;
}

/** Step 6: Generate a single INSERT statement */
function generateInsert(resource: InformationalResource): string {
  return `INSERT INTO informational_resources (title, description, url, resource_type, category, geography, languages, audience, source_org, tags)
VALUES (
  ${sqlString(resource.title)},
  ${sqlString(resource.description)},
  ${sqlString(resource.url)},
  ${sqlString(resource.resource_type)},
  ${sqlString(resource.category)},
  ${sqlString(resource.geography)},
  ${sqlArray(resource.languages)},
  ${sqlArray(resource.audience)},
  ${sqlString(resource.source_org)},
  ${sqlArray(resource.tags)}
);`;
}

/** Step 7: Generate full SQL file content */
function generateSQL(resources: InformationalResource[]): string {
  const header = `-- Seed: informational_resources
-- Source: Casey Family Programs Trello Board Export
-- Generated: ${new Date().toISOString().split('T')[0]}
-- Cards: ${resources.length}
--
-- This file was generated by supabase/scripts/generate-seed.ts
-- To regenerate: npx tsx supabase/scripts/generate-seed.ts

`;

  const inserts = resources.map(generateInsert).join('\n\n');
  return header + inserts + '\n';
}

// ============================================================================
// Main Pipeline
// ============================================================================

function main(): void {
  console.log('Reading Trello JSON...');
  const board = readTrelloJson(INPUT_PATH);

  console.log(`Found ${board.lists.length} lists, ${board.cards.length} cards`);
  const listMap = buildListMap(board.lists);

  const cards = extractCards(board.cards);
  console.log(`Filtered to ${cards.length} cards with known lists`);

  console.log('Mapping cards to resources...');
  const resources = cards.map((card) => mapToResource(card, listMap));

  // Append extra resources (e.g., KIND Spanish split from multi-PDF card)
  resources.push(...EXTRA_RESOURCES);
  console.log(`Added ${EXTRA_RESOURCES.length} extra resources (total: ${resources.length})`);

  console.log('Generating SQL...');
  const sql = generateSQL(resources);

  writeFileSync(OUTPUT_PATH, sql, 'utf-8');
  console.log(`Wrote ${resources.length} INSERT statements to ${OUTPUT_PATH}`);

  // Summary
  const byCat = new Map<string, number>();
  const byGeo = new Map<string, number>();
  for (const r of resources) {
    byCat.set(r.category, (byCat.get(r.category) ?? 0) + 1);
    byGeo.set(r.geography, (byGeo.get(r.geography) ?? 0) + 1);
  }

  console.log('\nBy category:');
  for (const [cat, count] of byCat) {
    console.log(`  ${cat}: ${count}`);
  }

  console.log('\nBy geography:');
  for (const [geo, count] of byGeo) {
    console.log(`  ${geo}: ${count}`);
  }
}

main();
