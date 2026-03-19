'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import CommunityJoinLink from '@/components/shared/CommunityJoinLink';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();


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

  // About dropdown - split into two columns
  const aboutCta = {
    title: 'Our Story',
    description: 'Learn how Foster Greatness is creating lifelong community and belonging',
    href: '/about',
    cta: 'Read Our Story',
  };

  const aboutLinks = [
    { label: 'Meet the Team', href: '/about#team', description: 'The people behind FG' },
    { label: 'Impact Report', href: '/impact', description: 'See our community impact' },
  ];

  // Community dropdown - split into two columns
  const communityJoin = {
    title: 'Join the Community',
    description: 'Connect with 2,000+ current and former foster youth nationwide',
    href: 'https://community.fostergreatness.co',
    cta: 'Join Now',
  };

  const communityLinks = [
    { label: 'Thriver Stories', href: '/thriver-stories', description: 'Stories of resilience' },
    { label: 'Storytellers Collective', href: '/storytellers-collective', description: 'Share your voice' },
    { label: 'Events', href: '/events', description: 'Upcoming gatherings' },
  ];

  // Resources dropdown
  const resourcesCta = {
    title: 'Resource Support',
    description: 'Connect with a Resource Specialist for personalized support navigating resources',
    href: 'https://community.fostergreatness.co/c/resource-specialist/',
    cta: 'Get Support',
    external: true,
  };

  const resourcesLinks = [
    { label: 'Resource Hub', href: '/resources', description: 'All resources and support services' },
    { label: 'Tax Support', href: '/tax-support', description: 'Free tax filing help for foster youth' },
    { label: 'Find Local Services', href: '/services', description: 'Search 500,000+ resources by ZIP' },
  ];

  // Get Involved dropdown - split into two columns
  const getInvolvedCta = {
    title: 'Contact Us',
    description: 'Have questions? We\'d love to hear from you',
    href: '/contact',
    cta: 'Get in Touch',
  };

  const getInvolvedLinks = [
    { label: 'Partnerships', href: '/partnerships', description: 'Partner with Foster Greatness' },
    { label: 'Newsletter', href: '/newsletter', description: 'Stay updated on our work' },
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

                  {/* About Dropdown - Two Column Spread */}
                  {activeMenu === 'about' && (
                    <div className="absolute top-full left-0 pt-3 z-50">
                      <div className="bg-white rounded-2xl shadow-[0_25px_60px_-15px_rgba(26,41,73,0.25)] border border-gray-100 overflow-hidden animate-menuIn">
                        <div className="flex">
                          {/* Left Column - Our Story CTA */}
                          <div className="w-64 bg-gradient-to-br from-fg-navy to-fg-blue p-6 flex flex-col justify-between">
                            <div>
                              <h3 className="text-white font-bold text-lg mb-2">{aboutCta.title}</h3>
                              <p className="text-white/80 text-sm leading-relaxed">{aboutCta.description}</p>
                            </div>
                            <Link
                              href={aboutCta.href}
                              onClick={closeMenus}
                              className="mt-4 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-fg-navy font-semibold rounded-full hover:bg-fg-light-blue transition-colors text-sm"
                            >
                              {aboutCta.cta}
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                            </Link>
                          </div>

                          {/* Right Column - Learn More */}
                          <div className="w-64 p-4">
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">
                              Learn More
                            </div>
                            {aboutLinks.map((link) => (
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
                            <CommunityJoinLink
                              href={communityJoin.href}
                              onClick={closeMenus}
                              className="mt-4 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-fg-navy font-semibold rounded-full hover:bg-fg-light-blue transition-colors text-sm"
                            >
                              {communityJoin.cta}
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </CommunityJoinLink>
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

                {/* Resources */}
                <div className="relative">
                  <button
                    onClick={() => handleMenuClick('resources')}
                    className={`relative px-4 py-2 text-[15px] font-medium rounded-full transition-all duration-300 ${
                      activeMenu === 'resources'
                        ? 'bg-white text-fg-navy shadow-sm'
                        : 'text-gray-600 hover:text-fg-navy hover:bg-white/60'
                    }`}
                  >
                    Resources
                    <svg
                      className={`inline-block ml-1 w-3 h-3 transition-transform duration-300 ${activeMenu === 'resources' ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Resources Dropdown - Two Column Spread */}
                  {activeMenu === 'resources' && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50">
                      <div className="bg-white rounded-2xl shadow-[0_25px_60px_-15px_rgba(26,41,73,0.25)] border border-gray-100 overflow-hidden animate-menuIn">
                        <div className="flex">
                          {/* Left Column - Resource Support CTA */}
                          <div className="w-64 bg-gradient-to-br from-fg-teal to-fg-blue p-6 flex flex-col justify-between">
                            <div>
                              <h3 className="text-white font-bold text-lg mb-2">{resourcesCta.title}</h3>
                              <p className="text-white/80 text-sm leading-relaxed">{resourcesCta.description}</p>
                            </div>
                            <a
                              href={resourcesCta.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={closeMenus}
                              className="mt-4 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-fg-navy font-semibold rounded-full hover:bg-fg-light-blue transition-colors text-sm"
                            >
                              {resourcesCta.cta}
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          </div>

                          {/* Right Column - Resource Links */}
                          <div className="w-64 p-4">
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">
                              Browse
                            </div>
                            {resourcesLinks.map((link) => (
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

                {/* Get Involved */}
                <div className="relative">
                  <button
                    onClick={() => handleMenuClick('getinvolved')}
                    className={`relative px-4 py-2 text-[15px] font-medium rounded-full transition-all duration-300 ${
                      activeMenu === 'getinvolved'
                        ? 'bg-white text-fg-navy shadow-sm'
                        : 'text-gray-600 hover:text-fg-navy hover:bg-white/60'
                    }`}
                  >
                    Get Involved
                    <svg
                      className={`inline-block ml-1 w-3 h-3 transition-transform duration-300 ${activeMenu === 'getinvolved' ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Get Involved Dropdown - Two Column Spread */}
                  {activeMenu === 'getinvolved' && (
                    <div className="absolute top-full right-0 pt-3 z-50">
                      <div className="bg-white rounded-2xl shadow-[0_25px_60px_-15px_rgba(26,41,73,0.25)] border border-gray-100 overflow-hidden animate-menuIn">
                        <div className="flex">
                          {/* Left Column - Contact CTA */}
                          <div className="w-64 bg-gradient-to-br from-fg-teal to-fg-blue p-6 flex flex-col justify-between">
                            <div>
                              <h3 className="text-white font-bold text-lg mb-2">{getInvolvedCta.title}</h3>
                              <p className="text-white/80 text-sm leading-relaxed">{getInvolvedCta.description}</p>
                            </div>
                            <Link
                              href={getInvolvedCta.href}
                              onClick={closeMenus}
                              className="mt-4 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-fg-navy font-semibold rounded-full hover:bg-fg-light-blue transition-colors text-sm"
                            >
                              {getInvolvedCta.cta}
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </Link>
                          </div>

                          {/* Right Column - Links */}
                          <div className="w-64 p-4">
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">
                              Connect
                            </div>
                            {getInvolvedLinks.map((link) => (
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

              {/* Social Media Icons */}
              <div className="flex items-center gap-1 ml-3 pl-3 border-l border-gray-200">
                <a
                  href="https://www.instagram.com/fostergreatness"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-fg-navy transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/fostergreatness1/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-fg-navy transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/company/fostergreatness"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-fg-navy transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com/@_FosterGreatness"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-fg-navy transition-colors"
                  aria-label="YouTube"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
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
            {/* About - Two sections */}
            <div>
              <div className="text-xs font-bold text-fg-orange uppercase tracking-wider mb-2 px-1">About</div>

              {/* Our Story CTA - Prominent */}
              <Link
                href={aboutCta.href}
                className="block mb-3 p-4 bg-gradient-to-r from-fg-navy to-fg-blue rounded-xl text-white"
              >
                <div className="font-bold text-base mb-1">{aboutCta.title}</div>
                <div className="text-white/80 text-xs mb-3">{aboutCta.description}</div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white text-fg-navy font-semibold rounded-full text-sm">
                  {aboutCta.cta}
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </Link>

              {/* Learn More Links */}
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
              <CommunityJoinLink
                href={communityJoin.href}
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
              </CommunityJoinLink>

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

            {/* Resources - Two sections */}
            <div>
              <div className="text-xs font-bold text-fg-orange uppercase tracking-wider mb-2 px-1">Resources</div>

              {/* Resource Support CTA - Prominent */}
              <a
                href={resourcesCta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block mb-3 p-4 bg-gradient-to-r from-fg-teal to-fg-blue rounded-xl text-white"
              >
                <div className="font-bold text-base mb-1">{resourcesCta.title}</div>
                <div className="text-white/80 text-xs mb-3">{resourcesCta.description}</div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white text-fg-navy font-semibold rounded-full text-sm">
                  {resourcesCta.cta}
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </a>

              {/* Resource Links */}
              <div className="grid grid-cols-2 gap-2">
                {resourcesLinks.map((link) => (
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

            {/* Get Involved - Two sections */}
            <div>
              <div className="text-xs font-bold text-fg-orange uppercase tracking-wider mb-2 px-1">Get Involved</div>

              {/* Contact CTA - Prominent */}
              <Link
                href={getInvolvedCta.href}
                className="block mb-3 p-4 bg-gradient-to-r from-fg-teal to-fg-blue rounded-xl text-white"
              >
                <div className="font-bold text-base mb-1">{getInvolvedCta.title}</div>
                <div className="text-white/80 text-xs mb-3">{getInvolvedCta.description}</div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white text-fg-navy font-semibold rounded-full text-sm">
                  {getInvolvedCta.cta}
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </Link>

              {/* Connect Links */}
              <div className="grid grid-cols-2 gap-2">
                {getInvolvedLinks.map((link) => (
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
