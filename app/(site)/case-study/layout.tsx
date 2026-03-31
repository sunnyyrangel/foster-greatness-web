import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Case Study: Building Foster Greatness | Technical Portfolio',
  description: 'How we built a full-stack platform serving 2,150+ foster youth — Resource Finder with 500K+ programs, analytics dashboard, community integrations, and enterprise security. Next.js 16, Supabase, Mapbox, Stripe, Sentry.',
  openGraph: {
    title: 'Case Study: Building Foster Greatness',
    description: 'A deep dive into the technology behind a platform serving foster youth nationwide.',
    type: 'article',
  },
};

export default function CaseStudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
