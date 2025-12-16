/**
 * Site Configuration
 *
 * Global settings for the Foster Greatness website.
 * Edit this file to change site-wide settings.
 */

export interface SiteConfig {
  // Branding
  name: string;
  tagline: string;

  // Donation Settings
  donation: {
    generalStripeLink: string;
    processingFeeRate: number;
    contactEmail: string;
  };

  // External Links
  links: {
    community: string;
    appStore: string;
    playStore: string;
  };

  // Feature Flags
  features: {
    showSearch: boolean;
    showDonateButton: boolean;
  };
}

export const siteConfig: SiteConfig = {
  name: 'Foster Greatness',
  tagline: 'Creating lifelong community and belonging for current and former foster youth',

  donation: {
    generalStripeLink: 'https://buy.stripe.com/14k5o8gnU1srcdG6op',
    processingFeeRate: 0.03,
    contactEmail: 'info@fostergreatness.co',
  },

  links: {
    community: 'https://community.fostergreatness.co',
    appStore: '#', // TODO: Add when available
    playStore: '#', // TODO: Add when available
  },

  features: {
    showSearch: true,
    showDonateButton: true,
  },
};

// =============================================================================
// STRIPE CONFIGURATION
// =============================================================================

export const stripeConfig = {
  /**
   * Stripe publishable key - loaded from environment variable
   * Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in .env.local
   */
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
};
