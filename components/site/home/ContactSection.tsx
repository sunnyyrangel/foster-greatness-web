'use client';

import { motion } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';
import TypeformEmbed from '@/components/shared/TypeformEmbed';
import { containerVariants, itemVariants } from './animations';

export default function ContactSection() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
      className="mt-10 md:mt-12"
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-fg-navy via-fg-navy to-fg-blue/80">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-fg-blue/20 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-fg-coral/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />

        <div className="relative p-8 md:p-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Content */}
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Mail className="w-4 h-4 text-fg-blue" />
                <span className="text-sm font-semibold text-white/90">We'd love to hear from you</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                Let's Connect
              </h2>
              <p className="text-lg text-white/80 leading-relaxed mb-8">
                Whether you're a foster youth looking for support, an organization wanting to partner, or someone who wants to make a difference—reach out. We're here for you.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="mailto:info@fostergreatness.co"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-fg-navy font-semibold rounded-full hover:bg-fg-blue hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Email Us
                </a>
                <a
                  href="https://community.fostergreatness.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-transparent text-white font-semibold rounded-full border-2 border-white/30 hover:bg-white/10 transition-colors"
                >
                  Join Community
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>

            {/* Typeform - using the proper component */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <TypeformEmbed minHeight="450px" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
