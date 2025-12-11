import type { Metadata } from 'next';
import { generatePageMetadata, generateBreadcrumbJsonLd, siteConfig } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Our Impact | Foster Greatness Community Results & Statistics',
  description: 'See the impact of Foster Greatness: 2,000+ community members, 500+ events hosted, $250K+ in resources connected. Real outcomes for foster youth nationwide.',
  path: '/impact',
});

export default function ImpactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: siteConfig.url },
    { name: 'Impact', url: `${siteConfig.url}/impact` },
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
