/**
 * Homepage Configuration
 *
 * Control what appears on the homepage and in what order.
 * Edit this file to change homepage layout and content.
 */

export interface HomepageSection {
  id: string;
  enabled: boolean;
  order: number;
}

export interface HomepageConfig {
  // Section visibility and order
  sections: HomepageSection[];

  // Featured campaign in hero area
  featuredCampaign: {
    enabled: boolean;
    campaignId?: string; // If not set, uses getFeaturedCampaign()
  };

  // Campaigns section settings
  campaignsSection: {
    enabled: boolean;
    maxItems: number;
    title: string;
    subtitle: string;
  };

  // Community section
  communitySection: {
    enabled: boolean;
    title: string;
    subtitle: string;
  };

  // Impact stats
  impactSection: {
    enabled: boolean;
    stats: {
      value: string;
      label: string;
    }[];
  };
}

export const homepageConfig: HomepageConfig = {
  sections: [
    { id: 'hero', enabled: true, order: 1 },
    { id: 'campaigns', enabled: true, order: 2 },
    { id: 'community', enabled: true, order: 3 },
    { id: 'impact', enabled: true, order: 4 },
    { id: 'thriver-stories', enabled: true, order: 5 },
    { id: 'contact', enabled: true, order: 6 },
  ],

  featuredCampaign: {
    enabled: true,
    // campaignId: 'holiday-gift-drive-2025', // Uncomment to override auto-selection
  },

  campaignsSection: {
    enabled: true,
    maxItems: 2,
    title: 'Support Our Community',
    subtitle: 'Current ways to make a difference',
  },

  communitySection: {
    enabled: true,
    title: 'More than a platform—a family',
    subtitle: 'Join 2,150+ current and former foster youth finding belonging',
  },

  impactSection: {
    enabled: true,
    stats: [
      { value: '2,150+', label: 'Community Members' },
      { value: '310', label: 'Event Attendees' },
      { value: '77', label: 'Wishes Granted' },
    ],
  },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get enabled sections in order
 */
export function getEnabledSections(): HomepageSection[] {
  return homepageConfig.sections
    .filter(s => s.enabled)
    .sort((a, b) => a.order - b.order);
}

/**
 * Check if a section is enabled
 */
export function isSectionEnabled(sectionId: string): boolean {
  const section = homepageConfig.sections.find(s => s.id === sectionId);
  return section?.enabled ?? false;
}
