'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckSquare, Calendar, MapPin, ExternalLink, RefreshCw, ArrowRight, Database, Ticket, ShieldCheck } from 'lucide-react';
import { fetchApi, EventItem } from '../../lib/api';

export default function RegistrationsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi<EventItem[]>('/registrations')
      .then(res => setEvents(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <CheckSquare className="w-7 h-7 text-emerald-600" /> My Registrations
          </h1>
          <p className="text-sm text-slate-500 mt-1">Confirmed event participation and registered pass tickets</p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-xs">
          <Database className="w-4 h-4 text-emerald-600" />
          <span>DB Status: Persisted in Store ({events.length} Passes)</span>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500">
          <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-2" />
          Loading registrations from database...
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center text-slate-500 border border-purple-100 space-y-4">
          <CheckSquare className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No Registrations Found</h3>
          <p className="text-sm text-slate-500">Browse recommended events and click "Register Now" to sign up.</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-purple-600 text-white font-bold text-xs"
          >
            Explore Dashboard
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map(evt => (
            <div
              key={evt.id}
              className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md transition-shadow relative overflow-hidden"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white font-extrabold flex items-center justify-center text-lg shrink-0 shadow-md">
                  <Ticket className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> Confirmed Ticket Pass
                    </span>
                    <span className="text-xs text-slate-400">• {evt.event_type}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{evt.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-purple-600" /> {evt.start_date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-purple-600" /> {evt.mode} ({evt.location})
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <Link
                  href={`/events/${evt.id}`}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs flex items-center gap-1"
                >
                  View Ticket Pass <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
