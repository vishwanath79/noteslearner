'use client';

import { useState, useEffect } from 'react';
import { dataManager } from '@/lib/dataManager';
import { Nugget, Topic } from '@/types';
import Navbar from './Navbar';
import Footer from './Footer';
import NuggetCarousel from './NuggetCarousel';
import StatsPanel from './StatsPanel';
import SettingsPanel from './SettingsPanel';
import DataManager from './DataManager';

interface HomePageProps {
  nuggets: Nugget[];
  topics: Topic[];
}

export default function HomePage({ nuggets: initialNuggets, topics: initialTopics }: HomePageProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [currentData, setCurrentData] = useState<{ nuggets: Nugget[], topics: Topic[] }>(() => {
    if (typeof window === 'undefined') {
      return { nuggets: initialNuggets || [], topics: initialTopics || [] };
    }
    const storedData = dataManager.getAllData();
    return storedData.nuggets.length || storedData.topics.length ? storedData : {
      nuggets: initialNuggets || [],
      topics: initialTopics || []
    };
  });

  const handleDataChange = () => {
    const newData = dataManager.getAllData();
    setCurrentData(newData);
    // Dispatch dataChange event for other components
    window.dispatchEvent(new CustomEvent('dataChange', { detail: newData }));
  };

  // Initialize data in localStorage if empty and set up event listeners
  useEffect(() => {
    const storedData = dataManager.getAllData();
    if (!storedData.nuggets.length && !storedData.topics.length) {
      const initialData = {
        nuggets: initialNuggets || [],
        topics: initialTopics || []
      };
      localStorage.setItem('notes-learner-data', JSON.stringify(initialData));
      setCurrentData(initialData);
    }

    // Listen for storage events from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'notes-learner-data') {
        const newData = JSON.parse(e.newValue || '{"nuggets":[],"topics":[]}');
        setCurrentData(newData);
      }
    };

    // Listen for nugget completion events
    const handleNuggetComplete = () => {
      handleDataChange();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('nuggetCompleted', handleNuggetComplete);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('nuggetCompleted', handleNuggetComplete);
    };
  }, [initialNuggets, initialTopics]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const settings = JSON.parse(localStorage.getItem('notes-learner-settings') || '{}');
      if (!settings.keyboardShortcuts) return;

      if (event.key.toLowerCase() === 's') {
        setShowSettings(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <Navbar />
      
      <main className="pt-20 px-8 pb-8 flex-grow">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-end mb-8 space-x-4">
            <DataManager onDataChange={handleDataChange} />
            <button
              onClick={() => setShowSettings(prev => !prev)}
              className="p-2 rounded-full bg-[#282828] hover:bg-[#3E3E3E] 
                       transition-colors"
              aria-label="Settings"
            >
              ⚙️
            </button>
          </div>

          {showSettings ? (
            <SettingsPanel />
          ) : (
            <>
              <StatsPanel nuggets={currentData.nuggets} />
              <NuggetCarousel 
                nuggets={currentData.nuggets} 
                topics={currentData.topics} 
              />
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}