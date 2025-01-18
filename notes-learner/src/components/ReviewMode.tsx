'use client';

import { useState, useEffect } from 'react';
import { Nugget, Topic } from '@/types';
import { progressManager } from '@/lib/progressManager';
import NuggetCard from './NuggetCard';

interface ReviewModeProps {
  nuggets: Nugget[];
  topics: Topic[];
}

export default function ReviewMode({ nuggets, topics }: ReviewModeProps) {
  const [reviewNuggets, setReviewNuggets] = useState<Nugget[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const progress = progressManager.getProgress();
    const seenNuggets = nuggets.filter(nugget => progress[nugget.id]);
    
    // Shuffle the seen nuggets
    const shuffled = [...seenNuggets].sort(() => Math.random() - 0.5);
    setReviewNuggets(shuffled);
  }, [nuggets]);

  const getCurrentTopicColor = () => {
    const currentNugget = reviewNuggets[currentIndex];
    const currentTopic = topics.find(t => t.id === currentNugget?.topicId);
    return currentTopic?.color || '#000000';
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % reviewNuggets.length);
  };

  const handleComplete = (nuggetId: string) => {
    progressManager.markAsCompleted(nuggetId);
    handleNext(); // Move to next nugget after completion
  };

  if (reviewNuggets.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600 dark:text-gray-400">
          No nuggets to review yet. Start learning to build your review list!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <p className="text-gray-600 dark:text-gray-400">
          Reviewing {currentIndex + 1} of {reviewNuggets.length}
        </p>
      </div>

      <div className="relative">
        <NuggetCard
          nugget={reviewNuggets[currentIndex]}
          topicColor={getCurrentTopicColor()}
        />
        
        <button
          onClick={() => handleComplete(reviewNuggets[currentIndex].id)}
          className="mt-4 w-full py-2 px-4 bg-[#1DB954] text-white rounded-lg
                     hover:bg-opacity-90 transition-colors"
        >
          Mark as Reviewed
        </button>

        <button
          onClick={handleNext}
          className="mt-2 w-full py-2 px-4 bg-[#282828] text-white rounded-lg
                     hover:bg-[#3E3E3E] transition-colors"
        >
          Skip
        </button>
      </div>
    </div>
  );
}