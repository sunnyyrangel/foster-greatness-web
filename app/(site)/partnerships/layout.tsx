import type { Metadata } from 'next';
import { generatePageMetadata, generateBreadcrumbJsonLd, siteConfig } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Partner With Foster Greatness | Corporate & Nonprofit Partnerships',
  description: 'Partner with Foster Greatness to support foster youth. Explore corporate sponsorships, nonprofit collaborations, and employment partnership opportunities.',
  path: '/partnerships',
});

export default function PartnershipsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: siteConfig.url },
    { name: 'Partnerships', url: `${siteConfig.url}/partnerships` },
  ]);

  return (
    <>
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
