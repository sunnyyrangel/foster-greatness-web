import type { Metadata } from 'next';
import Link from 'next/link';
import {
  DollarSign,
  FileText,
  CheckCircle2,
  ArrowRight,
  Calendar,
  AlertCircle,
  ExternalLink,
  Users,
  Calculator,
  Clock,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tax Support for Foster Youth | Foster Greatness',
  description:
    'Free tax filing help for current and former foster youth. Learn about the California Foster Youth Tax Credit (up to $1,189), find free VITA tax prep sites, and get walk-through support from our team.',
  openGraph: {
    title: 'Tax Support for Foster Youth | Foster Greatness',
    description:
      'You could be owed up to $1,189. Free tax filing support for foster youth — credits, VITA sites, and walk-through help.',
  },
};

const creditBreakdown = [
  {
    name: 'CA Foster Youth Tax Credit (FYTC)',
    amount: '$1,189',
    description: 'Refundable credit for foster youth ages 18–25 who were in CA foster care at age 13+',
    highlight: true,
  },
  {
    name: 'CA Earned Income Tax Credit (CalEITC)',
    amount: 'Up to $3,756',
    description: 'Based on income and number of qualifying children. Up to $302 with no children.',
    highlight: false,
  },
  {
    name: 'Young Child Tax Credit (YCTC)',
    amount: 'Up to $1,189',
    description: 'If you have a child under 6. Requires CalEITC eligibility.',
    highlight: false,
  },
  {
    name: 'Federal EITC',
    amount: 'Up to $7,830',
    description: 'Based on income and qualifying children. Age 25+ required if no children.',
    highlight: false,
  },
];

const fytcRequirements = [
  'You were 18 to 25 years old on December 31, 2025',
  'You were in California foster care at age 13 or older',
  'You earned at least $1 during 2025',
  'You qualify for the California Earned Income Tax Credit (CalEITC)',
];

const whatToBring = [
  'Valid photo ID (driver\'s license, state ID, passport)',
  'Social Security card or ITIN for you (and spouse/dependents if applicable)',
  'All W-2s, 1099s, and other income documents',
  'Bank account and routing number (for direct deposit)',
  'Last year\'s tax return (if you filed)',
  'Any 1095-A if you had health insurance through Covered California',
];

const filingOptions = [
  {
    icon: Users,
    title: 'VITA Free Tax Prep',
    description: 'IRS-certified volunteers prepare your return for free. In person at community centers, libraries, and other locations.',
    cta: 'Find a VITA Site Near You',
    href: 'https://irs.treasury.gov/freetaxprep/',
    recommended: true,
  },
  {
    icon: Calculator,
    title: 'IRS Free File',
    description: 'Free guided tax software online if your income is $89,000 or less. Eight partner products available.',
    cta: 'Access IRS Free File',
    href: 'https://www.irs.gov/filing/free-file-do-your-federal-taxes-for-free',
    recommended: false,
  },
  {
    icon: FileText,
    title: 'CalFile (California)',
    description: 'File your California state return directly with the Franchise Tax Board for free.',
    cta: 'File with CalFile',
    href: 'https://www.ftb.ca.gov/file/ways-to-file/online/calfile/index.asp',
    recommended: false,
  },
];

