'use client';

import { useEffect, useState } from 'react';
import Nav from '../../components/Nav';
import Sidebar from '../../components/Sidebar';
import Require from '../../components/Require';
import { api } from '../../lib/api';
import Link from 'next/link';

function Page() {
  const [d, setD] = useState({ stats: { total: 0, active: 0, registrations: 0 }, events: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/organizer/dashboard')
      .then(res => {
        if (res) {
          setD({
            stats: res.stats || { total: 0, active: 0, registrations: 0 },
            events: Array.isArray(res.events) ? res.events : []
          });
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const statsList = [
    ['Total Events', d?.stats?.total || 0],
    ['Active Opportunities', d?.stats?.active || 0],
    ['Student Registrations', d?.stats?.registrations || 0]
  ];

  const eventsList = d?.events || [];

  return (
    <>
      <Sidebar organizer />
      <div className="lg:ml-64">
        <Nav />
        <main className="p-5 md:p-8 max-w-6xl">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-black">Welcome, Organizer! 👋</h1>
              <p className="muted text-sm mt-1">AI-powered event management and audience intelligence catalog.</p>
            </div>
            <Link className="btn btn-primary" href="/organizer/create">
              + Create Event
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-8">
            {statsList.map(x => (
              <div className="card p-6" key={x[0]}>
                <p className="muted text-xs uppercase font-bold tracking-wider">{x[0]}</p>
                <div className="text-4xl font-black mt-2 text-slate-900">{x[1]}</div>
              </div>
            ))}
          </div>

          <h2 className="font-black text-xl mt-10">Recent Events</h2>
          {loading ? (
            <div className="py-10 text-center muted">Loading organizer events...</div>
          ) : eventsList.length === 0 ? (
            <div className="card p-8 text-center mt-4 muted">No events created yet. Click "+ Create Event" to get started!</div>
          ) : (
            <div className="space-y-3 mt-4">
              {eventsList.map(e => (
                <div className="card p-5 flex justify-between items-center" key={e.id}>
                  <div>
                    <b className="text-base text-slate-900">{e.event_name || e.title}</b>
                    <p className="muted text-xs mt-1">
                      {e.start_date} • {e.mode || 'Online'} • <span className="font-bold text-green-600">{e.status || 'Published'}</span>
                    </p>
                  </div>
                  <span className="pill text-xs">{e.category || 'General'}</span>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export default function OrganizerHomeRoot() {
  return (
    <Require role="organizer">
      <Page />
    </Require>
  );
}
