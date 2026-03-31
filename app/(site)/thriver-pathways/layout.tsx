import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thriver Pathways Impact Report | Foster Greatness',
  description: 'Results from our first career readiness cohort for former foster youth. 84 applied, 48 enrolled, 100% felt better equipped, 8 accepted jobs. Built by Foster Greatness & Str8Up Employment Services.',
  openGraph: {
    title: 'Thriver Pathways Impact Report | Foster Greatness',
    description: 'A cohort-based career readiness program designed by and for foster alumni. See the results from our first cohort.',
    type: 'article',
  },
};

export default function ThriverPathwaysLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
