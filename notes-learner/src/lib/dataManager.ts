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

      // Create topic
      const topic: Topic = {
        id: String(parsed.data.id || ''),
        name: String(parsed.data.name || ''),
        color: String(parsed.data.color || '')
      };

      // Validate topic
      if (!topic.id || !topic.name || !topic.color) {
        throw new Error(`Missing required fields in frontmatter. Found: ${JSON.stringify(topic)}`);
      }

      // Parse nuggets
      const nuggets: Nugget[] = [];
      let currentQuestion = '';

      const lines = parsed.content.split('\n');
      console.log('Content lines:', lines);

      lines.forEach((line, index) => {
        line = line.trim();
        if (!line) return;
        
        if (line.startsWith('T:')) {
          currentQuestion = line.substring(2).trim();
        } else if (line.startsWith('D:') && currentQuestion) {
          nuggets.push({
            id: `${topic.id}-${nuggets.length}`,
            question: currentQuestion,
            description: line.substring(2).trim(),
            topicId: topic.id
          });
          currentQuestion = '';
        }
      });

      if (nuggets.length === 0) {
        throw new Error('No valid nuggets found. Ensure format is T: followed by D:');
      }

      console.log('Parsed nuggets:', nuggets);

      // Update storage
      const existingData = this.getAllData();
      const newData = {
        topics: [...existingData.topics.filter(t => t.id !== topic.id), topic],
        nuggets: [...existingData.nuggets.filter(n => !n.topicId.startsWith(topic.id)), ...nuggets]
      };

      localStorage.setItem(DATA_KEY, JSON.stringify(newData));
      return newData;

    } catch (error) {
      console.error('Import error:', error);
      throw new Error(`File format error: ${error.message}`);
    }
  },

  // ... rest of the code
};