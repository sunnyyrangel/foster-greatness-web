'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Users, Target, Heart, Briefcase, GraduationCap, Home, Building2, CheckCircle2, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import ContactSection from '@/components/site/ContactSection';
import FederalEndorsementBanner from '@/components/shared/FederalEndorsementBanner';

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

const currentPartners = [
  {
    name: 'Staffmark',
    description: 'Our largest partnership brings the first-of-its-kind Foster Greatness Comprehensive Employment Support Pipeline program. We offer career support services including resume building, curated mock interviews, a skilled Career Advisor, skill-marketing, and access to a secure job board. Staffmark hosts free career development workshops in our Community and sponsors events like our Thanksgiving Community Cooking Event.',
    logo: '/images/partners/smg.png',
    impact: 'Comprehensive employment pipeline program'
  },
  {
    name: 'EatWell',
    description: 'Every year, we partner with EatWell to host a virtual live Thanksgiving Community Gathering. This partnership provides former foster youth and their families with meals for Thanksgiving week, creates a Foster Greatness Community Cookbook with recipes for allies and community members, and hosts a virtual cooking class and gathering.',
    logo: '/images/partners/eatwell.png',
    impact: 'Annual Thanksgiving meals and community gatherings'
  },
  {
    name: 'First Star',
    description: 'We hosted the 2025 First Star Creation Conference virtually in the Foster Greatness Community. We\'ve created a private space within our app for First Star program alumni to connect, share updates, and stay engaged while accessing resources, events, and opportunities throughout the Foster Greatness Community.',
    logo: '/images/partners/firststar.png',
    impact: 'Virtual conference hosting and alumni community space'
  },
  {
    name: 'Lotus Grove Counseling & Consulting Services',
    description: 'Since September 2025, Lotus Grove offers skilled, trauma-informed, lived experience-led parenting support groups for individuals who spent time in foster care and are now parenting. This unique partnership recognizes that former foster youth may lack parenting role models, providing support to build stronger networks for becoming strong, healthy parents.',
    logo: '/images/partners/lotus-grove.png',
    impact: 'Trauma-informed parenting support groups'
  },
  {
    name: 'A Home Within',
    description: 'This partnership brings free, long-term, private practice therapy services to individuals impacted by foster care across over 20 states. A Home Within is expanding to all 50 states and partners with Foster Greatness to expand awareness. We feature them in our Resource Finder Tool and as a preferred partner through our Resource Support Services.',
    logo: '/images/partners/a-home-within.png',
    impact: 'Free long-term therapy in 20+ states'
  },
  {
    name: 'Youth Voices Rising',
    description: 'This partnership brings media training and skill development to former foster youth nationwide. Youth Voices Rising hosts op-ed media trainings in our Community to help those with lived experience understand journalism and share their stories powerfully. We\'re partnering on a series of media articles about the Executive Order: Fostering the Future for American Children and Families, plus a January 2026 webinar.',
    logo: '/images/partners/youth-voices-rising.png',
    impact: 'Media training and lived experience amplification'
  },
  {
    name: 'Cetera',
    description: 'This partnership expands our capacity, network, and knowledge base throughout Florida. Cetera helps populate and maintain our Foster Greatness Resource Finder with local programs and services for former foster youth in Florida. We co-market our services and share social media content to spread awareness about the Community app. Future expansion includes a Florida-based resource specialist liaison.',
    logo: '/images/partners/cetera.png',
    impact: 'Florida resource expansion and co-marketing'
  },
  {
    name: 'Str8Up Employment Services',
    description: 'Partnering with a lived experience founder and employment services expert, we\'re rebuilding live digital content to create Foster Greatness\' first ever Employment Readiness Program. This cohort-based program teaches former foster youth employment basics and prepares our community for the next steps in their career journey.',
    logo: '/images/partners/str8up.png',
    impact: 'Cohort-based Employment Readiness Program'
  },
  {
    name: 'National Foster Youth Institute',
    description: 'Our partnership with the National Foster Youth Institute connects our community with leadership development and advocacy opportunities at the national level.',
    logo: '/images/partners/nfyi.png',
    impact: 'National leadership and advocacy opportunities'
  },
  {
    name: 'Doing Good Works',
    description: 'Our parent organization providing infrastructure and support for foster youth-serving initiatives.',
    logo: '/images/partners/dgw-branded.png',
    impact: 'Organizational support and capacity building'
  }
];

