'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown, ImageIcon } from 'lucide-react';
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

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "Can advocates join this community?",
      answer: "Yes! While our programs are primarily designed for those with lived foster care experience, advocates who are committed to supporting our community are welcome to engage with us."
    },
    {
      question: "Do I have to be in foster care right now to join?",
      answer: "No. Our community welcomes current and former foster youth. We are an 18+ community serving individuals at any stage of their journey—with no age cap. Once you're part of our community, you're part of it for life."
    },
    {
      question: "Do I need to prove my foster youth status to qualify or join?",
      answer: "You do not need to prove your status to join. However, there may be some programs or opportunities that do require proof of lived experience."
    },
    {
      question: "Is this limited to a certain state or age?",
      answer: "We are an 18+ community with no upper age limit—support that lasts a lifetime."
    },
    {
      question: "Does it cost anything to join?",
      answer: "No! Joining our community is completely free. We believe support and belonging should be accessible to everyone."
    },
    {
      question: "Does Foster Greatness provide monetary support?",
      answer: "We connect members with resources including scholarships and access to various support programs. Not sure where to start? Submit a request and our team will help point you in the right direction."
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafbfc] relative">
      {/* Subtle texture */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231a2949' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative">
        {/* Hero Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative overflow-hidden bg-gradient-to-br from-fg-navy via-fg-blue to-fg-navy text-white py-20 md:py-28"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: '32px 32px'
            }}></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div variants={itemVariants} className="max-w-4xl mx-auto text-center">
              {/* Mission Statement - Front and Center */}
              <div className="inline-block mb-8 px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                <span className="text-sm font-semibold tracking-wide uppercase text-white/90">Our Mission</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 leading-tight">
                To co-create a space with people impacted by the foster system where{' '}
                <span className="text-fg-yellow">empowerment, healing, and community</span>{' '}
                are front and center.
              </h1>

              <div className="w-16 h-1 bg-fg-yellow mx-auto mb-8 rounded-full" />

              <p className="text-lg md:text-xl opacity-90 leading-relaxed mb-6">
                Foster Greatness is a lived experience-led organization creating lifelong community and belonging for current and former foster youth nationwide.
              </p>
              <p className="text-lg md:text-xl opacity-90 leading-relaxed">
                We believe{' '}
                <span className="font-bold text-fg-yellow">no one should age out</span> of support.
                Our community ensures individuals have continued access to resources, connection, and the belonging they deserve.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mt-10">
                <a
                  href="https://community.fostergreatness.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-fg-navy px-8 py-4 rounded-full font-bold hover:bg-fg-yellow transition-colors shadow-lg"
                >
                  Join Our Community
                  <ArrowRight className="w-5 h-5" />
                </a>
                <Link
                  href="/impact"
                  className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors"
                >
                  See Our Impact
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Federal Endorsement */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <FederalEndorsementBanner variant="compact" />
          </div>
        </div>

        {/* Vision & Core Values */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="py-16 md:py-20"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Vision */}
              <motion.div variants={itemVariants} className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-fg-navy mb-4">Our Vision</h2>
                <p className="text-xl text-fg-navy/70 leading-relaxed max-w-3xl mx-auto">
                  A world where every person who has lived through the foster system feels
                  <span className="font-semibold text-fg-blue"> seen, supported, and unstoppable</span>.
                </p>
              </motion.div>

              {/* Core Values */}
              <div className="grid md:grid-cols-3 gap-6">
                <motion.div variants={itemVariants} className="bg-white rounded-2xl p-8 shadow-sm border border-fg-navy/5 hover:shadow-md hover:border-fg-blue/30 transition-all duration-300 text-center">
                  <div className="w-16 h-16 bg-fg-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">💪</span>
                  </div>
                  <h3 className="text-xl font-bold text-fg-navy mb-3">Lived Experience-Led</h3>
                  <p className="text-fg-navy/60 leading-relaxed">
                    Our programs and community are designed and led by those who have lived through foster care.
                  </p>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white rounded-2xl p-8 shadow-sm border border-fg-navy/5 hover:shadow-md hover:border-fg-blue/30 transition-all duration-300 text-center">
                  <div className="w-16 h-16 bg-fg-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">🤝</span>
                  </div>
                  <h3 className="text-xl font-bold text-fg-navy mb-3">Lifelong Belonging</h3>
                  <p className="text-fg-navy/60 leading-relaxed">
                    Age in, never age out. Our community is a family that lasts a lifetime.
                  </p>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white rounded-2xl p-8 shadow-sm border border-fg-navy/5 hover:shadow-md hover:border-fg-blue/30 transition-all duration-300 text-center">
                  <div className="w-16 h-16 bg-fg-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">✨</span>
                  </div>
                  <h3 className="text-xl font-bold text-fg-navy mb-3">Dignity & Empowerment</h3>
                  <p className="text-fg-navy/60 leading-relaxed">
                    We celebrate strengths, not deficits. Every member is a Thriver with unlimited potential.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Community Activities */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="py-16 md:py-20 bg-fg-navy/[0.02] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <motion.div variants={itemVariants} className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-fg-navy mb-4">
                  What Can You Do in Our Community?
                </h2>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {[
                  { image: '/images/web images/panel-discussion.webp', title: 'Monthly Panel Discussions', desc: 'Lived experience leaders and advocates discuss policy and systemic change affecting our community.' },
                  { image: '/images/web images/workshops.webp', title: 'Learning Workshops', desc: 'Experts with lived experience lead workshops on financial literacy, storytelling, trauma recovery, and more.' },
                  { image: '/images/web images/community-events.jpg', title: 'Community Events', desc: 'Connect and have fun with others through cooking events, holiday contests, support spaces and more.' },
                  { image: '/images/web images/resource-support.jpg', title: 'Resource Support', desc: 'Get connected to local resources or personalized support you deserve.' }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-fg-navy/5 hover:shadow-md hover:border-fg-blue/30 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="h-40 relative">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-fg-navy mb-3">{item.title}</h3>
                      <p className="text-fg-navy/60 leading-relaxed text-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Community in Action */}
              <motion.div variants={itemVariants}>
                <h3 className="text-2xl md:text-3xl font-bold text-fg-navy mb-8 text-center">Our Community in Action</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { image: '/images/web images/advocacy-policy-work.jpg', title: 'Advocacy & Policy Work', desc: 'Monthly conversations with National Network for Sibling Connections to discuss foster care policies and sibling advocacy.' },
                    { image: '/images/web images/community-events.jpg', title: 'Community Building Events', desc: "Quarterly events focused on connection through meals, open-mic nights, paint nights and more." },
                    { image: '/images/web images/community-support-spaces.jpg', title: 'Community Support Spaces', desc: 'Supportive environments including our Parent Support Group for foster youth who are parents, connecting families and building strength together.' },
                    { image: '/images/web images/workshops.webp', title: 'Learning Workshops', desc: 'Expert-led workshops covering financial literacy to career development.' },
                    { image: '/images/web images/panel-discussion.webp', title: 'Panel Discussions', desc: 'Lived experience leaders and advocates tackle important community issues.' },
                    { image: '/images/web images/storyteller-collective.webp', title: 'Empowering Foster Youth Voices', desc: 'Our Storyteller Collective and "Thriver Stories" series provide platforms for foster care alumni to share their journeys and inspire others.' }
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      variants={itemVariants}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-fg-navy/5 hover:shadow-md transition-all duration-300"
                    >
                      <div className="aspect-[3/2] relative">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover object-top"
                        />
                      </div>
                      <div className="p-5">
                        <h4 className="text-lg font-bold text-fg-navy mb-2">{item.title}</h4>
                        <p className="text-sm text-fg-navy/60 leading-relaxed">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Resource Support */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="py-16 md:py-20"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <motion.div variants={itemVariants}>
                <h2 className="text-3xl md:text-4xl font-bold text-fg-navy mb-10 text-center">Resource Support</h2>
              </motion.div>

              {/* Resource Finder Feature */}
              <motion.div variants={itemVariants} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-fg-navy/5 mb-8">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="h-64 md:h-auto relative">
                    <Image
                      src="/images/resource-finder-preview.svg"
                      alt="FG Resource Finder"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-8 md:p-10 flex flex-col justify-center">
                    <div className="inline-block mb-4 px-4 py-1.5 bg-fg-teal/10 rounded-full w-fit">
                      <span className="text-xs font-bold tracking-wide uppercase text-fg-teal">Resource Finder</span>
                    </div>
                    <h3 className="text-2xl font-bold text-fg-navy mb-4">Find Local Resources Near You</h3>
                    <p className="text-fg-navy/70 leading-relaxed mb-4">
                      Our Resource Finder connects you to over 500,000 programs nationwide — search by ZIP code for housing, food, healthcare, jobs, education, legal aid, and more.
                    </p>
                    <p className="text-sm text-fg-navy/50 leading-relaxed mb-6">
                      Not sure where to start? You can also submit a support request and our team will help point you in the right direction.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href="/services"
                        className="inline-flex items-center gap-2 bg-fg-blue text-white px-6 py-3 rounded-full font-bold hover:bg-fg-navy transition-colors text-sm"
                      >
                        Search Resources
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <Link
                        href="/resources"
                        className="inline-flex items-center gap-2 border-2 border-fg-navy/10 text-fg-navy px-6 py-3 rounded-full font-bold hover:border-fg-blue/30 transition-colors text-sm"
                      >
                        Resource Support
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    image: '/images/support-request-preview.svg',
                    title: 'Submit a Support Request',
                    desc: 'Need help navigating resources? Submit a request through our community and our team will help connect you to the right programs and opportunities.'
                  },
                  {
                    image: '/images/community-belonging-preview.svg',
                    title: 'Community & Belonging',
                    desc: 'Join a nationwide community of current and former foster youth. Connect with others who understand your experience and build lasting relationships.'
                  }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-fg-navy/5 hover:shadow-md hover:border-fg-blue/30 transition-all duration-300"
                  >
                    <div className="h-44 relative">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                    <div className="p-8">
                      <h3 className="text-2xl font-bold text-fg-navy mb-4">{item.title}</h3>
                      <p className="text-fg-navy/70 mb-4 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Impact Stats - Interactive */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="py-20 bg-gradient-to-br from-fg-navy via-fg-blue to-fg-navy text-white relative overflow-hidden"
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-20">
            <motion.div
              className="absolute top-10 left-[10%] w-32 h-32 bg-fg-yellow rounded-full blur-3xl"
              animate={{ y: [0, 20, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-10 right-[15%] w-48 h-48 bg-fg-teal rounded-full blur-3xl"
              animate={{ y: [0, -30, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
              animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto">
              <Link href="/impact" className="block group">
                <motion.h3
                  variants={itemVariants}
                  className="text-center text-lg font-semibold text-white/70 uppercase tracking-wider mb-10 group-hover:text-white transition-colors"
                >
                  Our Growing Impact
                  <ArrowRight className="inline-block w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.h3>
              </Link>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {[
                  { number: '310', label: 'Event Attendees', icon: '👥' },
                  { number: '16', label: 'Panels & Workshops', icon: '🎉' },
                  { number: '77', label: 'Wishes Granted', icon: '🎁' },
                  { number: '2,000+', label: 'Community Members', icon: '💝' }
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="relative group cursor-default"
                  >
                    <motion.div
                      className="absolute inset-0 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="relative p-4">
                      <div className="text-3xl mb-2">{stat.icon}</div>
                      <motion.div
                        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2 text-fg-yellow"
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                      >
                        {stat.number}
                      </motion.div>
                      <div className="text-sm md:text-base opacity-90 font-medium">{stat.label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.div variants={itemVariants} className="text-center mt-10">
                <Link
                  href="/impact"
                  className="inline-flex items-center gap-2 text-white/80 hover:text-white font-semibold transition-colors"
                >
                  View Full Impact Report
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Partners - Auto-scrolling Carousel */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="py-16 md:py-20 overflow-hidden"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <motion.div variants={itemVariants} className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-fg-navy mb-4">Our Partners</h2>
                <p className="text-lg text-fg-navy/60">Organizations making our mission possible</p>
              </motion.div>

              {/* Infinite Scrolling Carousel */}
              <div className="relative">
                {/* Gradient overlays */}
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#fafbfc] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#fafbfc] to-transparent z-10 pointer-events-none" />

                <motion.div
                  className="flex gap-8"
                  animate={{ x: [0, -1800] }}
                  transition={{
                    x: {
                      repeat: Infinity,
                      repeatType: "loop",
                      duration: 30,
                      ease: "linear",
                    },
                  }}
                >
                  {/* Double the logos for seamless loop */}
                  {[...Array(2)].map((_, setIndex) => (
                    <div key={setIndex} className="flex gap-8 flex-shrink-0">
                      {[
                        { id: 'smg', image: '/images/partners/smg.png', alt: 'Staffmark Group' },
                        { id: 'eatwell', image: '/images/partners/eatwell.png', alt: 'EatWell' },
                        { id: 'firststar', image: '/images/partners/firststar.png', alt: 'First Star' },
                        { id: 'lotus', image: '/images/partners/lotus-grove.png', alt: 'Lotus Grove Counseling' },
                        { id: 'ahw', image: '/images/partners/a-home-within.png', alt: 'A Home Within' },
                        { id: 'yvr', image: '/images/partners/youth-voices-rising.png', alt: 'Youth Voices Rising' },
                        { id: 'cetera', image: '/images/partners/cetera.png', alt: 'Cetera' },
                        { id: 'str8up', image: '/images/partners/str8up.png', alt: 'Str8Up Employment Services' },
                        { id: 'nfyi', image: '/images/partners/nfyi.png', alt: 'National Foster Youth Institute' },
                      ].map((partner) => (
                        <div
                          key={`${setIndex}-${partner.id}`}
                          className="w-40 h-40 flex-shrink-0 bg-white rounded-2xl shadow-sm border border-fg-navy/5 flex items-center justify-center p-4 hover:shadow-md transition-shadow"
                        >
                          <Image
                            src={partner.image}
                            alt={partner.alt}
                            width={120}
                            height={120}
                            className="object-contain w-full h-full grayscale hover:grayscale-0 transition-all duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </motion.div>
              </div>

              <motion.div variants={itemVariants} className="text-center mt-10">
                <Link
                  href="/partnerships"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-fg-navy text-white font-semibold rounded-full hover:bg-fg-blue transition-colors shadow-lg shadow-fg-navy/20"
                >
                  View All Partners & Partnership Opportunities
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Team Section - Hidden for now */}

        {/* FAQ Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="py-16 md:py-20"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <motion.div variants={itemVariants}>
                <h2 className="text-3xl md:text-4xl font-bold text-fg-navy mb-10 text-center">
                  Frequently Asked Questions
                </h2>
              </motion.div>

              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    className="bg-white rounded-2xl shadow-sm border border-fg-navy/5 overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-fg-navy/[0.02] transition-colors"
                    >
                      <span className="font-bold text-fg-navy pr-4">{faq.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-fg-blue flex-shrink-0 transition-transform duration-200 ${
                          openFaq === i ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openFaq === i && (
                      <div className="px-6 pb-5 text-fg-navy/70 leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="py-16 md:py-20 relative overflow-hidden bg-gradient-to-br from-fg-navy via-fg-blue to-fg-navy text-white"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-fg-orange/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div variants={itemVariants} className="max-w-4xl mx-auto text-center">
              <div className="text-7xl mb-8">🌟</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Join Our Community?
              </h2>
              <p className="text-xl mb-10 opacity-90 leading-relaxed">
                Connect with 2,000+ current and former foster youth nationwide.
                Find belonging, support, and lifelong community.
              </p>
              <a
                href="https://community.fostergreatness.co"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white text-fg-navy px-8 py-4 rounded-full text-lg font-bold hover:bg-fg-yellow hover:text-fg-navy transition-all duration-300 shadow-2xl"
                aria-label="Join Foster Greatness Community"
              >
                Join Foster Greatness Community
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </a>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
