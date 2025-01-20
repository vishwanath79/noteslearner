'use client';

import Link from 'next/link';
import HelpModal from './HelpModal';

export default function Navbar() {
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data? This will remove all topics and progress.')) {
      // Clear all local storage data
      localStorage.removeItem('notes-learner-data');
      localStorage.removeItem('notes-learner-progress');
      localStorage.removeItem('notes-learner-streak');
      localStorage.removeItem('notes-learner-settings');
      
      // Dispatch events to update components
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('dataChange', { 
        detail: { nuggets: [], topics: [] } 
      }));
      
      // Reload the page to reset the state
      window.location.reload();
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#282828] shadow-lg z-40">
      <div className="max-w-4xl mx-auto px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-white hover:text-[#1DB954] transition-colors">
            Notes Learner
          </Link>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleReset}
              className="text-red-500 hover:text-red-400 transition-colors"
              aria-label="Reset all data"
            >
              Reset Data
            </button>
            <Link
              href="https://github.com/vishwanath79/noteslearner"
              className="text-white hover:text-[#1DB954] transition-colors"
              target="_blank"
            >
              About
            </Link>
            <HelpModal />
          </div>
        </div>
      </div>
    </nav>
  );
}