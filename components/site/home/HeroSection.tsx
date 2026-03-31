'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { containerVariants, itemVariants } from './animations';

export default function HeroSection() {
  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="mb-10 md:mb-12"
    >
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Content */}
        <motion.div variants={itemVariants}>
          <p className="text-sm font-semibold text-fg-blue uppercase tracking-wider mb-4">
            Join 2,150+ members nationwide
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-fg-navy mb-6 leading-[1.1] tracking-tight">
            A community you never age out of.
          </h1>
          <p className="text-xl text-fg-navy/70 mb-8 leading-relaxed max-w-xl">
            Built by and for people with lived foster care experience. Unlike traditional services that end at 18, Foster Greatness provides lifelong peer support, career opportunities, and resources.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <a
              href="https://community.fostergreatness.co"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-fg-navy text-white font-semibold rounded-full hover:bg-fg-blue transition-colors shadow-lg shadow-fg-navy/20"
            >
              Join the Community
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
            <a
              href="/about"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-fg-navy font-semibold hover:text-fg-blue transition-colors"
            >
              Learn More
            </a>
          </div>
          <p className="text-sm text-fg-navy/50">
            Available on{' '}
            <a href="https://community.fostergreatness.co" target="_blank" rel="noopener noreferrer" className="underline hover:text-fg-blue transition-colors">Web</a>,{' '}
            <a href="https://apps.apple.com/us/app/foster-greatness-community/id6456409836" target="_blank" rel="noopener noreferrer" className="underline hover:text-fg-blue transition-colors">iOS</a> &{' '}
            <a href="https://play.google.com/store/apps/details?id=co.circle.fostergreatness&hl=en_US" target="_blank" rel="noopener noreferrer" className="underline hover:text-fg-blue transition-colors">Android</a>
          </p>
        </motion.div>

        {/* Platform Preview */}
        <motion.div variants={itemVariants} className="relative">
          <a
            href="https://community.fostergreatness.co/home"
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-fg-navy/10">
              <Image
                src="/images/platform-preview.webp"
                alt="Foster Greatness community platform showing feed, events, and support options"
                width={600}
                height={450}
                className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.02]"
                priority
              />
              <div className="absolute inset-0 bg-fg-navy/0 group-hover:bg-fg-navy/5 transition-colors duration-300" />
            </div>
          </a>
        </motion.div>
      </div>
    </motion.section>
  );
}
