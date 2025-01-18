'use client';

import { useState, useEffect } from 'react';
import { Nugget, Topic } from '@/types';
import NuggetCarousel from './NuggetCarousel';
import StatsPanel from './StatsPanel';
import ReviewMode from './ReviewMode';
import SettingsPanel from './SettingsPanel';
import Navbar from './Navbar';
import Footer from './Footer';
import DataManager from './DataManager';
import { dataManager } from '@/lib/dataManager';
import PrivacyNotice from './PrivacyNotice';
export default function HomePage({ nuggets, topics }: { nuggets: Nugget[], topics: Topic[] }) {
  const [mode, setMode] = useState<'learn' | 'review'>('learn');
  const [showSettings, setShowSettings] = useState(false);

  const [data, setData] = useState(() => dataManager.getAllData());
  
  const handleDataChange = () => {
    setData(dataManager.getAllData());
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Load settings to check if keyboard shortcuts are enabled
      const settings = JSON.parse(localStorage.getItem('notes-learner-settings') || '{}');
      if (!settings.keyboardShortcuts) return;

      switch(event.key.toLowerCase()) {
        case 'l':
          setMode('learn');
          break;
        case 'r':
          setMode('review');
          break;
        case 's':
          setShowSettings(prev => !prev);
          break;
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
            >
              ⚙️
            </button>
          </div>

          {showSettings ? (
            <SettingsPanel />
          ) : (
            <>
              <StatsPanel nuggets={nuggets} />
              
              <div className="mb-8 flex justify-center space-x-4">
                <button
                  onClick={() => setMode('learn')}
                  className={`px-6 py-2 rounded-full transition-colors ${
                    mode === 'learn'
                      ? 'bg-[#1DB954] text-white'
                      : 'bg-[#282828] text-gray-300 hover:bg-[#3E3E3E]'
                  }`}
                >
                  Learn
                </button>
                <button
                  onClick={() => setMode('review')}
                  className={`px-6 py-2 rounded-full transition-colors ${
                    mode === 'review'
                      ? 'bg-[#1DB954] text-white'
                      : 'bg-[#282828] text-gray-300 hover:bg-[#3E3E3E]'
                  }`}
                >
                  Review
                </button>
              </div>

              {mode === 'learn' ? (
                <NuggetCarousel nuggets={nuggets} topics={topics} />
              ) : (
                <ReviewMode nuggets={nuggets} topics={topics} />
              )}
            </>
          )}
        </div>
      </main>
      <PrivacyNotice />
      <Footer />
    </div>
  );
}