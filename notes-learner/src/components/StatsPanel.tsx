'use client';

import { useEffect, useState } from 'react';
import { progressManager } from '@/lib/progressManager';
import { Nugget } from '@/types';

interface StatsPanelProps {
  nuggets: Nugget[];
}

export default function StatsPanel({ nuggets }: StatsPanelProps) {
  // Initialize with empty stats to match server-side rendering
  const [stats, setStats] = useState({
    streak: 0,
    completedNuggets: 0,
    completionRate: 0,
  });

  const [isClient, setIsClient] = useState(false);

  // Use useEffect to indicate client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const updateStats = () => {
      if (!nuggets?.length) return;
      
      const progress = progressManager.getProgress();
      console.log('Current progress:', progress);
      
      const completedNuggets = nuggets.filter(nugget => {
        const isCompleted = progress[nugget.id]?.completed;
        console.log(`Nugget ${nugget.id} completed:`, isCompleted);
        return isCompleted;
      }).length;
      
      const completionRate = Math.round((completedNuggets / nuggets.length) * 100);
      const streak = progressManager.getCurrentStreak();

      console.log('Updating stats:', { completedNuggets, completionRate, streak });

      setStats({
        streak,
        completedNuggets,
        completionRate: isNaN(completionRate) ? 0 : completionRate,
      });
    };

    updateStats();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'notes-learner-progress' || e.key === 'notes-learner-streak') {
        console.log('Storage change detected:', e.key);
        updateStats();
      }
    };
    
    const handleNuggetComplete = () => {
      console.log('Nugget completed event received');
      updateStats();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('nuggetCompleted', handleNuggetComplete);
    window.addEventListener('dataChange', updateStats);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('nuggetCompleted', handleNuggetComplete);
      window.removeEventListener('dataChange', updateStats);
    };
  }, [nuggets, isClient]);

  // Only show stats after client-side hydration
  if (!isClient) {
    return (
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-[#282828] p-6 rounded-lg">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-20 mb-2"></div>
              <div className="h-8 bg-gray-700 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <div className="bg-[#282828] p-6 rounded-lg hover:bg-[#3E3E3E] transition-colors">
        <h3 className="text-sm text-gray-400 mb-2">Current Streak</h3>
        <div className="flex items-baseline">
          <p className="text-2xl font-bold text-[#1DB954]">{stats.streak}</p>
          <span className="ml-2 text-sm text-gray-400">days</span>
        </div>
      </div>

      <div className="bg-[#282828] p-6 rounded-lg hover:bg-[#3E3E3E] transition-colors">
        <h3 className="text-sm text-gray-400 mb-2">Nuggets Learned</h3>
        <div className="flex items-baseline">
          <p className="text-2xl font-bold text-[#1DB954]">{stats.completedNuggets}</p>
          <span className="ml-2 text-sm text-gray-400">/ {nuggets?.length || 0}</span>
        </div>
      </div>

      <div className="bg-[#282828] p-6 rounded-lg hover:bg-[#3E3E3E] transition-colors">
        <h3 className="text-sm text-gray-400 mb-2">Completion</h3>
        <div className="flex items-baseline">
          <p className="text-2xl font-bold text-[#1DB954]">{stats.completionRate}</p>
          <span className="ml-2 text-sm text-gray-400">%</span>
        </div>
      </div>
    </div>
  );
}