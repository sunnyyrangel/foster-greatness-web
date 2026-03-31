'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Briefcase, Users, Target, TrendingUp, CheckCircle2, FileText, Calendar, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

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

const programFeatures = [
  {
    icon: FileText,
    title: 'Resume Building',
    description: 'Professional resume review and development with industry experts who understand your unique background.'
  },
  {
    icon: Users,
    title: '1:1 Interview Coaching',
    description: 'Personalized interview preparation sessions to build confidence and practice responses.'
  },
  {
    icon: Briefcase,
    title: 'Job Placement Support',
    description: 'Direct connections to employers actively seeking diverse talent with growth potential.'
  },
  {
    icon: Target,
    title: 'Skills Training',
    description: 'Access to professional development workshops on workplace skills and career advancement.'
  },
  {
    icon: Calendar,
    title: 'Ongoing Mentorship',
    description: 'Continued support after placement with regular check-ins and career guidance.'
  },
  {
    icon: TrendingUp,
    title: 'Career Advancement',
    description: 'Pathways to promotions and long-term career growth within partner companies.'
  }
];

const howItWorks = [
  {
    step: '01',
    title: 'Connect with Resource Specialist',
    description: 'Reach out to our Resource Specialists through the community platform to express interest in employment support.'
  },
  {
    step: '02',
    title: 'Initial Assessment',
    description: 'Meet with StaffMark team to discuss your career goals, skills, experience, and what you\'re looking for.'
  },
  {
    step: '03',
    title: 'Skills Development',
    description: 'Get personalized support with resume building, interview prep, and any skills training you need.'
  },
  {
    step: '04',
    title: 'Job Matching',
    description: 'StaffMark connects you with employers that align with your interests and career goals.'
  },
  {
    step: '05',
    title: 'Placement & Support',
    description: 'Receive ongoing mentorship and support as you start your new role and advance in your career.'
  }
];

const impactStats = [
  { number: '100+', label: 'Job Placements' },
  { number: '85%', label: 'Retention Rate' },
  { number: '50+', label: 'Employer Partners' },
  { number: '$45K', label: 'Average Starting Salary' }
];

export default function StaffMarkCaseStudy() {
  return (
    <div className="min-h-screen bg-[#fafbfc]">
      {/* Subtle texture */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231a2949' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative w-full py-6 sm:py-8 md:py-10 px-4 sm:px-6 md:px-8 lg:px-12 max-w-screen-2xl mx-auto">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Link
            href="/partnerships"
            className="inline-flex items-center gap-2 text-fg-navy/60 hover:text-fg-blue transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span className="font-semibold">Back to Partnerships</span>
          </Link>
        </motion.div>

        {/* Hero Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mb-10 md:mb-12"
        >
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div variants={itemVariants}>
              <div className="inline-block px-3 py-1 bg-fg-blue/10 text-fg-blue text-sm font-semibold rounded-full mb-4">
                Partnership Case Study
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-fg-navy mb-6 leading-[1.1] tracking-tight">
                StaffMark Group<br />Employment Partnership
              </h1>
              <p className="text-xl text-fg-navy/70 mb-8 leading-relaxed">
                Equipping foster youth with employment tools, resources, and skills for sustainable careers while expanding employer access to diverse talent.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://community.fostergreatness.co/c/employment"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-fg-navy text-white font-semibold rounded-full hover:bg-fg-blue transition-colors shadow-lg shadow-fg-navy/20"
                >
                  Access Employment Support
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="relative h-80 lg:h-96">
              <div className="relative h-full rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <Image
                  src="https://placehold.co/600x400/1a2949/FFFFFF?text=StaffMark+Partnership"
                  alt="StaffMark Group partnership with Foster Greatness"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Impact Stats */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="mb-10 md:mb-12"
        >
          <div className="bg-gradient-to-br from-fg-navy to-fg-blue rounded-3xl p-8 md:p-12 text-white">
            <motion.div variants={itemVariants} className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Partnership Impact</h2>
              <p className="text-white/80 max-w-2xl mx-auto">
                Real outcomes from our collaboration with StaffMark Group
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {impactStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                  <div className="text-white/80">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Program Features */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="mb-10 md:mb-12"
        >
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-fg-navy mb-3">
              What You Get
            </h2>
            <p className="text-fg-navy/60 max-w-2xl mx-auto">
              Comprehensive employment support designed specifically for foster care alumni
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {programFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-fg-navy/5 hover:shadow-md hover:border-fg-blue/30 transition-all"
                >
                  <div className="w-12 h-12 rounded-lg bg-fg-blue/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-fg-blue" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-fg-navy mb-2">{feature.title}</h3>
                  <p className="text-sm text-fg-navy/70 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* How It Works */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="mb-10 md:mb-12"
        >
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-fg-navy mb-3">
              How the Program Works
            </h2>
            <p className="text-fg-navy/60 max-w-2xl mx-auto">
              A clear pathway from connection to career success
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {howItWorks.map((step, i) => (
              <motion.div
                key={step.step}
                variants={itemVariants}
                className="relative mb-6 last:mb-0"
              >
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-fg-navy to-fg-blue text-white font-bold text-xl flex items-center justify-center">
                    {step.step}
                  </div>
                  <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm border border-fg-navy/5">
                    <h3 className="text-xl font-bold text-fg-navy mb-2">{step.title}</h3>
                    <p className="text-fg-navy/70 leading-relaxed">{step.description}</p>
                  </div>
                </div>
                {i < howItWorks.length - 1 && (
                  <div className="ml-8 h-8 w-0.5 bg-fg-blue/30"></div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Success Story */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="mb-10 md:mb-12"
        >
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-fg-navy/5"
          >
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-fg-navy to-fg-blue flex items-center justify-center text-white text-2xl font-bold">
                  M
                </div>
                <div>
                  <h3 className="text-xl font-bold text-fg-navy">Michael's Story</h3>
                  <p className="text-fg-navy/60">Foster Greatness Community Member</p>
                </div>
              </div>
              <blockquote className="text-lg text-fg-navy/80 leading-relaxed italic mb-6">
                "Through Foster Greatness and StaffMark, I discovered a renewed sense of purpose, which has fueled personal growth and boosted my professional confidence. The 1:1 coaching helped me realize I had skills I didn't even know employers valued. Now I'm not just employed—I'm building a real career."
              </blockquote>
              <div className="flex items-center gap-2 text-sm text-fg-navy/50">
                <CheckCircle2 className="w-4 h-4 text-fg-blue" aria-hidden="true" />
                <span>Placed in full-time position with benefits and growth opportunities</span>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="mb-10 md:mb-12"
        >
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-fg-blue/5 to-fg-navy/5 rounded-3xl p-8 md:p-12 text-center border border-fg-blue/20"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-fg-navy mb-4">
              Ready to Start Your Career Journey?
            </h2>
            <p className="text-lg text-fg-navy/70 mb-8 max-w-2xl mx-auto leading-relaxed">
              Connect with our Resource Specialists to learn more about the StaffMark employment program and take the first step toward sustainable employment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://community.fostergreatness.co/c/employment"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-fg-navy text-white font-semibold rounded-full hover:bg-fg-blue transition-colors shadow-lg shadow-fg-navy/20"
              >
                <Briefcase className="w-4 h-4" aria-hidden="true" />
                Explore Employment Opportunities
              </a>
              <a
                href="https://community.fostergreatness.co/c/find-help-foster-greatness/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-fg-navy font-semibold hover:text-fg-blue transition-colors"
              >
                Contact Resource Specialist
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
}
