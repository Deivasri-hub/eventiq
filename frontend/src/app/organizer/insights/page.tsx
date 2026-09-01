'use client';

import React from 'react';
import { BarChart3, Target, Users, Award } from 'lucide-react';

export default function AudienceInsightsPage() {
  const departments = [
    { name: 'AI & Data Science (AI & DS)', count: 342, percentage: 82 },
    { name: 'Computer Science & Engineering (CSE)', count: 418, percentage: 76 },
    { name: 'Information Technology (IT)', count: 215, percentage: 69 },
    { name: 'Electronics & Communication (ECE)', count: 180, percentage: 54 },
    { name: 'Biotechnology & Life Sciences', count: 95, percentage: 48 },
  ];

  const topSkillsNeeded = [
    { skill: 'Python', percentage: 94 },
    { skill: 'Machine Learning / AI', percentage: 88 },
    { skill: 'Problem Solving', percentage: 85 },
    { skill: 'Web Development (React)', percentage: 72 },
    { skill: 'Cybersecurity', percentage: 58 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-purple-600" /> Student Audience Insights
        </h1>
        <p className="text-sm text-slate-500 mt-1">Deep analytics on student demographics, skill profiles, and branch engagement</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Department Fit */}
        <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" /> Branch Demographic Breakdown
          </h2>

          <div className="space-y-4">
            {departments.map((dept, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-800">{dept.name}</span>
                  <span className="text-purple-700">{dept.count} students ({dept.percentage}% fit)</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full"
                    style={{ width: `${dept.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Skill Demand */}
        <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-600" /> Most Requested Student Skills
          </h2>

          <div className="space-y-4">
            {topSkillsNeeded.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-800">{item.skill}</span>
                  <span className="text-emerald-600">{item.percentage}% Demand</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
