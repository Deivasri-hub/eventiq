'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Calendar, Bookmark, BookmarkCheck, ArrowRight, Users, Sparkles } from 'lucide-react';
import { EventItem, fetchApi, trackInteraction } from '../lib/api';
import { MatchBadge } from './MatchBadge';

interface EventCardProps {
  event: EventItem;
  onSaveToggle?: (eventId: number, isSaved: boolean) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onSaveToggle }) => {
  const [isSaved, setIsSaved] = useState<boolean>(event.isSaved || false);
  const [saving, setSaving] = useState<boolean>(false);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSaving(true);
    try {
      const res = await fetchApi<{ saved: boolean }>(`/events/${event.id}/save`, { method: 'POST' });
      setIsSaved(res.saved);
      if (onSaveToggle) onSaveToggle(event.id, res.saved);
      trackInteraction(event.id, 'SAVE');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const defaultImg = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80';

  return (
    <div className="group relative bg-white rounded-2xl border border-purple-100/80 shadow-sm hover:shadow-xl hover:border-purple-300 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Event Image & Header Badges */}
      <div className="relative h-48 w-full bg-purple-900 overflow-hidden">
        <img
          src={event.image_url || defaultImg}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {event.matchScore !== undefined && (
            <MatchBadge score={event.matchScore} size="sm" />
          )}
          <span className="bg-white/90 backdrop-blur-md text-slate-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            {event.event_type}
          </span>
        </div>

        {/* Save Bookmark Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-md text-slate-700 hover:text-purple-600 hover:bg-white transition-all shadow-md"
          title={isSaved ? 'Remove from Saved' : 'Save Event'}
        >
          {isSaved ? (
            <BookmarkCheck className="w-4 h-4 text-purple-600 fill-purple-600" />
          ) : (
            <Bookmark className="w-4 h-4" />
          )}
        </button>

        {/* Price & Mode overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-white text-xs font-medium">
          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-md">
            <MapPin className="w-3.5 h-3.5 text-purple-300" />
            <span>{event.mode === 'Online' ? 'Online Event' : event.location}</span>
          </div>
          <span className={`px-2.5 py-1 rounded-md font-bold text-xs ${event.is_free ? 'bg-emerald-500/90 text-white' : 'bg-amber-500/90 text-white'}`}>
            {event.is_free ? 'FREE' : `₹${event.registration_fee}`}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* SIMILAR STUDENT RECOMMENDATION SOCIAL BADGE */}
          {event.isSimilarStudentRecommended && (
            <div className="mb-2 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-200/80 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-purple-800 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span className="truncate">Students with similar interests are participating</span>
            </div>
          )}

          <div className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-1">
            {event.category}
          </div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-700 transition-colors line-clamp-1 mb-2">
            {event.title}
          </h3>
          <p className="text-slate-600 text-sm line-clamp-2 mb-4">
            {event.description}
          </p>
        </div>

        <div>
          {/* Date & Time */}
          <div className="flex items-center gap-2 text-slate-500 text-xs mb-3">
            <Calendar className="w-4 h-4 text-purple-500" />
            <span>{event.start_date} {event.end_date !== event.start_date ? `to ${event.end_date}` : ''}</span>
          </div>

          {/* Skill tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(event.required_skills || []).slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="bg-purple-50 text-purple-700 text-xs font-medium px-2.5 py-0.5 rounded-md border border-purple-100"
              >
                {skill}
              </span>
            ))}
            {(event.required_skills || []).length > 3 && (
              <span className="text-slate-400 text-xs px-1 self-center">
                +{(event.required_skills || []).length - 3} more
              </span>
            )}
          </div>

          {/* Card Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            {event.matchScore !== undefined ? (
              <Link
                href={`/why-recommended/${event.id}`}
                className="text-xs text-purple-600 font-semibold hover:underline flex items-center gap-1"
              >
                Why Match?
              </Link>
            ) : (
              <span className="text-xs text-slate-400">{event.organizer_name}</span>
            )}

            <Link
              href={`/events/${event.id}`}
              onClick={() => trackInteraction(event.id, 'CLICK')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              View Details
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
