'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
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

  // Navigation structure
  const aboutLinks = [
    { label: 'Our Story', href: '/about', desc: 'How lived experience drives our mission' },
    { label: 'Impact Report', href: '/impact', desc: 'The difference we make together' },
    { label: 'Partnerships', href: '/partnerships', desc: 'Organizations building community' },
  ];

  const communityLinks = [
    { label: 'Join Community', href: 'https://community.fostergreatness.co', external: true, desc: 'Connect with 2,000+ members', highlight: true },
    { label: 'Resource Support', href: '/resources', desc: 'Get personalized help' },
    { label: 'Thriver Stories', href: '/thriver-stories', desc: 'Voices of resilience' },
    { label: 'Storyteller Collective', href: '/storytellers-collective', desc: 'Share your story' },
    { label: 'Events', href: '/events', desc: 'Gatherings & celebrations' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-[0_4px_30px_rgba(26,41,73,0.08)]'
            : 'bg-white'
        }`}
      >
        {/* Decorative top accent line */}
        <div className="h-1 bg-gradient-to-r from-fg-orange via-fg-teal to-fg-blue" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-18 lg:h-20">
            {/* Logo with hover glow */}
            <Link
              href="/"
              className="relative group flex-shrink-0"
              onClick={closeMenus}
            >
              <div className="absolute -inset-3 bg-gradient-to-r from-fg-orange/20 via-fg-teal/20 to-fg-blue/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
              <div className="relative h-10 w-36 sm:h-11 sm:w-40 lg:h-12 lg:w-48">
                <Image
                  src="/images/foster-greatness-horizontal.svg"
                  alt="Foster Greatness"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {/* About */}
              <div className="relative">
                <button
                  onClick={() => handleMenuClick('about')}
                  className={`group relative px-5 py-3 font-medium text-[15px] transition-colors duration-300 ${
                    activeMenu === 'about' ? 'text-fg-navy' : 'text-gray-600 hover:text-fg-navy'
                  }`}
                >
                  <span className="relative z-10">About</span>
                  <svg
                    className={`inline-block ml-1.5 w-3.5 h-3.5 transition-transform duration-300 ${activeMenu === 'about' ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                  {/* Hover pill background */}
                  <span className="absolute inset-0 rounded-full bg-fg-light-blue scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300" />
                </button>

                {/* About Dropdown */}
                {activeMenu === 'about' && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 animate-dropIn">
                    <div className="relative bg-white rounded-2xl shadow-[0_20px_60px_rgba(26,41,73,0.15)] border border-gray-100/80 p-2 min-w-[280px]">
                      {/* Dropdown arrow */}
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-100/80" />

                      <div className="relative">
                        {aboutLinks.map((link, i) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={closeMenus}
                            className="group flex flex-col px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-fg-light-blue hover:to-white transition-all duration-300"
                            style={{ animationDelay: `${i * 50}ms` }}
                          >
                            <span className="font-semibold text-fg-navy group-hover:text-fg-blue transition-colors">
                              {link.label}
                            </span>
                            <span className="text-sm text-gray-500 mt-0.5">{link.desc}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Community */}
              <div className="relative">
                <button
                  onClick={() => handleMenuClick('community')}
                  className={`group relative px-5 py-3 font-medium text-[15px] transition-colors duration-300 ${
                    activeMenu === 'community' ? 'text-fg-navy' : 'text-gray-600 hover:text-fg-navy'
                  }`}
                >
                  <span className="relative z-10">Community</span>
                  <svg
                    className={`inline-block ml-1.5 w-3.5 h-3.5 transition-transform duration-300 ${activeMenu === 'community' ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                  <span className="absolute inset-0 rounded-full bg-fg-light-blue scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300" />
                </button>

                {/* Community Dropdown */}
                {activeMenu === 'community' && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 animate-dropIn">
                    <div className="relative bg-white rounded-2xl shadow-[0_20px_60px_rgba(26,41,73,0.15)] border border-gray-100/80 p-2 min-w-[300px]">
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-100/80" />

                      <div className="relative">
                        {communityLinks.map((link, i) => (
                          link.external ? (
                            <a
                              key={link.href}
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={closeMenus}
                              className={`group flex items-start justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                                link.highlight
                                  ? 'bg-gradient-to-r from-fg-navy to-fg-blue text-white mb-2'
                                  : 'hover:bg-gradient-to-r hover:from-fg-light-blue hover:to-white'
                              }`}
                              style={{ animationDelay: `${i * 50}ms` }}
                            >
                              <div className="flex flex-col">
                                <span className={`font-semibold ${link.highlight ? 'text-white' : 'text-fg-navy group-hover:text-fg-blue'} transition-colors`}>
                                  {link.label}
                                </span>
                                <span className={`text-sm mt-0.5 ${link.highlight ? 'text-white/80' : 'text-gray-500'}`}>
                                  {link.desc}
                                </span>
                              </div>
                              <svg className={`w-4 h-4 mt-1 flex-shrink-0 ${link.highlight ? 'text-white/70' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          ) : (
                            <Link
                              key={link.href}
                              href={link.href}
                              onClick={closeMenus}
                              className="group flex flex-col px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-fg-light-blue hover:to-white transition-all duration-300"
                              style={{ animationDelay: `${i * 50}ms` }}
                            >
                              <span className="font-semibold text-fg-navy group-hover:text-fg-blue transition-colors">
                                {link.label}
                              </span>
                              <span className="text-sm text-gray-500 mt-0.5">{link.desc}</span>
                            </Link>
                          )
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Campaigns */}
              <div className="relative">
                <button
                  onClick={() => handleMenuClick('campaigns')}
                  className={`group relative px-5 py-3 font-medium text-[15px] transition-colors duration-300 ${
                    activeMenu === 'campaigns' ? 'text-fg-navy' : 'text-gray-600 hover:text-fg-navy'
                  }`}
                >
                  <span className="relative z-10">Give</span>
                  <svg
                    className={`inline-block ml-1.5 w-3.5 h-3.5 transition-transform duration-300 ${activeMenu === 'campaigns' ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                  <span className="absolute inset-0 rounded-full bg-fg-light-blue scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300" />
                </button>

                {/* Campaigns Dropdown */}
                {activeMenu === 'campaigns' && (
                  <div className="absolute top-full right-0 pt-3 animate-dropIn">
                    <div className="relative bg-white rounded-2xl shadow-[0_20px_60px_rgba(26,41,73,0.15)] border border-gray-100/80 p-2 min-w-[320px]">
                      <div className="absolute -top-2 right-8 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-100/80" />

                      <div className="relative">
                        {/* Active Campaigns */}
                        <div className="px-3 py-2">
                          <span className="text-xs font-bold text-fg-orange uppercase tracking-wider">Active Campaigns</span>
                        </div>
                        {navCampaigns.map((campaign, i) => (
                          <Link
                            key={campaign.id}
                            href={`/${campaign.slug}`}
                            onClick={closeMenus}
                            className="group flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-fg-light-blue hover:to-white transition-all duration-300"
                            style={{ animationDelay: `${i * 50}ms` }}
                          >
                            <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{campaign.icon}</span>
                            <div className="flex flex-col">
                              <span className="font-semibold text-fg-navy group-hover:text-fg-blue transition-colors">
                                {campaign.shortTitle}
                              </span>
                              <span className="text-sm text-gray-500 line-clamp-1">{campaign.description}</span>
                            </div>
                          </Link>
                        ))}

                        {/* Divider */}
                        <div className="my-2 mx-3 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                        {/* General Donation */}
                        <Link
                          href="/donate"
                          onClick={closeMenus}
                          className="group flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-fg-light-blue hover:to-white transition-all duration-300"
                        >
                          <span className="text-2xl">💝</span>
                          <div className="flex flex-col">
                            <span className="font-semibold text-fg-blue">Make a Donation</span>
                            <span className="text-sm text-gray-500">Support our mission</span>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact - Direct link */}
              <Link
                href="/contact"
                onClick={closeMenus}
                className="group relative px-5 py-3 font-medium text-[15px] text-gray-600 hover:text-fg-navy transition-colors duration-300"
              >
                <span className="relative z-10">Contact</span>
                <span className="absolute inset-0 rounded-full bg-fg-light-blue scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300" />
              </Link>
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* CTA Button with animated gradient */}
              <Link
                href="/donate"
                onClick={closeMenus}
                className="group relative px-6 py-2.5 lg:px-7 lg:py-3 rounded-full font-semibold text-sm lg:text-[15px] text-white overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,103,162,0.4)] hover:scale-[1.02]"
              >
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-fg-navy via-fg-blue to-fg-navy bg-[length:200%_100%] animate-shimmer" />
                <span className="relative z-10 flex items-center gap-2">
                  Donate
                  <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden relative w-11 h-11 flex items-center justify-center rounded-xl bg-fg-light-blue/50 hover:bg-fg-light-blue text-fg-navy transition-colors"
                aria-label="Toggle menu"
              >
                <div className="w-5 h-4 flex flex-col justify-between">
                  <span className={`block h-0.5 bg-current rounded-full transition-all duration-300 origin-center ${isMobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
                  <span className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 scale-0' : ''}`} />
                  <span className={`block h-0.5 bg-current rounded-full transition-all duration-300 origin-center ${isMobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Click outside to close */}
        {activeMenu && (
          <div
            className="fixed inset-0 z-[-1]"
            onClick={closeMenus}
          />
        )}
      </header>

      {/* Spacer for fixed header */}
      <div className="h-[calc(4px+4.5rem)] lg:h-[calc(4px+5rem)]" />

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-fg-navy/20 backdrop-blur-sm transition-opacity duration-500 ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={`absolute top-[calc(4px+4rem)] left-0 right-0 max-h-[calc(100vh-5rem)] overflow-y-auto bg-white shadow-2xl transition-all duration-500 ${
            isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
          }`}
        >
          <div className="p-6 space-y-6">
            {/* About Section */}
            <div>
              <h3 className="text-xs font-bold text-fg-orange uppercase tracking-wider mb-3">About</h3>
              <div className="space-y-1">
                {aboutLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-3 rounded-xl text-fg-navy font-medium hover:bg-fg-light-blue transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            {/* Community Section */}
            <div>
              <h3 className="text-xs font-bold text-fg-orange uppercase tracking-wider mb-3">Community</h3>
              <div className="space-y-1">
                {communityLinks.map((link) => (
                  link.external ? (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-colors ${
                        link.highlight
                          ? 'bg-gradient-to-r from-fg-navy to-fg-blue text-white'
                          : 'text-fg-navy hover:bg-fg-light-blue'
                      }`}
                    >
                      {link.label}
                      <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-3 rounded-xl text-fg-navy font-medium hover:bg-fg-light-blue transition-colors"
                    >
                      {link.label}
                    </Link>
                  )
                ))}
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            {/* Campaigns Section */}
            <div>
              <h3 className="text-xs font-bold text-fg-orange uppercase tracking-wider mb-3">Give</h3>
              <div className="space-y-1">
                {navCampaigns.map((campaign) => (
                  <Link
                    key={campaign.id}
                    href={`/${campaign.slug}`}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-fg-navy font-medium hover:bg-fg-light-blue transition-colors"
                  >
                    <span className="text-xl">{campaign.icon}</span>
                    {campaign.shortTitle}
                  </Link>
                ))}
                <Link
                  href="/donate"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-fg-blue font-semibold hover:bg-fg-light-blue transition-colors"
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
              className="block px-4 py-3 rounded-xl text-fg-navy font-medium hover:bg-fg-light-blue transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes dropIn {
          from {
            opacity: 0;
            transform: translateY(-8px) translateX(-50%);
          }
          to {
            opacity: 1;
            transform: translateY(0) translateX(-50%);
          }
        }

        @keyframes shimmer {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }

        .animate-dropIn {
          animation: dropIn 0.25s ease-out forwards;
        }

        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }

        .h-18 {
          height: 4.5rem;
        }
      `}</style>
    </>
  );
}
