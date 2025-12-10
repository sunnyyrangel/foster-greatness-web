'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { getNavCampaigns } from '@/data';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  const navCampaigns = getNavCampaigns();

  // Close menus when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveMenu(null);
  }, [pathname]);

  const clearCloseTimeout = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const handleMenuEnter = useCallback((menu: string) => {
    clearCloseTimeout();
    setActiveMenu(menu);
  }, [clearCloseTimeout]);

  const handleMenuLeave = useCallback(() => {
    clearCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 100);
  }, [clearCloseTimeout]);

  const handleDropdownEnter = useCallback(() => {
    clearCloseTimeout();
  }, [clearCloseTimeout]);

  const handleDropdownLeave = useCallback(() => {
    handleMenuLeave();
  }, [handleMenuLeave]);

  const handleLinkClick = useCallback(() => {
    setActiveMenu(null);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dropdown menu configurations
  const aboutLinks = [
    { label: 'Our Story', href: '/about' },
    { label: 'Impact Report', href: '/impact' },
    { label: 'Partnerships', href: '/partnerships' },
  ];

  const communityLinks = [
    { label: 'Join Community', href: 'https://community.fostergreatness.co', external: true },
    { label: 'Resource Support', href: '/resources' },
    { label: 'Thriver Stories', href: '/thriver-stories' },
    { label: 'Community Events', href: '/events' },
    { label: 'Storytellers Collective', href: '/storytellers-collective' },
  ];

  return (
    <>
      <header className={`bg-white sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link href="/" className="relative h-10 w-40 lg:h-11 lg:w-44 flex-shrink-0">
              <Image
                src="/images/foster-greatness-horizontal.svg"
                alt="Foster Greatness"
                fill
                className="object-contain"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {/* About Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleMenuEnter('about')}
                onMouseLeave={handleMenuLeave}
              >
                <button className="flex items-center gap-1 px-4 py-2 text-gray-700 hover:text-fg-navy font-medium text-sm transition-colors">
                  About
                  <svg className={`w-4 h-4 transition-transform ${activeMenu === 'about' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {activeMenu === 'about' && (
                  <div
                    className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 animate-fadeIn"
                    onMouseEnter={handleDropdownEnter}
                    onMouseLeave={handleDropdownLeave}
                  >
                    {aboutLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={handleLinkClick}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-fg-light-blue hover:text-fg-navy transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Community Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleMenuEnter('community')}
                onMouseLeave={handleMenuLeave}
              >
                <button className="flex items-center gap-1 px-4 py-2 text-gray-700 hover:text-fg-navy font-medium text-sm transition-colors">
                  Community
                  <svg className={`w-4 h-4 transition-transform ${activeMenu === 'community' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {activeMenu === 'community' && (
                  <div
                    className="absolute top-full left-0 mt-1 w-52 bg-white rounded-lg shadow-lg border border-gray-100 py-2 animate-fadeIn"
                    onMouseEnter={handleDropdownEnter}
                    onMouseLeave={handleDropdownLeave}
                  >
                    {communityLinks.map((link) => (
                      link.external ? (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={handleLinkClick}
                          className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-fg-light-blue hover:text-fg-navy transition-colors"
                        >
                          {link.label}
                          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      ) : (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={handleLinkClick}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-fg-light-blue hover:text-fg-navy transition-colors"
                        >
                          {link.label}
                        </Link>
                      )
                    ))}
                  </div>
                )}
              </div>

              {/* Campaigns Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleMenuEnter('campaigns')}
                onMouseLeave={handleMenuLeave}
              >
                <button className="flex items-center gap-1 px-4 py-2 text-gray-700 hover:text-fg-navy font-medium text-sm transition-colors">
                  Campaigns
                  <svg className={`w-4 h-4 transition-transform ${activeMenu === 'campaigns' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {activeMenu === 'campaigns' && (
                  <div
                    className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 animate-fadeIn"
                    onMouseEnter={handleDropdownEnter}
                    onMouseLeave={handleDropdownLeave}
                  >
                    {navCampaigns.map((campaign) => (
                      <Link
                        key={campaign.id}
                        href={`/${campaign.slug}`}
                        onClick={handleLinkClick}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-fg-light-blue hover:text-fg-navy transition-colors"
                      >
                        <span className="text-lg">{campaign.icon}</span>
                        <span>{campaign.shortTitle}</span>
                      </Link>
                    ))}
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <Link
                        href="/donate"
                        onClick={handleLinkClick}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-fg-blue font-medium hover:bg-fg-light-blue transition-colors"
                      >
                        <span className="text-lg">💝</span>
                        <span>View All Ways to Give</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact - Direct Link */}
              <Link
                href="/contact"
                className="px-4 py-2 text-gray-700 hover:text-fg-navy font-medium text-sm transition-colors"
              >
                Contact
              </Link>
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              {/* Donate Button */}
              <Link
                href="/donate"
                className="bg-gradient-to-r from-fg-navy to-fg-blue text-white px-5 py-2.5 lg:px-6 rounded-full font-semibold text-sm hover:shadow-lg transition-all hover:scale-[1.02]"
              >
                Donate
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden border-t border-gray-100 bg-white animate-slideDown">
            <div className="container mx-auto px-4 py-4">
              {/* About Section */}
              <div className="py-2">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">About</div>
                {aboutLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-2 py-2.5 text-gray-700 hover:text-fg-navy font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="border-t border-gray-100 my-2" />

              {/* Community Section */}
              <div className="py-2">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">Community</div>
                {communityLinks.map((link) => (
                  link.external ? (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-2 py-2.5 text-gray-700 hover:text-fg-navy font-medium"
                    >
                      {link.label}
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-2 py-2.5 text-gray-700 hover:text-fg-navy font-medium"
                    >
                      {link.label}
                    </Link>
                  )
                ))}
              </div>

              <div className="border-t border-gray-100 my-2" />

              {/* Campaigns Section */}
              <div className="py-2">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">Campaigns</div>
                {navCampaigns.map((campaign) => (
                  <Link
                    key={campaign.id}
                    href={`/${campaign.slug}`}
                    className="flex items-center gap-3 px-2 py-2.5 text-gray-700 hover:text-fg-navy font-medium"
                  >
                    <span>{campaign.icon}</span>
                    <span>{campaign.shortTitle}</span>
                  </Link>
                ))}
              </div>

              <div className="border-t border-gray-100 my-2" />

              {/* Contact */}
              <Link
                href="/contact"
                className="block px-2 py-2.5 text-gray-700 hover:text-fg-navy font-medium"
              >
                Contact
              </Link>
            </div>
          </nav>
        )}
      </header>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.15s ease-out;
        }
      `}</style>
    </>
  );
}
