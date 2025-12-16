'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { itemVariants } from './animations';
import type { CircleEvent } from './types';

interface EventsSectionProps {
  events: CircleEvent[];
  loading: boolean;
}

export default function EventsSection({ events, loading }: EventsSectionProps) {
  return (
    <motion.div variants={itemVariants}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-fg-navy">Upcoming Events</h3>
        <a
          href="https://community.fostergreatness.co/c/general-events"
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
            <div key={i} className="h-40 bg-fg-navy/5 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {events.slice(0, 3).map((event) => {
            const eventDate = new Date(event.starts_at);
            const month = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
            const day = eventDate.getDate();
            const time = eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

            return (
              <a
                key={event.id}
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col rounded-xl bg-white border border-fg-navy/5 shadow-sm hover:shadow-md hover:border-fg-blue/30 transition-all group text-center overflow-hidden"
              >
                {event.cover_image_url && (
                  <div className="relative w-full h-24">
                    <Image
                      src={event.cover_image_url}
                      alt={event.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-3 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-lg bg-fg-navy flex flex-col items-center justify-center text-white mb-2 -mt-7 relative z-10 shadow-md">
                    <span className="text-[8px] font-bold leading-none opacity-80">{month}</span>
                    <span className="text-base font-bold leading-none">{day}</span>
                  </div>
                  <p className="font-semibold text-sm text-fg-navy group-hover:text-fg-blue transition-colors line-clamp-2 leading-tight">
                    {event.name}
                  </p>
                  <p className="text-sm text-fg-navy/50 mt-1">{time}</p>
                </div>
              </a>
            );
          })}
        </div>
      ) : (
        <p className="text-fg-navy/50">No upcoming events</p>
      )}
    </motion.div>
  );
}
