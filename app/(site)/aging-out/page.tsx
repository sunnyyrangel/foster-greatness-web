import Link from 'next/link';
import { ArrowRight, CheckCircle2, AlertTriangle, Heart, Home, GraduationCap, Briefcase, Users, ChevronDown, Calendar, Shield } from 'lucide-react';
import { generatePageMetadata, generateFaqJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo';

export const metadata = generatePageMetadata({
  title: 'Aging Out of Foster Care: Complete Guide & Resources (2025)',
  description: 'Learn what happens when you age out of foster care, available resources, and how to get free lifelong support. Guide covers housing, education, healthcare, and employment help for former foster youth.',
  path: '/aging-out',
});

const challenges = [
  {
    stat: '20%',
    description: 'become homeless immediately after aging out',
    source: 'National Foster Youth Institute',
    sourceUrl: 'https://nfyi.org',
  },
  {
    stat: '50%',
    description: 'experience homelessness within 4 years of leaving care',
    source: 'Jim Casey Youth Opportunities Initiative',
    sourceUrl: 'https://www.aecf.org',
  },
  {
    stat: '< 3%',
    description: 'earn a college degree (compared to 33% general population)',
    source: 'National Foster Youth Institute',
    sourceUrl: 'https://nfyi.org',
  },
  {
    stat: '25%',
    description: 'experience PTSD (more than double the rate of U.S. war veterans)',
    source: 'Casey Family Programs',
    sourceUrl: 'https://www.casey.org',
  },
];

const resources = [
  {
    icon: GraduationCap,
    title: 'Education & Training Vouchers (ETV)',
    description: 'Federal Chafee program providing up to $5,000/year for post-secondary education or training for youth who aged out of foster care.',
    link: 'https://www.childwelfare.gov/topics/outofhome/chafee/',
    linkText: 'Learn about ETV',
  },
  {
    icon: Shield,
    title: 'Medicaid Until Age 26',
    description: 'Under the Affordable Care Act, former foster youth can receive Medicaid coverage until age 26, regardless of income.',
    link: 'https://www.healthcare.gov/young-adults/children-under-26/',
    linkText: 'Healthcare.gov info',
  },
  {
    icon: Home,
    title: 'Housing Assistance Programs',
    description: 'The Family Unification Program (FUP) provides Housing Choice Vouchers specifically for youth aging out of foster care.',
    link: 'https://www.hud.gov/program_offices/public_indian_housing/programs/hcv/family',
    linkText: 'HUD FUP program',
  },
  {
    icon: Briefcase,
    title: 'Employment & Job Training',
    description: 'Many states offer job training, career counseling, and employment assistance through Independent Living Programs.',
    link: '/resources',
    linkText: 'Explore career support',
    internal: true,
  },
];

const statePrograms = [
  { state: 'California', age: 21, program: 'Extended Foster Care (AB 12)' },
  { state: 'New York', age: 21, program: 'Foster Care Extension' },
  { state: 'Texas', age: 21, program: 'Extended Foster Care' },
  { state: 'Illinois', age: 21, program: 'Extended Foster Care' },
  { state: 'Florida', age: 21, program: 'Extended Foster Care' },
  { state: 'Pennsylvania', age: 21, program: 'Extended Foster Care' },
];

const faqs = [
  {
    question: "What does aging out of foster care mean?",
    answer: "Aging out of foster care refers to when a young person reaches the age limit for foster care services (typically 18-21 depending on the state) and must leave the foster care system. This transition often happens without the family support network that most young adults rely on."
  },
  {
    question: "What age do you age out of foster care?",
    answer: "In most states, youth age out of foster care at 18. However, many states have extended foster care programs that allow youth to remain in care until 21. Some states like California extend support until age 26 for certain benefits."
  },
  {
    question: "What happens when you age out of foster care?",
    answer: "When youth age out, they lose access to foster care services and must navigate housing, employment, education, and healthcare independently. Without support, many face homelessness, unemployment, and other challenges. Organizations like Foster Greatness provide lifelong community support to help bridge this gap."
  },
  {
    question: "What resources are available after aging out of foster care?",
    answer: "Resources include Chafee Education and Training Vouchers (ETV) for education, Medicaid coverage until age 26, housing assistance programs, SNAP benefits, and nonprofit support organizations like Foster Greatness that provide peer support, resource navigation, and crisis assistance."
  },
  {
    question: "Can I get help after aging out of foster care?",
    answer: "Yes! Foster Greatness provides free, lifelong support for current and former foster youth with no age limit. You can access help finding resources, benefits screening, career services, peer community, and crisis fund assistance regardless of how long ago you aged out."
  },
  {
    question: "What percentage of foster youth become homeless after aging out?",
    answer: "According to the National Foster Youth Institute, approximately 20% of foster youth become homeless immediately after aging out. Within four years, up to 50% experience homelessness. This is why organizations like Foster Greatness exist to provide ongoing support."
  }
];

const siteUrl = 'https://www.fostergreatness.co';

const faqJsonLd = generateFaqJsonLd(faqs);

const breadcrumbJsonLd = generateBreadcrumbJsonLd([
  { name: 'Home', url: siteUrl },
  { name: 'Resources', url: `${siteUrl}/resources` },
  { name: 'Aging Out Guide', url: `${siteUrl}/aging-out` },
]);

export default function AgingOutPage() {
  return (
    <main className="relative min-h-screen bg-[#fafbfc]">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Subtle texture */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231a2949' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-fg-navy via-fg-navy to-fg-blue py-20 px-4 overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-fg-blue/20 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-fg-orange/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-white/60 text-sm mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/resources" className="hover:text-white transition-colors">Resources</Link>
            <span>/</span>
            <span className="text-white">Aging Out Guide</span>
          </nav>

          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Calendar className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white/90">Updated December 2025</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Aging Out of Foster Care
          </h1>

          <p className="text-xl text-white/80 leading-relaxed mb-4">
            <strong>Aging out of foster care</strong> happens when young people reach the age limit for foster care services—typically 18 to 21 depending on the state—and must transition to independence, often without family support.
          </p>

          <p className="text-lg text-white/70 leading-relaxed mb-8">
            This comprehensive guide covers what to expect, available resources, and how to get the support you deserve—because <strong>you should never have to face this transition alone</strong>.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="https://community.fostergreatness.co"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-fg-navy px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Get Free Support
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#resources"
              className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors"
            >
              View Resources
            </a>
          </div>
        </div>
      </section>

      {/* Key Statistics - Critical for GEO */}
      <section className="py-12 px-4 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-fg-navy mb-8 text-center">
            The Reality of Aging Out: Key Statistics
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {challenges.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-fg-navy mb-2">{item.stat}</div>
                <p className="text-gray-600 mb-3">{item.description}</p>
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-fg-blue hover:underline"
                >
                  Source: {item.source}
                </a>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-500 mt-6 text-sm">
            Each year, over 23,000 youth age out of foster care in the United States.
            <a href="https://www.acf.hhs.gov" target="_blank" rel="noopener noreferrer" className="ml-1 text-fg-blue hover:underline">
              (ACF/HHS)
            </a>
          </p>
        </div>
      </section>

      {/* What Happens When You Age Out */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-fg-navy mb-6">
            What Happens When You Age Out?
          </h2>

          <div className="prose prose-lg max-w-none text-gray-600">
            <p>
              When you age out of foster care, you face a sudden transition to independence that most young people don't experience until their mid-20s. Unlike peers who can rely on family for housing, financial support, and guidance, former foster youth often must navigate these challenges alone.
            </p>

            <h3 className="text-xl font-bold text-fg-navy mt-8 mb-4">Common Challenges Include:</h3>

            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-fg-orange flex-shrink-0 mt-1" />
                <span><strong>Housing instability</strong> – Finding affordable housing without credit history, rental history, or a co-signer</span>
              </li>
              <li className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-fg-orange flex-shrink-0 mt-1" />
                <span><strong>Financial literacy gaps</strong> – Managing money, building credit, and understanding benefits without guidance</span>
              </li>
              <li className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-fg-orange flex-shrink-0 mt-1" />
                <span><strong>Education barriers</strong> – Navigating college applications, financial aid, and campus resources</span>
              </li>
              <li className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-fg-orange flex-shrink-0 mt-1" />
                <span><strong>Employment challenges</strong> – Building a resume, finding jobs, and maintaining employment</span>
              </li>
              <li className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-fg-orange flex-shrink-0 mt-1" />
                <span><strong>Social isolation</strong> – Lack of family support network and lasting relationships</span>
              </li>
              <li className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-fg-orange flex-shrink-0 mt-1" />
                <span><strong>Mental health</strong> – Processing trauma while managing daily life responsibilities</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Available Resources */}
      <section id="resources" className="py-16 px-4 bg-gray-50 scroll-mt-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-fg-navy mb-4">
              Resources for Youth Aging Out of Foster Care
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Federal programs and support services available to help you transition successfully
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {resources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="w-12 h-12 rounded-xl bg-fg-blue/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-fg-blue" />
                  </div>
                  <h3 className="text-xl font-bold text-fg-navy mb-2">{resource.title}</h3>
                  <p className="text-gray-600 mb-4">{resource.description}</p>
                  {resource.internal ? (
                    <Link
                      href={resource.link}
                      className="inline-flex items-center gap-2 text-fg-blue font-semibold hover:gap-3 transition-all"
                    >
                      {resource.linkText}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <a
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-fg-blue font-semibold hover:gap-3 transition-all"
                    >
                      {resource.linkText}
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Extended Foster Care by State */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-fg-navy mb-4">
            Extended Foster Care by State
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Many states now offer extended foster care programs that allow youth to remain in care until age 21. Here are some examples:
          </p>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-fg-navy text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">State</th>
                  <th className="px-6 py-4 text-left font-semibold">Age Limit</th>
                  <th className="px-6 py-4 text-left font-semibold">Program</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {statePrograms.map((program, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-fg-navy">{program.state}</td>
                    <td className="px-6 py-4 text-gray-600">Up to {program.age}</td>
                    <td className="px-6 py-4 text-gray-600">{program.program}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            Contact your state's child welfare agency or Foster Greatness to learn about programs in your state.
          </p>
        </div>
      </section>

      {/* Foster Greatness Support */}
      <section className="py-16 px-4 bg-gradient-to-br from-fg-navy via-fg-navy to-fg-blue text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Users className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white/90">2,000+ Members Nationwide</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            You Don't Have to Face This Alone
          </h2>

          <p className="text-xl text-white/80 leading-relaxed mb-8 max-w-2xl mx-auto">
            Foster Greatness provides <strong>lifelong, free support</strong> for current and former foster youth—with no age limit. Whether you aged out last month or 20 years ago, we're here for you.
          </p>

          <div className="grid sm:grid-cols-3 gap-6 mb-10 text-left">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <CheckCircle2 className="w-8 h-8 text-fg-yellow mb-3" />
              <h3 className="font-bold mb-2">Get Help Finding Resources</h3>
              <p className="text-white/70 text-sm">Not sure where to start? Submit a request and our team will help point you in the right direction</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <CheckCircle2 className="w-8 h-8 text-fg-yellow mb-3" />
              <h3 className="font-bold mb-2">Peer Community</h3>
              <p className="text-white/70 text-sm">Connect with others who understand your experience</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <CheckCircle2 className="w-8 h-8 text-fg-yellow mb-3" />
              <h3 className="font-bold mb-2">Crisis Fund</h3>
              <p className="text-white/70 text-sm">Emergency assistance when you need it most</p>
            </div>
          </div>

          <a
            href="https://community.fostergreatness.co"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-fg-navy px-10 py-5 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            Join Foster Greatness – It's Free
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-fg-navy mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Common questions about aging out of foster care
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 group"
              >
                <summary className="px-6 py-5 cursor-pointer list-none flex justify-between items-center hover:bg-gray-50 rounded-2xl transition-colors">
                  <span className="font-bold text-fg-navy pr-4">{faq.question}</span>
                  <ChevronDown className="w-5 h-5 text-fg-blue flex-shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Related Resources */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-fg-navy mb-6">Related Resources</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/resources"
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-fg-blue/30 transition-all group"
            >
              <h3 className="font-bold text-fg-navy group-hover:text-fg-blue transition-colors mb-2">
                All Foster Youth Resources
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Housing, career support, benefits screening, and more
              </p>
              <span className="inline-flex items-center gap-2 text-fg-blue font-semibold text-sm group-hover:gap-3 transition-all">
                View Resources
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            <Link
              href="/about"
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-fg-blue/30 transition-all group"
            >
              <h3 className="font-bold text-fg-navy group-hover:text-fg-blue transition-colors mb-2">
                About Foster Greatness
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Learn about our lived experience-led community
              </p>
              <span className="inline-flex items-center gap-2 text-fg-blue font-semibold text-sm group-hover:gap-3 transition-all">
                Learn More
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
