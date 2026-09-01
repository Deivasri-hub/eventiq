'use client';

import React from 'react';
import { BarChart3, TrendingUp, Eye, CheckSquare, Sparkles } from 'lucide-react';

export default function EventAnalyticsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
          <TrendingUp className="w-7 h-7 text-purple-600" /> Event Performance Analytics
        </h1>
        <p className="text-sm text-slate-500 mt-1">Track event registrations, conversion rates, and AI recommendation distribution</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">Avg Registration Conversion</span>
          <div className="text-3xl font-black text-purple-700">18.4%</div>
          <span className="text-xs text-emerald-600 font-bold">+4.2% above national benchmark</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">AI Recommendation Click-Through</span>
          <div className="text-3xl font-black text-indigo-600">42.8%</div>
          <span className="text-xs text-indigo-600 font-bold">Students click "Why Recommended"</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">Skill Gap Engagement</span>
          <div className="text-3xl font-black text-emerald-600">68%</div>
          <span className="text-xs text-emerald-600 font-bold">Students complete recommended prep</span>
        </div>
      </div>
    </div>
  );
}
