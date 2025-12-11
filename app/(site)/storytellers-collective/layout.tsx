import type { Metadata } from 'next';
import { generatePageMetadata, generateBreadcrumbJsonLd, siteConfig } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Storyteller Collective | Share Your Foster Care Journey',
  description: 'Join the Foster Greatness Storyteller Collective. Share your lived foster care experience, develop storytelling skills, and inspire others through your journey.',
  path: '/storytellers-collective',
});

export default function StorytellersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: siteConfig.url },
    { name: 'Storyteller Collective', url: `${siteConfig.url}/storytellers-collective` },
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
