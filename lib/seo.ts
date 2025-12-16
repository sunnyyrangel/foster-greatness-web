import type { Metadata } from 'next'

const siteUrl = 'https://www.fostergreatness.co'

export const siteConfig = {
  name: 'Foster Greatness',
  description: 'Lifelong community and belonging for current and former foster youth nationwide. Built by and for people with lived foster care experience.',
  url: siteUrl,
  ogImage: `${siteUrl}/images/platform-preview.webp`,
  email: 'info@fostergreatness.co',
  social: {
    instagram: 'https://www.instagram.com/fostergreatness',
    facebook: 'https://www.facebook.com/fostergreatness1/',
    linkedin: 'https://www.linkedin.com/company/fostergreatness',
    youtube: 'https://www.youtube.com/@fostergreatness',
  },
  keywords: [
    'foster youth community',
    'foster care alumni support',
    'former foster youth resources',
    'aging out of foster care',
    'lived experience foster care',
    'foster youth support',
    'foster care peer support',
    'transition age foster youth',
    'foster youth nationwide',
    'foster care community platform',
    'foster youth organization',
    'foster care alumni',
    'foster youth employment support',
    'foster youth housing resources',
    'foster youth education support',
  ],
}

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Foster Greatness | Lifelong Community for Foster Youth Nationwide',
    template: '%s | Foster Greatness',
  },
  description: 'Join 2,000+ current and former foster youth in a lived experience-led community. Access peer support, resources, employment help, and lifelong belonging. No age limit. Free to join.',
  keywords: siteConfig.keywords,
  authors: [{ name: 'Foster Greatness', url: siteUrl }],
  creator: 'Foster Greatness',
  publisher: 'Foster Greatness',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Foster Greatness',
    title: 'Foster Greatness | Lifelong Community for Foster Youth Nationwide',
    description: 'Join 2,000+ current and former foster youth in a lived experience-led community. Access peer support, resources, employment help, and lifelong belonging.',
    images: [
      {
        url: `${siteUrl}/images/platform-preview.webp`,
        width: 600,
        height: 450,
        alt: 'Foster Greatness community platform showing feed, events, and support options',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Foster Greatness | Lifelong Community for Foster Youth Nationwide',
    description: 'Join 2,000+ current and former foster youth in a lived experience-led community. Access peer support, resources, and lifelong belonging.',
    images: [`${siteUrl}/images/platform-preview.webp`],
    creator: '@fostergreatness',
  },
  verification: {
    // Add your Google Search Console verification code here after setting up GSC
    // Get this from: Google Search Console > Settings > Ownership verification > HTML tag
    // google: 'your-google-verification-code',

    // Bing Webmaster Tools verification (also covers Yahoo, DuckDuckGo)
    // Get this from: Bing Webmaster Tools > Site > Verify ownership
    // other: {
    //   'msvalidate.01': 'your-bing-verification-code',
    // },
  },
  category: 'nonprofit',
}

// Organization structured data for JSON-LD
export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'NonprofitOrganization',
  '@id': `${siteUrl}/#organization`,
  name: 'Foster Greatness',
  alternateName: 'FG',
  url: siteUrl,
  logo: {
    '@type': 'ImageObject',
    url: `${siteUrl}/images/fg-icon.png`,
    width: 512,
    height: 512,
  },
  image: `${siteUrl}/images/platform-preview.webp`,
  description: 'Foster Greatness is a lived experience-led nonprofit creating lifelong community and belonging for current and former foster youth nationwide.',
  foundingDate: '2020',
  email: 'info@fostergreatness.co',
  sameAs: [
    siteConfig.social.instagram,
    siteConfig.social.facebook,
    siteConfig.social.linkedin,
    siteConfig.social.youtube,
  ],
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'US',
  },
  areaServed: {
    '@type': 'Country',
    name: 'United States',
  },
  knowsAbout: [
    'Foster Care',
    'Foster Youth Support',
    'Aging Out of Foster Care',
    'Foster Care Alumni',
    'Youth Transition Services',
    'Peer Support',
    'Resource Navigation',
  ],
  slogan: 'A community you never age out of.',
  nonprofitStatus: 'Nonprofit501c3',
}

// Website structured data for JSON-LD
export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  url: siteUrl,
  name: 'Foster Greatness',
  description: 'Lifelong community and belonging for current and former foster youth nationwide.',
  publisher: {
    '@id': `${siteUrl}/#organization`,
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteUrl}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

// Helper function to generate page-specific metadata
export function generatePageMetadata({
  title,
  description,
  path = '',
  image,
  noIndex = false,
}: {
  title: string
  description: string
  path?: string
  image?: string
  noIndex?: boolean
}): Metadata {
  const url = `${siteUrl}${path}`
  const ogImage = image || `${siteUrl}/images/platform-preview.webp`

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      title,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  }
}

// FAQ structured data generator
export function generateFaqJsonLd(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

// Breadcrumb structured data generator
export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
