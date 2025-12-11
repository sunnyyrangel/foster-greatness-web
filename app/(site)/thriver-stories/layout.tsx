import type { Metadata } from 'next';
import { generatePageMetadata, generateBreadcrumbJsonLd, siteConfig } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Thriver Stories | Foster Youth Success Stories & Interviews',
  description: 'Watch inspiring interviews with foster care alumni sharing their journeys of resilience and success. New episodes weekly from the Foster Greatness community.',
  path: '/thriver-stories',
});

export default function ThriverStoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: siteConfig.url },
    { name: 'Thriver Stories', url: `${siteConfig.url}/thriver-stories` },
  ]);

  const videoSeriesJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoGallery',
    name: 'Thriver Stories',
    description: 'Inspiring interviews with foster care alumni sharing their journeys of resilience, strength, and success.',
    publisher: {
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
          __html: JSON.stringify(videoSeriesJsonLd),
        }}
      />
      {children}
    </>
  );
}
