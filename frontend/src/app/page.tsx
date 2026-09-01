'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Brain, Target, Award, Users, Zap, BarChart2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="space-y-20 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-purple-400/20 via-indigo-300/20 to-fuchsia-300/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100/80 border border-purple-200 text-purple-700 text-xs font-bold tracking-wide uppercase shadow-xs">
            <Zap className="w-4 h-4 text-purple-600 fill-purple-600 animate-pulse" />
            <span>ALLCOLLEGEEVENT AI INTELLIGENCE PLATFORM</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
            ACE Intelligence <br />
            <span className="gradient-text">The AI Recommendation Engine</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            AllCollegeEvent uses AI to understand your skills, interests and career goals, recommending the exact right opportunities to the right students.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-base shadow-lg shadow-purple-300 hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/events"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-purple-200 shadow-sm transition-all flex items-center justify-center gap-2"
            >
              Explore All 30 Events
            </Link>
          </div>

          {/* VISUAL FLOW DIAGRAM */}
          <div className="pt-12 max-w-5xl mx-auto">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-purple-100 shadow-xl space-y-6">
              <h3 className="text-xs font-extrabold tracking-wider uppercase text-purple-600">
                ACE Intelligence End-to-End Recommendation Engine
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                {/* Step 1 */}
                <div className="bg-purple-50/60 rounded-2xl p-5 border border-purple-100 text-left space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Student Profile</h4>
                    <p className="text-xs text-slate-600 mt-1">Skills, Branch, Career Goal & Past Events</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="bg-indigo-50/60 rounded-2xl p-5 border border-indigo-100 text-left space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">AI Engine</h4>
                    <p className="text-xs text-slate-600 mt-1">Multi-factor Scoring & Peer Similarity</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="bg-fuchsia-50/60 rounded-2xl p-5 border border-fuchsia-100 text-left space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-fuchsia-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Event Intelligence</h4>
                    <p className="text-xs text-slate-600 mt-1">Auto Classification & Skill Tags</p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="bg-emerald-50/60 rounded-2xl p-5 border border-emerald-100 text-left space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
                    4
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Personalized Match</h4>
                    <p className="text-xs text-slate-600 mt-1">Explainable Match % & Skill Gap</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Making AllCollegeEvent Smarter with AI
          </h2>
          <p className="text-slate-600 text-base">
            No more endless scrolling. Precision opportunity matching with transparent reasons and skill roadmaps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-sm hover:shadow-lg transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">AI-Powered Matching</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Analyzes skills (55%), interests (20%), career goals (15%), and location (10%) to compute accurate match scores.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-sm hover:shadow-lg transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Similar Student Proof</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Recommends events trending among peer students with similar interest profiles, filtered strictly by student eligibility.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-sm hover:shadow-lg transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-fuchsia-100 text-fuchsia-600 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Skill Gap Analysis</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Identifies missing required skills for target hackathons or workshops and delivers structured learning roadmaps.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-sm hover:shadow-lg transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <BarChart2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Organizer Intelligence</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Organizers run automated quality audits, extract skill tags, and target the exact right student engineering branches.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
