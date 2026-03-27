import Link from 'next/link';
import Image from 'next/image';
import { Heart, Home, Utensils, Briefcase, DollarSign, Users, ArrowRight, CheckCircle2, Clock, Calendar, ChevronDown, Search } from 'lucide-react';

export default function ResourcesPage() {
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
      <section className="relative bg-gradient-to-br from-fg-navy via-fg-navy to-fg-blue py-16 md:py-20 px-4 overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-fg-blue/20 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-fg-orange/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Heart className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white/90">Age In, Never Age Out</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Resources & Support
          </h1>

          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed mb-8">
            Everything you need in one place — find local services, attend community events, screen for benefits, access career support, and more. Completely free, no age limit.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/services"
              className="inline-flex items-center gap-3 bg-white text-fg-navy px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <Search className="w-5 h-5" />
              Find Resources Near You
            </Link>
            <a
              href="#events"
              className="inline-flex items-center gap-3 border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all"
            >
              <Calendar className="w-5 h-5" />
              View Events
            </a>
          </div>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="py-16 px-4 relative z-10">
        <div className="max-w-6xl mx-auto -mt-24">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Resource Finder */}
            <Link href="/services" className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-fg-blue/30 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-fg-teal/10 flex items-center justify-center mb-4 group-hover:bg-fg-teal/20 transition-colors">
                <Search className="w-6 h-6 text-fg-teal" />
              </div>
              <h3 className="text-lg font-bold text-fg-navy mb-2">Resource Finder</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">Search 500,000+ programs by ZIP code — housing, food, healthcare, jobs, education, and more.</p>
              <span className="text-fg-blue font-semibold text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Search now <ArrowRight className="w-4 h-4" />
              </span>
            </Link>

            {/* Events */}
            <a href="#events" className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-fg-blue/30 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-fg-blue/10 flex items-center justify-center mb-4 group-hover:bg-fg-blue/20 transition-colors">
                <Calendar className="w-6 h-6 text-fg-blue" />
              </div>
              <h3 className="text-lg font-bold text-fg-navy mb-2">Community Events</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">Workshops, panel discussions, cooking nights, support spaces, and more — all free and virtual.</p>
              <span className="text-fg-blue font-semibold text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                View events <ArrowRight className="w-4 h-4" />
              </span>
            </a>

            {/* Benefits Screener */}
            <a href="#benefits-screener" className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-fg-blue/30 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-fg-orange/10 flex items-center justify-center mb-4 group-hover:bg-fg-orange/20 transition-colors">
                <DollarSign className="w-6 h-6 text-fg-orange" />
              </div>
              <h3 className="text-lg font-bold text-fg-navy mb-2">Benefits Screener</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">Discover benefits you qualify for — SNAP, healthcare, education funds, tax credits, and more.</p>
              <span className="text-fg-blue font-semibold text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Take screener <ArrowRight className="w-4 h-4" />
              </span>
            </a>

            {/* Career Support */}
            <a href="#career" className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-fg-blue/30 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-fg-navy/10 flex items-center justify-center mb-4 group-hover:bg-fg-navy/15 transition-colors">
                <Briefcase className="w-6 h-6 text-fg-navy" />
              </div>
              <h3 className="text-lg font-bold text-fg-navy mb-2">Career Support</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">Resume building, mock interviews, career advising, and job placement through our Staffmark partnership.</p>
              <span className="text-fg-blue font-semibold text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Learn more <ArrowRight className="w-4 h-4" />
              </span>
            </a>

            {/* Crisis Fund */}
            <a href="#crisis-fund" className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-fg-blue/30 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-4 group-hover:bg-red-100 transition-colors">
                <Heart className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-fg-navy mb-2">Crisis Fund</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">Emergency financial assistance for unexpected hardships — rent, utilities, transportation, and more.</p>
              <span className="text-fg-blue font-semibold text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Get help <ArrowRight className="w-4 h-4" />
              </span>
            </a>

            {/* Submit Request */}
            <a href="https://community.fostergreatness.co/c/find-help-foster-greatness/" target="_blank" rel="noopener noreferrer" className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-fg-blue/30 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-fg-blue/10 flex items-center justify-center mb-4 group-hover:bg-fg-blue/20 transition-colors">
                <Users className="w-6 h-6 text-fg-blue" />
              </div>
              <h3 className="text-lg font-bold text-fg-navy mb-2">Submit a Request</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">Not sure where to start? Our team will help point you in the right direction.</p>
              <span className="text-fg-blue font-semibold text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Submit request <ArrowRight className="w-4 h-4" />
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-16 px-4 scroll-mt-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-fg-blue/10 text-fg-blue px-4 py-2 rounded-full mb-4">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-semibold">Community Events</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-fg-navy">
                Upcoming Events
              </h2>
              <p className="text-gray-600 mt-2">Workshops, panels, cooking nights, and more — all free and virtual.</p>
            </div>
            <a
              href="https://community.fostergreatness.co/c/general-events/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-fg-blue font-semibold hover:text-fg-navy transition-colors shrink-0"
            >
              View all events <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <iframe
              src="/widgets/circle-events"
              className="w-full border-none"
              style={{ height: 260 }}
              loading="lazy"
              title="Upcoming community events"
            />
          </div>
        </div>
      </section>

      {/* Resource Finder Feature */}
      <section className="py-16 px-4 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-fg-teal/10 to-fg-blue/10 rounded-3xl p-8 md:p-12 border border-fg-teal/20">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-fg-navy mb-4">
                  Resource Finder
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Search over 500,000 programs and services across the U.S. by ZIP code. Find housing, food, healthcare, employment, education, legal help, and more — all in one place.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['Housing', 'Food', 'Healthcare', 'Jobs', 'Education', 'Legal', 'Family', 'Transit'].map((tag) => (
                    <span key={tag} className="text-xs font-semibold bg-white text-fg-navy px-3 py-1.5 rounded-full border border-gray-200">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 bg-fg-navy text-white px-8 py-4 rounded-full font-bold hover:bg-fg-blue transition-colors shadow-lg"
                >
                  Search Resources Near You
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/images/resource-finder-preview.svg"
                  alt="Resource Finder tool preview"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-fg-navy mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find resources instantly with our Resource Finder, or submit a request for personalized help from our team.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                number: '01',
                title: 'Search by ZIP Code',
                description: 'Use our Resource Finder to search over 500,000 programs near you — housing, food, healthcare, jobs, and more.',
                image: '/images/resource-finder-preview.svg',
              },
              {
                number: '02',
                title: 'Browse & Connect',
                description: 'Explore results by category, view program details, and contact organizations directly.',
                image: '/images/search-results-preview.svg',
              },
              {
                number: '03',
                title: 'Need More Help?',
                description: 'Submit a support request through our community and our team will help connect you to the right resources.',
                image: '/images/support-request-preview.svg',
              },
            ].map((step, i, arr) => (
              <div key={step.number} className="flex flex-col">
                <div className="mb-6 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                  <div className="relative aspect-[3/2]">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex-1 relative">
                  <div className="text-5xl font-black text-fg-blue/20 mb-4">{step.number}</div>
                  <h3 className="text-xl font-bold text-fg-navy mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>

                  {i < arr.length - 1 && (
                    <div className="hidden md:flex absolute top-1/2 -right-6 transform -translate-y-1/2 z-10">
                      <ArrowRight className="w-8 h-8 text-fg-blue/30" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Can Help With */}
      <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-fg-navy mb-4">
              What We Can Help With
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We can help connect you with support across all areas of life.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Home, title: 'Housing Support', description: 'Help finding stable housing, navigating rental assistance, and accessing transitional living programs.' },
              { icon: Utensils, title: 'Food Security', description: 'Connect with food assistance programs, SNAP benefits, and local food resources.' },
              { icon: Briefcase, title: 'Career Services', description: 'Resume building, mock interviews, career advising, skill development, and job placement support.' },
              { icon: DollarSign, title: 'Financial Benefits', description: 'Discover benefits you qualify for including healthcare, education funds, tax credits, and more.' },
              { icon: Heart, title: 'Mental Health', description: 'Access free and low-cost therapy services, support groups, and wellness resources.' },
              { icon: Calendar, title: 'Events & Workshops', description: 'Free virtual workshops, panel discussions, cooking nights, support spaces, and community gatherings.' },
            ].map((area) => {
              const Icon = area.icon;
              return (
                <div
                  key={area.title}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-fg-blue/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-fg-blue" />
                  </div>
                  <h3 className="text-lg font-bold text-fg-navy mb-2">{area.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{area.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Screener */}
      <section id="benefits-screener" className="py-20 px-4 scroll-mt-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-fg-blue/10 text-fg-blue px-4 py-2 rounded-full mb-4">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm font-semibold">Free Benefits Discovery</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-fg-navy mb-4">
              Discover Benefits You Deserve
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              In just 10-15 minutes, uncover financial and social benefits you may qualify for. This isn't about handouts—it's about getting what's already yours.
            </p>
          </div>

          <div className="bg-gradient-to-br from-fg-navy via-fg-blue to-fg-navy rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-fg-yellow/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-fg-teal/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

            <div className="relative z-10">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                {[
                  { icon: '🍽️', label: 'SNAP & Food Benefits' },
                  { icon: '🏥', label: 'Healthcare Coverage' },
                  { icon: '🎓', label: 'Education Funds' },
                  { icon: '💰', label: 'Tax Credits' },
                  { icon: '🏠', label: 'Housing Assistance' },
                  { icon: '⚡', label: 'Utility Programs' },
                ].map((benefit) => (
                  <div
                    key={benefit.label}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-3 hover:bg-white/20 transition-all cursor-default group"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">{benefit.icon}</span>
                    <span className="font-medium text-sm md:text-base">{benefit.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-white/10">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-fg-yellow" />
                    <span className="text-white/80">10-15 minutes</span>
                  </div>
                  <div className="w-px h-6 bg-white/20" />
                  <span className="text-white/60 text-sm">Powered by Single Stop</span>
                </div>

                <a
                  href="https://app.singlestop.org/fostergreatness/main"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-fg-yellow text-fg-navy px-8 py-4 rounded-full font-bold hover:bg-white transition-colors shadow-lg"
                >
                  Take the Free Screener
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Crisis Fund */}
      <section id="crisis-fund" className="py-16 px-4 scroll-mt-24">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100 text-center">
            <div className="inline-flex p-4 rounded-2xl bg-red-50 mb-6">
              <Heart className="w-10 h-10 text-red-500" />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-fg-navy mb-4">
              Crisis Fund
            </h2>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Sometimes life throws unexpected challenges your way. Our Crisis Fund provides emergency assistance when you need it most—because you deserve support in your hardest moments.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://donate.stripe.com/bJe3cvb2Y50k7G96xJco003"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-fg-navy to-fg-blue text-white px-8 py-4 rounded-full font-bold hover:shadow-lg transition-all"
              >
                <Heart className="w-5 h-5" />
                Support the Crisis Fund
              </a>
              <a
                href="https://community.fostergreatness.co"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border-2 border-fg-navy text-fg-navy px-8 py-4 rounded-full font-bold hover:bg-fg-navy hover:text-white transition-colors"
              >
                Request Assistance
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Career Support */}
      <section id="career" className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white scroll-mt-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-fg-blue/10 px-4 py-2 rounded-full mb-6">
                <Briefcase className="w-4 h-4 text-fg-blue" />
                <span className="text-sm font-semibold text-fg-navy">Powered by Staffmark Partnership</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-fg-navy mb-6">
                Career Support Pipeline
              </h2>

              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Our comprehensive employment support program gives you everything you need to build a successful career.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  'Professional resume building',
                  'Curated-for-the-job mock interviews',
                  'Dedicated Career Advisor',
                  'Skill marketing and development',
                  'Access to secure job board',
                  'Free career development workshops',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-fg-blue flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              <a
                href="https://community.fostergreatness.co"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-fg-navy text-white px-8 py-4 rounded-full font-bold hover:bg-fg-blue transition-colors"
              >
                Access Career Support
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🚀</div>
                <h3 className="text-xl font-bold text-fg-navy">Thriver Pathways</h3>
                <div className="inline-flex items-center gap-2 bg-fg-teal/10 text-fg-teal px-3 py-1 rounded-full mt-2">
                  <span className="text-xs font-semibold">First Cohort Complete</span>
                </div>
              </div>

              <p className="text-gray-600 text-center mb-4">
                Our first cohort just wrapped up! Participants explored personal mission, interview mastery, professional networking, workplace rights, and resume crafting — plus earned a $100 career readiness stipend.
              </p>

              <p className="text-gray-600 text-center mb-6 font-medium">
                Results coming soon. Stay tuned for more opportunities to join future cohorts.
              </p>

              <div className="text-center text-sm text-gray-500">
                In partnership with Str8Up Employment Services
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-fg-navy mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "What resources are available for foster youth?",
                answer: "Foster youth can access housing assistance, food security programs (SNAP), career services including resume building and job placement, educational scholarships, mental health support, benefits screening, and community events. Not sure where to start? Submit a request and our team will help point you in the right direction."
              },
              {
                question: "How do I access foster youth resources through Foster Greatness?",
                answer: "Use our Resource Finder to search by ZIP code, browse community events, or join our free community at community.fostergreatness.co and submit a resource support request."
              },
              {
                question: "Are Foster Greatness resources free?",
                answer: "Yes, all Foster Greatness resources and support services are completely free. This includes the Resource Finder, benefits screening, career services, events, and community access."
              },
              {
                question: "Do I need to be currently in foster care to access resources?",
                answer: "No. Foster Greatness serves both current and former foster youth. There is no age limit—we believe you should never age out of support. Whether you're 18 or 48, you can access our resources."
              },
              {
                question: "What is the Crisis Fund?",
                answer: "The Crisis Fund provides emergency financial assistance to foster youth community members facing unexpected hardships. This can help with urgent needs like rent, utilities, transportation, or other immediate expenses."
              },
              {
                question: "What events does Foster Greatness offer?",
                answer: "We host free virtual events including financial literacy workshops, cooking nights, open mic nights, panel discussions on foster care policy, career development workshops, and community support spaces. All events are open to community members."
              }
            ].map((faq, index) => (
              <details
                key={index}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 group"
              >
                <summary className="px-6 py-5 cursor-pointer list-none flex justify-between items-center hover:bg-gray-50 rounded-2xl transition-colors">
                  <span className="font-bold text-fg-navy pr-4">{faq.question}</span>
                  <ChevronDown className="w-5 h-5 text-fg-blue flex-shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-b from-white to-fg-light-blue">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-fg-navy mb-6">
            Ready to Get Support?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our community and get help finding the support you deserve.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/services"
              className="inline-flex items-center gap-3 bg-fg-navy text-white px-10 py-5 rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:bg-fg-blue transition-all"
            >
              <Search className="w-5 h-5" />
              Find Resources
            </Link>
            <a
              href="https://community.fostergreatness.co"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 border-2 border-fg-navy text-fg-navy px-10 py-5 rounded-full font-bold text-lg hover:bg-fg-navy hover:text-white transition-all"
            >
              Join Community
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
