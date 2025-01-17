'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { dataManager } from '@/lib/dataManager';
//import { Topic } from '@/types';

interface DataManagerProps {
  onDataChange: () => void;
}

export default function DataManager({ onDataChange }: DataManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleFile = async (file: File) => {
    try {
      if (!file.name.endsWith('.md')) {
        showMessage('Please upload a markdown (.md) file', 'error');
        return;
      }

      const text = await file.text();
      const { topic, nuggets } = dataManager.parseMarkdown(text);
      dataManager.saveToLocalStorage(topic, nuggets);
      showMessage('Topic added successfully!', 'success');
      onDataChange();
    } catch (error) {
      showMessage('Error processing file', 'error');
      console.error('Error:', error);
    }
  };

  const handleDelete = (topicId: string) => {
    try {
      dataManager.deleteTopic(topicId);
      showMessage('Topic deleted successfully!', 'success');
      onDataChange();
    } catch (error) {
      showMessage('Error deleting topic', 'error');
      console.error('Error:', error);
    }
  };

  const handleExport = () => {
    try {
      const data = dataManager.exportAllData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'notes-learner-data.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showMessage('Data exported successfully!', 'success');
    } catch (error) {
      showMessage('Error exporting data', 'error');
      console.error('Error:', error);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { topics } = dataManager.getAllData();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-2 rounded-full bg-[#282828] text-gray-300 
                   hover:bg-[#3E3E3E] transition-colors"
      >
        Manage Data
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 
                       flex items-center justify-center"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#282828] rounded-lg p-6 w-full max-w-lg 
                         shadow-xl space-y-6"
            >
              <h2 className="text-xl font-bold text-white">Manage Your Data</h2>

              {message && (
                <div className={`p-3 rounded ${
                  message.type === 'success' 
                    ? 'bg-green-500 bg-opacity-10 text-green-400' 
                    : 'bg-red-500 bg-opacity-10 text-red-400'
                }`}>
                  {message.text}
                </div>
              )}

              {/* Drop Zone */}
              <div
                onDragOver={e => e.preventDefault()}
                onDragEnter={() => setIsDragging(true)}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={handleClick}
                className={`border-2 border-dashed rounded-lg p-8 text-center 
                           transition-colors cursor-pointer
                           ${isDragging 
                             ? 'border-[#1DB954] bg-[#1DB954] bg-opacity-10' 
                             : 'border-gray-600 hover:border-gray-500'}`}
              >
                <div className="space-y-2">
                  <p className="text-gray-300">
                    Drag and drop your markdown files here
                  </p>
                  <p className="text-sm text-gray-500">
                    or click to select files
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".md"
                    className="hidden"
                    onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
                  />
                </div>
              </div>

              {/* Existing Topics */}
              <div className="space-y-3">
                <h3 className="text-white font-semibold">Current Topics</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {topics.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      No topics yet. Upload a markdown file to get started!
                    </p>
                  ) : (
                    topics.map(topic => (
                      <div 
                        key={topic.id}
                        className="flex items-center justify-between p-3 
                                 bg-[#3E3E3E] rounded-lg"
                      >
                        <span className="text-gray-300">{topic.name}</span>
                        <button 
                          className="text-red-400 hover:text-red-300 
                                   transition-colors"
                          onClick={() => handleDelete(topic.id)}
                        >
                          Delete
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Export Button */}
              <button
                className="w-full py-2 rounded-full bg-[#1DB954] text-white 
                         hover:bg-opacity-90 transition-colors"
                onClick={handleExport}
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