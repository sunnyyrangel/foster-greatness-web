import { Suspense } from 'react';
import { Search, Heart, ArrowRight, Users } from 'lucide-react';
import { generatePageMetadata } from '@/lib/seo';
import ProgramSearch from '@/components/findhelp/ProgramSearch';

export const metadata = generatePageMetadata({
  title: 'Find Local Services & Programs',
  description:
    'Search for free and low-cost social services near you. Find help with food, housing, healthcare, employment, and more. Foster Greatness connects foster youth with local resources.',
  path: '/services',
});

// Server component wrapper that extracts search params
export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const initialZip = typeof params.zip === 'string' ? params.zip : undefined;
  const initialProgramId = typeof params.program === 'string' ? params.program : undefined;

  return (
    <main className="relative min-h-screen bg-[#fafbfc]">
      {/* Subtle texture */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231a2949' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-fg-navy via-fg-navy to-fg-blue py-16 px-4 overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-fg-blue/20 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-fg-orange/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Search className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white/90">
              Powered by Findhelp
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Find Local Services Near You
          </h1>

          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Search thousands of free and low-cost programs for food, housing, healthcare,
            employment, and more. Your ZIP code connects you to resources in your community.
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="relative py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-fg-blue" />
              </div>
            }
          >
            <ProgramSearch initialZip={initialZip} initialProgramId={initialProgramId} />
          </Suspense>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-fg-navy text-center mb-10">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-fg-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-fg-blue">1</span>
              </div>
              <h3 className="font-bold text-fg-navy mb-2">Enter Your ZIP</h3>
              <p className="text-gray-600 text-sm">
                Start by entering your ZIP code to find services available in your area.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-fg-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-fg-blue">2</span>
              </div>
              <h3 className="font-bold text-fg-navy mb-2">Choose a Category</h3>
              <p className="text-gray-600 text-sm">
                Select the type of help you need—food, housing, healthcare, jobs, and more.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-fg-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-fg-blue">3</span>
              </div>
              <h3 className="font-bold text-fg-navy mb-2">Connect with Programs</h3>
              <p className="text-gray-600 text-sm">
                Browse programs, save your favorites, and reach out directly by phone or email.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Connect with Specialist */}
      <section className="py-16 px-4 bg-gradient-to-b from-white to-fg-light-blue">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100 text-center">
            <div className="inline-flex p-4 rounded-2xl bg-fg-blue/10 mb-6">
              <Users className="w-10 h-10 text-fg-blue" />
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-fg-navy mb-4">
              Need 1:1 Help Finding Resources?
            </h2>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Our Resource Specialists can help you navigate options and connect with programs
              that fit your specific situation. Join our community to get personalized support.
            </p>

            <a
              href="https://community.fostergreatness.co"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-fg-navy text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:bg-fg-blue transition-all"
            >
              Connect with a Specialist
              <ArrowRight className="w-5 h-5" />
            </a>

            <p className="mt-4 text-sm text-gray-400">
              Free for all current and former foster youth
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Note */}
      <section className="py-8 px-4 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-gray-500">
            <Heart className="w-4 h-4 inline-block mr-1 text-red-400" />
            Your privacy matters. Search results are not stored, and your saved programs are only
            kept on your device.
          </p>
        </div>
      </section>
    </main>
  );
}
