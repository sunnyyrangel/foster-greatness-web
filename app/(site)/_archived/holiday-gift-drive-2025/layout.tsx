import type { Metadata } from 'next';
import { generatePageMetadata, generateBreadcrumbJsonLd, siteConfig } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Holiday Gift Drive 2025 | Give a Gift to Foster Youth',
  description: 'Support foster youth this holiday season. Sponsor a gift for a community member through the Foster Greatness Holiday Gift Drive 2025. $60 funds one member gift.',
  path: '/holiday-gift-drive-2025',
  image: 'https://www.fostergreatness.co/images/holiday-gift-tree.png',
});

export default function HolidayGiftDriveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: siteConfig.url },
    { name: 'Holiday Gift Drive 2025', url: `${siteConfig.url}/holiday-gift-drive-2025` },
  ]);

  const eventJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Foster Greatness Holiday Gift Drive 2025',
    description: 'Annual holiday gift drive to provide gifts to current and former foster youth community members.',
    startDate: '2025-11-01',
    endDate: '2025-12-31',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    location: {
      '@type': 'VirtualLocation',
      url: `${siteConfig.url}/holiday-gift-drive-2025`,
    },
    organizer: {
      '@type': 'NonprofitOrganization',
      name: 'Foster Greatness',
      url: siteConfig.url,
    },
    offers: {
      '@type': 'Offer',
      price: '60',
      priceCurrency: 'USD',
      description: 'Sponsor one gift for a foster youth community member',
      url: `${siteConfig.url}/holiday-gift-drive-2025`,
    },
    image: `${siteConfig.url}/images/holiday-gift-tree.png`,
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
          __html: JSON.stringify(eventJsonLd),
        }}
      />
      {children}
    </>
  );
}
