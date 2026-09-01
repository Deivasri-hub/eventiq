'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusCircle, Sparkles, Users, Eye, CheckSquare, BarChart3, ArrowRight, Layers } from 'lucide-react';
import { fetchApi, EventItem } from '../../../lib/api';

interface OrganizerDashboardData {
  totalEvents: number;
  activeEvents: number;
  registrations: number;
  views: number;
  recentEvents: EventItem[];
  audienceInsights: { department: string; fitScore: number }[];
}

export default function OrganizerDashboardPage() {
  const [data, setData] = useState<OrganizerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi<OrganizerDashboardData>('/organizer/dashboard')
      .then(res => setData(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-500 font-medium">
        Loading organizer dashboard metrics...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-3xl p-8 border border-purple-100 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase mb-2">
            <Sparkles className="w-4 h-4 text-purple-600" /> Organizer Intelligence Center
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">EventIQ Organizer Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Manage events, analyze audience reach, and launch new opportunities</p>
        </div>

        <Link
          href="/organizer/create"
          className="px-6 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          Create & Analyze Event
        </Link>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Created Events</span>
            <Layers className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{data.totalEvents}</div>
          <span className="text-xs text-emerald-600 font-bold">Live in EventIQ Database</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Active Opportunities</span>
            <CheckSquare className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{data.activeEvents}</div>
          <span className="text-xs text-emerald-600 font-bold">Upcoming / Ongoing</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Student Registrations</span>
            <Users className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{data.registrations}</div>
          <span className="text-xs text-indigo-600 font-bold">+18% this month</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total AI Impressions</span>
            <Eye className="w-5 h-5 text-fuchsia-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{data.views}</div>
          <span className="text-xs text-fuchsia-600 font-bold">High student engagement</span>
        </div>
      </div>

      {/* TWO COLUMN GRID: RECENT EVENTS + AUDIENCE INSIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Events Table (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-purple-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Recent Organizer Events</h2>
            <Link href="/organizer/events" className="text-xs font-bold text-purple-600 hover:underline">
              View All Events
            </Link>
          </div>

          <div className="divide-y divide-slate-100 overflow-x-auto">
            {data.recentEvents.map(evt => (
              <div key={evt.id} className="py-4 flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{evt.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded-md">
                      {evt.event_type}
                    </span>
                    <span>{evt.start_date}</span>
                    <span className="capitalize text-emerald-600 font-bold">{evt.mode}</span>
                  </div>
                </div>

                <Link
                  href={`/events/${evt.id}`}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-700 text-xs font-bold shrink-0"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Audience Insights Card (1 Col) */}
        <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              Target Audience Insights
            </h2>
          </div>

          <p className="text-xs text-slate-500">
            AI-calculated demographic affinity across student engineering branches:
          </p>

          <div className="space-y-4">
            {data.audienceInsights.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-800">{item.department}</span>
                  <span className="text-purple-700">{item.fitScore}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full"
                    style={{ width: `${item.fitScore}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link
              href="/organizer/insights"
              className="w-full py-3 rounded-xl bg-purple-50 text-purple-700 text-xs font-bold flex items-center justify-center gap-1 border border-purple-200"
            >
              Explore Full Demographic Analytics <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
