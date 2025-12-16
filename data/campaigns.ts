/**
 * Campaign Configuration
 *
 * This is the SINGLE SOURCE OF TRUTH for all campaigns.
 * When you need to add, edit, or end a campaign, do it here.
 *
 * The Header, Donate page, and Homepage all pull from this file.
 */

export type CampaignStatus = 'active' | 'upcoming' | 'past';
export type CampaignType = 'donation' | 'event' | 'ongoing';

export interface Campaign {
  // Identity
  id: string;
  slug: string;
  status: CampaignStatus;
  type: CampaignType;

  // Display
  title: string;
  shortTitle: string;
  description: string;
  tagline?: string;

  // Visual
  image: string;
  icon: string;

  // Dates
  startDate?: string;
  endDate?: string;
  eventDate?: string;

  // Donation
  stripeLink?: string;
  stripeBuyButtonId?: string;
  donationAmount?: number;
  donationLabel?: string;

  // Visibility Flags
  showInNav: boolean;
  showOnHomepage: boolean;
  showOnDonatePage: boolean;
  featured: boolean;

  // Page Type
  hasCustomPage: boolean;
}

// =============================================================================
// CAMPAIGN DEFINITIONS
// =============================================================================

export const campaigns: Campaign[] = [
  {
    id: 'holiday-gift-drive-2025',
    slug: 'holiday-gift-drive-2025',
    status: 'active',
    type: 'donation',

    title: 'Holiday Gift Drive 2025',
    shortTitle: 'Holiday Gift Drive',
    description: 'Help provide gifts to foster youth this holiday season through our interactive giving tree',
    tagline: 'Give the gift of belonging',

    image: '/images/holiday-gift-tree.png',
    icon: '🎄',

    startDate: '2025-11-15',
    endDate: '2025-12-25',

    stripeLink: 'https://donate.stripe.com/8wM3fO2Xn5Ht1tm3cc',
    donationLabel: 'Give a Gift',

    showInNav: true,
    showOnHomepage: true,
    showOnDonatePage: true,
    featured: true,

    hasCustomPage: true,
  },
  {
    id: 'gingerbread-2025',
    slug: 'gingerbread',
    status: 'active',
    type: 'event',

    title: 'Gingerbread House Contest',
    shortTitle: 'Gingerbread Contest',
    description: 'Support our community gingerbread building event and help create joyful memories',
    tagline: 'Build belonging together',

    image: '/images/gingerbread-1.jpg',
    icon: '🏠',

    startDate: '2025-11-18',
    endDate: '2025-12-19',
    eventDate: '2025-12-19',

    stripeBuyButtonId: 'buy_btn_1SQC6QF61ARMru0WlQcx7Fyb',
    // stripePublishableKey now comes from environment variable via stripeConfig
    donationAmount: 60,
    donationLabel: 'Fund 1 Member',

    showInNav: false,
    showOnHomepage: false,
    showOnDonatePage: false,
    featured: false,

    hasCustomPage: true,
  },
  {
    id: 'meal-kit-2024',
    slug: 'meal-kit-sponsors',
    status: 'past',
    type: 'donation',

    title: 'Meal Kit Sponsors',
    shortTitle: 'Meal Kits',
    description: 'Partner with us to provide Thanksgiving meal kits to foster families',

    image: '/images/community-feature.png',
    icon: '🦃',

    endDate: '2024-11-28',

    showInNav: false,
    showOnHomepage: false,
    showOnDonatePage: false,
    featured: false,

    hasCustomPage: true,
  },
  {
    id: 'crisis-fund',
    slug: 'crisis-fund',
    status: 'active',
    type: 'ongoing',

    title: 'Crisis Fund',
    shortTitle: 'Crisis Fund',
    description: 'Emergency assistance for community members when they need it most',

    image: '/images/crisis-fund.jpeg',
    icon: '🆘',

    stripeLink: 'https://donate.stripe.com/bJe3cvb2Y50k7G96xJco003',
    donationLabel: 'Support Crisis Fund',

    showInNav: false,
    showOnHomepage: false,
    showOnDonatePage: true,
    featured: false,

    hasCustomPage: false,
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get all active campaigns
 */
export function getActiveCampaigns(): Campaign[] {
  return campaigns.filter(c => c.status === 'active');
}

/**
 * Get campaigns to show in navigation
 */
export function getNavCampaigns(): Campaign[] {
  return campaigns.filter(c => c.showInNav && c.status !== 'past');
}

/**
 * Get campaigns to show on homepage
 */
export function getHomepageCampaigns(): Campaign[] {
  return campaigns.filter(c => c.showOnHomepage && c.status === 'active');
}

/**
 * Get campaigns to show on donate page
 */
export function getDonateCampaigns(): Campaign[] {
  return campaigns.filter(c => c.showOnDonatePage && c.status === 'active');
}

/**
 * Get the featured campaign (for hero placement)
 */
export function getFeaturedCampaign(): Campaign | undefined {
  return campaigns.find(c => c.featured && c.status === 'active');
}

/**
 * Get a campaign by its slug
 */
export function getCampaignBySlug(slug: string): Campaign | undefined {
  return campaigns.find(c => c.slug === slug);
}

/**
 * Get a campaign by its ID
 */
export function getCampaignById(id: string): Campaign | undefined {
  return campaigns.find(c => c.id === id);
}
