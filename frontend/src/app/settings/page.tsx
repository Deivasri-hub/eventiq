'use client';

import React, { useState } from 'react';
import { Settings, Bell, Lock, Shield, User } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';

export default function SettingsPage() {
  const { user } = useAuth();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [matchAlerts, setMatchAlerts] = useState(true);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
          <Settings className="w-7 h-7 text-purple-600" /> Account Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">Manage notification preferences and security settings</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <User className="w-5 h-5 text-purple-600" /> User Credentials
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-400 uppercase">Account Name</span>
            <div className="text-sm font-bold text-slate-900 mt-1">{user?.name || 'Alex Rivera'}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-400 uppercase">Email Address</span>
            <div className="text-sm font-bold text-slate-900 mt-1">{user?.email || 'student@eventiq.demo'}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Bell className="w-5 h-5 text-purple-600" /> AI Recommendation Notifications
        </h2>

        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
            <div>
              <div className="text-sm font-bold text-slate-900">High-Match Opportunity Alerts</div>
              <div className="text-xs text-slate-500">Notify me whenever a new event matches over 90% with my skills</div>
            </div>
            <input
              type="checkbox"
              checked={matchAlerts}
              onChange={e => setMatchAlerts(e.target.checked)}
              className="w-5 h-5 accent-purple-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
            <div>
              <div className="text-sm font-bold text-slate-900">Registration Deadline Reminders</div>
              <div className="text-xs text-slate-500">Receive reminders 48 hours before saved event deadlines expire</div>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={e => setEmailAlerts(e.target.checked)}
              className="w-5 h-5 accent-purple-600 rounded"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
