'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { containerVariants, itemVariants } from './animations';

// Partners 1-9, excluding 10 (DGW Branded logo)
const partners = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  image: `/images/partners/${i + 1}.png`,
  alt: `Partner ${i + 1}`
}));

export default function PartnersSection() {
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
          Our Partners
        </h2>
        <p className="text-fg-navy/60 max-w-2xl mx-auto">
          We're grateful to work alongside these incredible organizations in supporting foster youth.
        </p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl p-8 shadow-sm border border-fg-navy/5"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-10 items-center justify-items-center">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="w-full max-w-[160px] h-24 relative grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300"
            >
              <Image
                src={partner.image}
                alt={partner.alt}
                fill
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
}
