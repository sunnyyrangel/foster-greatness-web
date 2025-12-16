'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { itemVariants } from './animations';
import type { Newsletter } from './types';

interface NewsletterSectionProps {
  newsletters: Newsletter[];
  loading: boolean;
}

export default function NewsletterSection({ newsletters, loading }: NewsletterSectionProps) {
  return (
    <motion.div variants={itemVariants}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-fg-navy">Latest Newsletters</h3>
        <a
          href="https://fostergreatness.beehiiv.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-fg-blue hover:text-fg-navy transition-colors"
        >
          View All
        </a>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-fg-navy/5 overflow-hidden animate-pulse">
              <div className="h-32 bg-fg-navy/5" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-fg-navy/5 rounded" />
                <div className="h-4 bg-fg-navy/5 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : newsletters.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {newsletters.map((newsletter) => (
            <a
              key={newsletter.id}
              href={newsletter.web_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-xl border border-fg-navy/5 shadow-sm hover:shadow-md hover:border-fg-blue/30 transition-all overflow-hidden group"
            >
              {newsletter.thumbnail_url && (
                <div className="relative w-full h-32 overflow-hidden">
                  <Image
                    src={newsletter.thumbnail_url}
                    alt={newsletter.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-3">
                <h4 className="font-bold text-sm text-fg-navy group-hover:text-fg-blue transition-colors line-clamp-2 mb-2">
                  {newsletter.title}
                </h4>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-fg-blue group-hover:gap-2 transition-all">
                  Read
                  <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </span>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <p className="text-fg-navy/50 text-sm">No newsletters available</p>
      )}
    </motion.div>
  );
}
