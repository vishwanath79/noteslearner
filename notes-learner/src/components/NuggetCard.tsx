'use client';

import { useState, useEffect } from 'react';
import { Nugget } from '@/types';
import { progressManager } from '@/lib/progressManager';

interface NuggetCardProps {
  nugget: Nugget;
  topicColor: string;
  showDescription?: boolean;
}

export default function NuggetCard({ nugget, topicColor, showDescription = true }: NuggetCardProps) {
  const [isCompleted, setIsCompleted] = useState(false);

  // Check completion status on mount and when nugget changes
  useEffect(() => {
    if (!nugget?.id) return;
    const progress = progressManager.getProgress();
    setIsCompleted(progress[nugget.id]?.completed || false);
  }, [nugget?.id]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!nugget?.id) return;
    
    progressManager.toggleCompletion(nugget.id);
    setIsCompleted(!isCompleted);
  };

  if (!nugget) {
    return (
      <div className="p-6 rounded-lg bg-[#282828] shadow-lg">
        <p className="text-gray-400">No nugget available</p>
      </div>
    );
  }

  return (
    <div 
      className="p-6 rounded-lg bg-[#282828] shadow-lg hover:bg-[#3E3E3E] 
                 transition-colors duration-300 relative"
      style={{ borderLeft: `4px solid ${topicColor}` }}
    >
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold text-white">
          {nugget.topic}
        </h2>
        <button
          onClick={handleToggle}
          className={`p-2 rounded-full ${
            isCompleted 
              ? 'bg-[#1DB954] hover:bg-gray-600' 
              : 'bg-gray-600 hover:bg-[#1DB954]'
          } transition-colors text-white text-sm absolute top-4 right-4 cursor-pointer`}
          aria-label={isCompleted ? "Mark as not learned" : "Mark as learned"}
          type="button"
          style={{ pointerEvents: 'auto' }}
        >
          ✓
        </button>
      </div>
      {showDescription && (
        <p className="text-gray-300 pr-12">
          {nugget.description}
        </p>
      )}
    </div>
  );
}