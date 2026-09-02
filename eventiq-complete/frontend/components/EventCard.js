'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, CalendarDays, Bookmark, BookmarkCheck } from 'lucide-react';
import { api } from '../lib/api';

export default function EventCard({ event, score, onSaveToggle }) {
  const [saved, setSaved] = useState(Boolean(event.is_saved));
  const [saving, setSaving] = useState(false);

  async function toggleSave(e) {
    e.preventDefault();
    e.stopPropagation();
    setSaving(true);
    try {
      const res = await api(`/events/${event.id}/save`, { method: 'POST' });
      const nextSaved = res.saved !== undefined ? res.saved : !saved;
      setSaved(nextSaved);
      if (onSaveToggle) onSaveToggle(event.id, nextSaved);
    } catch (err) {
      setSaved(!saved);
    } finally {
      setSaving(false);
    }
  }

  const titleText = event.event_name || event.title || 'Untitled Event';
  const feeText = event.is_free ? 'Free' : `₹${event.registration_fee_inr || event.registration_fee || '—'}`;

  return (
    <div className="card overflow-hidden flex flex-col justify-between">
      <div>
        <div className="h-36 bg-gradient-to-br from-indigo-950 via-brand to-purple-400 p-5 text-white relative">
          <div className="text-3xl font-black opacity-80">AI</div>
          <button
            onClick={toggleSave}
            disabled={saving}
            title={saved ? 'Remove from Saved' : 'Save Event'}
            className="absolute right-4 top-4 bg-white/90 hover:bg-white text-ink rounded-full p-2 transition-all shadow-md"
          >
            {saved ? (
              <BookmarkCheck size={18} className="text-purple-600 fill-purple-600" />
            ) : (
              <Bookmark size={18} />
            )}
          </button>
        </div>
        <div className="p-4">
          <div className="flex justify-between gap-3">
            <div>
              <h3 className="font-extrabold leading-tight">{titleText}</h3>
              <p className="text-xs muted mt-1">
                {event.event_type || 'Event'} • {event.mode || 'Online'}
              </p>
            </div>
            {score != null && (
              <div className="text-right">
                <div className="text-xl font-black text-green-600">{score}%</div>
                <div className="text-[10px] font-bold text-green-600">MATCH</div>
              </div>
            )}
          </div>
          <div className="mt-3 text-xs space-y-2 muted">
            <div className="flex gap-2 items-center">
              <MapPin size={14} /> {event.location || 'Online'}
            </div>
            <div className="flex gap-2 items-center">
              <CalendarDays size={14} />
              {event.start_date}
              {event.end_date && event.end_date !== event.start_date ? ` – ${event.end_date}` : ''}
            </div>
          </div>
          <div className="mt-3 flex justify-between items-center">
            <span className="pill">{event.category || 'General'}</span>
            <span className="font-bold text-sm">{feeText}</span>
          </div>
        </div>
      </div>
      <div className="p-4 pt-0">
        <Link href={`/events/${event.id}`} className="btn btn-primary block text-center mt-2 text-sm">
          View Event
        </Link>
      </div>
    </div>
  );
}
