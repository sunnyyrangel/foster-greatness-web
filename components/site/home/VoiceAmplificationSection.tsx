'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { containerVariants, itemVariants } from './animations';

const voiceAmplificationItems = [
  {
    title: 'Thriver Stories',
    description: 'Host Isabel Stasa interviews FG Community members and advocates, sharing their stories of strength and resilience. New videos weekly!',
    image: '/images/thriver-stories.jpg',
    cta: 'Watch Episodes',
    link: '/storytellers-collective',
  },
  {
    title: 'Events & Workshops',
    description: 'Workshops, panels, community-building events, and much more! Explore our latest live events happening now.',
    image: '/images/panel-screenshot.png',
    cta: 'View Events',
    link: 'https://community.fostergreatness.co/c/general-events',
  },
  {
    title: 'Newsletter',
    description: 'Stay updated without joining the community. We share all our latest news and updates monthly.',
    image: '/images/newsletter-feature.jpg',
    cta: 'Read Newsletter',
    link: '/newsletter',
  },
];

export default function VoiceAmplificationSection() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
      className="mt-10 md:mt-12 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-10 bg-fg-blue/[0.03] rounded-3xl"
    >
      <motion.div variants={itemVariants} className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-fg-navy mb-3">
          Amplifying Lived Experience Voices
        </h2>
        <p className="text-fg-navy/60 max-w-2xl mx-auto">
          We amplify the voices of those with lived experience through workshops, podcast episodes, and panel events—empowering individuals by sharing their stories.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-3 gap-5">
        {voiceAmplificationItems.map((item) => (
          <motion.a
            key={item.title}
            href={item.link}
            {...(item.link.startsWith('http') && { target: "_blank", rel: "noopener noreferrer" })}
            variants={itemVariants}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-fg-navy/5 group hover:shadow-md hover:border-fg-blue/30 transition-all block"
          >
            <div className="relative h-44 w-full overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5">
              <h3 className="font-bold text-lg text-fg-navy group-hover:text-fg-blue transition-colors mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-fg-navy/70 leading-relaxed mb-3">
                {item.description}
              </p>
              <span className="inline-flex items-center gap-1 text-fg-blue font-semibold text-sm group-hover:gap-2 transition-all">
                {item.cta}
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </span>
            </div>
          </motion.a>
        ))}
      </div>
    </motion.section>
  );
}
