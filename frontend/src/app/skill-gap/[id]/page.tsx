'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Target, ArrowLeft, CheckCircle2, AlertTriangle, BookOpen, ExternalLink, Award, Sparkles } from 'lucide-react';
import { fetchApi, SkillGapItem } from '../../../lib/api';

interface SkillGapData {
  eventTitle: string;
  requiredSkills: string[];
  studentSkills: string[];
  skillDetails: {
    matchedSkills: string[];
    missingSkills: string[];
    skillMatchRatio: string;
    gapItems: SkillGapItem[];
  };
  matchScore: number;
}

export default function SkillGapPage() {
  const params = useParams();
  const id = params.id as string;

  const [data, setData] = useState<SkillGapData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchApi<SkillGapData>(`/events/${id}/skill-gap`)
      .then(res => setData(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-500 font-medium">
        Analyzing skill gap requirements...
      </div>
    );
  }

  const { eventTitle, skillDetails } = data;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back link */}
      <Link
        href={`/events/${id}`}
        className="inline-flex items-center gap-2 text-sm font-bold text-purple-600 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Event Details
      </Link>

      {/* Header Card */}
      <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-lg space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase">
          <Target className="w-4 h-4 text-indigo-600" /> Skill Gap Intelligence
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">{eventTitle}</h1>
        <p className="text-sm text-slate-600">
          You match <strong className="text-purple-700 font-extrabold">{skillDetails.skillMatchRatio}</strong> required skills for this event.
        </p>

        {/* Visual Progress Bar */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-xs font-bold text-slate-500">
            <span>Skill Readiness</span>
            <span>{skillDetails.matchedSkills.length} of {(data.requiredSkills || []).length || 1} skills ready</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-emerald-500 rounded-full transition-all duration-500"
              style={{
                width: `${Math.max(20, Math.round((skillDetails.matchedSkills.length / ((data.requiredSkills || []).length || 1)) * 100))}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* MATCHED SKILLS SECTION */}
      <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          Skills You Already Possess ({skillDetails.matchedSkills.length})
        </h2>
        {skillDetails.matchedSkills.length === 0 ? (
          <p className="text-xs text-slate-400">No overlapping skills found yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skillDetails.matchedSkills.map((s, i) => (
              <span key={i} className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {s}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* MISSING SKILLS & LEARNING RECOMMENDATIONS */}
      <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          Missing Skills & Recommended Learning Path ({skillDetails.gapItems.length})
        </h2>

        {skillDetails.gapItems.length === 0 ? (
          <div className="p-6 rounded-2xl bg-emerald-50 text-emerald-900 font-bold text-sm text-center">
            🎉 Amazing! You possess 100% of all required skills for this event. You are fully prepared!
          </div>
        ) : (
          <div className="space-y-4">
            {skillDetails.gapItems.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-purple-300 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    {item.skill}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
                    {item.difficulty} Level
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Why it matters:</span>
                  <p className="text-xs text-slate-600 font-medium">{item.whyItMatters}</p>
                </div>

                <div className="p-4 rounded-xl bg-purple-50/80 border border-purple-100 space-y-1">
                  <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-purple-600" />
                    EventIQ Learning Recommendation:
                  </span>
                  <p className="text-xs text-purple-800 font-medium">{item.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
