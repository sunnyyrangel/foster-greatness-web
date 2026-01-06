'use client';

import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, Briefcase, Heart, Lightbulb } from 'lucide-react';
import { containerVariants, itemVariants } from './animations';

const dailyActivities = [
  {
    icon: MessageCircle,
    label: 'Peer Support',
    example: '"Just needed to vent to someone who gets it. Thanks for listening."',
    color: 'bg-fg-blue/10 text-fg-blue',
  },
  {
    icon: Lightbulb,
    label: 'Resource Questions',
    example: '"Does anyone know how to apply for tuition assistance in California?"',
    color: 'bg-fg-orange/10 text-fg-orange',
  },
  {
    icon: Briefcase,
    label: 'Career & Business',
    example: '"Just launched my photography business! Here\'s my site if anyone needs headshots."',
    color: 'bg-fg-teal/10 text-fg-teal',
  },
  {
    icon: Heart,
    label: 'Mutual Aid',
    example: '"My company is hiring remote customer service reps — DM me if interested."',
    color: 'bg-fg-coral/10 text-fg-coral',
  },
];

export default function DailyLifeSection() {
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
          What Happens Daily in the Community
        </h2>
        <p className="text-fg-navy/60 max-w-2xl mx-auto">
          It's not just programs and events — it's people showing up for each other every day.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {dailyActivities.map((activity) => (
          <motion.div
            key={activity.label}
            variants={itemVariants}
            className="bg-white rounded-2xl p-5 shadow-sm border border-fg-navy/5 hover:shadow-md hover:border-fg-blue/20 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${activity.color}`}>
                <activity.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-fg-navy mb-2">{activity.label}</h3>
                <p className="text-sm text-fg-navy/60 italic leading-relaxed">
                  {activity.example}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-fg-navy/[0.03] to-fg-blue/[0.05] rounded-2xl p-6 text-center"
      >
        <p className="text-fg-navy/80 mb-4 max-w-xl mx-auto">
          <span className="font-semibold text-fg-navy">2,000+ members</span> supporting each other —
          sharing jobs, answering questions, celebrating wins, and just being there.
        </p>
        <a
          href="https://community.fostergreatness.co"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-fg-navy text-white font-semibold rounded-full hover:bg-fg-blue transition-colors"
        >
          See the Community
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </a>
      </motion.div>
    </motion.section>
  );
}
