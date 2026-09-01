'use client';

import React from 'react';
import { Settings, Building2, Shield, Bell } from 'lucide-react';
import { useAuth } from '../../../lib/AuthContext';

export default function OrganizerSettingsPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
          <Settings className="w-7 h-7 text-purple-600" /> Organizer Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">Manage organization details and verification badges</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-purple-600" /> Organization Profile
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Organization Name</label>
            <input
              type="text"
              defaultValue="ECLearnix Innovation Hub"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Organizer Email</label>
            <input
              type="email"
              readOnly
              value={user?.email || 'organizer@eventiq.demo'}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-600"
            />
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Verified EventIQ Institution Badge Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
