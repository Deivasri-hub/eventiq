'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusCircle, Layers, Calendar, MapPin, Eye, RefreshCw } from 'lucide-react';
import { fetchApi, EventItem } from '../../../lib/api';

export default function OrganizerEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi<EventItem[]>('/organizer/events')
      .then(res => {
        if (Array.isArray(res)) setEvents(res);
        else if (res && Array.isArray((res as any).events)) setEvents((res as any).events);
        else setEvents([]);
      })
      .catch(err => {
        console.error(err);
        setEvents([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const eventsList = events || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <Layers className="w-7 h-7 text-purple-600" /> My Published Events
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage and track your active hackathons, workshops, and expos</p>
        </div>

        <Link
          href="/organizer/create"
          className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" /> Create New Event
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500">
          <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-2" />
          Loading organizer events...
        </div>
      ) : eventsList.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center text-slate-500 border border-purple-100 space-y-3">
          <Layers className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No Events Created Yet</h3>
          <p className="text-sm text-slate-500">Click "Create New Event" to publish your first event and run AI intelligence audits.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventsList.map(evt => (
            <div key={evt.id} className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-purple-50 text-purple-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {evt.event_type}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    {evt.status || 'Upcoming'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{evt.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{evt.description}</p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-purple-600" /> {evt.start_date}
                  </span>
                  <span className="font-bold text-slate-800">
                    {evt.is_free ? 'FREE' : `₹${evt.registration_fee}`}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <Link
                    href={`/events/${evt.id}`}
                    className="flex-1 text-center py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold"
                  >
                    Preview
                  </Link>
                  <Link
                    href="/organizer/ai-analysis"
                    className="flex-1 text-center py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold"
                  >
                    AI Audit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
