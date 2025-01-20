'use client';

import { useState } from 'react';

export default function HelpModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-full bg-[#282828] hover:bg-[#3E3E3E] 
                 transition-colors text-white"
        aria-label="Help"
      >
        ?
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#282828] rounded-lg max-w-2xl w-full p-6 shadow-xl">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-white">How to Use Notes Learner</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
                aria-label="Close help"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6 text-gray-300">
              <section>
                <h3 className="text-xl font-semibold text-white mb-2">Adding Notes</h3>
                <p>
                  1. Create a markdown (.md) file in the <code className="bg-[#1E1E1E] px-2 py-1 rounded">src/data/topics</code> directory<br/>
                  2. Add frontmatter with topic name and color:<br/>
                  <code className="bg-[#1E1E1E] px-2 py-1 rounded block mt-2">
                    ---<br/>
                    name: Topic Name<br/>
                    color: "#4A90E2"<br/>
                    ---
                  </code>
                </p>
                <p className="mt-2">
                  3. Add nuggets using this format:<br/>
                  <code className="bg-[#1E1E1E] px-2 py-1 rounded block mt-2">
                    T: Your nugget title<br/>
                    D: Your nugget description
                  </code>
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-white mb-2">Tracking Progress</h3>
                <ul className="list-disc list-inside">
                  <li>Click the checkmark on any nugget to mark it as learned</li>
                  <li>Click again to mark as not learned</li>
                  <li>Track your daily streak in the stats panel</li>
                  <li>Monitor your overall completion rate</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-white mb-2">Navigation</h3>
                <ul className="list-disc list-inside">
                  <li>Use the topic dropdown to switch between topics</li>
                  <li>Use arrow keys or buttons to navigate between nuggets</li>
                  <li>Access settings to customize your learning experience</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 