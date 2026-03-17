'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink, Shield, FileText, Users, Building2 } from 'lucide-react';

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

const recommendations = [
  {
    number: 1,
    title: 'Support and Develop Trusted Sources of Information and Resource Navigators',
    summary: 'Build on existing trusted platforms developed in close collaboration with young people and community members, rather than starting from scratch.',
  },
  {
    number: 2,
    title: 'Ensure Users Can Connect with Live Support',
    summary: 'Integrate the platform with existing live supports and networks — the connection to a real person has been key to building trust with users.',
  },
  {
    number: 3,
    title: 'Remove Barriers to Technological Access',
    summary: 'Address internet access, device ownership, and digital skills barriers that disproportionately affect foster youth.',
  },
  {
    number: 4,
    title: 'Protect User Data, Including HIPAA Compliance',
    summary: 'Allow platform use without storing personal information without informed consent. Protect against identity theft and data sharing.',
  },
  {
    number: 5,
    title: 'Cover Transportation, Financial Security, and Life Skills',
    summary: 'Expand beyond housing, education, and healthcare to include transportation, financial security, and life skills building.',
  },
  {
    number: 6,
    title: 'Play to the Strengths of the Federal Government',
    summary: 'Include critical federal program information like Independent Living coordinators, housing voucher contacts, and Foster Youth Bill of Rights.',
  },
  {
    number: 7,
    title: 'Prioritize Access for Youth with Diverse Experiences and Abilities',
    summary: 'Build a platform accessible for young people with disabilities, rural/urban differences, limited broadband, and developmental differences.',
  },
  {
    number: 8,
    title: 'Test with Intended Users and Develop Feedback Loops',
    summary: 'Test the platform with an array of potential users and develop ongoing feedback mechanisms including external evaluations.',
  },
];

const coalitionOrgs = [
  { name: 'Foster Greatness', highlighted: true },
  { name: 'iFoster' },
  { name: 'FosterClub' },
  { name: 'Think of Us' },
  { name: 'MIT Media Lab' },
];

