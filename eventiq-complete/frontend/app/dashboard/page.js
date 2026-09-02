'use client';

import { useEffect, useState } from 'react';
import Nav from '../../components/Nav';
import Sidebar from '../../components/Sidebar';
import EventCard from '../../components/EventCard';
import Require from '../../components/Require';
import { api } from '../../lib/api';

function Page() {
  const [events, setEvents] = useState([]);
  const [q, setQ] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const loadRecommendations = () => {
    api('/recommendations')
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
    loadRecommendations();
  }, []);

  const filtered = (events || []).filter(e => {
    const titleStr = String(e.event_name || e.title || '').toLowerCase();
    const typeStr = String(e.event_type || '').toLowerCase();
    const matchesQ = titleStr.includes(q.toLowerCase());
    const matchesCat =
      categoryFilter === 'All' ? true : typeStr.includes(categoryFilter.toLowerCase().slice(0, 4));
    return matchesQ && matchesCat;
  });

  return (
    <>
      <Sidebar />
      <div className="lg:ml-64">
        <Nav />
        <main className="p-5 md:p-8 max-w-7xl">
          <h1 className="text-3xl font-black">Welcome back! 👋</h1>
          <p className="muted mt-1">Here are the top events recommended for you by EventIQ AI.</p>

          <div className="flex gap-3 mt-7">
            <input
              className="input max-w-xl"
              placeholder="Search recommended events..."
              value={q}
              onChange={e => setQ(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-auto mt-4 pb-1">
            {['All', 'Hackathons', 'Workshops', 'Conferences', 'Competitions', 'Internships'].map(x => (
              <span
                className={`pill whitespace-nowrap cursor-pointer transition-all ${
                  categoryFilter === x ? 'bg-purple-600 text-white font-bold' : ''
                }`}
                key={x}
                onClick={() => setCategoryFilter(x)}
              >
                {x}
              </span>
            ))}
          </div>

          <h2 className="text-xl font-black mt-8">Recommended For You</h2>

          {loading ? (
            <div className="py-16 text-center muted">Loading personalized AI recommendations...</div>
          ) : filtered.length === 0 ? (
            <div className="card p-10 text-center mt-4 muted font-bold">
              No recommended events match your criteria.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mt-4">
              {filtered.map(e => (
                <EventCard
                  key={e.id}
                  event={e}
                  score={e.match_score || e.matchScore}
                  onSaveToggle={loadRecommendations}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export default function StudentDashboardRoot() {
  return (
    <Require>
      <Page />
    </Require>
  );
}
