'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import updatesData from '@/data/updates.json';
import ErrorBoundary, { SectionErrorFallback } from '@/components/shared/ErrorBoundary';

// Import all home section components
import {
  containerVariants,
  HeroSection,
  TestimonialSection,
  EventsSection,
  NewsletterSection,
  ContactSection,
  AppDownloadSection,
  CommunitySection,
  DGWBrandedSection,
  PartnersSection,
  VoiceAmplificationSection,
  WhatYoullGetSection,
  FeaturedCard,
  TestimonialQuote,
  UpdateListItem,
  itemVariants,
} from '@/components/site/home';
import type { CircleEvent, Update, Newsletter } from '@/components/site/home';

export default function Home() {
  const { featured, updates: allUpdates } = updatesData as { featured: string; updates: Update[] };
  // Filter out unpublished updates (published: false). If published is undefined, default to true
  const updates = allUpdates.filter(u => u.published !== false);
  const [events, setEvents] = useState<CircleEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [newsletterLoading, setNewsletterLoading] = useState(true);

  const featuredUpdate = updates.find(u => u.id === featured);
  const otherUpdates = updates.filter(u => u.id !== featured);

  // Fetch upcoming events from Circle.so
  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('https://circle-events-widget-23sx.vercel.app/api/events');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();

        const allEvents = data.records || data || [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const filteredEvents = allEvents
          .filter((event: CircleEvent) => {
            const isGeneralEvents = event.space?.slug === 'general-events';
            const eventDate = new Date(event.starts_at);
            eventDate.setHours(0, 0, 0, 0);
            return isGeneralEvents && eventDate >= today;
          })
          .sort((a: CircleEvent, b: CircleEvent) =>
            new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()
          )
          .slice(0, 3);

        setEvents(filteredEvents);
      } catch (err) {
        console.error('Failed to fetch events:', err);
      } finally {
        setEventsLoading(false);
      }
    }
    fetchEvents();
  }, []);

  // Fetch latest newsletters from Beehiiv
  useEffect(() => {
    async function fetchNewsletters() {
      try {
        const response = await fetch('/api/newsletter');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setNewsletters(data);
      } catch (err) {
        console.error('Failed to fetch newsletters:', err);
      } finally {
        setNewsletterLoading(false);
      }
    }
    fetchNewsletters();
  }, []);

  return (
    <div className="min-h-screen bg-[#fafbfc] relative">
      {/* Subtle texture */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231a2949' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative w-full py-6 sm:py-8 md:py-10 px-4 sm:px-6 md:px-8 lg:px-12 max-w-screen-2xl mx-auto">
        {/* Hero Section */}
        <ErrorBoundary fallback={<SectionErrorFallback sectionName="hero" />}>
          <HeroSection />
        </ErrorBoundary>

        {/* Featured Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="mb-4 md:mb-6 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8 bg-fg-coral/[0.03] rounded-3xl"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-fg-navy">What's Happening</h2>
            <p className="text-fg-navy/60 mt-1">Latest news, events, and opportunities from our community</p>
          </motion.div>

          {/* Featured card + Testimonial quote side by side (2:1 ratio) */}
          <div className="grid md:grid-cols-3 gap-6 items-stretch mb-8">
            <div className="md:col-span-2">
              {featuredUpdate && <FeaturedCard update={featuredUpdate} />}
            </div>
            <TestimonialQuote />
          </div>

          {/* Testimonials Carousel - inside What's Happening */}
          <ErrorBoundary fallback={<SectionErrorFallback sectionName="testimonials" />}>
            <TestimonialSection />
          </ErrorBoundary>
        </motion.section>

        {/* Updates as news feed with images */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="mb-10 md:mb-12"
        >
          <div className="space-y-4 mb-8">
            {otherUpdates.map((update) => (
              <UpdateListItem key={update.id} update={update} />
            ))}
          </div>

          {/* Events - full width */}
          <div className="mb-8">
            <ErrorBoundary fallback={<SectionErrorFallback sectionName="events" />}>
              <EventsSection events={events} loading={eventsLoading} />
            </ErrorBoundary>
          </div>

          {/* Newsletters - full width */}
          <ErrorBoundary fallback={<SectionErrorFallback sectionName="newsletters" />}>
            <NewsletterSection newsletters={newsletters} loading={newsletterLoading} />
          </ErrorBoundary>
        </motion.section>

        {/* What You'll Get Access To - Value prop first */}
        <ErrorBoundary fallback={<SectionErrorFallback sectionName="features" />}>
          <WhatYoullGetSection />
        </ErrorBoundary>

        {/* Community Section */}
        <ErrorBoundary fallback={<SectionErrorFallback sectionName="community" />}>
          <CommunitySection />
        </ErrorBoundary>

        {/* Amplifying Lived Experience Voices */}
        <ErrorBoundary fallback={<SectionErrorFallback sectionName="voice amplification" />}>
          <VoiceAmplificationSection />
        </ErrorBoundary>

        {/* DGW Branded - Social Enterprise */}
        <ErrorBoundary fallback={<SectionErrorFallback sectionName="DGW Branded" />}>
          <DGWBrandedSection />
        </ErrorBoundary>

        {/* Partners */}
        <ErrorBoundary fallback={<SectionErrorFallback sectionName="partners" />}>
          <PartnersSection />
        </ErrorBoundary>

        {/* Contact Form */}
        <ErrorBoundary fallback={<SectionErrorFallback sectionName="contact form" />}>
          <ContactSection />
        </ErrorBoundary>

        {/* App Download Section */}
        <ErrorBoundary fallback={<SectionErrorFallback sectionName="app download" />}>
          <AppDownloadSection />
        </ErrorBoundary>
      </div>
    </div>
  );
}
