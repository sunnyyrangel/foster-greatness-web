'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, FileText, Newspaper, ArrowRight, Heart, Link2, Check, ChevronLeft, ChevronRight, Instagram, Youtube, Linkedin, Facebook, Mail } from 'lucide-react'
import Image from 'next/image'
import Script from 'next/script'
import updatesData from '@/data/updates.json'

interface CircleEvent {
  id: string
  name: string
  starts_at: string
  url: string
  location_type: string
  host?: string
  member_name?: string
  cover_image_url?: string
  space?: {
    slug: string
  }
}

type UpdateType = 'news' | 'page' | 'event' | 'donate'

interface Update {
  id: string
  type: UpdateType
  title: string
  description: string
  date: string
  link: string
  linkText: string
  eventDate?: string
  eventTime?: string
  image?: string
  published?: boolean
  cta?: string
}

interface Newsletter {
  id: string
  title: string
  subtitle?: string
  thumbnail_url?: string
  web_url: string
  publish_date: number
}

const typeConfig = {
  news: {
    icon: Newspaper,
    label: 'News',
    color: 'bg-fg-blue',
  },
  page: {
    icon: FileText,
    label: 'Resource',
    color: 'bg-fg-navy',
  },
  event: {
    icon: Calendar,
    label: 'Event',
    color: 'bg-fg-orange',
  },
  donate: {
    icon: Heart,
    label: 'Give',
    color: 'bg-fg-blue',
  },
}

function CopyLinkButton({ link }: { link: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="p-3 rounded-lg bg-white/80 hover:bg-white shadow-sm transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
      aria-label="Copy link"
    >
      {copied ? (
        <Check className="w-4 h-4 text-fg-blue" />
      ) : (
        <Link2 className="w-4 h-4 text-gray-500 hover:text-fg-blue" />
      )}
    </button>
  )
}

// Stagger animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

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
}

function HeroSection() {
  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="mb-10 md:mb-12"
    >
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Content */}
        <motion.div variants={itemVariants}>
          <p className="text-sm font-semibold text-fg-blue uppercase tracking-wider mb-4">
            Join 2,000+ members nationwide
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-fg-navy mb-6 leading-[1.1] tracking-tight">
            A community you never age out of.
          </h1>
          <p className="text-xl text-fg-navy/70 mb-8 leading-relaxed max-w-xl">
            Built by and for people with lived foster care experience. Unlike traditional services that end at 18, Foster Greatness provides lifelong peer support, career opportunities, and resources.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <a
              href="https://community.fostergreatness.co"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-fg-navy text-white font-semibold rounded-full hover:bg-fg-blue transition-colors shadow-lg shadow-fg-navy/20"
            >
              Join the Community
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
            <a
              href="/about"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-fg-navy font-semibold hover:text-fg-blue transition-colors"
            >
              Learn More
            </a>
          </div>
          <p className="text-sm text-fg-navy/50">
            Available on{' '}
            <a href="https://community.fostergreatness.co" target="_blank" rel="noopener noreferrer" className="underline hover:text-fg-blue transition-colors">Web</a>,{' '}
            <a href="https://apps.apple.com/us/app/foster-greatness-community/id6456409836" target="_blank" rel="noopener noreferrer" className="underline hover:text-fg-blue transition-colors">iOS</a> &{' '}
            <a href="https://play.google.com/store/apps/details?id=co.circle.fostergreatness&hl=en_US" target="_blank" rel="noopener noreferrer" className="underline hover:text-fg-blue transition-colors">Android</a>
          </p>
        </motion.div>

        {/* Platform Preview */}
        <motion.div variants={itemVariants} className="relative">
          <a
            href="https://community.fostergreatness.co/home"
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-fg-navy/10">
              <Image
                src="/images/platform-preview.webp"
                alt="Foster Greatness community platform showing feed, events, and support options"
                width={600}
                height={450}
                className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.02]"
                priority
              />
              <div className="absolute inset-0 bg-fg-navy/0 group-hover:bg-fg-navy/5 transition-colors duration-300" />
            </div>
          </a>
        </motion.div>
      </div>
    </motion.section>
  )
}

