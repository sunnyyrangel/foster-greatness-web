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
    { label: 'Our Story', href: '/about' },
    { label: 'Meet the Team', href: '/about#team' },
    { label: 'Impact Report', href: '/impact' },
    { label: 'Partnerships', href: '/partnerships' },
  ];

  // Community dropdown - split into two columns
  const communityJoin = {
    title: 'Join the Community',
    description: 'Connect with 2,000+ current and former foster youth nationwide',
    href: 'https://community.fostergreatness.co',
    cta: 'Join Now',
  };

  const communityLinks = [
    { label: 'Resource Support', href: '/resources', description: 'Get the support you need' },
    { label: 'Thriver Stories', href: '/thriver-stories', description: 'Stories of resilience' },
    { label: 'Storytellers Collective', href: '/storytellers-collective', description: 'Share your voice' },
    { label: 'Events', href: '/events', description: 'Upcoming gatherings' },
  ];

  // Give dropdown - split into two columns
  const giveDonate = {
    title: 'Make a Donation',
    description: 'Support our community with a one-time or recurring gift',
    href: '/donate',
    cta: 'Donate Now',
  };

  const giveLinks = [
    { label: 'Crisis Fund', href: '/donate', description: 'Emergency support for members', icon: '🆘' },
    ...navCampaigns.map(c => ({ label: c.shortTitle, href: `/${c.slug}`, description: c.tagline || 'Support this campaign', icon: c.icon })),
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled
            ? 'bg-white/98 backdrop-blur-xl shadow-[0_8px_40px_-12px_rgba(26,41,73,0.15)]'
            : 'bg-white'
        }`}
      >
        {/* Signature gradient bar - thicker, more presence */}
        <div className="h-1.5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-fg-orange via-fg-teal via-50% to-fg-blue" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="relative flex-shrink-0 group"
              onClick={closeMenus}
            >
              <div className="relative h-9 w-32 sm:h-10 sm:w-36 lg:h-11 lg:w-44">
                <Image
                  src="/images/foster-greatness-horizontal.svg"
                  alt="Foster Greatness"
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center">
              {/* Nav Items Container with subtle background */}
              <div className="flex items-center bg-gray-50/80 rounded-full px-2 py-1.5 border border-gray-100">
                {/* About */}
                <div className="relative">
                  <button
                    onClick={() => handleMenuClick('about')}
                    className={`relative px-4 py-2 text-[15px] font-medium rounded-full transition-all duration-300 ${
                      activeMenu === 'about'
                        ? 'bg-white text-fg-navy shadow-sm'
                        : 'text-gray-600 hover:text-fg-navy hover:bg-white/60'
                    }`}
                  >
                    About
                    <svg
                      className={`inline-block ml-1 w-3 h-3 transition-transform duration-300 ${activeMenu === 'about' ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* About Dropdown */}
                  {activeMenu === 'about' && (
                    <div className="absolute top-full left-0 pt-3 z-50">
                      <div className="bg-white rounded-2xl shadow-[0_25px_60px_-15px_rgba(26,41,73,0.25)] border border-gray-100 overflow-hidden min-w-[220px] animate-menuIn">
                        <div className="p-2">
                          {aboutLinks.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              onClick={closeMenus}
                              className="block px-4 py-2.5 text-[15px] text-gray-700 hover:text-fg-navy hover:bg-fg-light-blue/50 rounded-xl transition-colors font-medium"
                            >
                              {link.label}
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
                    className={`relative px-4 py-2 text-[15px] font-medium rounded-full transition-all duration-300 ${
                      activeMenu === 'community'
                        ? 'bg-white text-fg-navy shadow-sm'
                        : 'text-gray-600 hover:text-fg-navy hover:bg-white/60'
                    }`}
                  >
                    Community
                    <svg
                      className={`inline-block ml-1 w-3 h-3 transition-transform duration-300 ${activeMenu === 'community' ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Community Dropdown - Two Column Spread */}
                  {activeMenu === 'community' && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50">
                      <div className="bg-white rounded-2xl shadow-[0_25px_60px_-15px_rgba(26,41,73,0.25)] border border-gray-100 overflow-hidden animate-menuIn">
                        <div className="flex">
                          {/* Left Column - Join CTA */}
                          <div className="w-64 bg-gradient-to-br from-fg-navy to-fg-blue p-6 flex flex-col justify-between">
                            <div>
                              <h3 className="text-white font-bold text-lg mb-2">{communityJoin.title}</h3>
                              <p className="text-white/80 text-sm leading-relaxed">{communityJoin.description}</p>
                            </div>
                            <a
                              href={communityJoin.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={closeMenus}
                              className="mt-4 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-fg-navy font-semibold rounded-full hover:bg-fg-light-blue transition-colors text-sm"
                            >
                              {communityJoin.cta}
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          </div>

                          {/* Right Column - Browse Links */}
                          <div className="w-64 p-4">
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">
                              Explore
                            </div>
                            {communityLinks.map((link) => (
                              <Link
                                key={link.href}
                                href={link.href}
                                onClick={closeMenus}
                                className="block px-3 py-2.5 rounded-xl hover:bg-fg-light-blue/50 transition-colors group"
                              >
                                <div className="text-[15px] text-fg-navy font-medium group-hover:text-fg-blue transition-colors">
                                  {link.label}
                                </div>
                                <div className="text-xs text-gray-500 mt-0.5">
                                  {link.description}
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Give */}
                <div className="relative">
                  <button
                    onClick={() => handleMenuClick('give')}
                    className={`relative px-4 py-2 text-[15px] font-medium rounded-full transition-all duration-300 ${
                      activeMenu === 'give'
                        ? 'bg-white text-fg-navy shadow-sm'
                        : 'text-gray-600 hover:text-fg-navy hover:bg-white/60'
                    }`}
                  >
                    Give
                    <svg
                      className={`inline-block ml-1 w-3 h-3 transition-transform duration-300 ${activeMenu === 'give' ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Give Dropdown - Two Column Spread */}
                  {activeMenu === 'give' && (
                    <div className="absolute top-full right-0 pt-3 z-50">
                      <div className="bg-white rounded-2xl shadow-[0_25px_60px_-15px_rgba(26,41,73,0.25)] border border-gray-100 overflow-hidden animate-menuIn">
                        <div className="flex">
                          {/* Left Column - Donate CTA */}
                          <div className="w-64 bg-gradient-to-br from-fg-orange to-[#f97316] p-6 flex flex-col justify-between">
                            <div>
                              <h3 className="text-white font-bold text-lg mb-2">{giveDonate.title}</h3>
                              <p className="text-white/80 text-sm leading-relaxed">{giveDonate.description}</p>
                            </div>
                            <Link
                              href={giveDonate.href}
                              onClick={closeMenus}
                              className="mt-4 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-fg-orange font-semibold rounded-full hover:bg-fg-light-blue transition-colors text-sm"
                            >
                              {giveDonate.cta}
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                            </Link>
                          </div>

                          {/* Right Column - Campaigns */}
                          <div className="w-64 p-4">
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">
                              Ways to Give
                            </div>
                            {giveLinks.map((link) => (
                              <Link
                                key={link.href + link.label}
                                href={link.href}
                                onClick={closeMenus}
                                className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-fg-light-blue/50 transition-colors group"
                              >
                                <span className="text-lg mt-0.5">{link.icon}</span>
                                <div>
                                  <div className="text-[15px] text-fg-navy font-medium group-hover:text-fg-blue transition-colors">
                                    {link.label}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-0.5">
                                    {link.description}
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact - Direct link */}
                <Link
                  href="/contact"
                  onClick={closeMenus}
                  className="px-4 py-2 text-[15px] font-medium text-gray-600 hover:text-fg-navy hover:bg-white/60 rounded-full transition-all duration-300"
                >
                  Contact
                </Link>
              </div>

              {/* Donate Button - Outside the pill, stands out */}
              <Link
                href="/donate"
                onClick={closeMenus}
                className="group relative ml-4 px-6 py-2.5 rounded-full font-semibold text-[15px] text-white overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_12px_35px_-10px_rgba(250,133,38,0.5)]"
              >
                {/* Warm gradient - feels inviting, not corporate */}
                <div className="absolute inset-0 bg-gradient-to-r from-fg-orange via-[#f97316] to-fg-orange bg-[length:200%_100%] group-hover:animate-gradientFlow" />

                {/* Subtle glow ring on hover */}
                <div className="absolute -inset-1 bg-gradient-to-r from-fg-orange/40 to-fg-yellow/40 rounded-full opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-500" />

                <span className="relative z-10 flex items-center gap-2">
                  Donate
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </span>
              </Link>
            </nav>

            {/* Right side - Mobile */}
            <div className="flex items-center gap-3 lg:hidden">
              {/* Mobile Donate */}
              <Link
                href="/donate"
                className="px-4 py-2 bg-gradient-to-r from-fg-orange to-[#f97316] text-white text-sm font-semibold rounded-full shadow-sm"
              >
                Donate
              </Link>

              {/* Hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Toggle menu"
              >
                <div className="w-5 h-4 flex flex-col justify-between">
                  <span className={`block h-0.5 bg-fg-navy rounded-full transition-all duration-300 origin-center ${isMobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
                  <span className={`block h-0.5 bg-fg-navy rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 scale-0' : ''}`} />
                  <span className={`block h-0.5 bg-fg-navy rounded-full transition-all duration-300 origin-center ${isMobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Click outside to close dropdowns */}
        {activeMenu && (
          <div
            className="fixed inset-0 z-[-1]"
            onClick={closeMenus}
          />
        )}
      </header>

      {/* Spacer */}
      <div className="h-[calc(6px+4rem)] sm:h-[calc(6px+4.5rem)] lg:h-[calc(6px+5rem)]" />

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop with blur */}
        <div
          className={`absolute inset-0 bg-fg-navy/30 backdrop-blur-md transition-opacity duration-500 ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Sliding Panel */}
        <div
          className={`absolute top-[calc(6px+4rem)] sm:top-[calc(6px+4.5rem)] left-0 right-0 max-h-[calc(100vh-5rem)] overflow-y-auto bg-white border-t border-gray-100 transition-all duration-500 ease-out ${
            isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
          }`}
        >
          <div className="p-5 space-y-5">
            {/* About */}
            <div>
              <div className="text-xs font-bold text-fg-orange uppercase tracking-wider mb-2 px-1">About</div>
              <div className="grid grid-cols-2 gap-2">
                {aboutLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-4 py-3 bg-gray-50 rounded-xl text-fg-navy font-medium text-sm hover:bg-fg-light-blue transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Community - Two sections */}
            <div>
              <div className="text-xs font-bold text-fg-orange uppercase tracking-wider mb-2 px-1">Community</div>

              {/* Join CTA - Prominent */}
              <a
                href={communityJoin.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block mb-3 p-4 bg-gradient-to-r from-fg-navy to-fg-blue rounded-xl text-white"
              >
                <div className="font-bold text-base mb-1">{communityJoin.title}</div>
                <div className="text-white/80 text-xs mb-3">{communityJoin.description}</div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white text-fg-navy font-semibold rounded-full text-sm">
                  {communityJoin.cta}
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </a>

              {/* Explore Links */}
              <div className="grid grid-cols-2 gap-2">
                {communityLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-4 py-3 bg-gray-50 rounded-xl text-fg-navy font-medium text-sm hover:bg-fg-light-blue transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Give - Two sections */}
            <div>
              <div className="text-xs font-bold text-fg-orange uppercase tracking-wider mb-2 px-1">Give</div>

              {/* Donate CTA - Prominent */}
              <Link
                href={giveDonate.href}
                className="block mb-3 p-4 bg-gradient-to-r from-fg-orange to-[#f97316] rounded-xl text-white"
              >
                <div className="font-bold text-base mb-1">{giveDonate.title}</div>
                <div className="text-white/80 text-xs mb-3">{giveDonate.description}</div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white text-fg-orange font-semibold rounded-full text-sm">
                  {giveDonate.cta}
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              </Link>

              {/* Ways to Give Links */}
              <div className="space-y-2">
                {giveLinks.map((link) => (
                  <Link
                    key={link.href + link.label}
                    href={link.href}
                    className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl text-fg-navy font-medium text-sm hover:bg-fg-light-blue transition-colors"
                  >
                    <span className="text-lg">{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Contact */}
            <Link
              href="/contact"
              className="block px-4 py-3 bg-gray-50 rounded-xl text-fg-navy font-medium text-sm hover:bg-fg-light-blue transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes menuIn {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes shine {
          from { transform: translateX(-100%); }
          to { transform: translateX(100%); }
        }

        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-menuIn {
          animation: menuIn 0.2s ease-out forwards;
        }

        .animate-shine {
          animation: shine 3s ease-in-out infinite;
        }

        .group:hover .group-hover\\:animate-gradientFlow {
          animation: gradientFlow 2s ease infinite;
        }

        .h-18 {
          height: 4.5rem;
        }
      `}</style>
    </>
  );
}
