'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Nav from '../../../components/Nav';
import Sidebar from '../../../components/Sidebar';
import Require from '../../../components/Require';
import { api } from '../../../lib/api';
import Link from 'next/link';

function Page() {
  const router = useRouter();
  const [f, setF] = useState({
    event_name: '',
    description: '',
    event_type: 'Hackathon',
    category: 'Academic & Professional',
    mode: 'Online',
    location: 'Online',
    start_date: '2026-10-15',
    end_date: '2026-10-16',
    registration_fee_inr: 0,
    required_skills: [],
    target_audience: [],
    difficulty: 'Intermediate'
  });

  const [skillsInput, setSkillsInput] = useState('');
  const [a, setA] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const set = (k, v) => setF({ ...f, [k]: v });

  async function analyze() {
    setAnalyzing(true);
    setError('');
    const parsedSkills = skillsInput.split(',').map(x => x.trim()).filter(Boolean);
    const payload = { ...f, required_skills: parsedSkills.length ? parsedSkills : f.required_skills };
    try {
      const res = await api('/organizer/analyze', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      setA(res);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to analyze event');
    } finally {
      setAnalyzing(false);
    }
  }

  async function publish() {
    setPublishing(true);
    setMsg('');
    setError('');
    const parsedSkills = skillsInput.split(',').map(x => x.trim()).filter(Boolean);
    try {
      const publishData = {
        ...f,
        event_name: f.event_name || 'New Event',
        title: f.event_name || 'New Event',
        required_skills: a?.skill_tags || parsedSkills || f.required_skills,
        target_audience: a?.target_audience || f.target_audience || ['Students'],
        is_free: Number(f.registration_fee_inr) === 0,
        status: 'Upcoming'
      };

      await api('/organizer/events', {
        method: 'POST',
        body: JSON.stringify(publishData)
      });

      setMsg('Event published successfully! Redirecting to events...');
      setTimeout(() => {
        router.push('/organizer/events');
      }, 1000);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to publish event');
    } finally {
      setPublishing(false);
    }
  }

  return (
    <>
      <Sidebar organizer />
      <div className="lg:ml-64">
        <Nav />
        <main className="p-5 md:p-8 max-w-6xl">
          <Link href="/organizer" className="text-brand font-bold">
            ← Back to Organizer Center
          </Link>
          <h1 className="text-3xl font-black mt-5">Create & Analyze New Event</h1>
          <p className="muted text-sm mt-1">Fill in the details below to analyze student audience fit and publish to EventIQ catalog.</p>

          <div className="grid lg:grid-cols-2 gap-6 mt-6">
            {/* Form */}
            <div className="card p-6 space-y-4">
              <div>
                <label className="text-xs font-bold muted uppercase block mb-1">Event Title</label>
                <input
                  className="input"
                  placeholder="e.g. AI & Fullstack Innovation Hackathon 2026"
                  value={f.event_name}
                  onChange={e => set('event_name', e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-bold muted uppercase block mb-1">Description</label>
                <textarea
                  className="input min-h-32"
                  placeholder="Describe your event, problem statement, tracks, prizes..."
                  value={f.description}
                  onChange={e => set('description', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold muted uppercase block mb-1">Start Date</label>
                  <input
                    className="input"
                    type="date"
                    value={f.start_date}
                    onChange={e => set('start_date', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold muted uppercase block mb-1">End Date</label>
                  <input
                    className="input"
                    type="date"
                    value={f.end_date}
                    onChange={e => set('end_date', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold muted uppercase block mb-1">Type</label>
                  <select
                    className="input"
                    value={f.event_type}
                    onChange={e => set('event_type', e.target.value)}
                  >
                    <option>Hackathon</option>
                    <option>Workshop</option>
                    <option>Conference</option>
                    <option>Competition</option>
                    <option>Internship</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold muted uppercase block mb-1">Mode</label>
                  <select
                    className="input"
                    value={f.mode}
                    onChange={e => set('mode', e.target.value)}
                  >
                    <option>Online</option>
                    <option>Offline</option>
                    <option>Hybrid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold muted uppercase block mb-1">Location</label>
                <input
                  className="input"
                  placeholder="Online / Coimbatore / Campus"
                  value={f.location}
                  onChange={e => set('location', e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-bold muted uppercase block mb-1">Registration Fee (₹)</label>
                <input
                  className="input"
                  type="number"
                  placeholder="0 for Free"
                  value={f.registration_fee_inr}
                  onChange={e => set('registration_fee_inr', e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-bold muted uppercase block mb-1">Required Skills (Comma-separated)</label>
                <input
                  className="input"
                  placeholder="Python, Machine Learning, React, Problem Solving"
                  value={skillsInput}
                  onChange={e => setSkillsInput(e.target.value)}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  className="btn btn-secondary flex-1"
                  onClick={analyze}
                  disabled={analyzing}
                >
                  {analyzing ? 'Analyzing...' : 'Analyze with AI'}
                </button>
                <button
                  className="btn btn-primary flex-1"
                  onClick={publish}
                  disabled={publishing}
                >
                  {publishing ? 'Publishing...' : 'Publish Event'}
                </button>
              </div>

              {error && <p className="text-red-600 text-sm font-bold mt-2">{error}</p>}
              {msg && <p className="text-green-700 font-bold text-sm mt-2">{msg}</p>}
            </div>

            {/* AI Insights Card */}
            <div className="card p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-black">AI Generated Insights</h2>
                {a ? (
                  <div className="mt-5 space-y-4">
                    <div>
                      <b className="text-xs muted uppercase block">Smart Category</b>
                      <p className="font-bold text-slate-800">{a.smart_category}</p>
                    </div>
                    <div>
                      <b className="text-xs muted uppercase block">Skill Tags</b>
                      <p className="font-semibold text-purple-700">{(a.skill_tags || []).join(', ')}</p>
                    </div>
                    <div>
                      <b className="text-xs muted uppercase block">Target Audience Fit</b>
                      <p className="font-semibold text-slate-800">{(a.target_audience || []).join(', ')}</p>
                    </div>
                    <div>
                      <b className="text-xs muted uppercase block">Difficulty Level</b>
                      <p className="font-semibold text-slate-800">{a.difficulty}</p>
                    </div>
                    <div>
                      <b className="text-xs muted uppercase block">Career Relevance</b>
                      <p className="font-semibold text-slate-800">{(a.career_relevance || []).join(', ')}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                      <b className="text-green-800">Quality & Fit Confidence: {Math.round((a.confidence || 0.9) * 100)}%</b>
                      <p className="text-sm text-green-700 mt-1">{a.insight}</p>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center muted space-y-2">
                    <p className="font-bold text-slate-700">Ready to analyze event performance?</p>
                    <p className="text-xs">Fill in your event details and click "Analyze with AI" to generate smart skill tags and demographic fit scores.</p>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-slate-100">
                <button
                  className="btn btn-primary w-full"
                  onClick={publish}
                  disabled={publishing}
                >
                  {publishing ? 'Publishing Event...' : 'Publish Event Now'}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default function CreateEventRoot() {
  return (
    <Require role="organizer">
      <Page />
    </Require>
  );
}
