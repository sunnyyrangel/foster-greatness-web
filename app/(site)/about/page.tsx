'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';

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
      answer: "No. Foster Greatness serves current and former foster youth nationwide, regardless of which state you are in. We are an 18+ community with no upper age limit—support that lasts a lifetime."
    },
    {
      question: "Does it cost anything to join?",
      answer: "No! Joining our community is completely free. We believe support and belonging should be accessible to everyone."
    },
    {
      question: "Does Foster Greatness provide monetary support?",
      answer: "We connect members with resources including scholarships, wish granting through One Simple Wish, and access to various support programs. Our Resource Specialists can help you find the specific assistance you need."
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
                  href="#team"
                  className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors"
                >
                  Meet the Team
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.section>

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
                  { icon: '💬', title: 'Monthly Panel Discussions', desc: 'Lived experience leaders and advocates discuss policy and systemic change affecting our community.' },
                  { icon: '📚', title: 'Learning Workshops', desc: 'Experts with lived experience lead workshops on financial literacy, storytelling, trauma recovery, and more.' },
                  { icon: '🎉', title: 'Community Events', desc: 'Connect and have fun with others through cooking events, holiday contests, support spaces and more.' },
                  { icon: '🤝', title: 'Resource Support', desc: 'Get connected to local resources or personalized support you deserve.' }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-fg-navy/5 hover:shadow-md hover:border-fg-blue/30 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="text-5xl mb-4">{item.icon}</div>
                    <h3 className="text-xl font-bold text-fg-navy mb-3">{item.title}</h3>
                    <p className="text-fg-navy/60 leading-relaxed text-sm">{item.desc}</p>
                  </motion.div>
                ))}
              </div>

              {/* Community in Action */}
              <motion.div variants={itemVariants}>
                <h3 className="text-2xl md:text-3xl font-bold text-fg-navy mb-8 text-center">Our Community in Action</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { icon: '📢', title: 'Advocacy & Policy Work', desc: 'Monthly conversations with National Network for Sibling Connections to discuss foster care policies and sibling advocacy.' },
                    { icon: '🍳', title: 'Community Building Events', desc: "Quarterly events focused on connection through meals, open-mic nights, paint nights and more." },
                    { icon: '💙', title: 'Community Support Spaces', desc: 'Supportive environments for foster care alumni to connect, share, and find strength in community.' },
                    { icon: '🎓', title: 'Learning Workshops', desc: 'Expert-led workshops covering financial literacy to career development.' },
                    { icon: '🎤', title: 'Panel Discussions', desc: 'Lived experience leaders and advocates tackle important community issues.' },
                    { icon: '⭐', title: 'Storyteller Collective', desc: 'Our Storyteller Collective and "Thriver Stories" series provide platforms for foster care alumni to share their journeys.' }
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      variants={itemVariants}
                      className="bg-white rounded-2xl p-6 shadow-sm border border-fg-navy/5 hover:shadow-md transition-all duration-300"
                    >
                      <div className="text-4xl mb-3">{item.icon}</div>
                      <h4 className="text-lg font-bold text-fg-navy mb-2">{item.title}</h4>
                      <p className="text-sm text-fg-navy/60 leading-relaxed">{item.desc}</p>
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

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    icon: '🔍',
                    title: 'Local Resource Finder',
                    desc: 'Get connected to the support you deserve! Our Resource Hub is a free, one-stop tool for current and former foster youth to instantly find benefits and resources.',
                    tags: 'Housing • Food Security • Scholarships • Job Opportunities • Wish Granting • Basic Needs'
                  },
                  {
                    icon: '💝',
                    title: 'One-on-One Custom Support',
                    desc: 'Our Resource Specialists collaborate with you to understand your unique situation and identify tailored solutions, whether you are seeking scholarships, rent assistance, food aid, or other resources.'
                  },
                  {
                    icon: '🎁',
                    title: 'One Simple Wish Partnership',
                    desc: 'Foster Greatness proudly partners with One Simple Wish. Connect with our Resource Specialists to determine your eligibility to submit a wish.'
                  }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    className="bg-white rounded-2xl p-8 shadow-sm border border-fg-navy/5 hover:shadow-md hover:border-fg-blue/30 transition-all duration-300"
                  >
                    <div className="text-5xl mb-6">{item.icon}</div>
                    <h3 className="text-2xl font-bold text-fg-navy mb-4">{item.title}</h3>
                    <p className="text-fg-navy/70 mb-4 leading-relaxed">{item.desc}</p>
                    {item.tags && (
                      <p className="text-sm text-fg-blue font-semibold">{item.tags}</p>
                    )}
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
              <motion.h3
                variants={itemVariants}
                className="text-center text-lg font-semibold text-white/70 uppercase tracking-wider mb-10"
              >
                Our Growing Impact
              </motion.h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {[
                  { number: '2,000+', label: 'Community Members', icon: '👥' },
                  { number: '500+', label: 'Events Hosted', icon: '🎉' },
                  { number: '50+', label: 'Workshops', icon: '📚' },
                  { number: '$250K+', label: 'In Resources Connected', icon: '💝' }
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
            </div>
          </div>
        </motion.section>

        {/* Partners */}
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
                <h2 className="text-3xl md:text-4xl font-bold text-fg-navy mb-10 text-center">Our Partners</h2>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { name: 'One Simple Wish', desc: 'Direct connection to a wish-granting platform where foster youth can request gifts sponsored by donors.', logo: '/images/partners/osw.png', link: 'https://www.onesimplewish.org' },
                  { name: 'Cetera Financial Group', desc: 'Providing financial literacy workshops and guidance to help our community build strong financial futures.', logo: '/images/partners/cetera.png', link: 'https://www.cetera.com' },
                  { name: 'EatWell', desc: 'Healthy meal kits for community cooking sessions, bringing people together through shared meals.', logo: '/images/partners/eatwell.png', link: 'https://www.eatwell101.com' },
                  { name: 'StaffMark', desc: 'Equips foster youth with tools and resources for sustainable employment.', logo: '/images/partners/smg.png', link: 'https://www.staffmark.com' }
                ].map((partner, i) => (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-fg-navy/5 hover:shadow-md hover:border-fg-blue/30 transition-all duration-300 hover:-translate-y-1 group"
                  >
                    <div className="aspect-square mb-4 flex items-center justify-center p-4">
                      <Image
                        src={partner.logo}
                        alt={`${partner.name} logo`}
                        width={180}
                        height={180}
                        className="object-contain w-full h-full"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-fg-navy mb-3">{partner.name}</h3>
                    <p className="text-sm text-fg-navy/60 leading-relaxed mb-4">{partner.desc}</p>
                    <a
                      href={partner.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-fg-blue hover:text-fg-navy transition-colors inline-flex items-center gap-1"
                    >
                      Learn More <ArrowRight className="w-3 h-3" />
                    </a>
                  </motion.div>
                ))}
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

        {/* Team Section */}
        <motion.section
          id="team"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="py-16 md:py-20 bg-fg-navy/[0.02] scroll-mt-24"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <motion.div variants={itemVariants}>
                <h2 className="text-3xl md:text-4xl font-bold text-fg-navy mb-10 text-center">Meet the Team</h2>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  { name: 'Isabel Stasa', role: 'Director of Community Affairs and Social Impact', bio: 'Lived experience in foster care; first-gen graduate with honors from The University of Michigan. Roles include Foster Youth Policy Consultant, Senate Intern, Public Speaker, and National FY Advocate.', img: '/images/team/isabel-stasa.webp' },
                  { name: 'Lillee Taylor', role: 'Resource Specialist', bio: 'Lived experience in foster care, worked with non-profits to empower vulnerable youth populations. Skilled and passionate about family reunification, reducing homelessness and supporting foster parents.', img: '/images/team/lillee-taylor.webp' },
                  { name: 'Sunny Rangel', role: 'Director of UX & Product Development', bio: "Background in Graphic Design, designed for Fortune 500s. Created structure and user experience for community.", img: '/images/team/sunny-rangel.webp' },
                  { name: 'Jordan Bartlett', role: 'Co-Founder of Foster Greatness', bio: 'Personal connection to foster care, passionate about systemic change. Manages teams, donor funding and outreach communications.', img: '/images/team/jordan-bartlett.webp' },
                  { name: 'Scott Henderson', role: 'Co-Founder of Foster Greatness', bio: 'Helps oversee projects, build partnerships, and guide the team. Dedicated to fostering a strong sense of belonging and community.', img: '/images/team/scott-henderson.webp' }
                ].map((member, i) => (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-fg-navy/5 hover:shadow-md hover:border-fg-blue/30 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative h-64 bg-gradient-to-br from-fg-navy to-fg-blue overflow-hidden">
                      <Image
                        src={member.img}
                        alt={`${member.name}, ${member.role}`}
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-fg-navy mb-2">{member.name}</h3>
                      <p className="text-sm font-semibold text-fg-blue mb-3">{member.role}</p>
                      <p className="text-sm text-fg-navy/60 leading-relaxed">{member.bio}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

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
