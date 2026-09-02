'use client';

import { useEffect, useState } from 'react';
import Nav from '../../components/Nav';
import EventCard from '../../components/EventCard';
import { api } from '../../lib/api';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  const loadEvents = () => {
    api('/events')
      .then(res => {
        if (Array.isArray(res)) setEvents(res);
        else setEvents([]);
      })
      .catch(err => {
        console.error(err);
        setEvents([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const filtered = events.filter(e => {
    const titleStr = String(e.event_name || e.title || '').toLowerCase();
    const catStr = String(e.category || '').toLowerCase();
    const query = q.toLowerCase();
    return titleStr.includes(query) || catStr.includes(query);
  });

  return (
    <>
      <Nav />
      <main className="max-w-7xl mx-auto p-5 md:p-8">
        <h1 className="text-4xl font-black">Discover Events</h1>
        <p className="muted mt-2">Explore opportunities from your EventIQ dataset and student community.</p>

        <input
          className="input mt-6 max-w-2xl"
          placeholder="Search events by title, category, or skill..."
          value={q}
          onChange={e => setQ(e.target.value)}
        />

        {loading ? (
          <div className="py-16 text-center muted">Loading events catalog...</div>
        ) : filtered.length === 0 ? (
          <div className="card p-12 text-center mt-8 muted font-bold">
            No events found matching "{q}".
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mt-8">
            {filtered.map(e => (
              <EventCard key={e.id} event={e} onSaveToggle={loadEvents} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
