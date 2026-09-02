'use client';

import { useEffect, useState } from 'react';
import Nav from '../../../components/Nav';
import Sidebar from '../../../components/Sidebar';
import Require from '../../../components/Require';
import { api } from '../../../lib/api';
import Link from 'next/link';

function Page() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/organizer/events')
      .then(res => {
        if (Array.isArray(res)) setEvents(res);
        else if (res && Array.isArray(res.events)) setEvents(res.events);
        else setEvents([]);
      })
      .catch(err => {
        console.error(err);
        setEvents([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Sidebar organizer />
      <div className="lg:ml-64">
        <Nav />
        <main className="p-5 md:p-8 max-w-7xl">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-black">My Published Events</h1>
              <p className="muted text-sm mt-1">Manage and track your active hackathons, workshops, and expos</p>
            </div>
            <Link className="btn btn-primary" href="/organizer/create">
              + Create Event
            </Link>
          </div>

          {loading ? (
            <div className="py-16 text-center muted">Loading organizer events...</div>
          ) : events.length === 0 ? (
            <div className="card p-12 text-center mt-6 space-y-3">
              <h3 className="text-lg font-bold">No Events Created Yet</h3>
              <p className="muted text-sm">Click "+ Create Event" to publish your first event and run AI audits.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
              {events.map(e => (
                <div className="card p-6 flex flex-col justify-between" key={e.id}>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="pill text-xs">{e.event_type || 'Event'}</span>
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        {e.status || 'Published'}
                      </span>
                    </div>
                    <h3 className="font-black text-lg">{e.event_name || e.title}</h3>
                    <p className="muted text-xs mt-2 line-clamp-2">{e.description}</p>
                    <p className="muted text-xs mt-2">
                      📅 {e.start_date} • 📍 {e.location || 'Online'}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-5 pt-4 border-t border-slate-100">
                    <span className="pill">{e.category || 'General'}</span>
                    <span className="pill font-bold">
                      {e.is_free ? 'Free' : `₹${e.registration_fee_inr || e.registration_fee || '0'}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export default function OrganizerEventsRoot() {
  return (
    <Require role="organizer">
      <Page />
    </Require>
  );
}
