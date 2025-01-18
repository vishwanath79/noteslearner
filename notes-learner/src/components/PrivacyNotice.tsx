'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PrivacyNotice() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 p-4 bg-[#282828] border-t border-gray-700"
        >
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-[#1DB954]">🔒</span>
              <p className="text-sm text-gray-300">
                All data is stored locally in your browser and is not shared with other users.
              </p>
            </div>
            <button 
              onClick={() => setIsVisible(false)}
              className="ml-4 px-4 py-2 text-sm text-gray-400 hover:text-white 
                       bg-[#3E3E3E] rounded-full transition-colors"
            >
              Got it
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}