export default function FederalRecommendationPage() {
  return (
    <div className="min-h-screen bg-[#fafbfc] relative">
      {/* Subtle texture */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
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
              <div className="inline-flex items-center gap-2 mb-8 px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-semibold tracking-wide uppercase text-white/90">Federal Recognition</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 leading-tight">
                Recommended as a{' '}
                <span className="text-fg-yellow">Trusted Platform</span>{' '}
                by National Lived Experience Experts
              </h1>

              <div className="w-16 h-1 bg-fg-yellow mx-auto mb-8 rounded-full" />

              <p className="text-lg md:text-xl opacity-90 leading-relaxed max-w-3xl mx-auto">
                A coalition of leading foster care organizations recommended Foster Greatness to federal leadership as a trusted source of information and resource navigation for youth in and leaving foster care.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Context Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="py-16 md:py-20"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div variants={itemVariants} className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-fg-navy mb-4">The Context</h2>
                <p className="text-fg-navy/60 max-w-3xl mx-auto">
                  Understanding the federal initiative that prompted this recommendation
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-6">
                <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm border border-fg-navy/5">
                  <div className="w-12 h-12 rounded-lg bg-fg-blue/10 flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-fg-blue" />
                  </div>
                  <h3 className="text-lg font-bold text-fg-navy mb-3">The Executive Order</h3>
                  <p className="text-sm text-fg-navy/70 leading-relaxed mb-4">
                    In November 2025, the White House issued{' '}
                    <span className="font-semibold text-fg-navy">"Fostering the Future for American Children and Families"</span>,
                    charging federal agencies to develop technology solutions to better support youth in and leaving foster care.
                  </p>
                  <a
                    href="https://www.whitehouse.gov/presidential-actions/2025/11/fostering-the-future-for-american-children-and-families/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-fg-blue hover:text-fg-navy transition-colors"
                  >
                    Read the Executive Order
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm border border-fg-navy/5">
                  <div className="w-12 h-12 rounded-lg bg-fg-blue/10 flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-fg-blue" />
                  </div>
                  <h3 className="text-lg font-bold text-fg-navy mb-3">The Coalition</h3>
                  <p className="text-sm text-fg-navy/70 leading-relaxed mb-4">
                    Leading organizations with expertise in federal and state policy, direct service, program implementation, and{' '}
                    <span className="font-semibold text-fg-navy">lived experience</span>{' '}
                    convened to provide implementation recommendations to the Administration for Children and Families (ACF) and the National Design Studio.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {coalitionOrgs.map((org) => (
                      <span
                        key={org.name}
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          org.highlighted
                            ? 'bg-fg-blue text-white'
                            : 'bg-fg-navy/5 text-fg-navy/70'
                        }`}
                      >
                        {org.name}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Foster Greatness Highlight */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="py-12 md:py-16"
        >
          <div className="container mx-auto px-4">
            <motion.div
              variants={itemVariants}
              className="max-w-4xl mx-auto bg-gradient-to-br from-fg-navy to-fg-blue rounded-3xl p-8 md:p-12 text-white"
            >
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-8 h-8 text-fg-yellow" />
                <h2 className="text-2xl md:text-3xl font-bold">What They Said About Foster Greatness</h2>
              </div>
              <blockquote className="text-lg md:text-xl leading-relaxed text-white/90 mb-8 border-l-4 border-fg-yellow pl-6">
                "This digital platform provides former and current foster youth and their supporters discovery technology for more than 500,000+ resources across the U.S. and provides access to free 1 on 1 peer-coaching resource navigation to former foster youth using the community. The national resource hub also includes a HIPAA compliant Benefits Screener that allows members to discover every federal and state specific public benefit they qualify for within minutes and includes direct links to benefit applications. The community includes private job boards, a nationwide community co-created scholarship board, advocacy opportunity hub, and more resources. The digital platform is developed, designed, and managed by current and former foster youth."
              </blockquote>
              <p className="text-sm text-white/70 font-medium">
                — From the coalition memo to the Administration for Children and Families, February 2026
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* 8 Recommendations */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="py-16 md:py-20 bg-fg-navy/[0.02]"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div variants={itemVariants} className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-fg-navy mb-4">
                  8 Recommendations to Federal Leadership
                </h2>
                <p className="text-fg-navy/60 max-w-2xl mx-auto">
                  The coalition offered these recommendations to support and maximize the success of tech-leveraged solutions for foster youth.
                </p>
              </motion.div>

              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <motion.div
                    key={rec.number}
                    variants={itemVariants}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-fg-navy/5 hover:shadow-md hover:border-fg-blue/30 transition-all"
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-fg-blue/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-fg-blue">{rec.number}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-fg-navy mb-2">{rec.title}</h3>
                        <p className="text-sm text-fg-navy/70 leading-relaxed">{rec.summary}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Coalition Partners */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="py-16 md:py-20"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div variants={itemVariants} className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-fg-navy mb-4">
                  Trusted Sources Named in the Memo
                </h2>
                <p className="text-fg-navy/60 max-w-2xl mx-auto">
                  These organizations were highlighted as examples of trusted platforms and resource navigators currently serving foster youth.
                </p>
              </motion.div>

              <div className="grid sm:grid-cols-2 gap-6">
                <motion.div
                  variants={itemVariants}
                  className="bg-white rounded-2xl p-6 shadow-sm border-2 border-fg-blue/30 relative"
                >
                  <div className="absolute -top-3 left-6">
                    <span className="text-xs font-bold px-3 py-1 bg-fg-blue text-white rounded-full">That&apos;s Us</span>
                  </div>
                  <h3 className="text-lg font-bold text-fg-navy mb-2 mt-1">Foster Greatness Digital Community</h3>
                  <p className="text-sm text-fg-navy/70 leading-relaxed">
                    Digital platform providing 500,000+ resources, free 1-on-1 peer-coaching navigation, HIPAA-compliant benefits screener, job boards, scholarship board, and advocacy hub — developed, designed, and managed by current and former foster youth.
                  </p>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm border border-fg-navy/5">
                  <h3 className="text-lg font-bold text-fg-navy mb-2">iFoster</h3>
                  <p className="text-sm text-fg-navy/70 leading-relaxed">
                    Largest community network in child welfare with 100,000+ active members, HIPAA-compliant AI agents, and Medicaid-certified Peer Support Specialists.
                  </p>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm border border-fg-navy/5">
                  <h3 className="text-lg font-bold text-fg-navy mb-2">FosterClub</h3>
                  <p className="text-sm text-fg-navy/70 leading-relaxed">
                    National network for young people in foster care with HelpHub resource database, Peer Navigators, and comprehensive transition planning tools.
                  </p>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm border border-fg-navy/5">
                  <h3 className="text-lg font-bold text-fg-navy mb-2">Think of Us</h3>
                  <p className="text-sm text-fg-navy/70 leading-relaxed">
                    Virtual Support Services connecting youth and families to resources through tech-enabled strategies, currently operating in California, Georgia, and Greater Boston.
                  </p>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm border border-fg-navy/5 sm:col-span-2">
                  <h3 className="text-lg font-bold text-fg-navy mb-2">MIT Media Lab</h3>
                  <p className="text-sm text-fg-navy/70 leading-relaxed">
                    Research projects developed with foster youth including digital wallets for vital documents, safe transportation platforms, social connection through gaming, goal-planning apps, and youth-caregiver matching.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="py-16 md:py-20"
        >
          <div className="container mx-auto px-4">
            <motion.div variants={itemVariants} className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-fg-navy mb-4">
                Join Our Mission
              </h2>
              <p className="text-fg-navy/60 mb-8 max-w-xl mx-auto">
                Whether you're a foster youth seeking support, an organization looking to partner, or someone who wants to make a difference — there's a place for you.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="https://community.fostergreatness.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-fg-navy text-white font-semibold rounded-full hover:bg-fg-blue transition-colors shadow-lg shadow-fg-navy/20"
                >
                  Join the Community
                  <ArrowRight className="w-4 h-4" />
                </a>
                <Link
                  href="/partnerships"
                  className="inline-flex items-center gap-2 px-8 py-4 text-fg-navy font-semibold hover:text-fg-blue transition-colors border-2 border-fg-navy/10 rounded-full hover:border-fg-blue/30"
                >
                  Partner With Us
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
