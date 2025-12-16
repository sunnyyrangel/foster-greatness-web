'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { itemVariants } from './animations';
import type { Testimonial } from './types';

const testimonials: Testimonial[] = [
  {
    name: 'Zoey Dunkel',
    quote: "Foster Greatness has given me hope during some of my hardest moments. The team made me feel seen, cared for, and not alone.",
    avatar: null,
    initials: 'ZD',
    color: 'from-fg-navy to-fg-blue'
  },
  {
    name: 'Majd Abdallah',
    quote: "A centralized platform like Foster Greatness has been missing for foster kids and under resource people for so long. Y'all are seriously trailblazing!",
    avatar: '/images/majd-abdallah.jpg',
    initials: 'MA',
    color: 'from-fg-navy to-fg-blue'
  },
  {
    name: 'Michael Davis-Thomas',
    quote: "Through Foster Greatness, I discovered a renewed sense of purpose, which has fueled personal growth and boosted my professional confidence.",
    avatar: '/images/michael-davis-thomas.jpg',
    initials: 'MD',
    color: 'from-fg-navy to-fg-blue'
  },
  {
    name: 'Taylor Rockhold',
    quote: "Foster Greatness helped me tap into strengths I didn't even know I had.",
    avatar: '/images/taylor-rockhold.jpg',
    initials: 'TR',
    color: 'from-fg-navy to-fg-blue'
  },
  {
    name: 'Eugenia Doreen',
    quote: "Foster Greatness is more than an organization—it's a movement rooted in innovation, transformation, and joy.",
    avatar: '/images/eugenia-wallace.jpg',
    initials: 'ED',
    color: 'from-fg-navy to-fg-blue'
  },
  {
    name: 'Julie Ong',
    quote: "As I enter CSU for the fall semester, I know I can count on Foster Greatness for their continued support and helpful resources!",
    avatar: null,
    initials: 'JO',
    color: 'from-fg-navy to-fg-blue'
  },
  {
    name: 'Jessica Patino',
    quote: "Because of their consistent support, I feel stronger, connected, and equipped to build a brighter future for my family too.",
    avatar: null,
    initials: 'JP',
    color: 'from-fg-navy to-fg-blue'
  },
  {
    name: 'Emmerald Evans',
    quote: "They didn't just ask me to share my story—they gave me the tools to shape it, own it, and use it to make an impact.",
    avatar: '/images/emmerald-evans.jpg',
    initials: 'EE',
    color: 'from-fg-navy to-fg-blue'
  },
  {
    name: 'Chyenne Santini',
    quote: "Having the opportunity to be part of the very first cohort of the Storyteller Collective ignited a fire of inspiration within me.",
    avatar: '/images/chyenne-roan-santini.jpg',
    initials: 'CS',
    color: 'from-fg-navy to-fg-blue'
  },
  {
    name: 'Stormy Lukasavage',
    quote: "Foster Greatness pioneers the concept of involved participation and takes it to the next level by making it accessible and open.",
    avatar: '/images/stormy-lukasavage.jpg',
    initials: 'SL',
    color: 'from-fg-navy to-fg-blue'
  },
];

export default function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardsToShow(1);
      } else if (window.innerWidth < 1024) {
        setCardsToShow(2);
      } else {
        setCardsToShow(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, testimonials.length - cardsToShow);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  }, [maxIndex]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(Math.min(index, maxIndex));
  }, [maxIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if carousel container is focused or contains focus
      const container = document.getElementById('testimonial-carousel');
      if (!container?.contains(document.activeElement) && document.activeElement !== container) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrevious, goToNext]);

  return (
    <motion.div
      variants={itemVariants}
      className="mt-8 pt-8 border-t border-fg-navy/10"
    >
      <div className="text-center mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-fg-navy mb-2">
          What Our Community Says
        </h3>
        <p className="text-fg-navy/60 max-w-2xl mx-auto text-sm">
          Real stories from people who've found connection, support, and hope.
        </p>
      </div>

      <div
        id="testimonial-carousel"
        className="relative"
        role="region"
        aria-label="Testimonials carousel"
        tabIndex={0}
      >
        {/* Carousel container */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / cardsToShow)}%)`,
            }}
            aria-live="polite"
          >
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="flex-shrink-0 px-2"
                style={{ width: `${100 / cardsToShow}%` }}
              >
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-fg-navy/5 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 relative flex-shrink-0">
                      {t.avatar ? (
                        <Image
                          src={t.avatar}
                          alt={t.name}
                          fill
                          className="rounded-full object-cover ring-2 ring-fg-blue/20"
                        />
                      ) : (
                        <div className={`w-full h-full rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center ring-2 ring-fg-blue/20`}>
                          <span className="text-white font-bold">{t.initials}</span>
                        </div>
                      )}
                    </div>
                    <p className="font-bold text-fg-navy">{t.name}</p>
                  </div>
                  <blockquote className="text-fg-navy/80 leading-relaxed flex-1 text-sm">
                    "{t.quote}"
                  </blockquote>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 bg-white rounded-full p-2 shadow-md border border-fg-navy/10 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-fg-navy/5 transition-colors z-10"
          aria-label="Previous testimonials"
        >
          <ChevronLeft className="w-4 h-4 text-fg-navy" />
        </button>
        <button
          onClick={goToNext}
          disabled={currentIndex >= maxIndex}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 bg-white rounded-full p-2 shadow-md border border-fg-navy/10 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-fg-navy/5 transition-colors z-10"
          aria-label="Next testimonials"
        >
          <ChevronRight className="w-4 h-4 text-fg-navy" />
        </button>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-4" role="tablist" aria-label="Testimonial pages">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-fg-blue' : 'bg-fg-navy/20'
            }`}
            role="tab"
            aria-selected={index === currentIndex}
            aria-label={`Go to testimonial group ${index + 1}`}
          />
        ))}
      </div>
    </motion.div>
  );
}
