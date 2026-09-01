'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, ArrowLeft, CheckCircle2, AlertCircle, Target, Award, MapPin, Briefcase, ChevronRight, Users } from 'lucide-react';
import { fetchApi, RecommendationDetail } from '../../../lib/api';

export default function WhyRecommendedPage() {
  const params = useParams();
  const id = params.id as string;

  const [detail, setDetail] = useState<RecommendationDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchApi<RecommendationDetail>(`/events/${id}/recommendation`)
      .then(res => setDetail(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !detail) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-500 font-medium">
        Analyzing ACE AI recommendation weights...
      </div>
    );
  }

  const { event, recommendation } = detail;
  const sub = recommendation.subScores;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back link */}
      <Link
        href={`/events/${event.id}`}
        className="inline-flex items-center gap-2 text-sm font-bold text-purple-600 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Event Details
      </Link>

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-lg space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase mb-2">
              <Sparkles className="w-4 h-4 text-purple-600" /> Explainable ACE AI Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{event.title}</h1>
            <p className="text-sm text-slate-500 mt-1">Why this opportunity was matched to your student profile</p>
          </div>

          {/* LARGE SCORE BADGE */}
          <div className="w-36 h-36 rounded-3xl bg-gradient-to-tr from-purple-600 via-purple-700 to-indigo-800 text-white flex flex-col items-center justify-center p-4 shadow-xl shadow-purple-200 text-center shrink-0">
            <span className="text-4xl font-extrabold tracking-tight">{recommendation.matchScore}%</span>
            <span className="text-[10px] font-extrabold tracking-widest uppercase text-purple-200 mt-0.5">
              OVERALL MATCH
            </span>
          </div>
        </div>

        {/* SUB-SCORES BREAKDOWN GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-100 space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase block">Skill Match (55%)</span>
            <span className="text-xl font-black text-purple-700">{sub.skillMatchPercent}%</span>
          </div>

          <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-100 space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase block">Interest (20%)</span>
            <span className="text-xl font-black text-indigo-700">{sub.interestMatchPercent}%</span>
          </div>

          <div className="bg-fuchsia-50/70 p-4 rounded-2xl border border-fuchsia-100 space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase block">Career Goal (15%)</span>
            <span className="text-xl font-black text-fuchsia-700">{sub.careerMatchPercent}%</span>
          </div>

          <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100 space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase block">Location (10%)</span>
            <span className="text-xl font-black text-emerald-700">{sub.locationMatchPercent}%</span>
          </div>
        </div>
      </div>

      {/* SIMILAR STUDENT PROOF BADGE IF APPLICABLE */}
      {recommendation.isSimilarStudentRecommended && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-extrabold text-base">Popular Among Similar Students</h3>
            <p className="text-xs text-purple-100 mt-0.5">
              Students with interests similar to yours are actively participating in this event.
            </p>
          </div>
        </div>
      )}

      {/* WHY THIS EVENT? - EXPLAINABLE REASONS */}
      <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-sm space-y-6">
        <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-purple-600" />
          Why ACE AI Recommended This Event
        </h2>

        <div className="space-y-3">
          {recommendation.reasons.map((reason, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800 flex items-start gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{reason}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SKILL COMPARISON BREAKDOWN */}
      <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Award className="w-6 h-6 text-purple-600" />
            Skills Breakdown
          </h2>
          <span className="text-xs font-bold text-slate-500">
            {recommendation.skillDetails.skillMatchRatio} skills matched
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
            <h3 className="text-xs font-extrabold uppercase text-emerald-800 tracking-wider">
              ✓ Matched Skills ({recommendation.skillDetails.matchedSkills.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {recommendation.skillDetails.matchedSkills.map((s, i) => (
                <span key={i} className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-bold text-xs">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
            <h3 className="text-xs font-extrabold uppercase text-amber-800 tracking-wider">
              ⚠ Recommended Skills to Learn ({recommendation.skillDetails.missingSkills.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {recommendation.skillDetails.missingSkills.map((s, i) => (
                <span key={i} className="px-3 py-1 rounded-xl bg-amber-500 text-white font-bold text-xs">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Link
            href={`/skill-gap/${event.id}`}
            className="w-full py-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            Explore Deep Skill Gap Analysis & Learning Resources
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
