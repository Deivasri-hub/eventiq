'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface MatchBadgeProps {
  score?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const MatchBadge: React.FC<MatchBadgeProps> = ({ score = 85, size = 'md' }) => {
  let colorStyle = 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-200';
  if (score < 70 && score >= 50) {
    colorStyle = 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-blue-200';
  } else if (score < 50) {
    colorStyle = 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-200';
  }

  const padding = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : size === 'lg' ? 'px-4 py-2 text-lg font-bold' : 'px-3 py-1 text-sm font-semibold';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full shadow-sm ${padding} ${colorStyle}`}>
      <Sparkles className={size === 'lg' ? 'w-5 h-5' : 'w-3.5 h-3.5'} />
      <span>{score}% Match</span>
    </span>
  );
};