const partnershipBenefits = [
  {
    icon: Users,
    title: 'Direct Access to Community',
    description: 'Connect with 2,000+ foster youth and alumni nationwide through our established digital platform.'
  },
  {
    icon: Target,
    title: 'Mission-Aligned Impact',
    description: 'Collaborate with an organization led by people with lived experience in foster care.'
  },
  {
    icon: Heart,
    title: 'Authentic Feedback Loop',
    description: 'Receive genuine input from community members to shape programs that truly serve their needs.'
  },
  {
    icon: Building2,
    title: 'Broader Advocacy Network',
    description: 'Join a network of organizations committed to systemic change for foster youth nationwide.'
  },
  {
    icon: CheckCircle2,
    title: 'Data-Driven Outcomes',
    description: 'Track measurable impact with our transparent reporting and outcome measurement systems.'
  },
  {
    icon: Briefcase,
    title: 'Co-Creation Opportunities',
    description: 'Work alongside community members to design tailored programs and resources together.'
  }
];

const seekingPartners = [
  {
    icon: GraduationCap,
    category: 'Education',
    areas: ['Tutoring & Academic Support', 'College Preparation', 'Vocational Training', 'Scholarship Programs', 'Financial Literacy'],
    color: 'from-fg-navy to-fg-blue'
  },
  {
    icon: Heart,
    category: 'Healthcare',
    areas: ['Mental Health Services', 'Preventive Care', 'Health Insurance Navigation', 'Wellness Programs', 'Trauma-Informed Care'],
    color: 'from-fg-navy to-fg-blue'
  },
  {
    icon: Home,
    category: 'Housing',
    areas: ['Transitional Housing', 'Housing Navigation', 'Neighborhood Safety', 'Transportation Access', 'Home Stability Resources'],
    color: 'from-fg-navy to-fg-blue'
  }
];

const howItWorks = [
  {
    step: '01',
    title: 'Initial Conversation',
    description: 'Schedule a meeting to discuss your organization\'s mission, resources, and how we might collaborate.'
  },
  {
    step: '02',
    title: 'Alignment Assessment',
    description: 'We evaluate mutual fit based on community needs, shared values, and sustainable partnership potential.'
  },
  {
    step: '03',
    title: 'Co-Design Programs',
    description: 'Work together with community input to design programs that authentically serve foster youth needs.'
  },
  {
    step: '04',
    title: 'Launch & Measure',
    description: 'Implement partnership initiatives with clear goals, regular check-ins, and transparent outcome tracking.'
  }
];

