import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Foster Greatness | Lifelong Community for Foster Youth Nationwide',
  description: 'Join 2,000+ current and former foster youth in a lived experience-led community. Free peer support, resources, employment help, and lifelong belonging. No age limit.',
  path: '',
});

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
