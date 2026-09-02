'use client';

import { useEffect, useState } from 'react';
import Nav from '../../components/Nav';
import Sidebar from '../../components/Sidebar';
import Require from '../../components/Require';
import { api } from '../../lib/api';
import EventCard from '../../components/EventCard';

function Page() {
  const [savedEvents, setSavedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSaved = () => {
    api('/saved')
      .then(res => {
        if (Array.isArray(res)) setSavedEvents(res);
        else setSavedEvents([]);
      })
      .catch(err => {
        console.error(err);
        setSavedEvents([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSaved();
  }, []);

  return (
    <>
      <Sidebar />
      <div className="lg:ml-64">
        <Nav />
        <main className="p-5 md:p-8 max-w-7xl">
          <h1 className="text-3xl font-black">Saved Opportunities</h1>
          <p className="muted text-sm mt-1">Events you have bookmarked for later review.</p>

          {loading ? (
            <div className="py-16 text-center muted">Loading saved events...</div>
          ) : savedEvents.length === 0 ? (
            <div className="card p-12 text-center mt-6 space-y-2 muted">
              <h3 className="text-lg font-bold text-slate-800">No Saved Events Yet</h3>
              <p className="text-sm">Click the bookmark icon on any event card to save it here.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mt-6">
              {savedEvents.map(x => (
                <EventCard key={x.id} event={{ ...x, is_saved: true }} onSaveToggle={loadSaved} />
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export default function SavedEventsRoot() {
  return (
    <Require>
      <Page />
    </Require>
  );
}
