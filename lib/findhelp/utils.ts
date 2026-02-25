/**
 * Findhelp utility functions
 * Extracted from ProgramCard, ProgramDetailModal, and ProgramMap components.
 */

import type { Office, ProgramLite } from './types';

/**
 * Clean HTML/markup from API text for inline display (cards, lists).
 * Converts <br /> to space since cards are single-line.
 */
export function cleanDescriptionInline(text: string): string {
  return text
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/--\s*/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Clean HTML/markup from API text for block display (modals, detail views).
 * Converts <br /> to newline and -- to bullet points.
 */
export function cleanDescriptionBlock(text: string): string {
  return text
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/^--\s*/gm, '\u2022 ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Get availability badge color and text */
export function getAvailabilityInfo(availability: string) {
  switch (availability) {
    case 'available':
      return { color: 'bg-green-100 text-green-700', text: 'Available' };
    case 'limited':
      return { color: 'bg-yellow-100 text-yellow-700', text: 'Limited' };
    case 'unavailable':
      return { color: 'bg-red-100 text-red-700', text: 'Unavailable' };
    default:
      return { color: 'bg-gray-100 text-gray-700', text: 'Unknown' };
  }
}

/** Get free/reduced indicator text */
export function getFreeReducedText(freeOrReduced: string) {
  switch (freeOrReduced) {
    case 'free':
      return 'Free';
    case 'reduced':
      return 'Reduced cost';
    default:
      return null;
  }
}

/** Get open status from nearest office */
export function getOpenStatus(offices: Office[]): { text: string; isOpen: boolean } | null {
  if (!offices.length) return null;

  const officeWithHours = offices.find((o) => o.open_now_info);
  if (!officeWithHours?.open_now_info) return null;

  const info = officeWithHours.open_now_info;
  if (info.open_now) {
    return {
      text: info.close_time ? `Open until ${info.close_time}` : 'Open now',
      isOpen: true,
    };
  } else {
    return {
      text: info.open_time ? `Opens ${info.open_time}` : 'Closed',
      isOpen: false,
    };
  }
}

/** Get primary contact info from a program's first office */
export function getPrimaryContact(program: ProgramLite) {
  const office = program.offices[0];
  if (!office) return null;

  const address = [office.address1, office.city, office.state, office.postal]
    .filter(Boolean)
    .join(', ');

  return {
    phone: office.phone_number,
    address: address || null,
    website: office.website_url || program.website_url,
  };
}

/** Format office hours for display */
export function formatOfficeHours(office: Office): string[] {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
  const hours: string[] = [];

  for (const day of days) {
    const allDay = office.hours?.[`${day}_all_day` as keyof typeof office.hours];
    const start = office.hours?.[`${day}_start` as keyof typeof office.hours];
    const finish = office.hours?.[`${day}_finish` as keyof typeof office.hours];

    const dayName = day.charAt(0).toUpperCase() + day.slice(1);

    if (allDay) {
      hours.push(`${dayName}: 24 hours`);
    } else if (start && finish) {
      hours.push(`${dayName}: ${start} - ${finish}`);
    }
  }

  return hours;
}

/** Format office address parts into a comma-separated string */
export function formatAddress(office: Office): string {
  return [office.address1, office.address2, office.city, office.state, office.postal]
    .filter(Boolean)
    .join(', ');
}

/** Check if any non-administrative office reports open now */
export function matchesOpenNowFilter(program: ProgramLite): boolean {
  return program.offices.some(
    (o) => !o.is_administrative && o.open_now_info?.open_now === true
  );
}

/** Build a compact eligibility line from rules + rule_attributes */
export function formatEligibilityLine(program: ProgramLite): string | null {
  const parts: string[] = [];

  // Extract first age range from rules[]
  if (program.rules?.length) {
    const ageRule = program.rules.find(
      (r) => r.min_age !== undefined || r.max_age !== undefined
    );
    if (ageRule) {
      if (ageRule.min_age != null && ageRule.max_age != null) {
        parts.push(`Ages ${ageRule.min_age}\u2013${ageRule.max_age}`);
      } else if (ageRule.min_age != null) {
        parts.push(`Age ${ageRule.min_age}+`);
      } else if (ageRule.max_age != null) {
        parts.push(`Under ${ageRule.max_age}`);
      }
    }
  }

  // Take up to 2 rule_attributes
  if (program.rule_attributes?.length) {
    for (const attr of program.rule_attributes.slice(0, 2)) {
      if (parts.length >= 3) break;
      parts.push(attr);
    }
  }

  if (parts.length === 0) return null;

  const line = parts.join(' \u00b7 ');
  return line.length > 60 ? line.slice(0, 57) + '\u2026' : line;
}

/** Escape HTML for safe insertion into innerHTML (used by map popups) */
export function escapeHTML(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
