'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowLeft, Brain, Award, Target, CheckCircle2, AlertCircle, Send, BarChart2, ShieldCheck } from 'lucide-react';
import { EventAnalysisResult, fetchApi } from '../../../lib/api';

export default function AIEventAnalysisPage() {
  const router = useRouter();
  const [draft, setDraft] = useState<any>(null);
  const [analysis, setAnalysis] = useState<EventAnalysisResult | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('eventiq_ai_draft');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setDraft(parsed.input);
        setAnalysis(parsed.ai);
      } catch (err) {
        console.error(err);
      }
    } else {
      // Default demo event for visualization
      const sampleInput = {
        title: 'Generative AI & Multi-Agent Hackathon 2026',
        description: 'Build autonomous agent workflows using LLMs, Python, LangChain, and CrewAI over 24 hours.',
        category: 'Academic & Professional',
        eventType: 'Hackathon',
        mode: 'Offline',
        location: 'Coimbatore',
        requiredSkills: ['Python', 'Machine Learning', 'LLM', 'Generative AI'],
        eligibility: 'Open to CSE, IT, and AI & DS engineering students',
        registrationFee: 0,
      };

      setDraft(sampleInput);
      fetchApi<EventAnalysisResult>('/ai/analyze-event', {
        method: 'POST',
        body: JSON.stringify(sampleInput),
      }).then(res => setAnalysis(res)).catch(err => console.error(err));
    }
  }, []);

  if (!draft || !analysis) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center text-slate-500 font-medium">
        Running AI Event Intelligence Engine...
      </div>
    );
  }

  const handlePublishNow = async () => {
    try {
      await fetchApi('/organizer/events', {
        method: 'POST',
        body: JSON.stringify({
          title: draft.title,
          description: draft.description,
          category: draft.category || 'Academic & Professional',
          event_type: draft.eventType || 'Hackathon',
          mode: draft.mode || 'Offline',
          location: draft.location || 'Coimbatore',
          start_date: draft.startDate || '2026-10-15',
          end_date: draft.endDate || '2026-10-16',
          eligibility: draft.eligibility,
          required_skills: draft.requiredSkills,
          target_audience: ['CSE', 'AI & DS', 'IT'],
          registration_fee: draft.registrationFee || 0,
          is_free: (draft.registrationFee || 0) === 0,
          status: 'Upcoming',
        }),
      });

      router.push('/organizer/events');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <Link
        href="/organizer/create"
        className="inline-flex items-center gap-2 text-sm font-bold text-purple-600 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" /> Edit Event Form
      </Link>

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-purple-200 text-xs font-bold uppercase">
            <Brain className="w-4 h-4 text-purple-300" /> AI Event Intelligence Audit
          </div>
          <h1 className="text-3xl font-extrabold">{draft.title}</h1>
          <p className="text-sm text-purple-200">
            Real-time quality scoring, skill tag extraction, and student demographic fit analysis
          </p>
        </div>

        <button
          onClick={handlePublishNow}
          className="px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm shadow-lg transition-all shrink-0 flex items-center gap-2"
        >
          <Send className="w-4 h-4" /> Publish Event
        </button>
      </div>

      {/* TWO COLUMN STUDIO VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Input Event Summary (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-purple-100 shadow-sm space-y-6">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Input Event Details
          </h2>

          <div className="space-y-4 text-sm">
            <div>
              <span className="text-xs font-bold text-slate-400 block">Title:</span>
              <div className="font-bold text-slate-900">{draft.title}</div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 block">Description:</span>
              <p className="text-xs text-slate-600 line-clamp-4 mt-0.5">{draft.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="font-bold text-slate-400 block">Format:</span>
                <span className="font-semibold text-slate-800">{draft.eventType}</span>
              </div>
              <div>
                <span className="font-bold text-slate-400 block">Mode:</span>
                <span className="font-semibold text-slate-800">{draft.mode} ({draft.location})</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 block mb-1">Declared Skills:</span>
              <div className="flex flex-wrap gap-1">
                {(draft.requiredSkills || []).map((s: string, i: number) => (
                  <span key={i} className="px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 text-xs font-semibold">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AI-GENERATED INTELLIGENCE (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Top Score Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm space-y-1 text-center">
              <span className="text-xs font-bold text-slate-400 uppercase">Completeness Score</span>
              <div className="text-3xl font-black text-purple-700">{analysis.completenessScore}%</div>
              <span className="text-[10px] font-semibold text-slate-500">Information richness</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm space-y-1 text-center">
              <span className="text-xs font-bold text-slate-400 uppercase">Event Quality Score</span>
              <div className="text-3xl font-black text-emerald-600">{analysis.qualityScore}%</div>
              <span className="text-[10px] font-semibold text-emerald-600 font-bold">High Student Appeal</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm space-y-1 text-center">
              <span className="text-xs font-bold text-slate-400 uppercase">Difficulty Classification</span>
              <div className="text-xl font-extrabold text-indigo-700 mt-1">{analysis.difficulty}</div>
              <span className="text-[10px] font-semibold text-slate-500">AI-determined level</span>
            </div>
          </div>

          {/* AI Smart Category & Auto-Extracted Skill Tags */}
          <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                AI Smart Categorization & Skill Tags
              </h3>
              <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
                {analysis.smartCategory}
              </span>
            </div>

            <div>
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider block mb-2">
                Auto-Extracted Skill Tags for Recommendation Engine:
              </span>
              <div className="flex flex-wrap gap-2">
                {analysis.skillTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-xs"
                  >
                    ✓ {tag}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider block mb-2">
                Career Relevance Roles:
              </span>
              <div className="flex flex-wrap gap-2">
                {analysis.careerRelevance.map((role, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-200"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Target Audience Fit Breakdown */}
          <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              Target Audience Fit
            </h3>

            <div className="space-y-4">
              {analysis.targetAudience.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-800">{item.department}</span>
                    <span className="text-purple-700">{item.matchPercent}% Match</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-emerald-500 rounded-full"
                      style={{ width: `${item.matchPercent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendations for Organizer */}
          <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              AI Recommendations to Boost Student Conversions
            </h3>

            <div className="space-y-2">
              {analysis.recommendationsForOrganizer.map((rec, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-purple-50 text-xs font-semibold text-purple-900 border border-purple-100 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
