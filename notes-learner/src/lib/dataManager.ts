import matter from 'gray-matter';
import { Topic, Nugget } from '@/types';

const isServer = () => typeof window === 'undefined';
const DATA_KEY = 'notes-learner-data';

export const dataManager = {
  importData(content: string): { topics: Topic[], nuggets: Nugget[] } | void {
    if (isServer()) return;

    try {
      // Validate content
      if (!content.trim()) {
        throw new Error('Empty file content');
      }

      // Parse frontmatter
      const parsed = matter(content);
      console.log('Parsed content:', parsed);

      if (!parsed.data || Object.keys(parsed.data).length === 0) {
        throw new Error('No frontmatter found. Ensure file starts with ---');
      }

      // Create topic with filename-based ID
      const topic: Topic = {
        id: parsed.data.name.toLowerCase().replace(/\s+/g, '-'), // Generate ID from name
        name: String(parsed.data.name || ''),
        color: String(parsed.data.color || '')
      };

      // Validate topic
      if (!topic.name || !topic.color) {
        throw new Error(`Missing required fields in frontmatter. Found: ${JSON.stringify(topic)}`);
      }

      // Parse nuggets
      const nuggets: Nugget[] = [];
      let currentTitle = '';

      const lines = parsed.content.split('\n');
      console.log('Content lines:', lines);

      lines.forEach(line => {
        line = line.trim();
        if (!line) return;
        
        if (line.startsWith('T:')) {
          currentTitle = line.substring(2).trim();
        } else if (line.startsWith('D:') && currentTitle) {
          const nuggetId = `${topic.id}-${nuggets.length}`;
          nuggets.push({
            id: nuggetId,
            topic: currentTitle,
            description: line.substring(2).trim(),
            topicId: topic.id
          });
          
          // Initialize progress for new nugget
          const progress = this.getProgress();
          if (!progress[nuggetId]) {
            progress[nuggetId] = {
              completed: false,
              lastReviewed: ''
            };
          }
          localStorage.setItem('notes-learner-progress', JSON.stringify(progress));
          
          currentTitle = '';
        }
      });

      if (nuggets.length === 0) {
        throw new Error('No valid nuggets found. Ensure format is T: followed by D:');
      }

      console.log('Parsed nuggets:', nuggets);

      // Update storage and trigger events
      const existingData = this.getAllData();
      const newData = {
        topics: [...existingData.topics.filter(t => t.id !== topic.id), topic],
        nuggets: [...existingData.nuggets.filter(n => !n.topicId.startsWith(topic.id)), ...nuggets]
      };

      localStorage.setItem(DATA_KEY, JSON.stringify(newData));
      
      // Dispatch data change event
      window.dispatchEvent(new CustomEvent('dataChange', { detail: newData }));
      
      // Dispatch storage event for cross-tab updates
      window.dispatchEvent(new StorageEvent('storage', {
        key: DATA_KEY,
        newValue: JSON.stringify(newData)
      }));

      return newData;
    } catch (error) {
      console.error('Import error:', error as Error);
      throw new Error(`File format error: ${(error as Error).message}`);
    }
  },

  getAllData(): { topics: Topic[], nuggets: Nugget[] } {
    if (isServer()) return { topics: [], nuggets: [] };
    try {
      const stored = localStorage.getItem(DATA_KEY);
      return stored ? JSON.parse(stored) : { topics: [], nuggets: [] };
    } catch (error) {
      console.error('Error getting data:', error as Error);
      return { topics: [], nuggets: [] };
    }
  },

  getProgress(): Record<string, { completed: boolean; lastReviewed: string }> {
    if (isServer()) return {};
    try {
      const stored = localStorage.getItem('notes-learner-progress') || '{}';
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error getting progress:', error);
      return {};
    }
  }
};