import type { Metadata } from 'next';
import { generatePageMetadata, generateBreadcrumbJsonLd, siteConfig } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Contact Foster Greatness | Get in Touch',
  description: 'Contact Foster Greatness for questions about joining our community, partnership opportunities, or support. We respond to all inquiries.',
  path: '/contact',
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: siteConfig.url },
    { name: 'Contact', url: `${siteConfig.url}/contact` },
  ]);

  const contactPointJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Foster Greatness',
    mainEntity: {
      '@type': 'NonprofitOrganization',
      name: 'Foster Greatness',
      email: 'info@fostergreatness.co',
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'info@fostergreatness.co',
        contactType: 'customer support',
        availableLanguage: 'English',
      },
    },
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
          __html: JSON.stringify(contactPointJsonLd),
        }}
      />
      {children}
    </>
  );
}
