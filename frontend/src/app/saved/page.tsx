'use client';

import React, { useState, useEffect } from 'react';
import { Bookmark, RefreshCw } from 'lucide-react';
import { fetchApi, EventItem } from '../../lib/api';
import { EventCard } from '../../components/EventCard';

export default function SavedEventsPage() {
  const [savedEvents, setSavedEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSaved = () => {
    fetchApi<EventItem[]>('/saved')
      .then(res => setSavedEvents(Array.isArray(res) ? res : []))
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
          <Bookmark className="w-7 h-7 text-purple-600 fill-purple-600" /> Saved Opportunities
        </h1>
        <p className="text-sm text-slate-500 mt-1">Events you have bookmarked for later review</p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500">
          <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-2" />
          Loading saved events...
        </div>
      ) : savedEvents.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center text-slate-500 border border-purple-100 space-y-3">
          <Bookmark className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No Saved Events Yet</h3>
          <p className="text-sm text-slate-500">Click the bookmark icon on any event card to save it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {savedEvents.map(evt => (
            <EventCard key={evt.id} event={{ ...evt, isSaved: true }} onSaveToggle={loadSaved} />
          ))}
        </div>
      )}
    </div>
  );
}
