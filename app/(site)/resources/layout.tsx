import type { Metadata } from 'next';
import { generatePageMetadata, generateBreadcrumbJsonLd, generateFaqJsonLd, siteConfig } from '@/lib/seo';

const resourceFaqs = [
  {
    question: "What resources are available for foster youth?",
    answer: "Foster youth can access housing assistance, food security programs (SNAP), career services including resume building and job placement, educational scholarships, mental health support, and benefits screening. Foster Greatness provides free 1:1 support from Resource Specialists to help you navigate and access these resources."
  },
  {
    question: "How do I access foster youth resources through Foster Greatness?",
    answer: "Join our free community at community.fostergreatness.co, then submit a resource support request. A dedicated Resource Specialist will contact you within 24-48 hours (Monday-Friday) to provide personalized assistance."
  },
  {
    question: "Are Foster Greatness resources free?",
    answer: "Yes, all Foster Greatness resources and support services are completely free. This includes 1:1 Resource Specialist support, benefits screening, career services, and community access."
  },
  {
    question: "Do I need to be currently in foster care to access resources?",
    answer: "No. Foster Greatness serves both current and former foster youth. There is no age limit - we believe you should never age out of support. Whether you're 18 or 48, you can access our resources."
  },
  {
    question: "What is the Crisis Fund?",
    answer: "The Crisis Fund provides emergency financial assistance to foster youth community members facing unexpected hardships. This can help with urgent needs like rent, utilities, transportation, or other immediate expenses."
  },
  {
    question: "How can I get help with housing as a foster youth?",
    answer: "Foster Greatness Resource Specialists can help you find stable housing, navigate rental assistance programs, access transitional living programs, and connect with housing voucher programs. Join our community and submit a resource request to get started."
  }
];

export const metadata: Metadata = generatePageMetadata({
  title: 'Free Resources for Foster Youth | Housing, Jobs, Education Support',
  description: 'Access free resources for current and former foster youth: housing assistance, job training, scholarships, benefits screening, and 1:1 support from Resource Specialists. No age limit.',
  path: '/resources',
});

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: siteConfig.url },
    { name: 'Resources', url: `${siteConfig.url}/resources` },
  ]);

  const faqJsonLd = generateFaqJsonLd(resourceFaqs);

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
      {children}
    </>
  );
}