function FeaturedCard({ update }: { update: Update }) {
  const config = typeConfig[update.type]
  const Icon = config.icon
  const isExternal = update.link.startsWith('http')

  return (
    <motion.a
      href={update.link}
      {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
      variants={itemVariants}
      className="block bg-white rounded-2xl overflow-hidden shadow-sm border border-fg-navy/5 cursor-pointer group h-full hover:shadow-md hover:border-fg-blue/30 transition-all"
    >
      {/* Image on top */}
      {update.image && (
        <div className="relative h-48 md:h-56 w-full overflow-hidden">
          <Image
            src={update.image}
            alt={update.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority
          />
        </div>
      )}

      {/* Content below */}
      <div className="p-5 md:p-6">
        {/* Badge */}
        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${config.color} text-white text-sm font-semibold uppercase tracking-wider mb-3`}>
          <Icon className="w-3 h-3" aria-hidden="true" />
          {config.label}
        </div>

        <h2 className="text-xl md:text-2xl font-bold mb-2 text-fg-navy leading-tight group-hover:text-fg-blue transition-colors">
          {update.title}
        </h2>

        <p className="text-fg-navy/70 leading-relaxed mb-4 line-clamp-2">
          {update.description}
        </p>

        <span className="inline-flex items-center gap-2 text-fg-blue font-semibold group-hover:gap-3 transition-all">
          {update.linkText}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </span>
      </div>
    </motion.a>
  )
}

function TestimonialQuote() {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-2xl p-6 shadow-sm border border-fg-navy/5 h-full flex flex-col justify-center"
    >
      <div className="flex flex-col items-center text-center">
        <div className="relative w-36 h-36 rounded-2xl overflow-hidden flex-shrink-0 ring-4 ring-fg-blue/20 mb-4">
          <Image
            src="/images/rimy-morris-2.png"
            alt="Rimy Morris"
            fill
            className="object-cover"
          />
        </div>
        <blockquote className="text-fg-navy/80 text-lg leading-relaxed italic mb-3">
          "I had so much fun and truly needed all of the holiday spirit and community in this event! Felt like one big happy family"
        </blockquote>
        <p className="text-sm text-fg-navy/50">
          <span className="font-semibold text-fg-navy text-base">Rimy Morris</span> · 2024 Gingerbread Participant
        </p>
      </div>
    </motion.div>
  )
}

function UpdateCard({ update }: { update: Update }) {
  const config = typeConfig[update.type]
  const Icon = config.icon
  const isExternal = update.link.startsWith('http')

  return (
    <motion.a
      href={update.link}
      {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
      variants={itemVariants}
      className="group block bg-white rounded-2xl shadow-sm border border-fg-navy/5 overflow-hidden h-full"
    >
      {/* Thumbnail */}
      {update.image && (
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={update.image}
            alt={update.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      <div className="p-4">
        {/* Badge */}
        <div className="flex items-center gap-2 mb-2">
          <div className={`p-1.5 rounded-md ${config.color}`}>
            <Icon className="w-3 h-3 text-white" aria-hidden="true" />
          </div>
          <span className="text-sm font-semibold text-fg-navy/50 uppercase tracking-wider">
            {config.label}
          </span>
        </div>

        <h3 className="text-base font-bold text-fg-navy group-hover:text-fg-blue transition-colors line-clamp-2 mb-3 leading-snug">
          {update.title}
        </h3>

        <span className="inline-flex items-center gap-1 text-fg-blue font-semibold text-sm group-hover:gap-2 transition-all">
          {update.linkText}
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </span>
      </div>
    </motion.a>
  )
}

function EventsSection({ events, loading }: { events: CircleEvent[]; loading: boolean }) {
  return (
    <motion.div variants={itemVariants}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-fg-navy">Upcoming Events</h3>
        <a
          href="https://community.fostergreatness.co/c/general-events"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-fg-blue hover:text-fg-navy transition-colors"
        >
          View All
        </a>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 bg-fg-navy/5 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {events.slice(0, 3).map((event) => {
            const eventDate = new Date(event.starts_at)
            const month = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
            const day = eventDate.getDate()
            const time = eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })

            return (
              <a
                key={event.id}
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col rounded-xl bg-white border border-fg-navy/5 shadow-sm hover:shadow-md hover:border-fg-blue/30 transition-all group text-center overflow-hidden"
              >
                {event.cover_image_url && (
                  <div className="relative w-full h-24">
                    <Image
                      src={event.cover_image_url}
                      alt={event.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-3 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-lg bg-fg-navy flex flex-col items-center justify-center text-white mb-2 -mt-7 relative z-10 shadow-md">
                    <span className="text-[8px] font-bold leading-none opacity-80">{month}</span>
                    <span className="text-base font-bold leading-none">{day}</span>
                  </div>
                  <p className="font-semibold text-sm text-fg-navy group-hover:text-fg-blue transition-colors line-clamp-2 leading-tight">
                    {event.name}
                  </p>
                  <p className="text-sm text-fg-navy/50 mt-1">{time}</p>
                </div>
              </a>
            )
          })}
        </div>
      ) : (
        <p className="text-fg-navy/50">No upcoming events</p>
      )}
    </motion.div>
  )
}

function NewsletterSection({ newsletters, loading }: { newsletters: Newsletter[]; loading: boolean }) {
  return (
    <motion.div variants={itemVariants}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-fg-navy">Latest Newsletters</h3>
        <a
          href="https://fostergreatness.beehiiv.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-fg-blue hover:text-fg-navy transition-colors"
        >
          View All
        </a>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-fg-navy/5 overflow-hidden animate-pulse">
              <div className="h-32 bg-fg-navy/5" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-fg-navy/5 rounded" />
                <div className="h-4 bg-fg-navy/5 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : newsletters.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {newsletters.map((newsletter) => (
            <a
              key={newsletter.id}
              href={newsletter.web_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-xl border border-fg-navy/5 shadow-sm hover:shadow-md hover:border-fg-blue/30 transition-all overflow-hidden group"
            >
              {newsletter.thumbnail_url && (
                <div className="relative w-full h-32 overflow-hidden">
                  <Image
                    src={newsletter.thumbnail_url}
                    alt={newsletter.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-3">
                <h4 className="font-bold text-sm text-fg-navy group-hover:text-fg-blue transition-colors line-clamp-2 mb-2">
                  {newsletter.title}
                </h4>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-fg-blue group-hover:gap-2 transition-all">
                  Read
                  <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </span>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <p className="text-fg-navy/50 text-sm">No newsletters available</p>
      )}
    </motion.div>
  )
}

function CommunitySection() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="mt-8 md:mt-10"
    >
      <div className="bg-fg-navy rounded-3xl p-6 md:p-10 lg:p-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
              More than a platform—<br />a family.
            </h2>
            <p className="text-lg text-white/80 leading-relaxed mb-8">
              Foster Greatness is led by people who've lived through the foster system. Whether you need help with housing, want to share your story, or just need to know you're not alone—we've got you.
            </p>
            <a
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-fg-navy font-semibold rounded-full hover:bg-fg-blue hover:text-white transition-colors"
            >
              About Foster Greatness
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </motion.div>

          {/* Image */}
          <motion.div variants={itemVariants} className="relative h-64 sm:h-80 lg:h-96">
            <Image
              src="/images/digital-community-image.png"
              alt="Foster Greatness community members"
              fill
              className="object-contain"
            />
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

const communityFeatures = [
  {
    title: 'Resource Support',
    description: 'One-on-one support with dedicated professionals for housing, benefits, and more.',
    image: '/images/community-screenshot-1.png',
    cta: 'Request Support',
    link: 'https://community.fostergreatness.co/c/resource-specialist/',
    featured: true,
  },
  {
    title: 'Learning Workshops',
    description: 'Free expert-led workshops on financial literacy, career skills, and wellness.',
    image: '/images/community-screenshot-2.png',
    cta: 'Browse Workshops',
    link: 'https://community.fostergreatness.co/c/general-events',
  },
  {
    title: 'Community Events',
    description: 'Quarterly gatherings—cooking nights, open mics, paint nights—building real connections.',
    image: '/images/community-feature.png',
    cta: 'See Upcoming Events',
    link: 'https://community.fostergreatness.co/c/general-events',
  },
  {
    title: 'Panel Discussions',
    description: 'Leaders and advocates with lived experience tackling issues that matter to you.',
    image: '/images/panel-screenshot.png',
    cta: 'Watch Past Panels',
    link: 'https://community.fostergreatness.co/c/thriver-stories-discussions/',
  },
  {
    title: 'Employment Support Program',
    description: 'Direct employment support through Staffmark Group, connecting you to personal support for 1:1 interviews, resume help and more.',
    image: '/images/community-member-1.jpg',
    cta: 'Explore Opportunities',
    link: 'https://community.fostergreatness.co/c/employment',
    featured: true,
  },
  {
    title: 'Resource Finder',
    description: 'Instant access to local benefits, food support, healthcare, and housing resources.',
    image: '/images/resource-finder.jpeg',
    cta: 'Find Resources',
    link: 'https://community.fostergreatness.co/c/find-help-foster-greatness/',
  },
]

const voiceAmplificationItems = [
  {
    title: 'Thriver Stories',
    description: 'Host Isabel Stasa interviews FG Community members and advocates, sharing their stories of strength and resilience. New videos weekly!',
    image: '/images/thriver-stories.jpg',
    cta: 'Watch Episodes',
    link: '/storytellers-collective',
  },
  {
    title: 'Events & Workshops',
    description: 'Workshops, panels, community-building events, and much more! Explore our latest live events happening now.',
    image: '/images/panel-screenshot.png',
    cta: 'View Events',
    link: 'https://community.fostergreatness.co/c/general-events',
  },
  {
    title: 'Newsletter',
    description: 'Stay updated without joining the community. We share all our latest news and updates monthly.',
    image: '/images/newsletter-feature.jpg',
    cta: 'Read Newsletter',
    link: '/newsletter',
  },
]

const testimonials = [
  {
    name: 'Zoey Dunkel',
    quote: "Foster Greatness has given me hope during some of my hardest moments. The team made me feel seen, cared for, and not alone.",
    avatar: null,
    initials: 'ZD',
    color: 'from-fg-navy to-fg-blue'
  },
  {
    name: 'Majd Abdallah',
    quote: "A centralized platform like Foster Greatness has been missing for foster kids and under resource people for so long. Y'all are seriously trailblazing!",
    avatar: '/images/majd-abdallah.jpg',
    initials: 'MA',
    color: 'from-fg-navy to-fg-blue'
  },
  {
    name: 'Michael Davis-Thomas',
    quote: "Through Foster Greatness, I discovered a renewed sense of purpose, which has fueled personal growth and boosted my professional confidence.",
    avatar: '/images/michael-davis-thomas.jpg',
    initials: 'MD',
    color: 'from-fg-navy to-fg-blue'
  },
  {
    name: 'Taylor Rockhold',
    quote: "Foster Greatness helped me tap into strengths I didn't even know I had.",
    avatar: '/images/taylor-rockhold.jpg',
    initials: 'TR',
    color: 'from-fg-navy to-fg-blue'
  },
  {
    name: 'Eugenia Doreen',
    quote: "Foster Greatness is more than an organization—it's a movement rooted in innovation, transformation, and joy.",
    avatar: '/images/eugenia-wallace.jpg',
    initials: 'ED',
    color: 'from-fg-navy to-fg-blue'
  },
  {
    name: 'Julie Ong',
    quote: "As I enter CSU for the fall semester, I know I can count on Foster Greatness for their continued support and helpful resources!",
    avatar: null,
    initials: 'JO',
    color: 'from-fg-navy to-fg-blue'
  },
  {
    name: 'Jessica Patino',
    quote: "Because of their consistent support, I feel stronger, connected, and equipped to build a brighter future for my family too.",
    avatar: null,
    initials: 'JP',
    color: 'from-fg-navy to-fg-blue'
  },
  {
    name: 'Emmerald Evans',
    quote: "They didn't just ask me to share my story—they gave me the tools to shape it, own it, and use it to make an impact.",
    avatar: '/images/emmerald-evans.jpg',
    initials: 'EE',
    color: 'from-fg-navy to-fg-blue'
  },
  {
    name: 'Chyenne Santini',
    quote: "Having the opportunity to be part of the very first cohort of the Storyteller Collective ignited a fire of inspiration within me.",
    avatar: '/images/chyenne-roan-santini.jpg',
    initials: 'CS',
    color: 'from-fg-navy to-fg-blue'
  },
  {
    name: 'Stormy Lukasavage',
    quote: "Foster Greatness pioneers the concept of involved participation and takes it to the next level by making it accessible and open.",
    avatar: '/images/stormy-lukasavage.jpg',
    initials: 'SL',
    color: 'from-fg-navy to-fg-blue'
  },
]

function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [cardsToShow, setCardsToShow] = useState(3)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardsToShow(1)
      } else if (window.innerWidth < 1024) {
        setCardsToShow(2)
      } else {
        setCardsToShow(3)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const maxIndex = Math.max(0, testimonials.length - cardsToShow)

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.min(index, maxIndex))
  }

  return (
    <motion.div
      variants={itemVariants}
      className="mt-8 pt-8 border-t border-fg-navy/10"
    >
      <div className="text-center mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-fg-navy mb-2">
          What Our Community Says
        </h3>
        <p className="text-fg-navy/60 max-w-2xl mx-auto text-sm">
          Real stories from people who've found connection, support, and hope.
        </p>
      </div>

      <div className="relative">
        {/* Carousel container */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / cardsToShow)}%)`,
            }}
          >
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="flex-shrink-0 px-2"
                style={{ width: `${100 / cardsToShow}%` }}
              >
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-fg-navy/5 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 relative flex-shrink-0">
                      {t.avatar ? (
                        <Image
                          src={t.avatar}
                          alt={t.name}
                          fill
                          className="rounded-full object-cover ring-2 ring-fg-blue/20"
                        />
                      ) : (
                        <div className={`w-full h-full rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center ring-2 ring-fg-blue/20`}>
                          <span className="text-white font-bold">{t.initials}</span>
                        </div>
                      )}
                    </div>
                    <p className="font-bold text-fg-navy">{t.name}</p>
                  </div>
                  <blockquote className="text-fg-navy/80 leading-relaxed flex-1 text-sm">
                    "{t.quote}"
                  </blockquote>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 bg-white rounded-full p-2 shadow-md border border-fg-navy/10 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-fg-navy/5 transition-colors z-10"
          aria-label="Previous testimonials"
        >
          <ChevronLeft className="w-4 h-4 text-fg-navy" />
        </button>
        <button
          onClick={goToNext}
          disabled={currentIndex >= maxIndex}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 bg-white rounded-full p-2 shadow-md border border-fg-navy/10 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-fg-navy/5 transition-colors z-10"
          aria-label="Next testimonials"
        >
          <ChevronRight className="w-4 h-4 text-fg-navy" />
        </button>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-fg-blue' : 'bg-fg-navy/20'
            }`}
            aria-label={`Go to testimonial group ${index + 1}`}
          />
        ))}
      </div>
    </motion.div>
  )
}

function ContactSection() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
      className="mt-10 md:mt-12"
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-fg-navy via-fg-navy to-fg-blue/80">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-fg-blue/20 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-fg-coral/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />

        <div className="relative p-8 md:p-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Content */}
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Mail className="w-4 h-4 text-fg-blue" />
                <span className="text-sm font-semibold text-white/90">We'd love to hear from you</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                Let's Connect
              </h2>
              <p className="text-lg text-white/80 leading-relaxed mb-8">
                Whether you're a foster youth looking for support, an organization wanting to partner, or someone who wants to make a difference—reach out. We're here for you.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="mailto:info@fostergreatness.co"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-fg-navy font-semibold rounded-full hover:bg-fg-blue hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Email Us
                </a>
                <a
                  href="https://community.fostergreatness.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-transparent text-white font-semibold rounded-full border-2 border-white/30 hover:bg-white/10 transition-colors"
                >
                  Join Community
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>

            {/* Typeform */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div
                data-tf-live="01KAF384A3ZB71SN3JRSRCSWAD"
                className="w-full min-h-[450px]"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

function AppDownloadSection() {
  const appLinks = [
    {
      name: 'App Store',
      image: '/images/badge-apple.png',
      url: 'https://apps.apple.com/us/app/foster-greatness-community/id6456409836',
      alt: 'Download on the App Store'
    },
    {
      name: 'Google Play',
      image: '/images/badge-google-play.png',
      url: 'https://play.google.com/store/apps/details?id=co.circle.fostergreatness&hl=en_US',
      alt: 'Get it on Google Play'
    },
    {
      name: 'Desktop',
      image: '/images/badge-desktop.png',
      url: 'https://community.fostergreatness.co/home',
      alt: 'Access on Desktop'
    },
  ]

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
      className="mt-10 md:mt-12"
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-fg-navy via-fg-navy to-fg-blue">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-fg-coral/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative p-8 md:p-12 text-center">
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Join Our Community
            </h2>
            <p className="text-white/80 max-w-xl mx-auto mb-8 text-lg">
              Connect with fellow foster youth, access resources, and find your people. Available everywhere you are.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center items-center gap-4 md:gap-6"
          >
            {appLinks.map((app) => (
              <a
                key={app.name}
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-all hover:scale-105 hover:brightness-110"
              >
                <Image
                  src={app.image}
                  alt={app.alt}
                  width={180}
                  height={54}
                  className="h-12 md:h-14 w-auto"
                />
              </a>
            ))}
          </motion.div>

          <motion.p variants={itemVariants} className="mt-6 text-white/60 text-sm">
            Free to join. No credit card required.
          </motion.p>
        </div>
      </div>
    </motion.section>
  )
}

function DGWBrandedSection() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
      className="mt-10 md:mt-12"
    >
      <motion.div variants={itemVariants} className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-fg-navy mb-3">
          Powered by Purpose
        </h2>
        <p className="text-fg-navy/60 max-w-2xl mx-auto">
          Our unique social enterprise model means we're not dependent on government funding.
        </p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl border border-fg-navy/10"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,103,162,0.08),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(255,111,97,0.08),transparent_50%)]" />

        <div className="relative p-8 md:p-12">
          {/* Flow diagram */}
          <div className="grid md:grid-cols-3 gap-6 md:gap-4 items-center">
            {/* DGW Branded */}
            <div className="text-center">
              <div className="inline-block bg-white rounded-2xl shadow-lg border border-fg-navy/5 mb-4 overflow-hidden">
                <Image
                  src="/images/partners/10.png"
                  alt="DGW Branded"
                  width={200}
                  height={200}
                  className="w-32 h-32 object-contain"
                />
              </div>
              <h3 className="font-bold text-fg-navy mb-2">DGW Branded</h3>
              <p className="text-sm text-fg-navy/60">
                Merchandise with meaning. Every purchase tells a story.
              </p>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-24 h-0.5 bg-gradient-to-r from-fg-navy to-fg-blue" />
                <span className="text-xs font-semibold text-fg-navy/40 uppercase tracking-wider">Funds</span>
              </div>
            </div>
            <div className="md:hidden flex justify-center">
              <div className="w-0.5 h-8 bg-gradient-to-b from-fg-navy to-fg-blue" />
            </div>

            {/* Foster Greatness */}
            <div className="text-center">
              <div className="inline-block rounded-2xl shadow-lg mb-4 overflow-hidden">
                <Image
                  src="/images/fg-icon.png"
                  alt="Foster Greatness"
                  width={128}
                  height={128}
                  className="w-32 h-32"
                />
              </div>
              <h3 className="font-bold text-fg-navy mb-2">Foster Greatness</h3>
              <p className="text-sm text-fg-navy/60">
                Resource support, workshops, community tech, and crisis funding.
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="mt-10 pt-8 border-t border-fg-navy/10 text-center max-w-2xl mx-auto">
            <p className="text-fg-navy/70 leading-relaxed mb-6">
              When businesses choose DGW Branded, they're not just buying merchandise – they're investing in scholarships, job training, and lifelong support systems for foster youth.
            </p>
            <a
              href="https://www.dgwbranded.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-fg-navy hover:bg-fg-navy/90 text-white font-semibold px-6 py-3 rounded-full transition-colors"
            >
              Learn More About DGW Branded
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </motion.div>
    </motion.section>
  )
}

function PartnersSection() {
  // Partners 1-9, excluding 10 (DGW Branded logo)
  const partners = Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    image: `/images/partners/${i + 1}.png`,
    alt: `Partner ${i + 1}`
  }))

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
      className="mt-10 md:mt-12"
    >
      <motion.div variants={itemVariants} className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-fg-navy mb-3">
          Our Partners
        </h2>
        <p className="text-fg-navy/60 max-w-2xl mx-auto">
          We're grateful to work alongside these incredible organizations in supporting foster youth.
        </p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl p-8 shadow-sm border border-fg-navy/5"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-10 items-center justify-items-center">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="w-full max-w-[160px] h-24 relative grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300"
            >
              <Image
                src={partner.image}
                alt={partner.alt}
                fill
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </motion.div>
    </motion.section>
  )
}

function VoiceAmplificationSection() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
      className="mt-10 md:mt-12 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-10 bg-fg-blue/[0.03] rounded-3xl"
    >
      <motion.div variants={itemVariants} className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-fg-navy mb-3">
          Amplifying Lived Experience Voices
        </h2>
        <p className="text-fg-navy/60 max-w-2xl mx-auto">
          We amplify the voices of those with lived experience through workshops, podcast episodes, and panel events—empowering individuals by sharing their stories.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-3 gap-5">
        {voiceAmplificationItems.map((item) => (
          <motion.a
            key={item.title}
            href={item.link}
            {...(item.link.startsWith('http') && { target: "_blank", rel: "noopener noreferrer" })}
            variants={itemVariants}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-fg-navy/5 group hover:shadow-md hover:border-fg-blue/30 transition-all block"
          >
            <div className="relative h-44 w-full overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5">
              <h3 className="font-bold text-lg text-fg-navy group-hover:text-fg-blue transition-colors mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-fg-navy/70 leading-relaxed mb-3">
                {item.description}
              </p>
              <span className="inline-flex items-center gap-1 text-fg-blue font-semibold text-sm group-hover:gap-2 transition-all">
                {item.cta}
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </span>
            </div>
          </motion.a>
        ))}
      </div>
    </motion.section>
  )
}

function WhatYoullGetSection() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
      className="mt-10 md:mt-12 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-10 bg-fg-navy/[0.02] rounded-3xl"
    >
      <motion.div variants={itemVariants} className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-fg-navy mb-3">
          What You'll Get Access To
        </h2>
        <p className="text-fg-navy/60 max-w-2xl mx-auto">
          Support, community, and opportunities built by people who understand.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {communityFeatures.map((feature) => (
          <motion.a
            key={feature.title}
            href={feature.link}
            {...(feature.link.startsWith('http') && { target: "_blank", rel: "noopener noreferrer" })}
            variants={itemVariants}
            className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-fg-navy/5 group hover:shadow-md hover:border-fg-blue/30 transition-all block ${
              feature.featured ? 'sm:col-span-2 lg:col-span-1' : ''
            }`}
          >
            <div className="relative h-40 w-full overflow-hidden">
              <Image
                src={feature.image}
                alt={feature.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5">
              <h3 className="font-bold text-lg text-fg-navy group-hover:text-fg-blue transition-colors mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-fg-navy/70 leading-relaxed mb-3">
                {feature.description}
              </p>
              <span className="inline-flex items-center gap-1 text-fg-blue font-semibold text-sm group-hover:gap-2 transition-all">
                {feature.cta}
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </span>
            </div>
          </motion.a>
        ))}
      </div>

      <motion.div variants={itemVariants} className="text-center mt-8">
        <a
          href="https://community.fostergreatness.co"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-fg-navy text-white font-semibold rounded-full hover:bg-fg-blue transition-colors"
        >
          Join the Community
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </a>
      </motion.div>
    </motion.section>
  )
}

