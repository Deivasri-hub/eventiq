'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Search, Filter, RefreshCw } from 'lucide-react';
import { fetchApi, EventItem } from '../../lib/api';
import { EventCard } from '../../components/EventCard';

export default function DiscoverEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [modeFilter, setModeFilter] = useState('All');

  useEffect(() => {
    fetchApi<EventItem[]>('/recommendations')
      .then(res => setEvents(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = events.filter(evt => {
    const matchesSearch =
      evt.title.toLowerCase().includes(search.toLowerCase()) ||
      evt.category.toLowerCase().includes(search.toLowerCase()) ||
      (evt.required_skills || []).some(s => s.toLowerCase().includes(search.toLowerCase()));

    const matchesType = typeFilter === 'All' ? true : evt.event_type.toLowerCase() === typeFilter.toLowerCase();
    const matchesMode = modeFilter === 'All' ? true : evt.mode.toLowerCase() === modeFilter.toLowerCase();

    return matchesSearch && matchesType && matchesMode;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Discover Opportunities</h1>
        <p className="text-sm text-slate-500 mt-1">Browse all 30 hackathons, workshops, conferences, and internships</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search events by title, skill, or keyword..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-purple-600 text-sm font-medium"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="px-4 py-3 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-700 bg-white"
          >
            <option value="All">All Types</option>
            <option value="Hackathon">Hackathons</option>
            <option value="Workshop">Workshops</option>
            <option value="Conference">Conferences</option>
            <option value="Coding Competition">Coding Competitions</option>
            <option value="Esports">Esports</option>
            <option value="Training">Training</option>
          </select>

          <select
            value={modeFilter}
            onChange={e => setModeFilter(e.target.value)}
            className="px-4 py-3 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-700 bg-white"
          >
            <option value="All">All Modes</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500">
          <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-2" />
          Loading catalog...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map(evt => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      )}
    </div>
  );
}
