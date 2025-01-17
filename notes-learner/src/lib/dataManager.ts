import { Topic, Nugget } from '@/types';
import matter from 'gray-matter';

// Add this helper function at the top
const isServer = () => typeof window === 'undefined';

export const dataManager = {
  parseMarkdown(content: string): { topic: Topic; nuggets: Nugget[] } {
    try {
      const { data, content: markdownContent } = matter(content);
      
      const topic: Topic = {
        id: data.id || data.name.toLowerCase().replace(/\s+/g, '-'),
        name: data.name,
        description: data.description || '',
        color: data.color || '#1DB954',
      };

      
      const nuggets = markdownContent
        .split('\n\n')
        .filter(Boolean)
        .map((nuggetString, index) => {
          const lines = nuggetString.split('\n');
          const topic = lines[0]?.replace('T:', '').trim();
          const description = lines[1]?.replace('D:', '').trim();
          
          if (!topic || !description) return null;

          return {
            id: `${topic}-${index}`,
            topic,
            description,
            topicId: data.id,
          };
        })
        .filter((nugget): nugget is Nugget => nugget !== null);

      return { topic, nuggets };
    } catch (error) {
      console.error('Error parsing markdown:', error);
      throw new Error('Invalid markdown format');
    }
  },

  saveToLocalStorage(topic: Topic, nuggets: Nugget[]) {
    if (isServer()) return;

    try {
      const stored = localStorage.getItem('notes-learner-data') || '{}';
      const data = JSON.parse(stored);
      
      data[topic.id] = { topic, nuggets };
      localStorage.setItem('notes-learner-data', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      throw new Error('Failed to save data');
    }
  },

  getAllData(): { topics: Topic[]; nuggets: Nugget[] } {
    if (isServer()) {
      return { topics: [], nuggets: [] };
    }

    try {
      const stored = localStorage.getItem('notes-learner-data') || '{}';
      const data = JSON.parse(stored);
      
      return {
        topics: Object.values(data).map((d: any) => d.topic),
        nuggets: Object.values(data).flatMap((d: any) => d.nuggets),
      };
    } catch (error) {
      console.error('Error getting data:', error);
      return { topics: [], nuggets: [] };
    }
  },

  deleteTopic(topicId: string) {
    if (isServer()) return;

    try {
      const stored = localStorage.getItem('notes-learner-data') || '{}';
      const data = JSON.parse(stored);
      
      delete data[topicId];
      localStorage.setItem('notes-learner-data', JSON.stringify(data));
    } catch (error) {
      console.error('Error deleting topic:', error);
      throw new Error('Failed to delete topic');
    }
  },

  exportAllData(): string {
    if (isServer()) return '{}';

    try {
      const stored = localStorage.getItem('notes-learner-data') || '{}';
      return JSON.stringify(JSON.parse(stored), null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      throw new Error('Failed to export data');
    }
  }
};