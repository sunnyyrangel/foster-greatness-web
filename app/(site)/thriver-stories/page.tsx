'use client';

import { motion } from 'framer-motion';
import { Play, Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import YouTubePlaylist from '@/components/YouTubePlaylist';

export default function ThriverStoriesPage() {
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
      <section className="relative bg-gradient-to-b from-fg-light-blue to-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-6">
              <Play className="w-4 h-4 text-fg-blue" />
              <span className="text-sm font-semibold text-fg-navy">Video Series</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-fg-navy mb-6">
              Thriver Stories
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
              Real stories of resilience, strength, and transformation from our community.
            </p>

            <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8">
              Host Isabel Stasa interviews Foster Greatness community members, sharing their journeys and insights. New episodes weekly.
            </p>

            <div className="flex items-center justify-center gap-6">
              <a
                href="https://www.youtube.com/@_FosterGreatness/playlists"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white px-5 py-3 rounded-full shadow-sm hover:shadow-md transition-shadow"
              >
                <Image
                  src="/images/youtube-logo.webp"
                  alt="YouTube"
                  width={90}
                  height={30}
                  className="h-5 w-auto"
                />
                <span className="text-sm font-semibold text-fg-navy">Watch on YouTube</span>
              </a>
              <a
                href="https://open.spotify.com/show/0jAd3WahLfVMkjb2Fb1ODs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white px-5 py-3 rounded-full shadow-sm hover:shadow-md transition-shadow"
              >
                <Image
                  src="/images/spotify-logo.webp"
                  alt="Spotify"
                  width={90}
                  height={25}
                  className="h-5 w-auto"
                />
                <span className="text-sm font-semibold text-fg-navy">Listen on Spotify</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* YouTube Playlist */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <YouTubePlaylist playlistId="PLP4LxE_2m7ju-Bcbx2ia50UVFgP1AkcN6" maxResults={12} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-fg-navy via-fg-navy to-fg-blue rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="inline-flex p-3 rounded-xl bg-white/10 mb-6">
                <Heart className="w-8 h-8 text-fg-blue" />
              </div>

              <h2 className="text-3xl font-bold mb-4">
                Want to Share Your Story?
              </h2>

              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                Join the Storytellers Collective and learn how to harness your story as a powerful tool for change.
              </p>

              <Link
                href="/storytellers-collective"
                className="inline-flex items-center gap-2 bg-white text-fg-navy px-8 py-4 rounded-full font-bold hover:bg-fg-blue hover:text-white transition-colors"
              >
                Join Storytellers Collective
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
