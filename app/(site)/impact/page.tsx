import type { Metadata } from 'next';
import Link from 'next/link';
import { TrendingUp, Users, Heart, Gift, Calendar, ArrowRight, Target, Eye } from 'lucide-react';

export const metadata: Metadata = {
  title: '2024 Impact Report | Foster Greatness',
  description: 'See the measurable difference Foster Greatness is making in foster youth lives nationwide.',
};

const impactStats = [
  { number: '310', label: 'Event Attendees', icon: Users },
  { number: '8', label: 'Panels Hosted', icon: Calendar },
  { number: '8', label: 'Workshops Delivered', icon: TrendingUp },
  { number: '77', label: 'Wishes Granted', icon: Gift },
  { number: '2,000+', label: 'Community Members', icon: Heart },
  { number: '73', label: 'SDOH Event Participants', icon: Users },
];

const programHighlights = [
  {
    title: 'Panels & Workshops',
    description: 'We hosted 8 impactful panels and 8 engaging workshops, reaching 310 attendees. Panelists with lived experience courageously shared their journeys, providing inspiration and actionable insights.',
    icon: Calendar,
  },
  {
    title: 'SDOH & Community Events',
    description: 'We organized 2 Social Determinants of Health-focused community events in partnership with Eat Well and One Simple Wish, engaging 73 participants in discussions and activities designed to improve well-being.',
    icon: Heart,
  },
  {
    title: 'One Simple Wish Partnership',
    description: '77 wishes granted to community members through our partnership with One Simple Wish, providing everything from Nintendo Switches to essential household items.',
    icon: Gift,
  },
  {
    title: 'Foster Youth Tax Credit',
    description: 'Helped foster youth access the California Foster Youth Tax Credit, with 77 receiving one-on-one support and 35 receiving FYTC returns.',
    icon: TrendingUp,
  },
];

export default function ImpactPage() {
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
            <TrendingUp className="w-4 h-4 text-fg-blue" />
            <span className="text-sm font-semibold text-white/90">2024 Annual Report</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            2024 Impact Report
          </h1>

          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            A testament to the collective efforts of our team, supporters, and community members who have come together to make a meaningful difference.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-fg-blue/10">
                  <Target className="w-6 h-6 text-fg-blue" />
                </div>
                <h2 className="text-2xl font-bold text-fg-navy">Our Mission</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                To co-create a space with people impacted by the foster system where empowerment, healing, and community are front and center.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-fg-navy/10">
                  <Eye className="w-6 h-6 text-fg-navy" />
                </div>
                <h2 className="text-2xl font-bold text-fg-navy">Our Vision</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                A world where every person who has lived through the foster system feels seen, supported, and unstoppable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-fg-navy text-center mb-12">
            By The Numbers
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {impactStats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 text-center"
              >
                <div className="inline-flex p-3 rounded-xl bg-fg-blue/10 mb-4">
                  <stat.icon className="w-6 h-6 text-fg-blue" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-fg-navy mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Highlights */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-fg-navy text-center mb-12">
            Program Highlights
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {programHighlights.map((program) => (
              <div
                key={program.title}
                className="bg-white rounded-2xl p-8 shadow-md border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-fg-navy to-fg-blue">
                    <program.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-fg-navy">{program.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{program.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-fg-navy mb-4">
            Help Us Grow Our Impact
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            Your support helps us continue creating lifelong community and belonging for foster youth nationwide.
          </p>
          <Link
            href="/donate"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-fg-navy to-fg-blue text-white px-8 py-4 rounded-full font-bold hover:shadow-xl transition-all"
          >
            Support Our Mission
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
