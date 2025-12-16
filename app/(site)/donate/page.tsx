import type { Metadata } from 'next';
import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';
import { getDonateCampaigns, siteConfig, homepageConfig } from '@/data';
import CampaignCard from '@/components/site/CampaignCard';

export const metadata: Metadata = {
  title: 'Donate | Foster Greatness',
  description: 'Support Foster Greatness and help create lifelong community and belonging for current and former foster youth.',
};

export default function DonatePage() {
  // Get campaigns from config - automatically filters to active + showOnDonatePage
  const campaigns = getDonateCampaigns();
  const impactStats = homepageConfig.impactSection.stats;

  return (
    <main className="relative min-h-screen bg-[#fafbfc]">
      {/* Subtle texture */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231a2949' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-fg-navy via-fg-navy to-fg-blue py-20 px-4 overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-fg-blue/20 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-fg-orange/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Heart className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white/90">100% goes directly to programs</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Support Foster Greatness
          </h1>

          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Your generosity creates lifelong community and belonging for current and former foster youth nationwide.
          </p>
        </div>
      </section>

      {/* Active Campaigns - Dynamically generated from data/campaigns.ts */}
      {campaigns.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-fg-navy mb-4">
                Active Campaigns
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Choose a campaign to support, or make a general donation below.
              </p>
            </div>

            <div className={`grid ${campaigns.length === 1 ? 'max-w-lg' : 'md:grid-cols-2 max-w-4xl'} gap-8 mx-auto`}>
              {campaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* General Donation */}
      <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
            <div className="text-center mb-8">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-fg-blue/10 to-fg-navy/10 mb-6">
                <Heart className="w-10 h-10 text-fg-blue" />
              </div>
              <h2 className="text-3xl font-bold text-fg-navy mb-4">
                Support Our Mission
              </h2>
              <p className="text-lg text-gray-600 max-w-xl mx-auto">
                Make a general donation to support all Foster Greatness programs and help us create belonging for foster youth everywhere.
              </p>
            </div>

            <div className="flex justify-center mb-8">
              <a
                href={siteConfig.donation.generalStripeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-fg-navy to-fg-blue text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <Heart className="w-5 h-5" />
                Make a Donation
              </a>
            </div>

            <p className="text-center text-sm text-gray-500">
              Questions? Contact us at{' '}
              <a href={`mailto:${siteConfig.donation.contactEmail}`} className="text-fg-blue hover:underline">
                {siteConfig.donation.contactEmail}
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Impact Preview */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-fg-navy mb-8">Your Impact</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            {impactStats.map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl md:text-5xl font-bold text-fg-blue mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          <Link
            href="/impact"
            className="inline-flex items-center gap-2 text-fg-navy font-semibold hover:text-fg-blue transition-colors"
          >
            View Full Impact Report
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
