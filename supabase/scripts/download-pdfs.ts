/**
 * Download PDFs from Trello CDN → public/assets/files/resources/
 *
 * One-time script to pull PDF attachments from the Casey Trello board
 * and save them as static assets. Trello CDN URLs expire, so these
 * need to be downloaded while accessible.
 *
 * Usage: npx tsx supabase/scripts/download-pdfs.ts
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
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
  attachments: TrelloAttachment[];
}

interface TrelloBoard {
  cards: TrelloCard[];
}

interface DownloadTarget {
  cardId: string;
  cardName: string;
  trelloUrl: string;
  localFilename: string;
}

// ============================================================================
// Config
// ============================================================================

const INPUT_PATH = resolve(
  __dirname,
  '../../caseytrello/mkh9LrZG - resources-for-undocumented-youth-families.json'
);
const OUTPUT_DIR = resolve(__dirname, '../../public/assets/files/resources');

/**
 * Map of Trello card ID → array of { attachmentIndex, localFilename }.
 * attachmentIndex selects which attachment from the card's attachments array.
 */
const DOWNLOAD_MAP: Record<string, { attachmentIndex: number; localFilename: string }[]> = {
  // Grounding the Immigration Narrative — 1 PDF
  '67ab8b94414c7632cc8f7cb0': [
    { attachmentIndex: 0, localFilename: 'young-center-immigration-messaging.pdf' },
  ],
  // KIND KYR Flyers — 2 PDFs (English + Spanish)
  '67ae4d6a4a18b30cc164423c': [
    { attachmentIndex: 0, localFilename: 'kind-know-your-rights-english.pdf' },
    { attachmentIndex: 1, localFilename: 'kind-know-your-rights-spanish.pdf' },
  ],
  // Laken Riley Act — 1 PDF
  '67ae5462586d737358690648': [
    { attachmentIndex: 0, localFilename: 'laken-riley-act-juvenile-delinquency.pdf' },
  ],
  // Protected Areas Policies — 1 PDF
  '67ae54e26f762f52ef8d7169': [
    { attachmentIndex: 0, localFilename: 'protected-areas-policies.pdf' },
  ],
  // ABA Referral Tool — 1 PDF
  '67a29515d1db1df0d06bcbc6': [
    { attachmentIndex: 0, localFilename: 'aba-immigration-referral-tool.pdf' },
  ],
  // Make a Plan — 1 PDF
  '67a297feb396c41ea33620a6': [
    { attachmentIndex: 0, localFilename: 'make-a-plan-english.pdf' },
  ],
  // Trump 2.0 Guidance — 1 PDF
  '67a29944af215b589ef8ce5e': [
    { attachmentIndex: 0, localFilename: 'trump-2-top-tips-fact-sheet.pdf' },
  ],
  // Parental Toolkit Spanish — 1 PDF
  '67a298a3b3dd8552b4147a61': [
    { attachmentIndex: 0, localFilename: 'parental-toolkit-spanish.pdf' },
  ],
  // Casey Child Welfare Leaders — 1 PDF
  '67a3d02928466f6c434a9efb': [
    { attachmentIndex: 0, localFilename: 'casey-immigration-resources.pdf' },
  ],
};

// ============================================================================
// Pipeline
// ============================================================================

function buildTargets(board: TrelloBoard): DownloadTarget[] {
  const targets: DownloadTarget[] = [];

  for (const [cardId, downloads] of Object.entries(DOWNLOAD_MAP)) {
    const card = board.cards.find((c) => c.id === cardId);
    if (!card) {
      console.error(`Card not found: ${cardId}`);
      continue;
    }

    for (const dl of downloads) {
      const attachment = card.attachments[dl.attachmentIndex];
      if (!attachment) {
        console.error(`Attachment ${dl.attachmentIndex} not found on card: ${card.name}`);
        continue;
      }

      targets.push({
        cardId,
        cardName: card.name,
        trelloUrl: attachment.url,
        localFilename: dl.localFilename,
      });
    }
  }

  return targets;
}

async function downloadFile(target: DownloadTarget): Promise<boolean> {
  const outputPath = resolve(OUTPUT_DIR, target.localFilename);

  if (existsSync(outputPath)) {
    console.log(`  SKIP (exists): ${target.localFilename}`);
    return true;
  }

  try {
    const response = await fetch(target.trelloUrl);
    if (!response.ok) {
      console.error(`  FAIL (${response.status}): ${target.localFilename} — ${target.trelloUrl}`);
      return false;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length < 100) {
      console.error(`  FAIL (too small: ${buffer.length} bytes): ${target.localFilename}`);
      return false;
    }

    writeFileSync(outputPath, buffer);
    console.log(`  OK (${(buffer.length / 1024).toFixed(0)} KB): ${target.localFilename}`);
    return true;
  } catch (error) {
    console.error(`  FAIL (network): ${target.localFilename} — ${error}`);
    return false;
  }
}

async function main(): Promise<void> {
  console.log('Reading Trello JSON...');
  const board = JSON.parse(readFileSync(INPUT_PATH, 'utf-8')) as TrelloBoard;

  const targets = buildTargets(board);
  console.log(`\nDownloading ${targets.length} PDFs to ${OUTPUT_DIR}/\n`);

  let success = 0;
  let failed = 0;

  for (const target of targets) {
    const ok = await downloadFile(target);
    if (ok) success++;
    else failed++;
  }

  console.log(`\nDone: ${success} downloaded, ${failed} failed`);
  if (failed > 0) {
    process.exit(1);
  }
}

main();
