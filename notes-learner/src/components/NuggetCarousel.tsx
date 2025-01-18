'use client';

import { useState, useEffect, useRef } from 'react';
import { Nugget, Topic } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import NuggetCard from './NuggetCard';

interface NuggetCarouselProps {
  nuggets: Nugget[];
  topics: Topic[];
}

export default function NuggetCarousel({ nuggets, topics }: NuggetCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filteredNuggets, setFilteredNuggets] = useState(nuggets);
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout>>(null);

  // Filter nuggets when topic selection changes
  useEffect(() => {
    const filtered = selectedTopic === 'all'
      ? nuggets
      : nuggets.filter(nugget => nugget.topicId === selectedTopic);
    setFilteredNuggets(filtered);
    setCurrentIndex(0);
  }, [selectedTopic, nuggets]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredNuggets.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => 
      (prev - 1 + filteredNuggets.length) % filteredNuggets.length
    );
  };

  // Auto-advance setup
  useEffect(() => {
    const settings = JSON.parse(localStorage.getItem('notes-learner-settings') || '{}');
    
    if (settings.autoAdvance) {
      const timer = setInterval(goToNext, settings.autoAdvanceDelay * 1000 || 5000);
      autoAdvanceTimer.current = timer;
      
      return () => clearInterval(timer);
    }
  }, []);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        goToNext();
      } else if (event.key === 'ArrowLeft') {
        goToPrevious();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Get current topic color
  const getCurrentTopicColor = () => {
    const currentNugget = filteredNuggets[currentIndex];
    const currentTopic = topics.find(t => t.id === currentNugget?.topicId);
    return currentTopic?.color || '#000000';
  };

  return (
    <div className="space-y-6">
      {/* Topic Filter */}
      <div className="flex justify-center mb-4">
        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                     bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
        >
          <option value="all">All Topics</option>
          {topics.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.name}
            </option>
          ))}
        </select>
      </div>

      {/* Card Display with Navigation */}
      <div className="relative h-[300px]">
        <button 
          onClick={goToPrevious}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6
                   p-3 rounded-full bg-[#1DB954] text-white
                   hover:bg-opacity-90 transition-colors
                   shadow-lg z-10"
          aria-label="Previous nugget"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="absolute w-full"
          >
            {filteredNuggets.length > 0 && (
              <NuggetCard
                nugget={filteredNuggets[currentIndex]}
                topicColor={getCurrentTopicColor()}
              />
            )}
          </motion.div>
        </AnimatePresence>

        <button 
          onClick={goToNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6
                   p-3 rounded-full bg-[#1DB954] text-white
                   hover:bg-opacity-90 transition-colors
                   shadow-lg z-10"
          aria-label="Next nugget"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>

      {/* Progress Indicator */}
      <div className="text-center text-gray-600 dark:text-gray-400">
        {currentIndex + 1} / {filteredNuggets.length}
      </div>
    </div>
  );
}