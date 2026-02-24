import { Suspense } from 'react';
import { Metadata } from 'next';
import ProgramSearch from '@/components/findhelp/ProgramSearch';

const SITE_URL = 'https://www.fostergreatness.co';
const WIDGET_URL = `${SITE_URL}/widgets/services`;
const OEMBED_URL = `${SITE_URL}/api/oembed?url=${encodeURIComponent(WIDGET_URL)}&format=json`;

export const metadata: Metadata = {
  title: 'Resource Search - Foster Greatness',
  description: 'Search for local social service programs by ZIP code. Find food, housing, healthcare, employment, and more resources for foster youth.',
  openGraph: {
    title: 'Resource Search - Foster Greatness',
    description: 'Search for local social service programs by ZIP code.',
    url: WIDGET_URL,
    siteName: 'Foster Greatness',
    type: 'website',
  },
  alternates: {
    types: {
      'application/json+oembed': OEMBED_URL,
    },
  },
};

export default async function ServicesWidgetPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const initialZip = typeof params.zip === 'string' ? params.zip : undefined;
  const initialProgramId = typeof params.program === 'string' ? params.program : undefined;

  return (
    <div className="bg-white px-3 py-3">
      <div className="max-w-2xl mx-auto">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fg-blue" />
            </div>
          }
        >
          <ProgramSearch initialZip={initialZip} initialProgramId={initialProgramId} widget />
        </Suspense>
      </div>
    </div>
  );
}