export default function PartnershipsPage() {
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
        {/* Hero Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mb-10 md:mb-12"
        >
          <motion.div variants={itemVariants} className="max-w-4xl">
            <p className="text-sm font-semibold text-fg-blue uppercase tracking-wider mb-4">
              Partnership Opportunities
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-fg-navy mb-6 leading-[1.1] tracking-tight">
              Partnerships for<br />Empowerment
            </h1>
            <p className="text-xl text-fg-navy/70 mb-8 leading-relaxed max-w-3xl">
              Join our network of dedicated organizations working together to provide essential resources, opportunities, and support for foster youth transitioning to independence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-fg-navy text-white font-semibold rounded-full hover:bg-fg-blue transition-colors shadow-lg shadow-fg-navy/20"
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                Start Partnership Discussion
              </a>
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-fg-navy font-semibold hover:text-fg-blue transition-colors"
              >
                Learn About Foster Greatness
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        </motion.section>

        {/* Federal Endorsement */}
        <div className="mb-10 md:mb-12">
          <FederalEndorsementBanner variant="compact" />
        </div>

        {/* Current Partners */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="mb-10 md:mb-12"
        >
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-fg-navy mb-3">
              Our Current Partners
            </h2>
            <p className="text-fg-navy/60 max-w-2xl mx-auto">
              We're grateful to work alongside these incredible organizations in supporting foster youth nationwide.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPartners.map((partner) => (
              <motion.div
                key={partner.name}
                variants={itemVariants}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-fg-navy/5 hover:shadow-md hover:border-fg-blue/30 transition-all group h-full flex flex-col"
              >
                <div className="aspect-square bg-white flex items-center justify-center p-6 border-b border-gray-100">
                  <Image
                    src={partner.logo}
                    alt={`${partner.name} logo`}
                    width={200}
                    height={200}
                    className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-fg-navy mb-2 group-hover:text-fg-blue transition-colors">
                    {partner.name}
                  </h3>
                  <p className="text-sm text-fg-navy/70 leading-relaxed mb-3 flex-1">
                    {partner.description}
                  </p>
                  <p className="text-xs text-fg-navy/50 font-semibold">
                    {partner.impact}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Partnership Benefits */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="mb-10 md:mb-12"
        >
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-fg-navy mb-3">
              Why Partner With Us
            </h2>
            <p className="text-fg-navy/60 max-w-2xl mx-auto">
              Partnering with Foster Greatness means connecting with an authentic, lived experience-led community committed to meaningful impact.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnershipBenefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  variants={itemVariants}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-fg-navy/5 hover:shadow-md hover:border-fg-blue/30 transition-all"
                >
                  <div className="w-12 h-12 rounded-lg bg-fg-blue/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-fg-blue" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-fg-navy mb-2">{benefit.title}</h3>
                  <p className="text-sm text-fg-navy/70 leading-relaxed">{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Seeking Partners */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="mb-10 md:mb-12"
        >
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-fg-navy mb-3">
              Partnership Opportunities
            </h2>
            <p className="text-fg-navy/60 max-w-2xl mx-auto">
              We're actively seeking partners in these critical areas to expand support for our community.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {seekingPartners.map((category) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.category}
                  variants={itemVariants}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-fg-navy/5 hover:shadow-md hover:border-fg-blue/30 transition-all group"
                >
                  <div className={`h-2 bg-gradient-to-r ${category.color}`}></div>
                  <div className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-fg-navy/5 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-fg-navy" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-bold text-fg-navy mb-4 group-hover:text-fg-blue transition-colors">
                      {category.category}
                    </h3>
                    <ul className="space-y-2">
                      {category.areas.map((area) => (
                        <li key={area} className="flex items-start gap-2 text-sm text-fg-navy/70">
                          <CheckCircle2 className="w-4 h-4 text-fg-blue flex-shrink-0 mt-0.5" aria-hidden="true" />
                          <span>{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
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
              How Partnership Works
            </h2>
            <p className="text-fg-navy/60 max-w-2xl mx-auto">
              Our partnership process is designed to be collaborative, transparent, and focused on sustainable impact.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {howItWorks.map((step, i) => (
              <motion.div
                key={step.step}
                variants={itemVariants}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-fg-navy/5 h-full">
                  <div className="text-5xl font-black text-fg-blue/20 mb-4">{step.step}</div>
                  <h3 className="text-lg font-bold text-fg-navy mb-3">{step.title}</h3>
                  <p className="text-sm text-fg-navy/70 leading-relaxed">{step.description}</p>
                </div>
                {i < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-fg-blue/30" aria-hidden="true" />
                  </div>
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
            className="bg-gradient-to-br from-fg-navy to-fg-blue rounded-3xl p-8 md:p-12 text-white"
          >
            <div className="max-w-3xl mx-auto text-center">
              <div className="text-6xl mb-6">💡</div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Partnership Impact Example
              </h2>
              <p className="text-lg text-white/90 leading-relaxed mb-8">
                "Through our partnership with StaffMark Group, we've connected over 100 community members with sustainable employment opportunities. Their commitment to providing personalized support—from resume help to interview coaching—has transformed how our members navigate the job market."
              </p>
              <p className="text-sm text-white/70 font-semibold">
                Isabel Stasa, Director of Community Affairs and Social Impact
              </p>
            </div>
          </motion.div>
        </motion.section>

        {/* Contact Section */}
        <div id="contact" className="mb-10 md:mb-12 scroll-mt-24">
          <ContactSection
            title="Ready to Make an Impact?"
            subtitle="Start a Partnership"
            description="Let's explore how your organization can partner with Foster Greatness to create meaningful change for foster youth nationwide. Fill out the form and our partnership team will be in touch."
            email="partnerships@fostergreatness.co"
            showCommunityButton={false}
          />
        </div>
      </div>
    </div>
  );
}
