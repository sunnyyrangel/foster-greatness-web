import type { Metadata } from 'next';
import { generatePageMetadata, generateBreadcrumbJsonLd, siteConfig } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Donate to Foster Greatness | Support Foster Youth Nationwide',
  description: 'Your donation helps provide lifelong support, resources, and community for current and former foster youth. 100% of donations support foster youth programs.',
  path: '/donate',
});

export default function DonateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: siteConfig.url },
    { name: 'Donate', url: `${siteConfig.url}/donate` },
  ]);

  const donateActionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DonateAction',
    name: 'Donate to Foster Greatness',
    description: 'Support lifelong community and resources for foster youth nationwide',
    recipient: {
      '@type': 'NonprofitOrganization',
      name: 'Foster Greatness',
      url: siteConfig.url,
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
          __html: JSON.stringify(donateActionJsonLd),
        }}
      />
      {children}
    </>
  );
}
