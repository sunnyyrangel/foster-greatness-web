'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { containerVariants, itemVariants } from './animations';

const appLinks = [
  {
    name: 'App Store',
    image: '/images/badge-apple.png',
    url: 'https://apps.apple.com/us/app/foster-greatness-community/id6456409836',
    alt: 'Download on the App Store'
  },
  {
    name: 'Google Play',
    image: '/images/badge-google-play.png',
    url: 'https://play.google.com/store/apps/details?id=co.circle.fostergreatness&hl=en_US',
    alt: 'Get it on Google Play'
  },
  {
    name: 'Desktop',
    image: '/images/badge-desktop.png',
    url: 'https://community.fostergreatness.co/home',
    alt: 'Access on Desktop'
  },
];

export default function AppDownloadSection() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
      className="mt-10 md:mt-12"
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-fg-navy via-fg-navy to-fg-blue">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-fg-coral/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative p-8 md:p-12 text-center">
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Join Our Community
            </h2>
            <p className="text-white/80 max-w-xl mx-auto mb-8 text-lg">
              Connect with fellow foster youth, access resources, and find your people. Available everywhere you are.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center items-center gap-4 md:gap-6"
          >
            {appLinks.map((app) => (
              <a
                key={app.name}
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-all hover:scale-105 hover:brightness-110"
              >
                <Image
                  src={app.image}
                  alt={app.alt}
                  width={180}
                  height={54}
                  className="h-12 md:h-14 w-auto"
                />
              </a>
            ))}
          </motion.div>

          <motion.p variants={itemVariants} className="mt-6 text-white/60 text-sm">
            Free to join. No credit card required.
          </motion.p>
        </div>
      </div>
    </motion.section>
  );
}
