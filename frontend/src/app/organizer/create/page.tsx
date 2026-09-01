'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, ArrowLeft, Save, Send, ShieldCheck, Award, Calendar, MapPin, DollarSign, Brain } from 'lucide-react';
import { fetchApi } from '../../../lib/api';

export default function CreateEventPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Academic & Professional');
  const [eventType, setEventType] = useState('Hackathon');
  const [mode, setMode] = useState('Offline');
  const [location, setLocation] = useState('Coimbatore');
  const [startDate, setStartDate] = useState('2026-10-15');
  const [endDate, setEndDate] = useState('2026-10-16');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  const [eligibility, setEligibility] = useState('Open to all CSE, IT, and AI & DS engineering students');
  const [requiredSkills, setRequiredSkills] = useState('Python, Machine Learning, Problem Solving, Web Development');
  const [registrationFee, setRegistrationFee] = useState<number>(0);
  const [registrationDeadline, setRegistrationDeadline] = useState('2026-10-10');

  const [publishing, setPublishing] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyzeWithAI = async () => {
    setAnalyzing(true);
    try {
      const skillsArray = requiredSkills.split(',').map(s => s.trim()).filter(Boolean);
      const res = await fetchApi('/ai/analyze-event', {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          category,
          eligibility,
          requiredSkills: skillsArray,
          location,
          registrationFee,
        }),
      });

      // Store temporary draft in localStorage for AI Analysis page view
      localStorage.setItem('eventiq_ai_draft', JSON.stringify({
        input: {
          title, description, category, eventType, mode, location,
          startDate, endDate, startTime, endTime, eligibility,
          requiredSkills: skillsArray, registrationFee, registrationDeadline
        },
        ai: res
      }));

      router.push('/organizer/ai-analysis');
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setPublishing(true);

    const skillsArray = requiredSkills.split(',').map(s => s.trim()).filter(Boolean);
    try {
      await fetchApi('/organizer/events', {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          category,
          event_type: eventType,
          mode,
          location,
          start_date: startDate,
          end_date: endDate,
          start_time: startTime,
          end_time: endTime,
          eligibility,
          required_skills: skillsArray,
          target_audience: ['College Students', 'Developers'],
          registration_fee: registrationFee,
          is_free: registrationFee === 0,
          registration_deadline: registrationDeadline,
          status: 'Upcoming',
        }),
      });

      router.push('/organizer/events');
    } catch (err) {
      console.error(err);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        href="/organizer/dashboard"
        className="inline-flex items-center gap-2 text-sm font-bold text-purple-600 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-3xl p-8 border border-purple-100 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase mb-2">
            <Sparkles className="w-4 h-4 text-purple-600" /> AI Event Studio
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Create & Analyze New Event</h1>
          <p className="text-sm text-slate-500 mt-1">Publish opportunities and run AI intelligence audits before launch</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAnalyzeWithAI}
            disabled={analyzing}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Brain className="w-4 h-4" />
            {analyzing ? 'Analyzing...' : 'Analyze with AI'}
          </button>
        </div>
      </div>

      <form onSubmit={handlePublish} className="space-y-8">
        {/* Basic Event Info */}
        <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900">Basic Event Details</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Event Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Generative AI Hackathon 2026"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600 text-base font-bold text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                >
                  <option value="Academic & Professional">Academic & Professional</option>
                  <option value="Community & Social Events">Community & Social Events</option>
                  <option value="Cultural & Entertainment">Cultural & Entertainment</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Event Format</label>
                <select
                  value={eventType}
                  onChange={e => setEventType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                >
                  <option value="Hackathon">Hackathon</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Conference">Conference</option>
                  <option value="Coding Competition">Coding Competition</option>
                  <option value="Project Expo">Project Expo</option>
                  <option value="Esports">Esports</option>
                  <option value="Masterclass">Masterclass</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Detailed Description</label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Provide a comprehensive event description including problem statements, tracks, prizes, and schedule..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600 text-sm font-medium"
              />
            </div>
          </div>
        </div>

        {/* Schedule & Location */}
        <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" /> Logistics & Dates
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Mode</label>
              <select
                value={mode}
                onChange={e => setMode(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
              >
                <option value="Offline">Offline (In-Person)</option>
                <option value="Online">Online</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Coimbatore / Chennai / Online"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Registration Fee (₹)</label>
              <input
                type="number"
                value={registrationFee}
                onChange={e => setRegistrationFee(Number(e.target.value))}
                placeholder="0 for Free"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Registration Deadline</label>
              <input
                type="date"
                value={registrationDeadline}
                onChange={e => setRegistrationDeadline(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
              />
            </div>
          </div>
        </div>

        {/* Skills & Eligibility */}
        <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-600" /> Target Skills & Eligibility
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Required Skills (Comma separated)
              </label>
              <input
                type="text"
                value={requiredSkills}
                onChange={e => setRequiredSkills(e.target.value)}
                placeholder="Python, Machine Learning, React, Problem Solving..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Eligibility Statement</label>
              <input
                type="text"
                value={eligibility}
                onChange={e => setEligibility(e.target.value)}
                placeholder="e.g. Open to undergraduate engineering students"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={handleAnalyzeWithAI}
            disabled={analyzing}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Brain className="w-4 h-4" />
            {analyzing ? 'Analyzing...' : 'Analyze with AI'}
          </button>

          <button
            type="submit"
            disabled={publishing}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-lg shadow-purple-200 transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            {publishing ? 'Publishing Event...' : 'Publish Event'}
          </button>
        </div>
      </form>
    </div>
  );
}
