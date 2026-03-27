'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { containerVariants, itemVariants } from './animations';

export default function CommunitySection() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="mt-8 md:mt-10"
    >
      <div className="bg-fg-navy rounded-3xl p-6 md:p-10 lg:p-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
              More than a platform—<br />a family.
            </h2>
            <p className="text-lg text-white/80 leading-relaxed mb-8">
              Foster Greatness is led by people who've lived through the foster system. Whether you need help with housing, want to share your story, or just need to know you're not alone—we've got you.
            </p>
            <a
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-fg-navy font-semibold rounded-full hover:bg-fg-blue hover:text-white transition-colors"
            >
              About Foster Greatness
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </motion.div>

          {/* Image */}
          <motion.div variants={itemVariants} className="relative h-64 sm:h-80 lg:h-96">
            <Image
              src="/images/digital-community-image.webp"
              alt="Foster Greatness community members"
              fill
              className="object-cover rounded-2xl"
            />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
