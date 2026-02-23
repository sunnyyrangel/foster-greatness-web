import type { Metadata } from 'next';
import { generatePageMetadata, generateBreadcrumbJsonLd, siteConfig } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: '2025 Impact Report',
  description: 'See how Foster Greatness is fighting isolation and building community for foster youth. 2,147 members strong, 62 events hosted, 178 individuals supported — read our 2025 impact report.',
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
