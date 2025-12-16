'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { containerVariants, itemVariants } from './animations';

export default function DGWBrandedSection() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
      className="mt-10 md:mt-12"
    >
      <motion.div variants={itemVariants} className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-fg-navy mb-3">
          Powered by Purpose
        </h2>
        <p className="text-fg-navy/60 max-w-2xl mx-auto">
          Our unique social enterprise model means we're not dependent on government funding.
        </p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl border border-fg-navy/10"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,103,162,0.08),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(255,111,97,0.08),transparent_50%)]" />

        <div className="relative p-8 md:p-12">
          {/* Flow diagram */}
          <div className="grid md:grid-cols-3 gap-6 md:gap-4 items-center">
            {/* DGW Branded */}
            <div className="text-center">
              <div className="inline-block bg-white rounded-2xl shadow-lg border border-fg-navy/5 mb-4 overflow-hidden">
                <Image
                  src="/images/partners/10.png"
                  alt="DGW Branded"
                  width={200}
                  height={200}
                  className="w-32 h-32 object-contain"
                />
              </div>
              <h3 className="font-bold text-fg-navy mb-2">DGW Branded</h3>
              <p className="text-sm text-fg-navy/60">
                Merchandise with meaning. Every purchase tells a story.
              </p>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-24 h-0.5 bg-gradient-to-r from-fg-navy to-fg-blue" />
                <span className="text-xs font-semibold text-fg-navy/40 uppercase tracking-wider">Funds</span>
              </div>
            </div>
            <div className="md:hidden flex justify-center">
              <div className="w-0.5 h-8 bg-gradient-to-b from-fg-navy to-fg-blue" />
            </div>

            {/* Foster Greatness */}
            <div className="text-center">
              <div className="inline-block rounded-2xl shadow-lg mb-4 overflow-hidden">
                <Image
                  src="/images/fg-icon.png"
                  alt="Foster Greatness"
                  width={128}
                  height={128}
                  className="w-32 h-32"
                />
              </div>
              <h3 className="font-bold text-fg-navy mb-2">Foster Greatness</h3>
              <p className="text-sm text-fg-navy/60">
                Resource support, workshops, community tech, and crisis funding.
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="mt-10 pt-8 border-t border-fg-navy/10 text-center max-w-2xl mx-auto">
            <p className="text-fg-navy/70 leading-relaxed mb-6">
              When businesses choose DGW Branded, they're not just buying merchandise – they're investing in scholarships, job training, and lifelong support systems for foster youth.
            </p>
            <a
              href="https://www.dgwbranded.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-fg-navy hover:bg-fg-navy/90 text-white font-semibold px-6 py-3 rounded-full transition-colors"
            >
              Learn More About DGW Branded
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
