'use client';

import { useState } from 'react';
import { dataManager } from '@/lib/dataManager';
import { motion, AnimatePresence } from 'framer-motion';

interface DataManagerProps {
  onDataChange: () => void;
}

export default function DataManager({ onDataChange }: DataManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFile = async (file: File) => {
    setIsLoading(true);
    try {
      const text = await file.text();
      dataManager.importData(text);
      onDataChange(); // Trigger refresh of parent component
      setIsOpen(false);
    } catch (error) {
      console.error('Error importing data:', error);
      alert('Error importing data. Please check the file format.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) await handleFile(file);
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await handleFile(file);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-[#1DB954] text-white rounded-lg
                 hover:bg-opacity-90 transition-colors"
      >
        Manage Your Data
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-[#282828] p-6 rounded-lg max-w-md w-full mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Manage Your Data</h2>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>

              <div 
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
                className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center mb-4"
              >
                <input
                  type="file"
                  accept=".md"
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-input"
                />
                <label 
                  htmlFor="file-input"
                  className="cursor-pointer text-gray-400 hover:text-white"
                >
                  {isLoading ? 'Processing...' : 'Click or drag to upload .md files'}
                </label>
              </div>

              <div className="text-sm text-gray-400 mb-6">
                <p className="mb-2">File format example:</p>
                <pre className="bg-[#1a1a1a] p-3 rounded overflow-x-auto">
                  {`---
name: "JavaScript"
id: "js-basics"
color: "#F7DF1E"
---

T: What is a closure?
D: A function that has access to its outer scope.

T: What is hoisting?
D: Moving declarations to the top.`}
                </pre>
              </div>

              <button
                onClick={() => {
                  const data = dataManager.getAllData();
                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'notes-learner-data.json';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="w-full py-2 rounded-full bg-[#1DB954] text-white
                         hover:bg-opacity-90 transition-colors"
                disabled={isLoading}
              >
                Export All Data
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}