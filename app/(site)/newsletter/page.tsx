'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, ArrowRight, Heart, Calendar, Gift } from 'lucide-react';

export default function NewsletterPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('You\'re subscribed! Check your inbox for a confirmation.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <main className="relative min-h-screen bg-[#fafbfc]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-fg-light-blue to-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-6">
              <Mail className="w-4 h-4 text-fg-blue" />
              <span className="text-sm font-semibold text-fg-navy">Stay Connected</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-fg-navy mb-6">
              Join Our Newsletter
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Get updates on community events, member stories, resources, and ways to get involved with Foster Greatness.
            </p>

            {/* Signup Form */}
            <div className="max-w-md mx-auto">
              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center"
                >
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-800 mb-2">You&apos;re Subscribed!</h3>
                  <p className="text-green-700">{message}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="flex-1 px-5 py-4 rounded-full border border-gray-200 focus:border-fg-blue focus:ring-2 focus:ring-fg-blue/20 outline-none text-fg-navy"
                    />
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="px-8 py-4 bg-gradient-to-r from-fg-orange to-[#f97316] text-white font-semibold rounded-full hover:shadow-lg transition-shadow disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {status === 'loading' ? (
                        'Subscribing...'
                      ) : (
                        <>
                          Subscribe
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                  {status === 'error' && (
                    <p className="text-red-600 text-sm">{message}</p>
                  )}
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* What You'll Get */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-fg-navy text-center mb-12">
            What You&apos;ll Get
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center"
            >
              <div className="inline-flex p-4 rounded-xl bg-fg-light-blue mb-4">
                <Calendar className="w-8 h-8 text-fg-blue" />
              </div>
              <h3 className="text-xl font-bold text-fg-navy mb-3">Event Updates</h3>
              <p className="text-gray-600">
                Be the first to know about community events, workshops, and panel discussions.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center"
            >
              <div className="inline-flex p-4 rounded-xl bg-fg-light-blue mb-4">
                <Heart className="w-8 h-8 text-fg-blue" />
              </div>
              <h3 className="text-xl font-bold text-fg-navy mb-3">Member Stories</h3>
              <p className="text-gray-600">
                Inspiring stories of resilience and transformation from our Thriver community.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center"
            >
              <div className="inline-flex p-4 rounded-xl bg-fg-light-blue mb-4">
                <Gift className="w-8 h-8 text-fg-blue" />
              </div>
              <h3 className="text-xl font-bold text-fg-navy mb-3">Ways to Give</h3>
              <p className="text-gray-600">
                Learn about campaigns, fundraisers, and opportunities to support our community.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Privacy Note */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-gray-500 text-sm">
            We respect your privacy. Unsubscribe at any time. We&apos;ll never share your email with third parties.
          </p>
        </div>
      </section>
    </main>
  );
}