export default function TaxSupportPage() {
  return (
    <main className="relative min-h-screen bg-[#fafbfc]">
      {/* Subtle texture */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231a2949' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* ==================== HERO ==================== */}
      <section className="relative bg-gradient-to-br from-fg-navy via-fg-navy to-fg-blue py-20 px-4 overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-fg-teal/20 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-fg-orange/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <DollarSign className="w-4 h-4 text-fg-teal" />
            <span className="text-sm font-semibold text-white/90">2025 Tax Year &middot; File by April 15, 2026</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            You Could Be Owed Up to{' '}
            <span className="text-fg-teal">$1,189</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed">
            California&rsquo;s Foster Youth Tax Credit puts money back in your pocket &mdash; and we&rsquo;ll walk you through every step of filing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#am-i-eligible"
              className="inline-flex items-center justify-center gap-2 bg-fg-teal text-fg-navy font-semibold px-8 py-4 rounded-xl hover:bg-fg-teal/90 transition-all text-lg"
            >
              Check If You&rsquo;re Eligible
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="https://community.fostergreatness.co/c/resource-specialist/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/20 transition-all text-lg border border-white/20"
            >
              Request Tax Support
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ==================== DEADLINE BANNER ==================== */}
      <section className="relative bg-fg-orange/10 border-y border-fg-orange/20 py-4 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-3 text-center">
          <Clock className="w-5 h-5 text-fg-orange flex-shrink-0" />
          <p className="text-sm md:text-base font-medium text-fg-navy">
            <strong>Tax filing deadline:</strong> April 15, 2026. Don&rsquo;t leave money on the table &mdash; the FYTC is fully refundable, meaning you get cash back even if you owe no taxes.
          </p>
        </div>
      </section>

      {/* ==================== SECTION 1: AM I ELIGIBLE? ==================== */}
      <section id="am-i-eligible" className="relative py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold tracking-widest text-fg-blue uppercase mb-3">Step 1</span>
            <h2 className="text-3xl md:text-4xl font-bold text-fg-navy mb-4">Am I Eligible?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The California Foster Youth Tax Credit (FYTC) is specifically for people with foster care experience. Check if you qualify:
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 md:p-10 mb-8">
            <h3 className="text-xl font-bold text-fg-navy mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-fg-teal/10 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-fg-teal" />
              </div>
              FYTC Requirements (All Must Apply)
            </h3>
            <div className="space-y-4">
              {fytcRequirements.map((req) => (
                <div key={req} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-fg-teal flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-lg">{req}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-fg-teal/5 rounded-xl border border-fg-teal/10">
              <p className="text-sm text-gray-600">
                <strong className="text-fg-navy">Not sure if you qualify for CalEITC?</strong> If you earned income in 2025 and your total was under $32,900, you likely do. A VITA volunteer or our team can help you figure it out.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-fg-navy to-fg-blue rounded-2xl p-8 md:p-10 text-white">
            <h3 className="text-xl font-bold mb-2">The FYTC has returned $17.2 million to over 16,000 foster youth.</h3>
            <p className="text-white/80">Since the credit launched, it&rsquo;s also helped unlock an estimated $18.66 million in additional credits young people didn&rsquo;t know they were owed.</p>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 2: WHAT COULD I GET? ==================== */}
      <section className="relative py-16 md:py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold tracking-widest text-fg-blue uppercase mb-3">Step 2</span>
            <h2 className="text-3xl md:text-4xl font-bold text-fg-navy mb-4">What Could I Get?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Multiple credits can stack together. Here&rsquo;s what you might be eligible for:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {creditBreakdown.map((credit) => (
              <div
                key={credit.name}
                className={`rounded-2xl p-6 border-2 transition-all ${
                  credit.highlight
                    ? 'bg-fg-teal/5 border-fg-teal shadow-md'
                    : 'bg-gray-50 border-gray-100'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className={`font-bold text-lg ${credit.highlight ? 'text-fg-navy' : 'text-gray-800'}`}>
                    {credit.name}
                  </h3>
                  {credit.highlight && (
                    <span className="text-xs font-bold bg-fg-teal text-fg-navy px-2 py-1 rounded-full uppercase tracking-wide">
                      Foster Youth
                    </span>
                  )}
                </div>
                <p className={`text-3xl font-extrabold mb-2 ${credit.highlight ? 'text-fg-teal' : 'text-fg-navy'}`}>
                  {credit.amount}
                </p>
                <p className="text-sm text-gray-600">{credit.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-fg-navy/5 rounded-2xl border border-fg-navy/10">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-fg-blue flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-fg-navy mb-1">Example: A 22-year-old former foster youth in California with no children and $15,000 income</p>
                <p className="text-gray-600">Could receive: <strong className="text-fg-teal">$1,189</strong> (FYTC) + <strong>$302</strong> (CalEITC) = <strong className="text-fg-navy">$1,491 back</strong>. With a child under 6, that number goes higher.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 3: WHAT DO I NEED? ==================== */}
      <section className="relative py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold tracking-widest text-fg-blue uppercase mb-3">Step 3</span>
            <h2 className="text-3xl md:text-4xl font-bold text-fg-navy mb-4">What Do I Need?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Gather these documents before you file or visit a VITA site:
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 md:p-10">
            <div className="grid md:grid-cols-2 gap-4">
              {whatToBring.map((item) => (
                <div key={item} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <FileText className="w-5 h-5 text-fg-blue flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-fg-orange/5 rounded-xl border border-fg-orange/10">
              <p className="text-sm text-gray-600">
                <strong className="text-fg-navy">Missing documents?</strong> Don&rsquo;t let that stop you. Our team can help you figure out what you need and where to get it. Reach out through the community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 4: HOW TO FILE ==================== */}
      <section className="relative py-16 md:py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold tracking-widest text-fg-blue uppercase mb-3">Step 4</span>
            <h2 className="text-3xl md:text-4xl font-bold text-fg-navy mb-4">How to File (For Free)</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              You should never have to pay to file your taxes. Here are your best options:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {filingOptions.map((option) => (
              <div
                key={option.title}
                className={`rounded-2xl p-6 border-2 flex flex-col ${
                  option.recommended
                    ? 'bg-fg-blue/5 border-fg-blue shadow-md'
                    : 'bg-gray-50 border-gray-100'
                }`}
              >
                {option.recommended && (
                  <span className="text-xs font-bold bg-fg-blue text-white px-3 py-1 rounded-full uppercase tracking-wide self-start mb-4">
                    Recommended
                  </span>
                )}
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm mb-4">
                  <option.icon className={`w-6 h-6 ${option.recommended ? 'text-fg-blue' : 'text-gray-500'}`} />
                </div>
                <h3 className="text-lg font-bold text-fg-navy mb-2">{option.title}</h3>
                <p className="text-sm text-gray-600 mb-6 flex-1">{option.description}</p>
                <a
                  href={option.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center gap-2 font-semibold px-5 py-3 rounded-xl transition-all text-sm ${
                    option.recommended
                      ? 'bg-fg-blue text-white hover:bg-fg-blue/90'
                      : 'bg-white text-fg-navy border border-gray-200 hover:border-fg-blue hover:text-fg-blue'
                  }`}
                >
                  {option.cta}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== SECTION 5: GET HELP FROM FG ==================== */}
      <section className="relative py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold tracking-widest text-fg-blue uppercase mb-3">Step 5</span>
            <h2 className="text-3xl md:text-4xl font-bold text-fg-navy mb-4">Need Help? We&rsquo;ll Walk You Through It.</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We&rsquo;re not certified tax preparers, but we&rsquo;ve helped hundreds of community members navigate the filing process. Here&rsquo;s what we can do:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 text-center">
              <div className="w-14 h-14 bg-fg-teal/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-fg-teal" />
              </div>
              <h3 className="font-bold text-fg-navy mb-2">Walk-Through Support</h3>
              <p className="text-sm text-gray-600">We&rsquo;ll sit with you (virtually) and walk through the filing process step by step. No question is too basic.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 text-center">
              <div className="w-14 h-14 bg-fg-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-7 h-7 text-fg-blue" />
              </div>
              <h3 className="font-bold text-fg-navy mb-2">Document Help</h3>
              <p className="text-sm text-gray-600">Missing a W-2? Not sure what an ITIN is? We&rsquo;ll help you figure out what you need and how to get it.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 text-center">
              <div className="w-14 h-14 bg-fg-orange/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-7 h-7 text-fg-orange" />
              </div>
              <h3 className="font-bold text-fg-navy mb-2">VITA Connection</h3>
              <p className="text-sm text-gray-600">We&rsquo;ll connect you with a local VITA volunteer who can prepare and file your return for free.</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-fg-navy to-fg-blue rounded-2xl p-8 md:p-12 text-center text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
              Submit a resource request through our community and a team member will reach out to help you with your taxes.
            </p>
            <a
              href="https://community.fostergreatness.co/c/resource-specialist/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-fg-teal text-fg-navy font-bold px-8 py-4 rounded-xl hover:bg-fg-teal/90 transition-all text-lg"
            >
              Request Tax Support in Our Community
              <ExternalLink className="w-5 h-5" />
            </a>
            <p className="text-sm text-white/50 mt-4">Free for all community members. Not a member yet? Signing up takes 2 minutes.</p>
          </div>
        </div>
      </section>

      {/* ==================== FAQ ==================== */}
      <section className="relative py-16 md:py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-fg-navy mb-10 text-center">Common Questions</h2>
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-6">
              <h3 className="font-bold text-fg-navy mb-2">Do I have to pay taxes if I&rsquo;m in foster care?</h3>
              <p className="text-gray-600">If you earned income, you may need to file. But here&rsquo;s the thing &mdash; filing is how you <em>get money back</em>. The FYTC is refundable, meaning the state sends you a check even if you owe nothing.</p>
            </div>
            <div className="border-b border-gray-100 pb-6">
              <h3 className="font-bold text-fg-navy mb-2">I&rsquo;ve never filed taxes before. Is that a problem?</h3>
              <p className="text-gray-600">Not at all. VITA volunteers are trained to help first-time filers. And our team has walked hundreds of members through the process. You can also file for previous years if you missed credits.</p>
            </div>
            <div className="border-b border-gray-100 pb-6">
              <h3 className="font-bold text-fg-navy mb-2">What if I was in foster care in another state?</h3>
              <p className="text-gray-600">The FYTC is specifically for California foster care. However, you may still qualify for CalEITC, the federal EITC, and other credits regardless of where you were in care. File anyway &mdash; you might be surprised.</p>
            </div>
            <div className="border-b border-gray-100 pb-6">
              <h3 className="font-bold text-fg-navy mb-2">I didn&rsquo;t file last year. Can I still get the credit?</h3>
              <p className="text-gray-600">Yes. You can file prior year returns to claim credits you missed. A VITA volunteer or our team can help you file for previous years.</p>
            </div>
            <div className="border-b border-gray-100 pb-6">
              <h3 className="font-bold text-fg-navy mb-2">Is Foster Greatness a tax preparer?</h3>
              <p className="text-gray-600">No. We&rsquo;re not certified tax professionals and we don&rsquo;t prepare or file returns. We provide peer support to help you understand the process, gather your documents, and connect with free certified tax preparers through VITA.</p>
            </div>
            <div className="pb-2">
              <h3 className="font-bold text-fg-navy mb-2">I turned 26 in 2025. Do I still qualify for the FYTC?</h3>
              <p className="text-gray-600">It depends on your birthday. If you were 25 or younger on December 31, 2025, you qualify. If you turned 26 before that date, you don&rsquo;t qualify for the FYTC but may still be eligible for other credits.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== BOTTOM CTA ==================== */}
      <section className="relative py-12 px-4 bg-fg-navy">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-white/60 text-sm mb-3">
            Information on this page is for educational purposes and does not constitute tax advice. Consult a qualified tax professional for advice specific to your situation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://www.ftb.ca.gov/file/personal/credits/foster-youth-tax-credit.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors"
            >
              CA Franchise Tax Board — FYTC Details
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="hidden sm:inline text-white/30">|</span>
            <a
              href="https://irs.treasury.gov/freetaxprep/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors"
            >
              IRS VITA Site Locator
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="hidden sm:inline text-white/30">|</span>
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors"
            >
              Find More Resources
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
