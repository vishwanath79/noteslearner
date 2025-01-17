'use client';

import { useEffect, useState } from 'react';
import { progressManager } from '@/lib/progressManager';
import { Nugget } from '@/types';

interface StatsPanelProps {
  nuggets: Nugget[];
}

export default function StatsPanel({ nuggets }: StatsPanelProps) {
  const [stats, setStats] = useState({
    streak: 0,
    completedNuggets: 0,
    completionRate: 0,
  });

  useEffect(() => {
    if (!nuggets?.length) return;

    const progress = progressManager.getProgress();
    const completedNuggets = nuggets.filter(n => progress[n.id]?.completed).length;
    const completionRate = Math.round((completedNuggets / nuggets.length) * 100) || 0;
    const streak = progressManager.getCurrentStreak() || 0;

    setStats({
      streak,
      completedNuggets,
      completionRate,
    });
  }, [nuggets]);

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <div className="bg-[#282828] p-6 rounded-lg hover:bg-[#3E3E3E] transition-colors">
        <h3 className="text-sm text-gray-400 mb-2">Current Streak</h3>
        <div className="flex items-baseline">
          <p className="text-2xl font-bold text-[#1DB954]">{stats.streak || 0}</p>
          <span className="ml-2 text-sm text-gray-400">days</span>
        </div>
      </div>

      <div className="bg-[#282828] p-6 rounded-lg hover:bg-[#3E3E3E] transition-colors">
        <h3 className="text-sm text-gray-400 mb-2">Nuggets Learned</h3>
        <div className="flex items-baseline">
          <p className="text-2xl font-bold text-[#1DB954]">{stats.completedNuggets || 0}</p>
          <span className="ml-2 text-sm text-gray-400">/ {nuggets?.length || 0}</span>
        </div>
      </div>

      <div className="bg-[#282828] p-6 rounded-lg hover:bg-[#3E3E3E] transition-colors">
        <h3 className="text-sm text-gray-400 mb-2">Completion</h3>
        <div className="flex items-baseline">
          <p className="text-2xl font-bold text-[#1DB954]">{stats.completionRate || 0}</p>
          <span className="ml-2 text-sm text-gray-400">%</span>
        </div>
      </div>
    </div>
  );
}