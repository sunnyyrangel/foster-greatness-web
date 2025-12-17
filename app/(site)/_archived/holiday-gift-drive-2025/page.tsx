import type { Metadata } from 'next';
import InteractiveTree from './components/InteractiveTree';
import BrowseGifts from './components/BrowseGifts';
import { Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Holiday Gift Drive 2025 | Foster Greatness',
  description: 'Help make the holidays special for Foster Greatness community members. Choose a gift from our interactive Christmas tree and make a direct impact.',
  openGraph: {
    title: 'Holiday Gift Drive 2025 | Foster Greatness',
    description: 'Help make the holidays special for Foster Greatness community members',
    type: 'website',
  },
};

export default function GiftDrivePage() {
  return (
    <main className="relative min-h-screen bg-[#fafbfc]">
      {/* Subtle texture matching homepage */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231a2949' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-fg-light-blue to-white py-20 px-4 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 opacity-20">
          <Sparkles className="w-20 h-20 text-fg-blue" />
        </div>
        <div className="absolute bottom-10 right-10 opacity-20">
          <Sparkles className="w-16 h-16 text-fg-orange" />
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Event Badge */}
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md mb-8">
            <Sparkles className="w-5 h-5 text-fg-blue" />
            <span className="text-sm font-semibold text-fg-navy">
              Holiday Gift Drive 2025
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-fg-navy mb-6 leading-tight">
            Help Make the Holidays{' '}
            <span className="text-fg-blue">Special</span>
            <br />
            for Our Community
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed">
            Choose a gift from our interactive Christmas tree and bring holiday joy to a Foster Greatness community member. Every gift creates connection and celebrates belonging.
          </p>

          {/* Instructions */}
          <div className="inline-block bg-white px-8 py-4 rounded-xl shadow-lg border-2 border-fg-blue">
            <p className="text-lg font-semibold text-fg-navy">
              Click any ornament to see gift details and sponsor a community member
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Tree Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <InteractiveTree />
        </div>
      </section>

      {/* Browse All Gifts Section */}
      <BrowseGifts />

      {/* Thank You Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-fg-navy mb-6">
            Thank You for Creating Belonging
          </h2>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Your generosity helps current and former foster youth feel seen, valued, and connected during the holiday season. Every gift reminds our community members that they belong and are celebrated.
          </p>
          <p className="text-gray-600">
            Questions? Contact us at{' '}
            <a
              href="mailto:info@fostergreatness.co"
              className="text-fg-blue font-semibold hover:underline"
            >
              info@fostergreatness.co
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
