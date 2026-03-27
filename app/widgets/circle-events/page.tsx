'use client';

import { useState, useEffect } from 'react';

interface CircleEvent {
  id: string;
  name: string;
  starts_at: string;
  url: string;
  location_type: string;
  cover_image_url?: string;
  space?: {
    slug: string;
  };
}

export default function CircleEventsWidget() {
  const [events, setEvents] = useState<CircleEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('https://circle-events-widget-23sx.vercel.app/api/events');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();

        const allEvents = data.records || data || [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const filtered = allEvents
          .filter((event: CircleEvent) => {
            const isGeneral = event.space?.slug === 'general-events';
            const eventDate = new Date(event.starts_at);
            eventDate.setHours(0, 0, 0, 0);
            return isGeneral && eventDate >= today;
          })
          .sort((a: CircleEvent, b: CircleEvent) =>
            new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()
          )
          .slice(0, 10);

        setEvents(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', gap: 14, padding: '8px 4px', overflow: 'hidden' }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ flex: '0 0 220px', height: 220, background: '#f3f4f6', borderRadius: 12, animation: 'pulse 1.5s ease-in-out infinite' }} />
        ))}
        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <p style={{ fontFamily: "'Poppins', sans-serif", color: '#6b7280', fontSize: 15, textAlign: 'center', padding: 20 }}>
        No upcoming events right now — check back soon!
      </p>
    );
  }

  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: transparent; overflow-x: hidden; }
        .events-track { display: flex; gap: 14px; overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; padding: 8px 4px 12px; scrollbar-width: thin; scrollbar-color: #d1d5db transparent; font-family: 'Poppins', sans-serif; }
        .events-track::-webkit-scrollbar { height: 6px; }
        .events-track::-webkit-scrollbar-track { background: transparent; }
        .events-track::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
        .event-card { flex: 0 0 220px; scroll-snap-align: start; text-decoration: none; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb; background: #fff; transition: transform 0.2s, box-shadow 0.2s; display: block; }
        .event-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(26,41,73,0.12); }
      `}</style>
      <div className="events-track">
        {events.map((event) => {
          const d = new Date(event.starts_at);
          const month = months[d.getMonth()];
          const day = d.getDate();
          const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'America/Los_Angeles' });

          return (
            <a key={event.id} href={event.url} target="_blank" rel="noopener noreferrer" className="event-card">
              {event.cover_image_url ? (
                <img src={event.cover_image_url} alt="" style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }} />
              ) : (
                <div style={{ width: '100%', height: 120, background: 'linear-gradient(135deg, #1a2949, #0067a2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 32 }}>📅</span>
                </div>
              )}
              <div style={{ padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ background: '#0067a2', color: '#fff', borderRadius: 10, padding: '6px 0', width: 48, textAlign: 'center', flexShrink: 0 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, opacity: 0.8, lineHeight: 1 }}>{month}</div>
                    <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.2 }}>{day}</div>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#1a2949', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{event.name}</div>
                    <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{time} PST</div>
                  </div>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </>
  );
}
