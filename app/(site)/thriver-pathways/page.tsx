import Link from 'next/link';
import { ArrowRight, Download, Users, Briefcase, Award, BarChart3, CheckCircle2, Quote, FileText, Heart, TrendingUp, Star } from 'lucide-react';

const confidenceData = [
  { skill: 'Identifying Career Interests', before: 2.8, after: 4.4 },
  { skill: 'LinkedIn Profile Building', before: 2.3, after: 4.2 },
  { skill: 'Workplace Expectations & Culture', before: 3.0, after: 4.5 },
  { skill: 'Understanding Strengths at Work', before: 3.1, after: 4.5 },
  { skill: 'Workplace Rights (ADA, FMLA, OSHA)', before: 2.2, after: 4.0 },
  { skill: 'Interview Preparation', before: 2.4, after: 4.2 },
  { skill: 'Resume Crafting', before: 2.6, after: 4.3 },
  { skill: 'Career Support Network', before: 2.5, after: 4.3 },
  { skill: 'Cover Letter Writing', before: 2.3, after: 4.1 },
  { skill: 'Professional CV Creation', before: 2.2, after: 4.0 },
];

export default function ThriverPathwaysPage() {
  return (
    <main className="relative min-h-screen bg-white">

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-fg-navy via-fg-navy to-fg-blue py-20 md:py-28 px-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-fg-teal/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-fg-orange/10 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <span className="text-sm font-semibold text-white/90">Program Impact Report · Spring 2026</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Thriver Pathways
          </h1>

          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed mb-4">
            A cohort-based career readiness program designed by and for foster alumni — where professional growth happens inside a community that already knows your name.
          </p>

          <p className="text-lg text-white/60 mb-10">
            February – March 2026 · Created by Foster Greatness & Str8Up Employment Services
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/assets/files/thriver-pathways-impact-report.pdf"
              download
              className="inline-flex items-center gap-3 bg-white text-fg-navy px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <Download className="w-5 h-5" />
              Download Full Report (PDF)
            </a>
            <a
              href="#results"
              className="inline-flex items-center gap-3 border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-all"
            >
              View Results
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Key Stats Banner */}
      <section className="relative z-10 -mt-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold text-fg-navy">84</p>
                <p className="text-sm text-gray-500 mt-1">Foster Alumni Applied</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-fg-blue">48</p>
                <p className="text-sm text-gray-500 mt-1">Enrolled in Cohort</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-fg-teal">100%</p>
                <p className="text-sm text-gray-500 mt-1">Felt Better Equipped</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-fg-orange">8</p>
                <p className="text-sm text-gray-500 mt-1">Accepted Jobs/Internships</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About the Program */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-fg-navy mb-6">What is Thriver Pathways?</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Thriver Pathways is a virtual career readiness cohort program for former foster youth created by Foster Greatness and Str8Up Employment Services. The program combines workforce development with the one thing most career programs miss: a community of people who actually understand the road you've traveled.
          </p>

          <div className="bg-fg-navy/[0.03] rounded-2xl p-8 border border-fg-navy/5">
            <Quote className="w-8 h-8 text-fg-blue/30 mb-4" />
            <blockquote className="text-lg text-fg-navy leading-relaxed italic mb-4">
              "The most valuable thing I gained from Thriver Pathways was the realization that I'm not alone in this journey. I felt truly seen, and it gave me real hope that I can find a career even with my lived experience and everything going on in the world."
            </blockquote>
            <p className="text-sm font-semibold text-fg-navy">— Sara Ellis, Thriver Pathways Participant</p>
          </div>
        </div>
      </section>

      {/* Program at a Glance */}
      <section id="results" className="py-20 px-4 bg-gray-50 scroll-mt-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-fg-navy mb-4">The Numbers Behind the Journey</h2>
            <p className="text-lg text-gray-600">From application through completion, Thriver Pathways produced measurable outcomes across confidence, career readiness, and real-world job activity.</p>
          </div>

          {/* Enrollment Funnel */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
            <h3 className="text-xl font-bold text-fg-navy mb-6">Program Enrollment Funnel</h3>
            <p className="text-gray-600 mb-8">Demand far exceeded capacity — 84 foster alumni applied for a cohort of 48 participants.</p>

            <div className="space-y-4">
              {[
                { label: 'Applied to Participate', value: 84, pct: 100, color: 'bg-fg-navy' },
                { label: 'Enrolled in Cohort', value: 48, pct: 57, color: 'bg-fg-blue' },
                { label: 'Completed All Requirements', value: 15, pct: 18, color: 'bg-fg-teal' },
              ].map((step) => (
                <div key={step.label}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm font-semibold text-fg-navy">{step.label}</span>
                    <span className="text-sm font-bold text-fg-navy">{step.value}</span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-8 overflow-hidden">
                    <div
                      className={`${step.color} h-full rounded-full transition-all flex items-center justify-end pr-3`}
                      style={{ width: `${step.pct}%` }}
                    >
                      <span className="text-xs font-bold text-white">{step.pct}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Outcomes Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="text-4xl font-bold text-fg-navy mb-1">100%</div>
              <p className="text-sm text-gray-500">Felt Better Equipped After the Program</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="text-4xl font-bold text-fg-blue">4.85<span className="text-lg text-gray-400">/5</span></div>
              <p className="text-sm text-gray-500">Facilitator Rating</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="text-4xl font-bold text-fg-teal">95%</div>
              <p className="text-sm text-gray-500">Would Recommend to Others</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="text-4xl font-bold text-fg-orange">82%</div>
              <p className="text-sm text-gray-500">Actively Applied to Jobs During Program</p>
            </div>
          </div>

          {/* Job Outcomes */}
          <div className="bg-gradient-to-r from-fg-navy to-fg-blue rounded-2xl p-8 text-white">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Real Career Outcomes</h3>
                <p className="text-white/80 leading-relaxed">
                  Of participants who applied for jobs during the program, 10 received interviews — and 7 accepted new career opportunities.
                </p>
              </div>
              <div className="text-center">
                <div className="text-6xl font-bold text-fg-yellow">41%</div>
                <p className="text-white/70 text-lg mt-2">Accepted a Career Opportunity</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Confidence Outcomes */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-fg-navy mb-4">From Uncertain to Equipped</h2>
            <p className="text-lg text-gray-600">Post-program survey participants self-rated their confidence before and after the program across ten career-readiness areas. Every area showed meaningful growth.</p>
          </div>

          <div className="space-y-4">
            {confidenceData.map((item) => (
              <div key={item.skill} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <p className="text-sm font-semibold text-fg-navy mb-3">{item.skill}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-12">Before</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                      <div className="bg-gray-300 h-full rounded-full" style={{ width: `${(item.before / 5) * 100}%` }} />
                    </div>
                    <span className="text-xs text-gray-500 w-8">{item.before}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-fg-blue font-semibold w-12">After</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                      <div className="bg-fg-blue h-full rounded-full" style={{ width: `${(item.after / 5) * 100}%` }} />
                    </div>
                    <span className="text-xs font-bold text-fg-blue w-8">{item.after}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Participant Quote */}
      <section className="py-16 px-4 bg-fg-navy/[0.03]">
        <div className="max-w-3xl mx-auto text-center">
          <Quote className="w-10 h-10 text-fg-orange/30 mx-auto mb-6" />
          <blockquote className="text-xl md:text-2xl text-fg-navy leading-relaxed italic mb-6">
            "Someone told me today the difference between hope and optimism is that hope has a plan. And that's exactly how I feel about the Thriver Pathways Program."
          </blockquote>
          <p className="text-sm font-semibold text-fg-navy">— Sara Ellis, Thriver Pathways Participant</p>
        </div>
      </section>

      {/* Program Quality */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-fg-navy mb-10 text-center">Program Quality</h2>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="text-4xl font-bold text-fg-navy mb-2">4.6<span className="text-lg text-gray-400">/5</span></div>
              <p className="font-semibold text-fg-navy mb-1">Content Clarity</p>
              <p className="text-sm text-gray-500">Materials were easy to understand and follow</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="text-4xl font-bold text-fg-blue mb-2">4.45<span className="text-lg text-gray-400">/5</span></div>
              <p className="font-semibold text-fg-navy mb-1">Virtual Format</p>
              <p className="text-sm text-gray-500">Zoom sessions worked well for learning styles</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="text-4xl font-bold text-fg-teal mb-2">4.82<span className="text-lg text-gray-400">/5</span></div>
              <p className="font-semibold text-fg-navy mb-1">Facilitation Quality</p>
              <p className="text-sm text-gray-500">Facilitators were knowledgeable, supportive, & engaging</p>
            </div>
          </div>

          <div className="bg-fg-navy/[0.03] rounded-2xl p-8 border border-fg-navy/5">
            <Quote className="w-8 h-8 text-fg-blue/30 mb-4" />
            <blockquote className="text-lg text-fg-navy leading-relaxed italic mb-4">
              "It's not like every other one size fits all program. It felt like those teaching the course were invested in our success."
            </blockquote>
            <p className="text-sm font-semibold text-fg-navy">— Faith Sharp, Thriver Pathways Participant</p>
          </div>
        </div>
      </section>

      {/* Essential Documents */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-fg-navy mb-4">Addressing Barriers Beyond the Resume</h2>
            <p className="text-lg text-gray-600">Thriver Pathways checked in on essential document access — a critical barrier for many foster alumni.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[
              { label: 'Social Security Card', pct: 94 },
              { label: 'State ID / Driver\'s License', pct: 94 },
              { label: 'Birth Certificate', pct: 88 },
              { label: 'High School Diploma / GED', pct: 76 },
              { label: 'College Transcripts', pct: 82 },
            ].map((doc) => (
              <div key={doc.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
                <div className="text-3xl font-bold text-fg-navy mb-2">{doc.pct}%</div>
                <p className="text-xs text-gray-500 leading-tight">{doc.label}</p>
              </div>
            ))}
          </div>

          <p className="text-gray-600 text-center max-w-3xl mx-auto">
            For foster alumni — many of whom have navigated placement transitions without consistent record-keeping — this kind of barrier removal is not a side note. It is the work.
          </p>
        </div>
      </section>

      {/* What Participants Want More Of */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-fg-navy mb-4 text-center">Listening to Build What's Next</h2>
          <p className="text-lg text-gray-600 text-center mb-10">Participant feedback directly shapes how this program grows.</p>

          <div className="space-y-4">
            {[
              { topic: 'Interviewing Skills & Practice', votes: 12, desc: 'Participants want dedicated time for interview techniques, mock rounds, and storytelling practice.' },
              { topic: 'Job Placement & Employer Connections', votes: 12, desc: 'Direct pathways to employers alongside the curriculum. Our Staffmark partnership directly answers this ask.' },
              { topic: 'One-on-One Coaching Sessions', votes: 11, desc: 'Individualized time — live resume reviews, personalized feedback, and guidance from coaches.' },
              { topic: 'Networking & Peer Mentorship', votes: 9, desc: 'Structured peer connections and informational interviews — the relational infrastructure of long-term career growth.' },
              { topic: 'More Hands-On Activities', votes: 9, desc: 'Applied, practice-based work built into future sessions.' },
            ].map((item, i) => (
              <div key={item.topic} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-fg-blue/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-fg-blue">{item.votes}</span>
                </div>
                <div>
                  <h3 className="font-bold text-fg-navy mb-1">{item.topic}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Participant Quote */}
      <section className="py-16 px-4 bg-fg-navy/[0.03]">
        <div className="max-w-3xl mx-auto text-center">
          <Quote className="w-10 h-10 text-fg-teal/30 mx-auto mb-6" />
          <blockquote className="text-xl md:text-2xl text-fg-navy leading-relaxed italic mb-6">
            "I walked away with actual knowledge and feeling like I learned things I did not know going into the program. I actually feel like my time was worth it being in this program."
          </blockquote>
          <p className="text-sm font-semibold text-fg-navy">— Joanna Mandujano, Thriver Pathways Participant</p>
        </div>
      </section>

      {/* Staffmark Partnership */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-fg-navy to-fg-blue rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">What Comes After the Program?</h2>
              <p className="text-white/80 text-lg leading-relaxed mb-6">
                The journey doesn't end when the cohort does. Foster Greatness has partnered with Staffmark — one of the nation's leading workforce solutions companies — to ensure Thriver Pathways alumni have continued access to career support, job placement resources, and employment opportunities long after graduation.
              </p>

              <div className="grid md:grid-cols-2 gap-8 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="font-bold text-lg mb-3">The Staffmark Partnership</h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Staffmark's partnership extends the reach of Thriver Pathways beyond the program itself — giving members ongoing access to job boards, skills development, and employer connections.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="font-bold text-lg mb-3">What Members Gain</h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Job placement support, employer connections, and access to Staffmark's national hiring network — continuing the career momentum built during Thriver Pathways.
                  </p>
                </div>
              </div>

              <p className="text-white/60 text-sm mt-8">
                12 of 17 participants said job placement assistance was the program improvement they wanted most. This partnership is a direct response — from data to action.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-fg-light-blue">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-fg-navy mb-6">
            Interested in Partnering with Foster Greatness?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Thriver Pathways is built for expansion — and we're actively seeking corporate partners who want to invest in a community that is changing how foster alumni access careers.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/assets/files/thriver-pathways-impact-report.pdf"
              download
              className="inline-flex items-center gap-3 bg-fg-navy text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:bg-fg-blue transition-all"
            >
              <Download className="w-5 h-5" />
              Download Full Report
            </a>
            <Link
              href="/partnerships"
              className="inline-flex items-center gap-3 border-2 border-fg-navy text-fg-navy px-8 py-4 rounded-full font-bold text-lg hover:bg-fg-navy hover:text-white transition-all"
            >
              Explore Partnerships
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
