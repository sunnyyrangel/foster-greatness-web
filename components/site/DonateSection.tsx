'use client';

import { Heart } from 'lucide-react';
import Script from 'next/script';
import StripeBuyButton from '@/components/StripeBuyButton';
import { siteConfig, stripeConfig } from '@/data';
import type { Campaign } from '@/data';

interface DonateSectionProps {
  /**
   * Optional campaign for campaign-specific donation.
   * If not provided, shows general donation.
   */
  campaign?: Campaign;

  /**
   * Section title override
   */
  title?: string;

  /**
   * Section subtitle override
   */
  subtitle?: string;

  /**
   * Show as compact version (no padding/background)
   */
  compact?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Reusable donation section component.
 *
 * Supports:
 * - Campaign-specific donations (with StripeBuyButton or payment link)
 * - General donations (using site config)
 * - Compact mode for embedding in other sections
 */
export default function DonateSection({
  campaign,
  title,
  subtitle,
  compact = false,
  className = '',
}: DonateSectionProps) {
  // Determine donation details
  const hasBuyButton = campaign?.stripeBuyButtonId;
  const stripeLink = campaign?.stripeLink || siteConfig.donation.generalStripeLink;
  // Stripe publishable key comes from environment variable via stripeConfig
  const publishableKey = stripeConfig.publishableKey;
  const donationLabel = campaign?.donationLabel || 'Make a Donation';
  const amount = campaign?.donationAmount;

  // Section text
  const sectionTitle = title || (campaign ? `Support ${campaign.shortTitle}` : 'Support Our Mission');
  const sectionSubtitle = subtitle || (
    campaign
      ? campaign.description
      : 'Make a general donation to support all Foster Greatness programs and help us create belonging for foster youth everywhere.'
  );

  if (compact) {
    return (
      <div className={`w-full ${className}`}>
        {hasBuyButton && (
          <Script
            src="https://js.stripe.com/v3/buy-button.js"
            strategy="lazyOnload"
          />
        )}

        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold mb-2 text-fg-navy">{sectionTitle}</h3>
          {amount && (
            <p className="text-base text-gray-600">
              ${amount} {donationLabel.toLowerCase()}
            </p>
          )}
        </div>

        {hasBuyButton ? (
          <StripeBuyButton
            buyButtonId={campaign.stripeBuyButtonId!}
            publishableKey={publishableKey}
          />
        ) : (
          <div className="flex justify-center">
            <a
              href={stripeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-fg-navy to-fg-blue text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <Heart className="w-5 h-5" />
              {donationLabel}
            </a>
          </div>
        )}

        <p className="text-center text-sm text-gray-500 mt-4">
          Questions? Contact{' '}
          <a
            href={`mailto:${siteConfig.donation.contactEmail}`}
            className="text-fg-blue hover:underline"
          >
            {siteConfig.donation.contactEmail}
          </a>
        </p>
      </div>
    );
  }

  return (
    <section className={`py-16 px-4 bg-gradient-to-b from-white to-gray-50 ${className}`}>
      {hasBuyButton && (
        <Script
          src="https://js.stripe.com/v3/buy-button.js"
          strategy="lazyOnload"
        />
      )}

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
          <div className="text-center mb-8">
            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-fg-blue/10 to-fg-navy/10 mb-6">
              <Heart className="w-10 h-10 text-fg-blue" />
            </div>
            <h2 className="text-3xl font-bold text-fg-navy mb-4">
              {sectionTitle}
            </h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              {sectionSubtitle}
            </p>
            {amount && (
              <p className="text-2xl font-bold text-fg-blue mt-4">
                ${amount} per {donationLabel.toLowerCase().replace('fund ', '').replace('give ', '')}
              </p>
            )}
          </div>

          {hasBuyButton ? (
            <div className="w-full mb-8">
              <StripeBuyButton
                buyButtonId={campaign.stripeBuyButtonId!}
                publishableKey={publishableKey}
              />
            </div>
          ) : (
            <div className="flex justify-center mb-8">
              <a
                href={stripeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-fg-navy to-fg-blue text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <Heart className="w-5 h-5" />
                {donationLabel}
              </a>
            </div>
          )}

          <p className="text-center text-sm text-gray-500">
            Questions? Contact{' '}
            <a
              href={`mailto:${siteConfig.donation.contactEmail}`}
              className="text-fg-blue hover:underline"
            >
              {siteConfig.donation.contactEmail}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
