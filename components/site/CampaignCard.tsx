'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Gift, ArrowRight } from 'lucide-react';
import type { Campaign } from '@/data/campaigns';

interface CampaignCardProps {
  campaign: Campaign;
}

/**
 * CampaignCard - Reusable campaign card component for donation pages
 *
 * Handles both internal (Link) and external (a tag) routing based on
 * whether the campaign has a stripeLink.
 *
 * Usage:
 *   <CampaignCard campaign={campaign} />
 */
export default function CampaignCard({ campaign }: CampaignCardProps) {
  // Use Stripe link if available, otherwise fall back to campaign page
  const donateUrl = campaign.stripeLink || `/${campaign.slug}`;
  const isExternal = !!campaign.stripeLink;

  const cardContent = (
    <>
      <div className="relative h-48 overflow-hidden">
        <Image
          src={campaign.image}
          alt={campaign.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-fg-navy to-fg-blue opacity-20" />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-fg-navy to-fg-blue">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-fg-navy group-hover:text-fg-blue transition-colors">
            {campaign.title}
          </h3>
        </div>
        <p className="text-gray-600 mb-4">{campaign.description}</p>
        {campaign.donationAmount && (
          <p className="text-lg font-bold text-fg-blue mb-4">
            ${campaign.donationAmount} {campaign.donationLabel?.toLowerCase().replace('fund ', 'per ').replace('give ', '')}
          </p>
        )}
        <span className="inline-flex items-center gap-2 text-fg-blue font-semibold group-hover:gap-3 transition-all">
          {campaign.donationLabel || 'Support This Campaign'}
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </>
  );

  const cardClassName = "group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100";

  if (isExternal) {
    return (
      <a
        href={donateUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cardClassName}
      >
        {cardContent}
      </a>
    );
  }

  return (
    <Link href={donateUrl} className={cardClassName}>
      {cardContent}
    </Link>
  );
}
