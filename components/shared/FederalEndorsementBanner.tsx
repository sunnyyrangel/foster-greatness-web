'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, ArrowRight } from 'lucide-react';

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
};

interface FederalEndorsementBannerProps {
  /** Use 'prominent' for homepage, 'compact' for inner pages */
  variant?: 'prominent' | 'compact';
}

export default function FederalEndorsementBanner({ variant = 'compact' }: FederalEndorsementBannerProps) {
  if (variant === 'prominent') {
    return (
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 },
          },
        }}
        className="mb-10 md:mb-12"
      >
        <motion.div variants={itemVariants}>
          <Link
            href="/federal-recommendation"
            className="block bg-gradient-to-r from-fg-navy via-fg-blue to-fg-navy rounded-3xl p-8 md:p-10 text-white hover:shadow-xl transition-shadow group"
          >
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Shield className="w-8 h-8 text-fg-yellow" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <p className="text-xs font-semibold uppercase tracking-wider text-fg-yellow mb-2">
                  Federal Recognition
                </p>
                <h3 className="text-xl md:text-2xl font-bold mb-2">
                  Recommended as a Trusted Platform by National Lived Experience Experts
                </h3>
                <p className="text-white/80 text-sm md:text-base leading-relaxed">
                  A coalition of leading foster care organizations recommended Foster Greatness to federal leadership as a trusted source of information and resource navigation for youth in and leaving foster care.
                </p>
              </div>
              <div className="flex-shrink-0">
                <span className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full font-semibold text-sm group-hover:bg-white/20 transition-colors">
                  Read the Memo
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      </motion.section>
    );
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={itemVariants}
    >
      <Link
        href="/federal-recommendation"
        className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm border border-fg-blue/20 hover:shadow-md hover:border-fg-blue/40 transition-all group"
      >
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-fg-blue/10 flex items-center justify-center">
          <Shield className="w-5 h-5 text-fg-blue" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-fg-blue mb-0.5">
            Federal Recognition
          </p>
          <p className="text-sm font-semibold text-fg-navy leading-snug">
            Recommended to federal leadership as a trusted platform by national lived experience experts
          </p>
        </div>
        <ArrowRight className="w-4 h-4 text-fg-navy/40 flex-shrink-0 group-hover:text-fg-blue group-hover:translate-x-1 transition-all" />
      </Link>
    </motion.div>
  );
}
