'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { ArrowRight, ExternalLink, Shield, BarChart3, Search, Users, Code, Database, Globe, Zap, Heart, CheckCircle2, ChevronDown, Briefcase, Eye, Lock, Activity, Layers, Monitor, Smartphone, Server } from 'lucide-react';

const techStack = [
  { name: 'Next.js 16', category: 'Framework', icon: '⚡', desc: 'App Router, React Server Components, Turbopack' },
  { name: 'TypeScript', category: 'Language', icon: '🔷', desc: 'Strict types across 70+ components and 15 API routes' },
  { name: 'Tailwind CSS', category: 'Styling', icon: '🎨', desc: 'Utility-first with custom brand design system' },
  { name: 'Supabase', category: 'Database', icon: '🗄️', desc: 'PostgreSQL with RLS, RPC functions, real-time' },
  { name: 'Vercel', category: 'Hosting', icon: '▲', desc: 'Edge functions, analytics, auto-deploy from GitHub' },
  { name: 'Mapbox GL', category: 'Maps', icon: '🗺️', desc: 'Interactive maps, geocoding, heatmap layers' },
  { name: 'Stripe', category: 'Payments', icon: '💳', desc: 'Donation processing, embedded buy buttons' },
  { name: 'Sentry', category: 'Monitoring', icon: '🔍', desc: 'Error tracking, performance monitoring, Supabase integration' },
  { name: 'Findhelp API', category: 'Data', icon: '🏥', desc: '500,000+ social service programs across the U.S.' },
  { name: 'Google Gemini', category: 'AI', icon: '🤖', desc: 'Resource enrichment pipeline for community submissions' },
  { name: 'Recharts', category: 'Visualization', icon: '📊', desc: 'Analytics charts, timelines, category breakdowns' },
  { name: 'Framer Motion', category: 'Animation', icon: '✨', desc: 'Page transitions, scroll animations, micro-interactions' },
];

