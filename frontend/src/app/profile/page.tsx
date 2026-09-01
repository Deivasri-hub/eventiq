'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, X, Save, CheckCircle2, User, MapPin, Briefcase, GraduationCap, Code, Heart, History } from 'lucide-react';
import { fetchApi, StudentProfile } from '../../lib/api';

const COMMON_SKILLS = [
  'Python', 'Java', 'JavaScript', 'C++', 'Machine Learning', 'Data Science',
  'Deep Learning', 'React', 'Node.js', 'Cybersecurity', 'Cloud Computing',
  'Problem Solving', 'Teamwork', 'Biotechnology', 'IoT', 'Agile'
];

const COMMON_INTERESTS = [
  'AI', 'Web Development', 'Data Science', 'Cybersecurity', 'Cloud',
  'Robotics', 'Green Tech', 'Esports', 'Entrepreneurship', 'Research'
];

const CAREER_GOALS = [
  'AI Engineer', 'ML Engineer', 'Data Scientist', 'Software Developer',
  'Full Stack Developer', 'Cybersecurity Engineer', 'Cloud Architect',
  'Product Manager', 'Startup Founder'
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<StudentProfile>({
    user_id: 1,
    department: 'Computer Science & Engineering',
    year: 3,
    location: 'Coimbatore',
    career_goal: 'AI Engineer',
    experience_level: 'Intermediate',
    skills: ['Python', 'Machine Learning', 'JavaScript', 'Problem Solving', 'Data Science'],
    interests: ['AI', 'Web Development', 'Data Science', 'Cloud'],
    previous_participations: ['HACKNIMA 2026', 'GENESIS\'26 / Martian Chronicles']
  });

  const [newSkillInput, setNewSkillInput] = useState('');
  const [newInterestInput, setNewInterestInput] = useState('');
  const [newParticipationInput, setNewParticipationInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchApi<StudentProfile>('/students/profile')
      .then(res => {
        if (res) setProfile(res);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleAddSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (trimmed && !profile.skills.includes(trimmed)) {
      setProfile(prev => ({ ...prev, skills: [...prev.skills, trimmed] }));
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skillToRemove) }));
  };

  const handleAddInterest = (interestToAdd: string) => {
    const trimmed = interestToAdd.trim();
    if (trimmed && !profile.interests.includes(trimmed)) {
      setProfile(prev => ({ ...prev, interests: [...prev.interests, trimmed] }));
      setNewInterestInput('');
    }
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    setProfile(prev => ({ ...prev, interests: prev.interests.filter(i => i !== interestToRemove) }));
  };

  const handleAddParticipation = (partToAdd: string) => {
    const trimmed = partToAdd.trim();
    const currentList = profile.previous_participations || [];
    if (trimmed && !currentList.includes(trimmed)) {
      setProfile(prev => ({ ...prev, previous_participations: [...currentList, trimmed] }));
      setNewParticipationInput('');
    }
  };

  const handleRemoveParticipation = (partToRemove: string) => {
    setProfile(prev => ({
      ...prev,
      previous_participations: (prev.previous_participations || []).filter(p => p !== partToRemove)
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      await fetchApi('/students/profile', {
        method: 'PUT',
        body: JSON.stringify(profile),
      });
      setSuccessMsg('Profile updated! Your ACE AI recommendations will now adjust.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-500 font-medium">
        Loading profile data...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-purple-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-extrabold flex items-center justify-center text-xl shadow-lg shadow-purple-200">
            AR
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Student Profile & Preferences</h1>
            <p className="text-sm text-slate-500">
              Customize your skills, career goals, and past participation for ACE AI
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm font-semibold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Academic Details */}
        <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-purple-600" />
            Academic & Location Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Department / Branch
              </label>
              <select
                value={profile.department}
                onChange={e => setProfile({ ...profile, department: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
              >
                <option value="Computer Science & Engineering">Computer Science & Engineering (CSE)</option>
                <option value="AI & Data Science (AI & DS)">AI & Data Science (AI & DS)</option>
                <option value="Information Technology (IT)">Information Technology (IT)</option>
                <option value="Electronics & Communication (ECE)">Electronics & Communication (ECE)</option>
                <option value="Electrical & Electronics (EEE)">Electrical & Electronics (EEE)</option>
                <option value="Biotechnology">Biotechnology</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Year of Study</label>
              <select
                value={profile.year}
                onChange={e => setProfile({ ...profile, year: parseInt(e.target.value, 10) })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
              >
                <option value={1}>1st Year</option>
                <option value={2}>2nd Year</option>
                <option value={3}>3rd Year</option>
                <option value={4}>4th Year</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Location Preference</label>
              <div className="relative">
                <MapPin className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={profile.location}
                  onChange={e => setProfile({ ...profile, location: e.target.value })}
                  placeholder="Coimbatore, Chennai, etc."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Experience Level</label>
              <select
                value={profile.experience_level}
                onChange={e => setProfile({ ...profile, experience_level: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Career Goal */}
        <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-purple-600" />
            Target Career Goal
          </h2>
          <div>
            <select
              value={profile.career_goal}
              onChange={e => setProfile({ ...profile, career_goal: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-base font-semibold text-purple-900"
            >
              {CAREER_GOALS.map(goal => (
                <option key={goal} value={goal}>
                  {goal}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Skills Tag Input */}
        <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Code className="w-5 h-5 text-purple-600" />
              Skills & Expertise
            </h2>
            <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
              {profile.skills.length} skills selected
            </span>
          </div>

          <div className="flex flex-wrap gap-2 min-h-12 p-3 rounded-2xl bg-slate-50 border border-slate-200">
            {profile.skills.map((skill, idx) => (
              <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-600 text-white text-xs font-semibold shadow-xs">
                {skill}
                <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-purple-200">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newSkillInput}
              onChange={e => setNewSkillInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill(newSkillInput);
                }
              }}
              placeholder="Type a skill (e.g. Python, React, Cybersecurity)..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
            />
            <button
              type="button"
              onClick={() => handleAddSkill(newSkillInput)}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
        </div>

        {/* Interests Tag Input */}
        <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Heart className="w-5 h-5 text-purple-600" />
              Interests & Domain Topics
            </h2>
            <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
              {profile.interests.length} interests selected
            </span>
          </div>

          <div className="flex flex-wrap gap-2 min-h-12 p-3 rounded-2xl bg-slate-50 border border-slate-200">
            {profile.interests.map((interest, idx) => (
              <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-xs">
                {interest}
                <button type="button" onClick={() => handleRemoveInterest(interest)} className="hover:text-indigo-200">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newInterestInput}
              onChange={e => setNewInterestInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddInterest(newInterestInput);
                }
              }}
              placeholder="Type an interest (e.g. AI, Web3, Green Tech)..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
            />
            <button
              type="button"
              onClick={() => handleAddInterest(newInterestInput)}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
        </div>

        {/* Previous Event Participation */}
        <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <History className="w-5 h-5 text-purple-600" />
              Previous Event Participation History
            </h2>
          </div>

          <div className="flex flex-wrap gap-2 min-h-12 p-3 rounded-2xl bg-slate-50 border border-slate-200">
            {(profile.previous_participations || []).map((part, idx) => (
              <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 text-white text-xs font-semibold shadow-xs">
                {part}
                <button type="button" onClick={() => handleRemoveParticipation(part)} className="hover:text-slate-300">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newParticipationInput}
              onChange={e => setNewParticipationInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddParticipation(newParticipationInput);
                }
              }}
              placeholder="Add past event name (e.g. HACKNIMA 2026, Smart India Hackathon)..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
            />
            <button
              type="button"
              onClick={() => handleAddParticipation(newParticipationInput)}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
