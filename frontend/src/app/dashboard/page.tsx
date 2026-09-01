'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Search, Filter, RefreshCw, Layers, CheckCircle2, Bookmark, CheckSquare, Users, Zap } from 'lucide-react';
import { fetchApi, EventItem, StudentProfile } from '../../lib/api';
import { EventCard } from '../../components/EventCard';
import { useAuth } from '../../lib/AuthContext';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedFee, setSelectedFee] = useState<string>('All');
  const [selectedMode, setSelectedMode] = useState<string>('All');

  const categories = ['All', 'Hackathon', 'Workshop', 'Conference', 'Coding Competition', 'Training', 'Esports', 'Masterclass'];

  const loadData = async () => {
    setLoading(true);
    try {
      const [recsData, profileData] = await Promise.all([
        fetchApi<EventItem[]>('/recommendations'),
        fetchApi<StudentProfile>('/students/profile').catch(() => null),
      ]);
      setEvents(recsData);
      setProfile(profileData);
    } catch (err) {
      console.error('Error loading recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredEvents = events.filter(evt => {
    const matchesSearch =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (evt.required_skills || []).some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' ? true : evt.event_type.toLowerCase().includes(selectedCategory.toLowerCase());

    const matchesFee =
      selectedFee === 'All' ? true : selectedFee === 'Free' ? evt.is_free : !evt.is_free;

    const matchesMode =
      selectedMode === 'All' ? true : evt.mode.toLowerCase() === selectedMode.toLowerCase();

    return matchesSearch && matchesCategory && matchesFee && matchesMode;
  });

  const recommendedForYou = filteredEvents.slice(0, 4);
  const similarStudentEvents = filteredEvents.filter(e => e.isSimilarStudentRecommended).slice(0, 4);
  const freeEvents = filteredEvents.filter(e => e.is_free).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* WELCOME BANNER */}
      <div className="relative rounded-3xl bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 text-white p-8 overflow-hidden shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-purple-200 text-xs font-semibold">
            <Zap className="w-4 h-4 text-purple-300 fill-purple-300" />
            <span>ACE AI Match Engine Active</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Alex'}! 👋
          </h1>

          <p className="text-purple-100 text-sm sm:text-base leading-relaxed">
            ACE Intelligence analyzed your profile (
            <span className="font-bold text-white">{profile?.department || 'CSE'}</span> •{' '}
            <span className="font-bold text-white">{profile?.career_goal || 'AI Engineer'}</span>). Matches are sorted by skills, interests, and peer student participation.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/profile"
              className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all"
            >
              Edit Profile & Skills
            </Link>
            <Link
              href="/registrations"
              className="px-4 py-2 rounded-xl bg-white text-purple-900 hover:bg-purple-50 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <CheckSquare className="w-4 h-4 text-purple-600" />
              My Registered Events
            </Link>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search AllCollegeEvent by title, skill (Python, AI, React), or topic..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-purple-600 text-sm font-medium"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <select
              value={selectedFee}
              onChange={e => setSelectedFee(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
            >
              <option value="All">All Fees</option>
              <option value="Free">FREE Only</option>
              <option value="Paid">PAID Only</option>
            </select>

            <select
              value={selectedMode}
              onChange={e => setSelectedMode(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
            >
              <option value="All">All Modes</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500 font-medium space-y-3">
          <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mx-auto" />
          <p>Calculating personalized ACE AI matches...</p>
        </div>
      ) : (
        <>
          {/* SECTION 1: TOP RECOMMENDED FOR YOU */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Top Recommended For You
                </h2>
                <p className="text-xs text-slate-500">Matched by Skills, Interests & Career Goal</p>
              </div>
              <Link href="/events" className="text-xs font-bold text-purple-600 hover:underline">
                View All ({filteredEvents.length})
              </Link>
            </div>

            {recommendedForYou.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center text-slate-500 border border-purple-100">
                No events matched your search filter. Try clearing filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendedForYou.map(evt => (
                  <EventCard key={evt.id} event={evt} onSaveToggle={loadData} />
                ))}
              </div>
            )}
          </section>

          {/* SECTION 2: POPULAR AMONG SIMILAR STUDENTS (SOCIAL RECOMMENDATIONS) */}
          {similarStudentEvents.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-600" />
                    Popular Among Students Like You
                  </h2>
                  <p className="text-xs text-slate-500">
                    Students with similar interest profiles are registering for these eligible events
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarStudentEvents.map(evt => (
                  <EventCard key={evt.id} event={evt} onSaveToggle={loadData} />
                ))}
              </div>
            </section>
          )}

          {/* SECTION 3: FREE OPPORTUNITIES */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Featured Free Opportunities
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {freeEvents.map(evt => (
                <EventCard key={evt.id} event={evt} onSaveToggle={loadData} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