const features = [
  {
    id: 'resource-finder',
    title: 'Resource Finder',
    subtitle: 'Connecting foster youth to 500,000+ programs',
    description: 'A ZIP code-based search tool that queries the Findhelp API across 8 SDOH categories, overlays community-recommended resources from Supabase, and includes curated informational guides. Users can save programs to a resource board, view on a map, and contact organizations directly.',
    stats: [
      { label: 'Programs searchable', value: '500K+' },
      { label: 'SDOH categories', value: '8' },
      { label: 'API routes', value: '4' },
      { label: 'Data sources', value: '3' },
    ],
    technical: [
      'Findhelp API with OAuth token management and auto-refresh',
      'Population filtering to exclude irrelevant programs (veterans, seniors, etc.)',
      '3-tier parallel search: local ZIP → state-level → national resources',
      'Mapbox GL integration with program pins and detail popups',
      'Resource board with localStorage persistence + email/share/print export',
      'Deep linking support — share specific programs via URL parameters',
      'Community-recommended resources from Supabase with coverage levels',
      'Informational resource cards (guides, fact sheets) from separate table',
    ],
    link: '/services',
    color: 'fg-teal',
  },
  {
    id: 'analytics',
    title: 'Analytics Dashboard',
    subtitle: 'Real-time insights into resource usage',
    description: 'A custom admin dashboard tracking every interaction with the Resource Finder — from searches and program views to contact actions and board exports. Includes geographic heatmaps, day/time activity grids, conversion funnels, and period-over-period growth comparisons.',
    stats: [
      { label: 'Event types tracked', value: '8' },
      { label: 'Dashboard widgets', value: '12' },
      { label: 'Heatmap types', value: '2' },
      { label: 'Date ranges', value: '4' },
    ],
    technical: [
      'Custom event tracking via navigator.sendBeacon (survives page navigation)',
      'Supabase service_events table with indexed columns for fast queries',
      'ZIP-to-state mapping for geographic breakdown across 12+ states',
      'Mapbox heatmap layer with dynamic geocoding of ZIP codes',
      'Day-of-week × time-of-day activity grid (GitHub contributions style)',
      'Conversion funnel: Search → View → Save → Contact → Export',
      'Previous-period comparison with automatic growth % calculation',
      'Google Ads conversion tracking for search and community join events',
    ],
    link: '/admin/analytics-mockup',
    color: 'fg-blue',
  },
  {
    id: 'community',
    title: 'Community Platform Integration',
    subtitle: 'Circle.so + custom embeds and widgets',
    description: 'Integration with Circle.so community platform including custom HTML embeds for the welcome dashboard, an events widget that pulls live data from the Circle API, and Google Ads conversion tracking on community join links across the site.',
    stats: [
      { label: 'Community members', value: '2,150+' },
      { label: 'Custom widgets', value: '2' },
      { label: 'Embed components', value: '5' },
      { label: 'Event sources', value: '1' },
    ],
    technical: [
      'Circle events widget at /widgets/circle-events fetching live event data',
      'Custom welcome dashboard HTML embed with brand-consistent design',
      'SVG preview graphics for embed cards (5 custom illustrations)',
      'CommunityJoinLink wrapper component firing Google Ads conversions',
      'Newsletter integration via Beehiiv API with rate-limited subscription endpoint',
    ],
    link: null,
    color: 'fg-orange',
  },
  {
    id: 'submissions',
    title: 'Resource Submission System',
    subtitle: 'Community-driven resource curation with AI',
    description: 'A full submission workflow allowing community members to suggest local resources, which are then enriched by Google Gemini AI and reviewed by admins before being published to the search results.',
    stats: [
      { label: 'Coverage levels', value: '4' },
      { label: 'Admin actions', value: '3' },
      { label: 'AI enrichment', value: 'Gemini' },
      { label: 'Rate limit', value: '5/min' },
    ],
    technical: [
      'Public suggestion form with Zod validation',
      'AI enrichment via Google Gemini Flash for description and tag generation',
      'Admin review dashboard with approve/reject/update workflow',
      'Coverage level system: local → statewide → multi-state → national',
      'Supabase RLS policies for data isolation',
      'SDOH category mapping aligned with Findhelp taxonomy',
    ],
    link: null,
    color: 'fg-navy',
  },
  {
    id: 'security',
    title: 'Enterprise Security',
    subtitle: 'Zero vulnerabilities, production-grade protection',
    description: 'Comprehensive security implementation including custom rate limiting, CORS protection, Content Security Policy, input validation, and admin authentication — all built without third-party security packages.',
    stats: [
      { label: 'Security headers', value: '7' },
      { label: 'Rate-limited routes', value: '12' },
      { label: 'CORS origins', value: '5' },
      { label: 'Vulnerabilities', value: '0' },
    ],
    technical: [
      'Custom IP-based sliding window rate limiter (zero dependencies)',
      'Per-endpoint rate limits from 5/min (submissions) to 60/min (analytics)',
      'CORS whitelist with preflight handling and 403 for unauthorized origins',
      'CSP headers whitelisting Google Ads, Mapbox, Sentry, Stripe',
      'Admin auth via per-user tokens with cookie-based sessions',
      'X-Frame-Options DENY (except /widgets routes for embeds)',
      'Input validation with Zod on all API endpoints',
      'Sentry error tracking with PII filtering and privacy compliance',
    ],
    link: null,
    color: 'fg-navy',
  },
];

const timeline = [
  { date: 'Nov 2025', title: 'Project kickoff', desc: 'Next.js 16 setup, brand system, campaign architecture' },
  { date: 'Dec 2025', title: 'Core platform', desc: 'Homepage, donation flows, Stripe integration, Sentry monitoring, SEO' },
  { date: 'Jan 2026', title: 'Security hardening', desc: 'Rate limiting, CORS, CSP, admin auth, Vercel Analytics' },
  { date: 'Feb 2026', title: 'Resource Finder v1', desc: 'Findhelp API integration, 8 SDOH categories, map view, resource board' },
  { date: 'Feb 2026', title: 'Informational resources', desc: 'Supabase table, PDF guides, search RPC, category alignment' },
  { date: 'Mar 2026', title: 'Community resources', desc: 'Submission workflow, AI enrichment, admin review, coverage levels' },
  { date: 'Mar 2026', title: 'Analytics dashboard', desc: 'Event tracking, heatmaps, conversion funnel, geographic breakdown' },
  { date: 'Mar 2026', title: 'Community integration', desc: 'Circle embeds, events widget, Thriver Pathways impact report' },
];