export default function Home() {
  const { featured, updates: allUpdates } = updatesData as { featured: string; updates: Update[] }
  // Filter out unpublished updates (published: false). If published is undefined, default to true
  const updates = allUpdates.filter(u => u.published !== false)
  const [events, setEvents] = useState<CircleEvent[]>([])
  const [eventsLoading, setEventsLoading] = useState(true)
  const [newsletters, setNewsletters] = useState<Newsletter[]>([])
  const [newsletterLoading, setNewsletterLoading] = useState(true)

  const featuredUpdate = updates.find(u => u.id === featured)
  const otherUpdates = updates.filter(u => u.id !== featured)

  // Fetch upcoming events from Circle.so
  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('https://circle-events-widget-23sx.vercel.app/api/events')
        if (!response.ok) throw new Error('Failed to fetch')
        const data = await response.json()

        const allEvents = data.records || data || []
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const filteredEvents = allEvents
          .filter((event: CircleEvent) => {
            const isGeneralEvents = event.space?.slug === 'general-events'
            const eventDate = new Date(event.starts_at)
            eventDate.setHours(0, 0, 0, 0)
            return isGeneralEvents && eventDate >= today
          })
          .sort((a: CircleEvent, b: CircleEvent) =>
            new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()
          )
          .slice(0, 3)

        setEvents(filteredEvents)
      } catch (err) {
        console.error(err)
      } finally {
        setEventsLoading(false)
      }
    }
    fetchEvents()
  }, [])

  // Fetch latest newsletters from Beehiiv
  useEffect(() => {
    async function fetchNewsletters() {
      try {
        const response = await fetch('/api/newsletter')
        if (!response.ok) throw new Error('Failed to fetch')
        const data = await response.json()
        setNewsletters(data)
      } catch (err) {
        console.error(err)
      } finally {
        setNewsletterLoading(false)
      }
    }
    fetchNewsletters()
  }, [])

  return (
    <div className="min-h-screen bg-[#fafbfc] relative">
      {/* Subtle texture */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231a2949' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative w-full py-6 sm:py-8 md:py-10 px-4 sm:px-6 md:px-8 lg:px-12 max-w-screen-2xl mx-auto">
        {/* Hero Section */}
        <HeroSection />

        {/* Featured Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="mb-4 md:mb-6 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8 bg-fg-coral/[0.03] rounded-3xl"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-fg-navy">What's Happening</h2>
            <p className="text-fg-navy/60 mt-1">Latest news, events, and opportunities from our community</p>
          </motion.div>

          {/* Featured card + Testimonial quote side by side (2:1 ratio) */}
          <div className="grid md:grid-cols-3 gap-6 items-stretch mb-8">
            <div className="md:col-span-2">
              {featuredUpdate && <FeaturedCard update={featuredUpdate} />}
            </div>
            <TestimonialQuote />
          </div>

          {/* Testimonials Carousel - inside What's Happening */}
          <TestimonialSection />
        </motion.section>

        {/* Updates as news feed with images */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="mb-10 md:mb-12"
        >
          <div className="space-y-4 mb-8">
            {otherUpdates.map((update) => {
              const config = typeConfig[update.type]
              const Icon = config.icon
              const isExternal = update.link.startsWith('http')
              return (
                <motion.a
                  key={update.id}
                  href={update.link}
                  {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
                  variants={itemVariants}
                  className="block group"
                >
                  <div className="bg-white rounded-xl shadow-sm border border-fg-navy/5 group-hover:shadow-md group-hover:border-fg-blue/30 transition-all overflow-hidden">
                    <div className="flex flex-col sm:flex-row">
                      {/* Image */}
                      {update.image && (
                        <div className="relative w-full sm:w-48 h-32 sm:h-auto flex-shrink-0">
                          <Image
                            src={update.image}
                            alt={update.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-4 flex-1">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${config.color} text-white mb-2`}>
                              <Icon className="w-3 h-3" />
                              {config.label}
                            </span>
                            <h3 className="font-bold text-fg-navy group-hover:text-fg-blue transition-colors">
                              {update.title}
                            </h3>
                          </div>
                          <span className="text-xs text-fg-navy/50 whitespace-nowrap">
                            {new Date(update.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-sm text-fg-navy/70 leading-relaxed mb-3">
                          {update.description}
                        </p>
                        <span className="inline-flex items-center gap-1 text-fg-blue font-semibold text-sm group-hover:gap-2 transition-all">
                          {update.cta || update.linkText}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.a>
              )
            })}
          </div>

          {/* Events - full width */}
          <div className="mb-8">
            <EventsSection events={events} loading={eventsLoading} />
          </div>

          {/* Newsletters - full width */}
          <NewsletterSection newsletters={newsletters} loading={newsletterLoading} />
        </motion.section>

        {/* What You'll Get Access To - Value prop first */}
        <WhatYoullGetSection />

        {/* Community Section */}
        <CommunitySection />

        {/* Amplifying Lived Experience Voices */}
        <VoiceAmplificationSection />

        {/* DGW Branded - Social Enterprise */}
        <DGWBrandedSection />

        {/* Partners */}
        <PartnersSection />

        {/* Contact Form */}
        <ContactSection />

        {/* App Download Section */}
        <AppDownloadSection />
      </div>

      {/* Typeform Embed Script */}
      <Script src="//embed.typeform.com/next/embed.js" strategy="afterInteractive" />
    </div>
  )
}
