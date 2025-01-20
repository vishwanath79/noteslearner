import matter from 'gray-matter';
import { Topic, Nugget } from '@/types';

const isServer = () => typeof window === 'undefined';
const DATA_KEY = 'notes-learner-data';

export const dataManager = {
  importData(content: string): { topics: Topic[], nuggets: Nugget[] } | void {
    if (isServer()) return;

    try {
      console.log('Importing content:', content.substring(0, 200));

      // Validate content
      if (!content.trim()) {
        throw new Error('Empty file content');
      }

      // Parse frontmatter with detailed error handling
      let parsed;
      try {
        parsed = matter(content);
        console.log('Parsed frontmatter:', parsed.data);
      } catch (e) {
        throw new Error(`Failed to parse frontmatter: ${(e as Error).message}`);
      }

      // Create topic
      const topic: Topic = {
        id: parsed.data.name.toLowerCase().replace(/\s+/g, '-'),
        name: String(parsed.data.name),
        color: parsed.data.color || '#4A90E2'
      };

      // Parse nuggets with detailed validation
      const nuggets: Nugget[] = [];
      let currentTitle = '';
      let currentDescription = '';

      // Split content by double newlines to separate nuggets
      const sections = parsed.content.split('\n\n');
      
      for (const section of sections) {
        const lines = section.split('\n');
        
        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine) continue;

          if (trimmedLine.startsWith('T:')) {
            // Save previous nugget if exists
            if (currentTitle && currentDescription) {
              const nuggetId = `${topic.id}-${nuggets.length}`;
              nuggets.push({
                id: nuggetId,
                topic: currentTitle,
                description: currentDescription,
                topicId: topic.id
              });
            }
            currentTitle = trimmedLine.substring(2).trim();
            currentDescription = '';
          } else if (trimmedLine.startsWith('D:')) {
            currentDescription = trimmedLine.substring(2).trim();
          }
        }
      }

      // Add final nugget if exists
      if (currentTitle && currentDescription) {
        const nuggetId = `${topic.id}-${nuggets.length}`;
        nuggets.push({
          id: nuggetId,
          topic: currentTitle,
          description: currentDescription,
          topicId: topic.id
        });
      }

      console.log('Parsed nuggets:', nuggets);

      // Update storage
      const existingData = this.getAllData();
      const newData = {
        topics: [...existingData.topics.filter(t => t.id !== topic.id), topic],
        nuggets: [...existingData.nuggets.filter(n => !n.topicId.startsWith(topic.id)), ...nuggets]
      };

      localStorage.setItem(DATA_KEY, JSON.stringify(newData));
      window.dispatchEvent(new CustomEvent('dataChange', { detail: newData }));

      return newData;
    } catch (error) {
      console.error('Import error:', error);
      throw new Error(`File format error: ${(error as Error).message}`);
    }
  },

  getAllData(): { topics: Topic[], nuggets: Nugget[] } {
    if (isServer()) return { topics: [], nuggets: [] };
    try {
      const stored = localStorage.getItem(DATA_KEY);
      const data = stored ? JSON.parse(stored) : { topics: [], nuggets: [] };
      return {
        topics: Array.isArray(data.topics) ? data.topics : [],
        nuggets: Array.isArray(data.nuggets) ? data.nuggets : []
      };
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