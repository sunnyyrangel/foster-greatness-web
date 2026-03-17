'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, FileText, Newspaper, Heart, ArrowRight, Link2, Check } from 'lucide-react';
import Image from 'next/image';
import { itemVariants } from './animations';
import type { Update, UpdateType } from './types';

const typeConfig: Record<UpdateType, { icon: typeof Newspaper; label: string; color: string }> = {
  news: {
    icon: Newspaper,
    label: 'News',
    color: 'bg-fg-blue',
  },
  page: {
    icon: FileText,
    label: 'Resource',
    color: 'bg-fg-navy',
  },
  event: {
    icon: Calendar,
    label: 'Event',
    color: 'bg-fg-orange',
  },
  donate: {
    icon: Heart,
    label: 'Give',
    color: 'bg-fg-blue',
  },
};

export function CopyLinkButton({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-3 rounded-lg bg-white/80 hover:bg-white shadow-sm transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
      aria-label="Copy link"
    >
      {copied ? (
        <Check className="w-4 h-4 text-fg-blue" />
      ) : (
        <Link2 className="w-4 h-4 text-gray-500 hover:text-fg-blue" />
      )}
    </button>
  );
}

export function FeaturedCard({ update }: { update: Update }) {
  const config = typeConfig[update.type];
  const Icon = config.icon;
  const isExternal = update.link.startsWith('http');

  return (
    <motion.a
      href={update.link}
      {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
      variants={itemVariants}
      className="block bg-white rounded-2xl overflow-hidden shadow-sm border border-fg-navy/5 cursor-pointer group h-full hover:shadow-md hover:border-fg-blue/30 transition-all"
    >
      {/* Image on top */}
      {update.image && (
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <Image
            src={update.image}
            alt={update.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority
          />
        </div>
      )}

      {/* Content below */}
      <div className="p-5 md:p-6">
        {/* Badge */}
        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${config.color} text-white text-sm font-semibold uppercase tracking-wider mb-3`}>
          <Icon className="w-3 h-3" aria-hidden="true" />
          {config.label}
        </div>

        <h2 className="text-xl md:text-2xl font-bold mb-2 text-fg-navy leading-tight group-hover:text-fg-blue transition-colors">
          {update.title}
        </h2>

        <p className="text-fg-navy/70 leading-relaxed mb-4 line-clamp-2">
          {update.description}
        </p>

        <span className="inline-flex items-center gap-2 text-fg-blue font-semibold group-hover:gap-3 transition-all">
          {update.linkText}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </span>
      </div>
    </motion.a>
  );
}


export function UpdateCard({ update }: { update: Update }) {
  const config = typeConfig[update.type];
  const Icon = config.icon;
  const isExternal = update.link.startsWith('http');

  return (
    <motion.a
      href={update.link}
      {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
      variants={itemVariants}
      className="group block bg-white rounded-2xl shadow-sm border border-fg-navy/5 overflow-hidden h-full"
    >
      {/* Thumbnail */}
      {update.image && (
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={update.image}
            alt={update.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      <div className="p-4">
        {/* Badge */}
        <div className="flex items-center gap-2 mb-2">
          <div className={`p-1.5 rounded-md ${config.color}`}>
            <Icon className="w-3 h-3 text-white" aria-hidden="true" />
          </div>
          <span className="text-sm font-semibold text-fg-navy/50 uppercase tracking-wider">
            {config.label}
          </span>
        </div>

        <h3 className="text-base font-bold text-fg-navy group-hover:text-fg-blue transition-colors line-clamp-2 mb-3 leading-snug">
          {update.title}
        </h3>

        <span className="inline-flex items-center gap-1 text-fg-blue font-semibold text-sm group-hover:gap-2 transition-all">
          {update.linkText}
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </span>
      </div>
    </motion.a>
  );
}

export function UpdateListItem({ update }: { update: Update }) {
  const config = typeConfig[update.type];
  const Icon = config.icon;
  const isExternal = update.link.startsWith('http');

  return (
    <motion.a
      href={update.link}
      {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
      variants={itemVariants}
      className="block group"
    >
      <div className="bg-white rounded-xl shadow-sm border border-fg-navy/5 group-hover:shadow-md group-hover:border-fg-blue/30 transition-all overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          {update.image && (
            <div className="relative w-full sm:w-48 h-32 sm:h-auto flex-shrink-0">
              <Image
                src={update.image}
                alt={update.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-4 flex-1">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${config.color} text-white mb-2`}>
                  <Icon className="w-3 h-3" />
                  {config.label}
                </span>
                <h3 className="font-bold text-fg-navy group-hover:text-fg-blue transition-colors">
                  {update.title}
                </h3>
              </div>
              <span className="text-xs text-fg-navy/50 whitespace-nowrap">
                {new Date(update.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
            <p className="text-sm text-fg-navy/70 leading-relaxed mb-3">
              {update.description}
            </p>
            <span className="inline-flex items-center gap-1 text-fg-blue font-semibold text-sm group-hover:gap-2 transition-all">
              {update.cta || update.linkText}
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </motion.a>
  );
}

export { typeConfig };
