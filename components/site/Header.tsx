'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getNavCampaigns } from '@/data';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const navCampaigns = getNavCampaigns();

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveMenu(null);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenuClick = useCallback((menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  }, [activeMenu]);

  const closeMenus = useCallback(() => {
    setActiveMenu(null);
  }, []);

  const aboutLinks = [
    { label: 'Our Story', href: '/about', icon: '✦' },
    { label: 'Meet the Team', href: '/about#team', icon: '◎' },
    { label: 'Impact Report', href: '/impact', icon: '◈' },
    { label: 'Partnerships', href: '/partnerships', icon: '◇' },
  ];

  const communityLinks = [
    { label: 'Join Community', href: 'https://community.fostergreatness.co', external: true, highlight: true, icon: '★' },
    { label: 'Resource Support', href: '/resources', icon: '◆' },
    { label: 'Thriver Stories', href: '/thriver-stories', icon: '♡' },
    { label: 'Storyteller Collective', href: '/storytellers-collective', icon: '✧' },
    { label: 'Events', href: '/events', icon: '◉' },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700`}>
        {/* Floating nav container */}
        <div className={`mx-4 sm:mx-6 lg:mx-8 mt-4 transition-all duration-700 ${
          scrolled ? 'mt-2' : 'mt-4'
        }`}>
          <div className={`max-w-7xl mx-auto transition-all duration-700 ${
            scrolled
              ? 'bg-white/90 backdrop-blur-2xl shadow-[0_8px_60px_-12px_rgba(26,41,73,0.25),0_0_0_1px_rgba(26,41,73,0.05)] rounded-2xl'
              : 'bg-white shadow-[0_20px_80px_-20px_rgba(26,41,73,0.2),0_0_0_1px_rgba(26,41,73,0.03)] rounded-[28px]'
          }`}>

            {/* Gradient border effect */}
            <div className="absolute inset-0 rounded-[inherit] p-[2px] -z-10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-fg-orange via-fg-teal to-fg-blue opacity-60 blur-sm" />
            </div>

            <div className="px-5 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16 lg:h-[72px]">
                {/* Logo */}
                <Link href="/" className="relative group flex-shrink-0" onClick={closeMenus}>
                  <motion.div
                    className="relative h-9 w-32 sm:h-10 sm:w-36 lg:h-10 lg:w-40"
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Image
                      src="/images/foster-greatness-horizontal.svg"
                      alt="Foster Greatness"
                      fill
                      className="object-contain"
                      priority
                    />
                  </motion.div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-1">
                  {/* About */}
                  <div className="relative">
                    <motion.button
                      onClick={() => handleMenuClick('about')}
                      className={`relative px-4 py-2.5 text-[15px] font-medium rounded-xl transition-colors duration-200 ${
                        activeMenu === 'about'
                          ? 'text-fg-navy bg-fg-light-blue'
                          : 'text-gray-600 hover:text-fg-navy hover:bg-gray-50'
                      }`}
                      whileTap={{ scale: 0.97 }}
                    >
                      <span className="flex items-center gap-1.5">
                        About
                        <motion.svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          animate={{ rotate: activeMenu === 'about' ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </motion.svg>
                      </span>
                    </motion.button>

                    <AnimatePresence>
                      {activeMenu === 'about' && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                          className="absolute top-full left-0 pt-2 z-50"
                        >
                          <div className="bg-white rounded-2xl shadow-[0_30px_90px_-20px_rgba(26,41,73,0.3)] border border-gray-100/50 overflow-hidden min-w-[240px]">
                            {/* Decorative header */}
                            <div className="h-1.5 bg-gradient-to-r from-fg-orange via-fg-teal to-fg-blue" />
                            <div className="p-2">
                              {aboutLinks.map((link, i) => (
                                <motion.div
                                  key={link.href}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.05 }}
                                >
                                  <Link
                                    href={link.href}
                                    onClick={closeMenus}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-fg-light-blue hover:to-transparent transition-all group"
                                  >
                                    <span className="text-fg-teal text-sm opacity-60 group-hover:opacity-100 transition-opacity">{link.icon}</span>
                                    <span className="font-medium text-gray-700 group-hover:text-fg-navy transition-colors">{link.label}</span>
                                  </Link>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Community */}
                  <div className="relative">
                    <motion.button
                      onClick={() => handleMenuClick('community')}
                      className={`relative px-4 py-2.5 text-[15px] font-medium rounded-xl transition-colors duration-200 ${
                        activeMenu === 'community'
                          ? 'text-fg-navy bg-fg-light-blue'
                          : 'text-gray-600 hover:text-fg-navy hover:bg-gray-50'
                      }`}
                      whileTap={{ scale: 0.97 }}
                    >
                      <span className="flex items-center gap-1.5">
                        Community
                        <motion.svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          animate={{ rotate: activeMenu === 'community' ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </motion.svg>
                      </span>
                    </motion.button>

                    <AnimatePresence>
                      {activeMenu === 'community' && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                          className="absolute top-full left-0 pt-2 z-50"
                        >
                          <div className="bg-white rounded-2xl shadow-[0_30px_90px_-20px_rgba(26,41,73,0.3)] border border-gray-100/50 overflow-hidden min-w-[280px]">
                            <div className="h-1.5 bg-gradient-to-r from-fg-blue via-fg-teal to-fg-orange" />
                            <div className="p-2">
                              {communityLinks.map((link, i) => (
                                <motion.div
                                  key={link.href}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.05 }}
                                >
                                  {link.external ? (
                                    <a
                                      href={link.href}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={closeMenus}
                                      className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all group ${
                                        link.highlight
                                          ? 'bg-gradient-to-r from-fg-navy via-fg-blue to-fg-navy bg-[length:200%_100%] text-white hover:bg-right'
                                          : 'hover:bg-gradient-to-r hover:from-fg-light-blue hover:to-transparent'
                                      }`}
                                      style={link.highlight ? { backgroundPosition: 'left' } : undefined}
                                    >
                                      <span className="flex items-center gap-3">
                                        <span className={`text-sm ${link.highlight ? 'text-white/80' : 'text-fg-teal opacity-60 group-hover:opacity-100'} transition-opacity`}>{link.icon}</span>
                                        <span className={`font-medium ${link.highlight ? 'text-white' : 'text-gray-700 group-hover:text-fg-navy'} transition-colors`}>{link.label}</span>
                                      </span>
                                      <svg className={`w-4 h-4 ${link.highlight ? 'text-white/60' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                      </svg>
                                    </a>
                                  ) : (
                                    <Link
                                      href={link.href}
                                      onClick={closeMenus}
                                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-fg-light-blue hover:to-transparent transition-all group"
                                    >
                                      <span className="text-fg-teal text-sm opacity-60 group-hover:opacity-100 transition-opacity">{link.icon}</span>
                                      <span className="font-medium text-gray-700 group-hover:text-fg-navy transition-colors">{link.label}</span>
                                    </Link>
                                  )}
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Give */}
                  <div className="relative">
                    <motion.button
                      onClick={() => handleMenuClick('give')}
                      className={`relative px-4 py-2.5 text-[15px] font-medium rounded-xl transition-colors duration-200 ${
                        activeMenu === 'give'
                          ? 'text-fg-navy bg-fg-light-blue'
                          : 'text-gray-600 hover:text-fg-navy hover:bg-gray-50'
                      }`}
                      whileTap={{ scale: 0.97 }}
                    >
                      <span className="flex items-center gap-1.5">
                        Give
                        <motion.svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          animate={{ rotate: activeMenu === 'give' ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </motion.svg>
                      </span>
                    </motion.button>

                    <AnimatePresence>
                      {activeMenu === 'give' && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                          className="absolute top-full right-0 pt-2 z-50"
                        >
                          <div className="bg-white rounded-2xl shadow-[0_30px_90px_-20px_rgba(26,41,73,0.3)] border border-gray-100/50 overflow-hidden min-w-[300px]">
                            <div className="h-1.5 bg-gradient-to-r from-fg-yellow via-fg-orange to-fg-orange" />
                            <div className="p-2">
                              <div className="px-4 py-2 flex items-center gap-2">
                                <div className="h-px flex-1 bg-gradient-to-r from-fg-orange/30 to-transparent" />
                                <span className="text-[11px] font-bold text-fg-orange uppercase tracking-widest">Campaigns</span>
                                <div className="h-px flex-1 bg-gradient-to-l from-fg-orange/30 to-transparent" />
                              </div>
                              {navCampaigns.map((campaign, i) => (
                                <motion.div
                                  key={campaign.id}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.05 }}
                                >
                                  <Link
                                    href={`/${campaign.slug}`}
                                    onClick={closeMenus}
                                    className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-fg-light-blue hover:to-transparent transition-all group"
                                  >
                                    <span className="text-2xl group-hover:scale-110 transition-transform">{campaign.icon}</span>
                                    <div className="flex flex-col">
                                      <span className="font-semibold text-gray-800 group-hover:text-fg-navy transition-colors">{campaign.shortTitle}</span>
                                      <span className="text-xs text-gray-500 line-clamp-1">{campaign.description}</span>
                                    </div>
                                  </Link>
                                </motion.div>
                              ))}

                              <div className="my-2 mx-3 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                              <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.15 }}
                              >
                                <Link
                                  href="/donate"
                                  onClick={closeMenus}
                                  className="flex items-center gap-4 px-4 py-3 rounded-xl bg-gradient-to-r from-fg-orange/10 to-transparent hover:from-fg-orange/20 transition-all group"
                                >
                                  <span className="text-2xl">💝</span>
                                  <span className="font-semibold text-fg-orange group-hover:text-fg-orange transition-colors">Make a Donation</span>
                                </Link>
                              </motion.div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Contact */}
                  <Link
                    href="/contact"
                    onClick={closeMenus}
                    className="px-4 py-2.5 text-[15px] font-medium text-gray-600 hover:text-fg-navy hover:bg-gray-50 rounded-xl transition-all"
                  >
                    Contact
                  </Link>

                  {/* Divider */}
                  <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-200 to-transparent mx-2" />

                  {/* Donate CTA */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      href="/donate"
                      onClick={closeMenus}
                      className="group relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-[15px] text-white overflow-hidden"
                    >
                      {/* Animated gradient background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-fg-orange via-[#ff6b35] to-fg-orange bg-[length:200%_100%] animate-gradient-x" />

                      {/* Shimmer effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      </div>

                      <span className="relative z-10">Donate</span>
                      <motion.span
                        className="relative z-10"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        ♥
                      </motion.span>
                    </Link>
                  </motion.div>
                </nav>

                {/* Mobile */}
                <div className="flex items-center gap-3 lg:hidden">
                  <Link
                    href="/donate"
                    className="px-4 py-2 bg-gradient-to-r from-fg-orange to-[#ff6b35] text-white text-sm font-semibold rounded-lg"
                  >
                    Donate ♥
                  </Link>

                  <motion.button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                    whileTap={{ scale: 0.95 }}
                    aria-label="Toggle menu"
                  >
                    <div className="w-5 h-4 flex flex-col justify-between">
                      <motion.span
                        className="block h-0.5 bg-fg-navy rounded-full origin-center"
                        animate={isMobileMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                        transition={{ duration: 0.2 }}
                      />
                      <motion.span
                        className="block h-0.5 bg-fg-navy rounded-full"
                        animate={isMobileMenuOpen ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                      <motion.span
                        className="block h-0.5 bg-fg-navy rounded-full origin-center"
                        animate={isMobileMenuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Click outside */}
        {activeMenu && (
          <div className="fixed inset-0 z-[-1]" onClick={closeMenus} />
        )}
      </header>

      {/* Spacer */}
      <div className="h-24 lg:h-28" />

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-fg-navy/40 backdrop-blur-md lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="fixed top-24 left-4 right-4 z-50 lg:hidden"
            >
              <div className="bg-white rounded-2xl shadow-[0_30px_90px_-15px_rgba(26,41,73,0.35)] border border-gray-100 overflow-hidden max-h-[calc(100vh-120px)] overflow-y-auto">
                {/* Decorative header */}
                <div className="h-1.5 bg-gradient-to-r from-fg-orange via-fg-teal to-fg-blue" />

                <div className="p-4 space-y-4">
                  {/* About */}
                  <div>
                    <div className="flex items-center gap-2 px-2 mb-2">
                      <span className="text-fg-teal text-xs">✦</span>
                      <span className="text-[11px] font-bold text-fg-navy/50 uppercase tracking-widest">About</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {aboutLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="px-4 py-3 bg-gray-50 hover:bg-fg-light-blue rounded-xl text-fg-navy font-medium text-sm transition-colors flex items-center gap-2"
                        >
                          <span className="text-fg-teal/60 text-xs">{link.icon}</span>
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                  {/* Community */}
                  <div>
                    <div className="flex items-center gap-2 px-2 mb-2">
                      <span className="text-fg-blue text-xs">◎</span>
                      <span className="text-[11px] font-bold text-fg-navy/50 uppercase tracking-widest">Community</span>
                    </div>
                    <div className="space-y-2">
                      {communityLinks.map((link) => (
                        link.external ? (
                          <a
                            key={link.href}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                              link.highlight
                                ? 'bg-gradient-to-r from-fg-navy to-fg-blue text-white'
                                : 'bg-gray-50 hover:bg-fg-light-blue text-fg-navy'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span className={`text-xs ${link.highlight ? 'text-white/60' : 'text-fg-teal/60'}`}>{link.icon}</span>
                              {link.label}
                            </span>
                            <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        ) : (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="flex items-center gap-2 px-4 py-3 bg-gray-50 hover:bg-fg-light-blue rounded-xl text-fg-navy font-medium text-sm transition-colors"
                          >
                            <span className="text-fg-teal/60 text-xs">{link.icon}</span>
                            {link.label}
                          </Link>
                        )
                      ))}
                    </div>
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                  {/* Give */}
                  <div>
                    <div className="flex items-center gap-2 px-2 mb-2">
                      <span className="text-fg-orange text-xs">♡</span>
                      <span className="text-[11px] font-bold text-fg-navy/50 uppercase tracking-widest">Give</span>
                    </div>
                    <div className="space-y-2">
                      {navCampaigns.map((campaign) => (
                        <Link
                          key={campaign.id}
                          href={`/${campaign.slug}`}
                          className="flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-fg-light-blue rounded-xl text-fg-navy font-medium text-sm transition-colors"
                        >
                          <span className="text-xl">{campaign.icon}</span>
                          {campaign.shortTitle}
                        </Link>
                      ))}
                      <Link
                        href="/donate"
                        className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-fg-orange/10 to-fg-yellow/10 hover:from-fg-orange/20 hover:to-fg-yellow/20 rounded-xl text-fg-orange font-semibold text-sm transition-colors"
                      >
                        <span className="text-xl">💝</span>
                        Make a Donation
                      </Link>
                    </div>
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                  {/* Contact */}
                  <Link
                    href="/contact"
                    className="flex items-center gap-2 px-4 py-3 bg-gray-50 hover:bg-fg-light-blue rounded-xl text-fg-navy font-medium text-sm transition-colors"
                  >
                    <span className="text-fg-teal/60 text-xs">◈</span>
                    Contact Us
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </>
  );
}
