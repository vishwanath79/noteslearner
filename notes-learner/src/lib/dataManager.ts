import matter from 'gray-matter';
import { Topic, Nugget } from '@/types';

const isServer = () => typeof window === 'undefined';
const DATA_KEY = 'notes-learner-data';

export const dataManager = {
  importData(content: string) {
    if (isServer()) return;

    try {
      // Parse with gray-matter
      const parsed = matter(content);
      console.log('Parsed content:', {
        data: parsed.data,
        content: parsed.content
      });

      // Create topic from frontmatter
      const topic: Topic = {
        id: parsed.data.id?.toString() || '',
        name: parsed.data.name?.toString() || '',
        color: parsed.data.color?.toString() || '#000000'
      };

      // Validate topic data
      if (!topic.id || !topic.name || !topic.color) {
        console.error('Invalid topic data:', topic);
        throw new Error('Invalid frontmatter: missing required fields');
      }

      // Parse nuggets from content
      const nuggets: Nugget[] = [];
      let currentQuestion = '';

      parsed.content.split('\n').forEach(line => {
        line = line.trim();
        if (!line) return;
        
        if (line.startsWith('T:')) {
          currentQuestion = line.substring(2).trim();
        } else if (line.startsWith('D:') && currentQuestion) {
          nuggets.push({
            id: `${topic.id}-${nuggets.length}`,

            topic: currentQuestion,  // Changed from 'question' to 'title'
            description: line.substring(2).trim(),
            topicId: topic.id
          });
          currentQuestion = '';
        }
      });

      console.log('Parsed nuggets:', nuggets);

      // Get existing data
      const existingData = this.getAllData();
      
      // Merge new data with existing data
      const updatedTopics = [...existingData.topics.filter((t: Topic) => t.id !== topic.id), topic];
      const updatedNuggets = [
        ...existingData.nuggets.filter((n: Nugget) => !n.topicId.startsWith(topic.id)),
        ...nuggets
      ];

      // Save updated data
      const newData = { topics: updatedTopics, nuggets: updatedNuggets };
      localStorage.setItem(DATA_KEY, JSON.stringify(newData));

      console.log('Saved data:', newData);
      return newData;
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  },

  getAllData() {
    if (isServer()) return { topics: [], nuggets: [] };
    
    try {
      const stored = localStorage.getItem(DATA_KEY);
      if (!stored) return { topics: [], nuggets: [] };

      const data = JSON.parse(stored);
      console.log('Retrieved data:', data);
      return data;
    } catch (error) {
      console.error('Error getting data:', error);
      return { topics: [], nuggets: [] };
    }
  },

  clearData() {
    if (isServer()) return;
    try {
      localStorage.removeItem(DATA_KEY);
      console.log('Data cleared');
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  },

  exportData(): string {
    if (isServer()) return '';
    
    try {
      const data = this.getAllData();
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      return '';
    }
  }
};