import type { Metadata } from 'next';
import { generatePageMetadata, generateBreadcrumbJsonLd, generateFaqJsonLd, siteConfig } from '@/lib/seo';

const servicesFaqs = [
  {
    question: "How do I find local resources for foster youth?",
    answer: "Use the Foster Greatness Resource Finder at fostergreatness.co/services. Enter your ZIP code to search thousands of free and low-cost programs across 8 categories: food, housing, healthcare, employment, education, transportation, legal services, and family & childcare. Results include community-recommended programs and curated guides."
  },
  {
    question: "What kind of services can foster youth find on this page?",
    answer: "The Resource Finder covers 8 categories of social services: Food & Nutrition (SNAP, food pantries, meals), Housing & Shelter (rent assistance, shelters, utilities), Healthcare (medical, dental, mental health, substance abuse), Employment & Income (job training, career services, financial assistance), Education (tutoring, GED, college, scholarships), Transportation (transit passes, car programs), Legal Services (legal aid, immigration, court), and Family & Childcare."
  },
  {
    question: "Is the Resource Finder free to use?",
    answer: "Yes, the Resource Finder is completely free. You do not need to be a Foster Greatness member to search for services. Simply enter your ZIP code and browse available programs in your area."
  },
  {
    question: "What is the Benefits Screener?",
    answer: "The Benefits Screener helps community members identify government programs and benefits they may qualify for — from housing assistance and SNAP to education grants and healthcare. It screens for dozens of federal and state benefits in one place."
  },
  {
    question: "Can I suggest a resource to be added?",
    answer: "Yes! Visit fostergreatness.co/suggest-resource to recommend a local program or service. Nonprofits, community members, and those with lived experience can submit resources. All submissions are reviewed by our team to ensure quality and relevance before being added."
  },
  {
    question: "Do I need to prove my foster care status to use these resources?",
    answer: "No. The Resource Finder is available to everyone. Many of the programs listed serve all eligible individuals, not just foster youth. Foster Greatness does not require proof of foster care status to access our tools or community."
  },
];

export const metadata: Metadata = generatePageMetadata({
  title: 'Find Local Services & Resources for Foster Youth',
  description: 'Search thousands of free programs by ZIP code. Find food, housing, healthcare, employment, education, transportation, legal, and family services near you. Includes Benefits Screener and community-recommended resources.',
  path: '/services',
});

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: siteConfig.url },
    { name: 'Find Services', url: `${siteConfig.url}/services` },
  ]);

  const faqJsonLd = generateFaqJsonLd(servicesFaqs);

  const webAppJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Foster Greatness Resource Finder',
    url: `${siteConfig.url}/services`,
    description: 'Search thousands of free and low-cost social service programs by ZIP code across 8 categories including food, housing, healthcare, employment, education, transportation, legal services, and family & childcare.',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    provider: {
      '@type': 'Organization',
      name: 'Foster Greatness',
      url: siteConfig.url,
    },
    featureList: [
      'ZIP code-based local service search',
      'Eight SDOH categories',
      'Community-recommended resources',
      'Benefits screener',
      'Resource board to save programs',
      'Map view of nearby services',
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webAppJsonLd),
        }}
      />
      {children}
    </>
  );
}
