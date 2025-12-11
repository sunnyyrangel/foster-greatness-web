import type { Metadata } from 'next';
import { generatePageMetadata, generateBreadcrumbJsonLd, generateFaqJsonLd, siteConfig } from '@/lib/seo';

const agingOutFaqs = [
  {
    question: "What does aging out of foster care mean?",
    answer: "Aging out of foster care refers to when a young person reaches the age limit for foster care services (typically 18-21 depending on the state) and must leave the foster care system. This transition often happens without the family support network that most young adults rely on."
  },
  {
    question: "What age do you age out of foster care?",
    answer: "In most states, youth age out of foster care at 18. However, many states have extended foster care programs that allow youth to remain in care until 21. Some states like California extend support until age 26 for certain benefits."
  },
  {
    question: "What happens when you age out of foster care?",
    answer: "When youth age out, they lose access to foster care services and must navigate housing, employment, education, and healthcare independently. Without support, many face homelessness, unemployment, and other challenges. Organizations like Foster Greatness provide lifelong community support to help bridge this gap."
  },
  {
    question: "What resources are available after aging out of foster care?",
    answer: "Resources include Chafee Education and Training Vouchers (ETV) for education, Medicaid coverage until age 26, housing assistance programs, SNAP benefits, and nonprofit support organizations like Foster Greatness that provide peer support, resource navigation, and crisis assistance."
  },
  {
    question: "Can I get help after aging out of foster care?",
    answer: "Yes! Foster Greatness provides free, lifelong support for current and former foster youth with no age limit. You can access 1:1 resource specialist support, benefits screening, career services, peer community, and crisis fund assistance regardless of how long ago you aged out."
  },
  {
    question: "What percentage of foster youth become homeless after aging out?",
    answer: "According to the National Foster Youth Institute, approximately 20% of foster youth become homeless immediately after aging out. Within four years, up to 50% experience homelessness. This is why organizations like Foster Greatness exist to provide ongoing support."
  }
];

export const metadata: Metadata = generatePageMetadata({
  title: 'Aging Out of Foster Care: Complete Guide to Resources & Support',
  description: 'What happens when you age out of foster care? Comprehensive guide covering challenges, resources, housing help, education support, and how to get lifelong assistance. Updated 2025.',
  path: '/aging-out',
});

export default function AgingOutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: siteConfig.url },
    { name: 'Resources', url: `${siteConfig.url}/resources` },
    { name: 'Aging Out Guide', url: `${siteConfig.url}/aging-out` },
  ]);

  const faqJsonLd = generateFaqJsonLd(agingOutFaqs);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Aging Out of Foster Care: Complete Guide to Resources & Support',
    description: 'Comprehensive guide for youth aging out of foster care, covering challenges, available resources, and how to get help.',
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
    datePublished: '2025-12-01',
    dateModified: '2025-12-11',
    mainEntityOfPage: `${siteConfig.url}/aging-out`,
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
