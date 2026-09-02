'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Calendar, MapPin, Bookmark, BookmarkCheck, CheckCircle2, ArrowLeft, ShieldCheck, Target, Award, Clock, DollarSign, ExternalLink, X, Database, Ticket } from 'lucide-react';
import { fetchApi, RecommendationDetail } from '../../../lib/api';
import { MatchBadge } from '../../../components/MatchBadge';

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [detail, setDetail] = useState<RecommendationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showRegModal, setShowRegModal] = useState(false);
  const [regTimestamp, setRegTimestamp] = useState('');

  useEffect(() => {
    if (!id) return;
    fetchApi<RecommendationDetail>(`/events/${id}/recommendation`)
      .then(res => {
        setDetail(res);
        setIsRegistered(res.isRegistered);
        setIsSaved(res.isSaved);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRegister = async () => {
    setRegistering(true);
    try {
      await fetchApi(`/events/${id}/register`, { method: 'POST' });
      setIsRegistered(true);
      setRegTimestamp(new Date().toLocaleString());
      setShowRegModal(true);
    } catch (err) {
      console.error(err);
    } finally {
      setRegistering(false);
    }
  };

  const handleToggleSave = async () => {
    try {
      const res = await fetchApi<{ saved: boolean }>(`/events/${id}/save`, { method: 'POST' });
      setIsSaved(res.saved);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !detail) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-500 font-medium">
        Loading event intelligence...
      </div>
    );
  }

  const { event, recommendation } = detail;
  const defaultImg = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 relative">
      {/* Back Button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm font-bold text-purple-600 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      {/* Main Header Card */}
      <div className="bg-white rounded-3xl overflow-hidden border border-purple-100 shadow-lg space-y-6">
        <div className="relative h-72 w-full bg-slate-900">
          <img
            src={event.image_url || defaultImg}
            alt={event.title}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />

          <div className="absolute top-4 left-4 flex items-center gap-2">
            <MatchBadge score={recommendation.matchScore} size="lg" />
            <span className="bg-white/90 backdrop-blur-md text-slate-900 font-extrabold text-xs px-3 py-1.5 rounded-full shadow-sm">
              {event.event_type}
            </span>
          </div>

          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <div className="text-xs font-bold text-purple-300 uppercase tracking-widest">
              {event.category}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{event.title}</h1>
            <p className="text-sm text-slate-300 flex items-center gap-4">
              <span>Organized by <strong className="text-white">{event.organizer_name}</strong></span>
              <span>•</span>
              <span className="capitalize">{event.mode} ({event.location})</span>
            </p>
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="px-6 pb-6 pt-2 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <button
              onClick={handleRegister}
              disabled={registering || isRegistered}
              className={`px-6 py-3 rounded-2xl font-extrabold text-sm shadow-md transition-all flex items-center gap-2 ${
                isRegistered
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {isRegistered ? (
                <>
                  <CheckCircle2 className="w-5 h-5" /> Registered & Stored in DB
                </>
              ) : registering ? (
                'Saving to Database...'
              ) : (
                'Register Now'
              )}
            </button>

            <button
              onClick={handleToggleSave}
              className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-purple-50 text-slate-700 font-bold text-sm transition-all flex items-center gap-2"
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="w-4 h-4 text-purple-600 fill-purple-600" /> Saved
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" /> Save Event
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/why-recommended/${event.id}`}
              className="px-4 py-3 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs flex items-center gap-1.5 transition-colors border border-purple-200"
            >
              <Sparkles className="w-4 h-4 text-purple-600" /> Why Recommended?
            </Link>

            <Link
              href={`/skill-gap/${event.id}`}
              className="px-4 py-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-1.5 transition-colors border border-indigo-200"
            >
              <Target className="w-4 h-4 text-indigo-600" /> Skill Gap Analysis
            </Link>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left 2 Cols: Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900">About the Opportunity</h2>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Required Skills */}
          <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" /> Required Skills & Knowledge
            </h2>
            <div className="flex flex-wrap gap-2">
              {(event.required_skills || []).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 font-semibold text-xs border border-purple-200"
                >
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Eligibility */}
          {event.eligibility && (
            <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-sm space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" /> Eligibility Criteria
              </h2>
              <p className="text-slate-700 text-sm font-medium">{event.eligibility}</p>
            </div>
          )}
        </div>

        {/* Right Col: Logistics Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Logistics & Details
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-purple-600 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900">Date</div>
                  <div className="text-xs text-slate-500">{event.start_date} to {event.end_date}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-purple-600 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900">Timing</div>
                  <div className="text-xs text-slate-500">{event.start_time || '09:00'} - {event.end_time || '18:00'}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-purple-600 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900">Location</div>
                  <div className="text-xs text-slate-500">{event.mode} ({event.location})</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900">Registration Fee</div>
                  <div className="text-xs font-bold text-emerald-600">
                    {event.is_free ? 'FREE OF COST' : `₹${event.registration_fee}`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* REGISTRATION CONFIRMATION TICKET MODAL */}
      {showRegModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 border border-purple-100 shadow-2xl space-y-6 text-center relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowRegModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg shadow-emerald-100">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold">
                <Database className="w-3.5 h-3.5 text-emerald-600" /> STORED IN BACKEND DATABASE
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">Registration Confirmed!</h2>
              <p className="text-sm text-slate-600">
                You are officially registered for <strong className="text-slate-900">{event.title}</strong>.
              </p>
            </div>

            {/* Ticket Box */}
            <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-100 text-left space-y-2 text-xs">
              <div className="flex justify-between font-bold text-purple-900">
                <span>Pass Status:</span>
                <span className="text-emerald-600 uppercase font-extrabold">Active Ticket</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Timestamp:</span>
                <span className="font-semibold text-slate-800">{regTimestamp}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Event Mode:</span>
                <span className="font-semibold text-slate-800">{event.mode} ({event.location})</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/registrations"
                className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2"
              >
                <Ticket className="w-4 h-4" /> View My Registered Passes
              </Link>
              <button
                onClick={() => setShowRegModal(false)}
                className="w-full py-2.5 rounded-xl text-slate-500 font-bold text-xs hover:bg-slate-100"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
