import type { Metadata } from 'next';
import { generatePageMetadata, generateBreadcrumbJsonLd, generateFaqJsonLd, siteConfig } from '@/lib/seo';

const impactFaqs = [
  {
    question: "What is Foster Greatness's impact?",
    answer: "In 2025, Foster Greatness grew to 2,150+ community members (1,042 new), hosted 62 events including 34 community gatherings and 22 workshops, served 178 individuals through resource navigation, and fulfilled 220 resource requests."
  },
  {
    question: "How many foster youth does Foster Greatness serve?",
    answer: "Foster Greatness serves 2,150++ current and former foster youth nationwide as of 2025, with 1,042 new members joining in 2025 alone. The community has no age limit — support lasts a lifetime."
  },
  {
    question: "What kind of events does Foster Greatness host for foster youth?",
    answer: "Foster Greatness hosted 62 events in 2025: 34 community gatherings (holiday celebrations, cooking events, support spaces), 22 learning workshops (financial literacy, storytelling, career skills), and featured 24 lived experience panelists sharing their journeys."
  },
  {
    question: "What resources does Foster Greatness provide?",
    answer: "Foster Greatness received 220 resource requests in 2025, serving 178 individuals. Top needs included housing & rent (94 requests), employment (65), education (52), transportation (48), financial assistance (43), and food & groceries (25). 100% of members who made a resource request needed community and peer support to access that support."
  },
  {
    question: "What is the Storytellers Collective?",
    answer: "The Storytellers Collective is Foster Greatness's pilot program training foster youth to own their narratives through professional media training, premium storyteller kits, and a national platform. The 2025 cohort included 7 storytellers, including Taylor Rockhold whose work led Delaware to adopt the Storytelling Companion statewide."
  },
  {
    question: "What is the National Network for Fostering Sibling Connections?",
    answer: "The National Network for Fostering Sibling Connections (NNFSC) operates under Foster Greatness's fiscal sponsorship. Founded by Lily Colby, Esq., NNFSC trained 500+ state and local leaders, built a network of 200+ volunteers, launched 50-state legal research, created the nation's first Sibling Connections Healing Circles, and raised $40,000+ in its first year — all to ensure sibling relationships are no longer treated as optional in foster care."
  },
];

export const metadata: Metadata = generatePageMetadata({
  title: '2025 Impact Report — Foster Greatness',
  description: 'See how Foster Greatness is fighting isolation and building community for foster youth. 2,150+ members, 62 events, 178 individuals supported, 7 storytellers trained, and NNFSC fiscal sponsorship launched. Read our 2025 impact report.',
  path: '/impact',
});

export default function ImpactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: siteConfig.url },
    { name: '2025 Impact Report', url: `${siteConfig.url}/impact` },
  ]);

  const faqJsonLd = generateFaqJsonLd(impactFaqs);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: '2025 Impact Report: No One Should Navigate Life Alone',
    description: 'Foster Greatness 2025 annual impact report. 2,150+ community members, 62 events hosted, 178 individuals served through resource navigation, Storytellers Collective pilot, and NNFSC fiscal sponsorship.',
    author: {
      '@type': 'Organization',
      name: 'Foster Greatness',
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Foster Greatness',
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/images/fg-icon.png`,
      },
    },
    datePublished: '2026-01-15',
    dateModified: '2026-03-12',
    mainEntityOfPage: `${siteConfig.url}/impact`,
    image: `${siteConfig.url}/images/impact/storyteller-collective.jpg`,
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
          __html: JSON.stringify(articleJsonLd),
        }}
      />
      {children}
    </>
  );
}
