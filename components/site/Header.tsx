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

  // Get campaigns from config
  const navCampaigns = getNavCampaigns();

  // Close menus when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveMenu(null);
  }, [pathname]);

  // Clear any pending close timeout
  const clearCloseTimeout = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  // Open menu immediately, clear any pending close
  const handleMenuEnter = useCallback((menu: string) => {
    clearCloseTimeout();
    setActiveMenu(menu);
  }, [clearCloseTimeout]);

  // Delay closing to allow mouse to move to dropdown
  const handleMenuLeave = useCallback(() => {
    clearCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  }, [clearCloseTimeout]);

  // Keep menu open when hovering dropdown
  const handleDropdownEnter = useCallback(() => {
    clearCloseTimeout();
  }, [clearCloseTimeout]);

  // Close menu when leaving dropdown
  const handleDropdownLeave = useCallback(() => {
    handleMenuLeave();
  }, [handleMenuLeave]);

  // Close menu on link click
  const handleLinkClick = useCallback(() => {
    setActiveMenu(null);
  }, []);

  // Cleanup timeout on unmount
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

  return (
    <>
      {/* Main Header */}
      <header className={`bg-white sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-lg' : 'shadow-sm'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 xl:h-20">
            {/* Logo */}
            <Link href="/" className="relative h-10 w-40 xl:h-12 xl:w-52 flex-shrink-0 group">
              <Image
                src="/images/foster-greatness-horizontal.svg"
                alt="Foster Greatness"
                fill
                className="object-contain transition-transform duration-300 group-hover:scale-105"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center space-x-1">
              {/* About Menu */}
              <div
                className="relative"
                onMouseEnter={() => handleMenuEnter('about')}
                onMouseLeave={handleMenuLeave}
              >
                <button className="px-4 py-3 text-gray-700 hover:text-navy font-semibold transition-all duration-200 hover:scale-105 relative group text-sm">
                  About
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-navy to-blue transition-transform duration-300 origin-left ${activeMenu === 'about' ? 'scale-x-100' : 'scale-x-0'}`}></span>
                </button>
              </div>

              {/* Community Menu */}
              <div
                className="relative"
                onMouseEnter={() => handleMenuEnter('community')}
                onMouseLeave={handleMenuLeave}
              >
                <button className="px-4 py-3 text-gray-700 hover:text-navy font-semibold transition-all duration-200 hover:scale-105 relative text-sm">
                  Community
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-navy to-blue transition-transform duration-300 origin-left ${activeMenu === 'community' ? 'scale-x-100' : 'scale-x-0'}`}></span>
                </button>
              </div>

              {/* Resources Menu */}
              <div
                className="relative"
                onMouseEnter={() => handleMenuEnter('resources')}
                onMouseLeave={handleMenuLeave}
              >
                <button className="px-4 py-3 text-gray-700 hover:text-navy font-semibold transition-all duration-200 hover:scale-105 relative text-sm">
                  Resources
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-navy to-blue transition-transform duration-300 origin-left ${activeMenu === 'resources' ? 'scale-x-100' : 'scale-x-0'}`}></span>
                </button>
              </div>

              {/* Campaigns Menu */}
              <div
                className="relative"
                onMouseEnter={() => handleMenuEnter('campaigns')}
                onMouseLeave={handleMenuLeave}
              >
                <button className="px-4 py-3 text-gray-700 hover:text-navy font-semibold transition-all duration-200 hover:scale-105 relative text-sm">
                  Campaigns
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-navy to-blue transition-transform duration-300 origin-left ${activeMenu === 'campaigns' ? 'scale-x-100' : 'scale-x-0'}`}></span>
                </button>
              </div>

              <Link href="/partnerships" className="px-4 py-2 text-gray-700 hover:text-navy font-semibold transition-all duration-200 hover:scale-105 text-sm">
                Partnerships
              </Link>

              <Link href="/contact" className="px-4 py-2 text-gray-700 hover:text-navy font-semibold transition-all duration-200 hover:scale-105 text-sm">
                Contact
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              {/* Donate Button */}
              <Link
                href="/donate"
                className="relative overflow-hidden bg-gradient-to-r from-navy to-blue text-white px-5 py-2.5 xl:px-8 xl:py-3 rounded-full font-bold hover:shadow-xl transition-all duration-300 hover:scale-105 group text-sm xl:text-base"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Donate
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="group-hover:translate-x-1 transition-transform hidden xl:block">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue to-navy opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="xl:hidden w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-light-blue rounded-lg transition-all"
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
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

        {/* Mega Menu Dropdown - Full Width with Animation */}
        {activeMenu && (
          <div
            className="absolute left-0 right-0 top-full bg-white border-t border-gray-100 shadow-2xl animate-slideDown"
            onMouseEnter={handleDropdownEnter}
            onMouseLeave={handleDropdownLeave}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, #1a2949 1px, transparent 0)`,
                backgroundSize: '32px 32px'
              }}></div>
            </div>

            <div className="container mx-auto px-4 py-10 relative">
              {/* About Mega Menu */}
              {activeMenu === 'about' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Section */}
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-2xl font-bold text-navy mb-6 animate-fadeIn">About Foster Greatness</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {[
                        { icon: '📖', title: 'Our Story', desc: 'Discover how lived experience leadership drives our mission', href: '/about', delay: '0ms' },
                        { icon: '📊', title: 'Impact Report', desc: 'See the measurable difference we make nationwide', href: '/impact', delay: '100ms' },
                        { icon: '🤝', title: 'Our Partners', desc: 'Organizations making lifelong community possible', href: '/partnerships', delay: '200ms' }
                      ].map((item, i) => (
                        <Link
                          key={i}
                          href={item.href}
                          onClick={handleLinkClick}
                          className="group relative p-5 rounded-xl bg-gradient-to-br from-white to-light-blue/30 hover:from-light-blue hover:to-blue/10 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-100 animate-fadeIn"
                          style={{ animationDelay: item.delay }}
                        >
                          <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                          <h4 className="text-lg font-bold text-navy group-hover:text-blue mb-1 transition-colors">{item.title}</h4>
                          <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Featured Section */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-navy via-navy to-blue rounded-xl p-6 text-white shadow-xl animate-fadeIn" style={{ animationDelay: '100ms' }}>
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                      <div className="text-5xl mb-4">❤️</div>
                      <h4 className="text-xl font-bold mb-3">Age In, Never Age Out</h4>
                      <p className="text-sm mb-6 opacity-90 leading-relaxed">Support that evolves with you throughout your entire life.</p>
                      <Link
                        href="/about"
                        onClick={handleLinkClick}
                        className="inline-flex items-center gap-2 bg-white text-navy px-5 py-2.5 rounded-full font-bold hover:bg-yellow hover:text-navy transition-all duration-300 hover:scale-105 shadow-lg text-sm"
                      >
                        Learn More
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Community Mega Menu */}
              {activeMenu === 'community' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-2xl font-bold text-navy mb-6 animate-fadeIn">Join Our Community</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {[
                        { icon: '🌟', title: 'Join Community', desc: 'Connect with 1,100+ current and former foster youth', href: 'https://community.fostergreatness.co', delay: '0ms', external: true },
                        { icon: '💫', title: 'Thriver Stories', desc: 'Watch inspiring stories of resilience', href: '/thriver-stories', delay: '100ms', external: false },
                        { icon: '🎤', title: 'Storytellers Collective', desc: 'Share your story and guide others', href: '/storytellers-collective', delay: '200ms', external: false },
                        { icon: '📅', title: 'Community Events', desc: 'Gatherings and connection opportunities', href: '/events', delay: '300ms', external: false }
                      ].map((item, i) => (
                        item.external ? (
                          <a
                            key={i}
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleLinkClick}
                            className="group relative p-5 rounded-xl bg-gradient-to-br from-white to-light-blue/30 hover:from-light-blue hover:to-blue/10 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-100 animate-fadeIn"
                            style={{ animationDelay: item.delay }}
                          >
                            <div className="text-4xl mb-3 transform group-hover:scale-110 transition-all duration-300">{item.icon}</div>
                            <h4 className="text-lg font-bold text-navy group-hover:text-blue mb-1 transition-colors">{item.title}</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                          </a>
                        ) : (
                          <Link
                            key={i}
                            href={item.href}
                            onClick={handleLinkClick}
                            className="group relative p-5 rounded-xl bg-gradient-to-br from-white to-light-blue/30 hover:from-light-blue hover:to-blue/10 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-100 animate-fadeIn"
                            style={{ animationDelay: item.delay }}
                          >
                            <div className="text-4xl mb-3 transform group-hover:scale-110 transition-all duration-300">{item.icon}</div>
                            <h4 className="text-lg font-bold text-navy group-hover:text-blue mb-1 transition-colors">{item.title}</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                          </Link>
                        )
                      ))}
                    </div>
                  </div>

                  <div className="relative overflow-hidden bg-gradient-to-br from-navy via-blue to-navy rounded-xl p-6 text-white shadow-xl animate-fadeIn" style={{ animationDelay: '100ms' }}>
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                      <div className="text-5xl mb-4">🏡</div>
                      <h4 className="text-xl font-bold mb-3">Find Your Belonging</h4>
                      <p className="text-sm mb-6 opacity-90 leading-relaxed">A community where you truly belong.</p>
                      <a
                        href="https://community.fostergreatness.co"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleLinkClick}
                        className="inline-flex items-center gap-2 bg-white text-navy px-5 py-2.5 rounded-full font-bold hover:bg-yellow hover:text-navy transition-all duration-300 hover:scale-105 shadow-lg text-sm"
                      >
                        Join Free Today
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Resources Mega Menu */}
              {activeMenu === 'resources' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-2xl font-bold text-navy mb-6 animate-fadeIn">Get Support</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {[
                        { icon: '🤝', title: 'Resource Support', desc: 'Personalized 1:1 support with housing, food, benefits', href: '/resources', delay: '0ms' },
                        { icon: '💰', title: 'Benefits Screener', desc: 'Discover benefits you may qualify for', href: '/resources#benefits-screener', delay: '100ms' },
                        { icon: '💼', title: 'Career Support', desc: 'Resume building, interviews, job board access', href: '/resources#career', delay: '200ms' },
                        { icon: '🆘', title: 'Crisis Fund', desc: 'Emergency assistance when you need it most', href: '/resources#crisis-fund', delay: '300ms' }
                      ].map((item, i) => (
                        <Link
                          key={i}
                          href={item.href}
                          onClick={handleLinkClick}
                          className="group relative p-5 rounded-xl bg-gradient-to-br from-white to-light-blue/30 hover:from-light-blue hover:to-blue/10 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-100 animate-fadeIn"
                          style={{ animationDelay: item.delay }}
                        >
                          <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                          <h4 className="text-lg font-bold text-navy group-hover:text-blue mb-1 transition-colors">{item.title}</h4>
                          <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="relative overflow-hidden bg-gradient-to-br from-navy via-navy to-blue rounded-xl p-6 text-white shadow-xl animate-fadeIn" style={{ animationDelay: '100ms' }}>
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                      <div className="text-5xl mb-4">🌟</div>
                      <h4 className="text-xl font-bold mb-3">Age In, Never Age Out</h4>
                      <p className="text-sm mb-6 opacity-90 leading-relaxed">Personalized resources to help you thrive at any stage.</p>
                      <Link
                        href="/resources"
                        onClick={handleLinkClick}
                        className="inline-flex items-center gap-2 bg-white text-navy px-5 py-2.5 rounded-full font-bold hover:bg-yellow hover:text-navy transition-all duration-300 hover:scale-105 shadow-lg text-sm"
                      >
                        Access Resources
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Campaigns Mega Menu */}
              {activeMenu === 'campaigns' && (
                <div className={`grid grid-cols-1 ${navCampaigns.length > 1 ? 'lg:grid-cols-2' : 'max-w-2xl'} gap-6`}>
                  {navCampaigns.map((campaign, index) => (
                    <Link
                      key={campaign.id}
                      href={`/${campaign.slug}`}
                      onClick={handleLinkClick}
                      className="group relative overflow-hidden rounded-xl bg-white border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fadeIn"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex flex-col sm:flex-row">
                        <div className="relative w-full sm:w-40 h-40 sm:h-auto flex-shrink-0">
                          <Image
                            src={campaign.image}
                            alt={campaign.title}
                            fill
                            className={campaign.image.includes('gift-tree') ? 'object-contain bg-gradient-to-br from-light-blue to-white p-4' : 'object-cover'}
                          />
                        </div>
                        <div className="p-5 flex flex-col justify-center">
                          <div className="text-xs font-bold text-orange uppercase tracking-wider mb-1">
                            {campaign.status === 'active' ? 'Active Campaign' : campaign.status === 'upcoming' ? 'Coming Soon' : ''}
                          </div>
                          <h4 className="text-lg font-bold text-navy group-hover:text-blue mb-1 transition-colors">{campaign.title}</h4>
                          <p className="text-sm text-gray-600 leading-relaxed mb-3">{campaign.description}</p>
                          <span className="inline-flex items-center gap-2 text-blue font-semibold text-sm group-hover:gap-3 transition-all">
                            {campaign.donationLabel || 'Learn More'}
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="xl:hidden py-6 border-t bg-light-blue/30 animate-slideDown">
            <div className="flex flex-col space-y-2 px-4">
              <Link href="/about" className="text-gray-700 hover:text-navy hover:bg-white transition-all px-4 py-3 rounded-lg font-semibold">About</Link>
              <a href="https://community.fostergreatness.co" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-navy hover:bg-white transition-all px-4 py-3 rounded-lg font-semibold">Community</a>
              <Link href="/resources" className="text-gray-700 hover:text-navy hover:bg-white transition-all px-4 py-3 rounded-lg font-semibold">Resources</Link>
              <div className="px-4 py-3">
                <div className="font-bold text-navy mb-3">Campaigns</div>
                <div className="ml-4 space-y-2">
                  {navCampaigns.map((campaign) => (
                    <Link
                      key={campaign.id}
                      href={`/${campaign.slug}`}
                      className="block text-gray-600 hover:text-navy text-sm py-2"
                    >
                      {campaign.icon} {campaign.shortTitle}
                    </Link>
                  ))}
                </div>
              </div>
              <Link href="/partnerships" className="text-gray-700 hover:text-navy hover:bg-white transition-all px-4 py-3 rounded-lg font-semibold">Partnerships</Link>
              <Link href="/contact" className="text-gray-700 hover:text-navy hover:bg-white transition-all px-4 py-3 rounded-lg font-semibold">Contact</Link>
            </div>
          </nav>
        )}
      </header>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </>
  );
}
