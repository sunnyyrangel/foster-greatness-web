'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { containerVariants, itemVariants } from './animations';

const communityFeatures = [
  {
    title: 'Resource Support',
    description: 'Not sure where to start? Submit a request and our team will help point you in the right direction.',
    image: '/images/community-screenshot-1.png',
    cta: 'Request Support',
    link: 'https://community.fostergreatness.co/c/find-help-foster-greatness/',
    featured: true,
  },
  {
    title: 'Learning Workshops',
    description: 'Free expert-led workshops on financial literacy, career skills, and wellness.',
    image: '/images/community-screenshot-2.png',
    cta: 'Browse Workshops',
    link: 'https://community.fostergreatness.co/c/general-events',
  },
  {
    title: 'Community Events',
    description: 'Quarterly gatherings—cooking nights, open mics, paint nights—building real connections.',
    image: '/images/community-feature.png',
    cta: 'See Upcoming Events',
    link: 'https://community.fostergreatness.co/c/general-events',
  },
  {
    title: 'Panel Discussions',
    description: 'Leaders and advocates with lived experience tackling issues that matter to you.',
    image: '/images/panel-screenshot.png',
    cta: 'Watch Past Panels',
    link: 'https://community.fostergreatness.co/c/thriver-stories-discussions/',
  },
  {
    title: 'Employment Support Program',
    description: 'Direct employment support through Staffmark Group, connecting you to personal support for 1:1 interviews, resume help and more.',
    image: '/images/community-member-1.jpg',
    cta: 'Explore Opportunities',
    link: 'https://community.fostergreatness.co/c/employment',
    featured: true,
  },
  {
    title: 'Resource Finder',
    description: 'Instant access to local benefits, food support, healthcare, and housing resources.',
    image: '/images/resource-finder.jpeg',
    cta: 'Find Resources',
    link: 'https://community.fostergreatness.co/c/find-help-foster-greatness/',
  },
];

export default function WhatYoullGetSection() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
      className="mt-10 md:mt-12 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-10 bg-fg-navy/[0.02] rounded-3xl"
    >
      <motion.div variants={itemVariants} className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-fg-navy mb-3">
          What You'll Get Access To
        </h2>
        <p className="text-fg-navy/60 max-w-2xl mx-auto">
          Support, community, and opportunities built by people who understand.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {communityFeatures.map((feature) => (
          <motion.a
            key={feature.title}
            href={feature.link}
            {...(feature.link.startsWith('http') && { target: "_blank", rel: "noopener noreferrer" })}
            variants={itemVariants}
            className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-fg-navy/5 group hover:shadow-md hover:border-fg-blue/30 transition-all block ${
              feature.featured ? 'sm:col-span-2 lg:col-span-1' : ''
            }`}
          >
            <div className="relative h-40 w-full overflow-hidden">
              <Image
                src={feature.image}
                alt={feature.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5">
              <h3 className="font-bold text-lg text-fg-navy group-hover:text-fg-blue transition-colors mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-fg-navy/70 leading-relaxed mb-3">
                {feature.description}
              </p>
              <span className="inline-flex items-center gap-1 text-fg-blue font-semibold text-sm group-hover:gap-2 transition-all">
                {feature.cta}
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </span>
            </div>
          </motion.a>
        ))}
      </div>

      <motion.div variants={itemVariants} className="text-center mt-8">
        <a
          href="https://community.fostergreatness.co"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-fg-navy text-white font-semibold rounded-full hover:bg-fg-blue transition-colors"
        >
          Join the Community
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </a>
      </motion.div>
    </motion.section>
  );
}
