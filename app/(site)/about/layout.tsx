import type { Metadata } from 'next';
import { generatePageMetadata, generateFaqJsonLd, generateBreadcrumbJsonLd, siteConfig } from '@/lib/seo';

const faqs = [
  {
    question: "Can advocates join this community?",
    answer: "Yes! While our programs are primarily designed for those with lived foster care experience, advocates who are committed to supporting our community are welcome to engage with us."
  },
  {
    question: "Do I have to be in foster care right now to join?",
    answer: "No. Our community welcomes current and former foster youth. We are an 18+ community serving individuals at any stage of their journey—with no age cap. Once you're part of our community, you're part of it for life."
  },
  {
    question: "Do I need to prove my foster youth status to qualify or join?",
    answer: "You do not need to prove your status to join. However, there may be some programs or opportunities that do require proof of lived experience."
  },
  {
    question: "Is this limited to a certain state or age?",
    answer: "We are an 18+ community with no upper age limit—support that lasts a lifetime. We serve foster youth nationwide across all 50 states."
  },
  {
    question: "Does it cost anything to join?",
    answer: "No! Joining our community is completely free. We believe support and belonging should be accessible to everyone."
  },
  {
    question: "Does Foster Greatness provide monetary support?",
    answer: "We connect members with resources including scholarships and access to various support programs. Not sure where to start? Submit a request and our team will help point you in the right direction."
  }
];

export const metadata: Metadata = generatePageMetadata({
  title: 'About Foster Greatness | Our Mission, Vision & Team',
  description: 'Learn about Foster Greatness, a lived experience-led nonprofit creating lifelong community for current and former foster youth. Meet our team and discover our mission.',
  path: '/about',
});

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const faqJsonLd = generateFaqJsonLd(faqs);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: siteConfig.url },
    { name: 'About', url: `${siteConfig.url}/about` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />
      {children}
    </>
  );
}
