import Link from 'next/link';
import Image from 'next/image';
import { Heart, Home, Utensils, Briefcase, DollarSign, Users, ArrowRight, CheckCircle2, Clock, MessageCircle, ChevronDown } from 'lucide-react';

const resourceAreas = [
  {
    icon: Home,
    title: 'Housing Support',
    description: 'Help finding stable housing, navigating rental assistance, and accessing transitional living programs.',
  },
  {
    icon: Utensils,
    title: 'Food Security',
    description: 'Connect with food assistance programs, SNAP benefits, and local food resources.',
  },
  {
    icon: Briefcase,
    title: 'Career Services',
    description: 'Resume building, mock interviews, career advising, skill development, and job placement support.',
  },
  {
    icon: DollarSign,
    title: 'Financial Benefits',
    description: 'Discover benefits you qualify for including healthcare, education funds, tax credits, and more.',
  },
  {
    icon: Heart,
    title: 'Mental Health',
    description: 'Access free and low-cost therapy services, support groups, and wellness resources.',
  },
  {
    icon: Users,
    title: 'Community Connection',
    description: 'Build relationships with others who share your experience and find your belonging.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Create an Account',
    description: 'Sign up for free at our community platform to access all resource support services.',
    image: '/images/web images/create-an-account.jpg',
  },
  {
    number: '02',
    title: 'Submit Request Form',
    description: 'Complete the "Access Resource Support" form in the Resource Support section.',
    image: '/images/web images/submit-request-form.jpg',
  },
  {
    number: '03',
    title: 'Connect with a Specialist',
    description: 'A resource specialist will reach out within 24-48 hours (Mon-Fri, 9AM-5PM PST).',
    image: '/images/web images/connect-with-a-specialist.jpg',
  },
];

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
      <section className="relative bg-gradient-to-br from-fg-navy via-fg-navy to-fg-blue py-20 px-4 overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-fg-blue/20 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-fg-orange/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Heart className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white/90">Age In, Never Age Out</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Free Resources for Foster Youth
          </h1>

          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed mb-8">
            Personalized 1:1 support for current and former foster youth. Access housing assistance, job training, scholarships, benefits screening, and more—completely free, with no age limit.
          </p>

          <a
            href="https://community.fostergreatness.co"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-fg-navy px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            Access Resource Support
            <ArrowRight className="w-5 h-5" />
          </a>

          {/* Last updated for freshness signal */}
          <p className="mt-6 text-white/50 text-sm">
            Last updated: December 2025
          </p>
        </div>
      </section>

      {/* Statistics Section for GEO */}
      <section className="py-12 px-4 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-fg-navy">23,000+</div>
              <p className="text-sm text-gray-600 mt-1">Youth age out of foster care annually in the U.S.</p>
              <p className="text-xs text-gray-400 mt-1">Source: <a href="https://www.acf.hhs.gov" target="_blank" rel="noopener noreferrer" className="underline hover:text-fg-blue">ACF/HHS</a></p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-fg-navy">20%</div>
              <p className="text-sm text-gray-600 mt-1">Become homeless immediately after aging out</p>
              <p className="text-xs text-gray-400 mt-1">Source: <a href="https://nfyi.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-fg-blue">NFYI</a></p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-fg-navy">$250K+</div>
              <p className="text-sm text-gray-600 mt-1">In resources connected to our community members</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-fg-navy">2,000+</div>
              <p className="text-sm text-gray-600 mt-1">Foster youth in our nationwide community</p>
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
              Getting support is simple. Our process connects you with a dedicated specialist who understands your unique needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={step.number} className="flex flex-col">
                {/* Phone Mockup with Screenshot */}
                <div className="mb-6 flex justify-center">
                  <div className="relative w-32 h-56 bg-fg-navy rounded-[1.75rem] border-4 border-fg-navy shadow-lg overflow-hidden">
                    {/* Phone notch */}
                    <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-12 h-4 bg-black rounded-full z-10" />
                    {/* Screen content */}
                    <div className="absolute inset-1 rounded-[1.25rem] overflow-hidden bg-white">
                      <Image
                        src={step.image}
                        alt={step.title}
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                    {/* Home indicator */}
                    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-10 h-1 bg-white/50 rounded-full z-10" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex-1 relative">
                  <div className="text-5xl font-black text-fg-blue/20 mb-4">{step.number}</div>
                  <h3 className="text-xl font-bold text-fg-navy mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>

                  {/* Arrow between cards */}
                  {i < steps.length - 1 && (
                    <div className="hidden md:flex absolute top-1/2 -right-6 transform -translate-y-1/2 z-10">
                      <ArrowRight className="w-8 h-8 text-fg-blue/30" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Response within 24-48 hours</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              <span>Monday-Friday, 9AM-5PM PST</span>
            </div>
          </div>
        </div>
      </section>

      {/* Resource Areas */}
      <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-fg-navy mb-4">
              What We Can Help With
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our resource specialists can connect you with support across all areas of life.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resourceAreas.map((area) => {
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

      {/* Benefits Screener Section - Enhanced Visual Design */}
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
            {/* Animated background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-fg-yellow/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-fg-teal/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full" />

            <div className="relative z-10">
              {/* Benefit cards grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                {[
                  { icon: '🍽️', label: 'SNAP & Food Benefits' },
                  { icon: '🏥', label: 'Healthcare Coverage' },
                  { icon: '🎓', label: 'Education Funds' },
                  { icon: '💰', label: 'Tax Credits' },
                  { icon: '🏠', label: 'Housing Assistance' },
                  { icon: '⚡', label: 'Utility Programs' },
                ].map((benefit, i) => (
                  <div
                    key={benefit.label}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-3 hover:bg-white/20 transition-all hover:scale-105 cursor-default group"
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
                  href="https://community.fostergreatness.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-fg-yellow text-fg-navy px-8 py-4 rounded-full font-bold hover:bg-white transition-colors shadow-lg hover:shadow-xl hover:scale-105 transform"
                >
                  Take the Free Screener
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Crisis Fund Section - Moved before Career Support for emphasis */}
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

      {/* Career Support Section */}
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
                <div className="text-6xl mb-4">💼</div>
                <h3 className="text-xl font-bold text-fg-navy">Employment Readiness Program</h3>
                <p className="text-gray-600 mt-2">Coming Soon</p>
              </div>

              <p className="text-gray-600 text-center mb-6">
                Our new cohort-based program will teach employment basics and prepare you for the next steps in your career journey.
              </p>

              <div className="text-center text-sm text-gray-500">
                In partnership with Str8Up Employment Services
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-fg-navy mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Common questions about foster youth resources and support
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "What resources are available for foster youth?",
                answer: "Foster youth can access housing assistance, food security programs (SNAP), career services including resume building and job placement, educational scholarships, mental health support, and benefits screening. Foster Greatness provides free 1:1 support from Resource Specialists to help you navigate and access these resources."
              },
              {
                question: "How do I access foster youth resources through Foster Greatness?",
                answer: "Join our free community at community.fostergreatness.co, then submit a resource support request. A dedicated Resource Specialist will contact you within 24-48 hours (Monday-Friday) to provide personalized assistance."
              },
              {
                question: "Are Foster Greatness resources free?",
                answer: "Yes, all Foster Greatness resources and support services are completely free. This includes 1:1 Resource Specialist support, benefits screening, career services, and community access."
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
                question: "How can I get help with housing as a foster youth?",
                answer: "Foster Greatness Resource Specialists can help you find stable housing, navigate rental assistance programs, access transitional living programs, and connect with housing voucher programs. Join our community and submit a resource request to get started."
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

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-white to-fg-light-blue">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-fg-navy mb-6">
            Ready to Get Support?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our community and connect with a resource specialist who can help you access the support you deserve.
          </p>
          <a
            href="https://community.fostergreatness.co"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-fg-navy text-white px-10 py-5 rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:bg-fg-blue transition-all"
          >
            Join Foster Greatness Community
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>
    </main>
  );
}