export default function CaseStudyPage() {
  const [expandedFeature, setExpandedFeature] = useState<string | null>('resource-finder');

  return (
    <main className="relative min-h-screen bg-white">

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#0a0f1c] via-fg-navy to-[#0a1628] py-24 md:py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.08) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-fg-blue/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-fg-teal/10 rounded-full blur-3xl" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8">
            <Code className="w-4 h-4 text-fg-teal" />
            <span className="text-sm font-semibold text-white/80">Technical Case Study</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Building a Platform for<br />
            <span className="text-fg-teal">Foster Youth Nationwide</span>
          </h1>

          <p className="text-xl text-white/70 max-w-3xl leading-relaxed mb-10">
            How a small team built a full-stack platform connecting 2,150+ current and former foster youth to resources, community, career support, and belonging — powered by Next.js 16, Supabase, and a dozen integrated services.
          </p>

          <div className="flex flex-wrap gap-3 mb-12">
            {['Next.js 16', 'TypeScript', 'Supabase', 'Mapbox', 'Stripe', 'Sentry', 'Findhelp API', 'Gemini AI'].map((tag) => (
              <span key={tag} className="text-xs font-mono font-semibold bg-white/10 text-white/70 px-3 py-1.5 rounded-full border border-white/10">
                {tag}
              </span>
            ))}
          </div>

          <div className="grid sm:grid-cols-4 gap-6">
            {[
              { value: '30+', label: 'Pages & Routes' },
              { value: '70+', label: 'Components' },
              { value: '15', label: 'API Endpoints' },
              { value: '250+', label: 'Commits' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-white/50">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Team */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-fg-navy mb-4 text-center">The Team</h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            A lean team that moved fast — from concept to production in under 5 months.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="w-20 h-20 rounded-full bg-fg-navy/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-fg-navy">SR</span>
              </div>
              <h3 className="text-xl font-bold text-fg-navy mb-1">Sunny Rangel</h3>
              <p className="text-fg-blue font-semibold text-sm mb-3">Director of UX & Product Development</p>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Led product design, UX architecture, brand system implementation, and front-end development. Designed and built the Resource Finder, analytics dashboard, community integrations, and page experiences.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {['UX/UI', 'Frontend', 'Product'].map((tag) => (
                  <span key={tag} className="text-xs font-semibold bg-fg-blue/10 text-fg-blue px-2.5 py-1 rounded-full">{tag}</span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="w-20 h-20 rounded-full bg-fg-navy/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-fg-navy">JB</span>
              </div>
              <h3 className="text-xl font-bold text-fg-navy mb-1">Jordan Bartlett</h3>
              <p className="text-fg-blue font-semibold text-sm mb-3">Co-Founder & Technical Lead</p>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Established the project foundation and core infrastructure. Built the security layer (rate limiting, CORS, CSP), Sentry integration, analytics tracking, resource submission system, AI enrichment pipeline, and Google Ads conversion tracking.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Security', 'Backend', 'Infrastructure'].map((tag) => (
                  <span key={tag} className="text-xs font-semibold bg-fg-teal/10 text-fg-teal px-2.5 py-1 rounded-full">{tag}</span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="w-20 h-20 rounded-full bg-fg-navy/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-fg-navy">IR</span>
              </div>
              <h3 className="text-xl font-bold text-fg-navy mb-1">Isabel Stasa</h3>
              <p className="text-fg-blue font-semibold text-sm mb-3">Director of Community Affairs & Social Impact</p>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Drove content strategy, community programs, and impact measurement. Led the Thriver Pathways program from design through impact reporting, managed partner relationships, and shaped the platform's lived-experience-led voice.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Content', 'Programs', 'Impact'].map((tag) => (
                  <span key={tag} className="text-xs font-semibold bg-fg-orange/10 text-fg-orange px-2.5 py-1 rounded-full">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Challenge */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-fg-navy mb-6 text-center">The Challenge</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-4">
                <span className="text-2xl">🚧</span>
              </div>
              <h3 className="text-lg font-bold text-fg-navy mb-3">The Problem</h3>
              <ul className="space-y-3 text-gray-600 text-sm">
                <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">•</span>Foster youth "age out" of the system at 18-21 with no centralized support</li>
                <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">•</span>Resources are fragmented across hundreds of local organizations</li>
                <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">•</span>Existing tools use deficit-based language that feels transactional</li>
                <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">•</span>No platform combined resources, community, career support, and events</li>
                <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">•</span>No way to measure whether people actually connected with services</li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-fg-teal/10 flex items-center justify-center mb-4">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="text-lg font-bold text-fg-navy mb-3">Our Approach</h3>
              <ul className="space-y-3 text-gray-600 text-sm">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-fg-teal mt-0.5 flex-shrink-0" />Build a dignity-centered platform led by lived experience</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-fg-teal mt-0.5 flex-shrink-0" />Integrate with Findhelp API for 500K+ programs searchable by ZIP</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-fg-teal mt-0.5 flex-shrink-0" />Layer community-curated resources on top of national data</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-fg-teal mt-0.5 flex-shrink-0" />Track every interaction to prove impact with real data</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-fg-teal mt-0.5 flex-shrink-0" />Ship fast with a config-driven architecture for easy content updates</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Overview */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-fg-navy mb-4 text-center">Architecture</h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            A modern full-stack architecture built for performance, security, and rapid iteration.
          </p>

          <div className="bg-[#0a0f1c] rounded-2xl p-8 md:p-12 text-white mb-12 overflow-hidden">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Monitor className="w-5 h-5 text-fg-teal" />
                  <h3 className="font-bold">Frontend</h3>
                </div>
                <ul className="space-y-2 text-sm text-white/60">
                  <li>Next.js 16 App Router</li>
                  <li>React 19 Server Components</li>
                  <li>Tailwind CSS + Framer Motion</li>
                  <li>Radix UI Primitives</li>
                  <li>Recharts + Mapbox GL</li>
                  <li>TypeScript strict mode</li>
                </ul>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Server className="w-5 h-5 text-fg-blue" />
                  <h3 className="font-bold">Backend</h3>
                </div>
                <ul className="space-y-2 text-sm text-white/60">
                  <li>15 API routes (serverless)</li>
                  <li>Supabase PostgreSQL + RLS</li>
                  <li>Findhelp API (OAuth)</li>
                  <li>Stripe payment processing</li>
                  <li>Beehiiv newsletter API</li>
                  <li>Google Gemini AI enrichment</li>
                </ul>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-fg-orange" />
                  <h3 className="font-bold">Infrastructure</h3>
                </div>
                <ul className="space-y-2 text-sm text-white/60">
                  <li>Vercel Edge + serverless</li>
                  <li>Sentry error monitoring</li>
                  <li>Custom rate limiting (12 routes)</li>
                  <li>CORS + CSP + 7 security headers</li>
                  <li>Vercel + Google Analytics</li>
                  <li>GitHub CI/CD auto-deploy</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Tech Stack Grid */}
          <h3 className="text-2xl font-bold text-fg-navy mb-6">Tech Stack</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {techStack.map((tech) => (
              <div key={tech.name} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-2xl mb-2">{tech.icon}</div>
                <h4 className="font-bold text-fg-navy text-sm">{tech.name}</h4>
                <p className="text-xs text-gray-400 mb-1">{tech.category}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Deep Dives */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-fg-navy mb-4 text-center">What We Built</h2>
          <p className="text-lg text-gray-600 text-center mb-12">Click each feature for the technical breakdown.</p>

          <div className="space-y-4">
            {features.map((feature) => (
              <div key={feature.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <button
                  onClick={() => setExpandedFeature(expandedFeature === feature.id ? null : feature.id)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                >
                  <div>
                    <h3 className="text-xl font-bold text-fg-navy">{feature.title}</h3>
                    <p className="text-gray-500 text-sm mt-0.5">{feature.subtitle}</p>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-fg-blue flex-shrink-0 transition-transform ${expandedFeature === feature.id ? 'rotate-180' : ''}`} />
                </button>

                {expandedFeature === feature.id && (
                  <div className="px-8 pb-8 border-t border-gray-100 pt-6">
                    <p className="text-gray-600 leading-relaxed mb-6">{feature.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      {feature.stats.map((stat) => (
                        <div key={stat.label} className="bg-gray-50 rounded-xl p-4 text-center">
                          <div className="text-2xl font-bold text-fg-navy">{stat.value}</div>
                          <div className="text-xs text-gray-500">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    <h4 className="font-bold text-fg-navy mb-3 text-sm uppercase tracking-wide">Technical Details</h4>
                    <ul className="space-y-2 mb-6">
                      {feature.technical.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <Code className="w-3.5 h-3.5 text-fg-blue mt-1 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>

                    {feature.link && (
                      <Link
                        href={feature.link}
                        className="inline-flex items-center gap-2 text-fg-blue font-semibold text-sm hover:text-fg-navy transition-colors"
                      >
                        View live <ExternalLink className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-fg-navy mb-12 text-center">Development Timeline</h2>

          <div className="relative">
            <div className="absolute left-[18px] top-0 bottom-0 w-px bg-gray-200" />
            <div className="space-y-8">
              {timeline.map((item, i) => (
                <div key={i} className="flex gap-6">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-fg-blue flex items-center justify-center flex-shrink-0">
                      <div className="w-3 h-3 rounded-full bg-white" />
                    </div>
                  </div>
                  <div className="pb-2">
                    <span className="text-xs font-bold text-fg-blue uppercase tracking-wide">{item.date}</span>
                    <h3 className="text-lg font-bold text-fg-navy mt-1">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="py-20 px-4 bg-gradient-to-br from-fg-navy via-fg-blue to-fg-navy text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-fg-teal/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-fg-yellow/10 rounded-full blur-3xl" />

        <div className="max-w-5xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Real-World Impact</h2>
          <p className="text-white/70 text-center mb-12 max-w-2xl mx-auto">This isn't just code — it's infrastructure for belonging.</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { value: '2,150+', label: 'Community Members' },
              { value: '500K+', label: 'Programs Searchable' },
              { value: '84', label: 'Career Program Applicants' },
              { value: '100%', label: 'Felt Better Equipped' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-fg-yellow">{stat.value}</div>
                <div className="text-sm text-white/60 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/thriver-pathways"
              className="inline-flex items-center gap-2 bg-white text-fg-navy px-8 py-4 rounded-full font-bold hover:bg-fg-yellow transition-colors"
            >
              View Thriver Pathways Impact Report
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-fg-navy mb-6">Explore the Platform</h2>
          <p className="text-lg text-gray-600 mb-8">See these features in action.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/services" className="inline-flex items-center gap-2 bg-fg-navy text-white px-8 py-4 rounded-full font-bold hover:bg-fg-blue transition-colors shadow-lg">
              <Search className="w-5 h-5" /> Try the Resource Finder
            </Link>
            <Link href="/admin/analytics-mockup" className="inline-flex items-center gap-2 border-2 border-fg-navy text-fg-navy px-8 py-4 rounded-full font-bold hover:bg-fg-navy hover:text-white transition-colors">
              <BarChart3 className="w-5 h-5" /> View Analytics Dashboard
            </Link>
            <Link href="/thriver-pathways" className="inline-flex items-center gap-2 border-2 border-fg-navy text-fg-navy px-8 py-4 rounded-full font-bold hover:bg-fg-navy hover:text-white transition-colors">
              <Activity className="w-5 h-5" /> Impact Report
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
