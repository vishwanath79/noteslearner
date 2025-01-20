import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Topic, Nugget } from '@/types';

// Function to parse individual nuggets from content
function parseNuggets(content: string): Nugget[] {
  // Split content by double newlines to separate nuggets
  const nuggetStrings = content.split('\n\n').filter(Boolean);
  
  return nuggetStrings.map((nuggetString, index) => {
    // Extract topic and description using regex
    const topicMatch = nuggetString.match(/T: (.+)/);
    const descMatch = nuggetString.match(/D: (.+)/);
    
    if (!topicMatch || !descMatch) {
      return null;
    }

    return {
      id: `nugget-${index}`,
      topic: topicMatch[1].trim(),
      description: descMatch[1].trim(),
      topicId: '', // Will be set when loading the topic
    };
  }).filter((nugget): nugget is Nugget => nugget !== null);
}

// Function to get all topics with error handling
export function getAllTopics(): string[] {
  try {
    const topicsDir = path.join(process.cwd(), 'src/data/topics');
    if (!fs.existsSync(topicsDir)) {
      console.warn('Topics directory not found:', topicsDir);
      return [];
    }
    return fs.readdirSync(topicsDir)
      .filter(filename => filename.endsWith('.md'));
  } catch (error) {
    console.error('Error reading topics directory:', error);
    return [];
  }
}

// Function to load a specific topic and its nuggets with error handling
export function loadTopic(topicFileName: string): { topic: Topic; nuggets: Nugget[] } {
  try {
    const fullPath = path.join(process.cwd(), 'src/data/topics', topicFileName);
    if (!fs.existsSync(fullPath)) {
      console.warn('Topic file not found:', fullPath);
      return {
        topic: {
          id: 'default',
          name: 'Default Topic',
          color: '#4A90E2'
        },
        nuggets: []
      };
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    const topic: Topic = {
      id: data.name?.toLowerCase().replace(/\s+/g, '-') || 'default',
      name: data.name || 'Default Topic',
      color: data.color || '#4A90E2'
    };
    
    // Parse nuggets
    const nuggets: Nugget[] = [];
    const sections = content.split('\n\n').filter(section => section.trim());
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const lines = section.split('\n').map(line => line.trim()).filter(Boolean);
      
      let topicText = '';
      let description = '';
      
      for (const line of lines) {
        if (line.startsWith('T:')) {
          topicText = line.substring(2).trim();
        } else if (line.startsWith('D:')) {
          description = line.substring(2).trim();
        }
      }
      
      if (topicText && description) {
        nuggets.push({
          id: `${topic.id}-${i}`,
          topic: topicText,
          description: description,
          topicId: topic.id
        });
      }
    }
    
    console.log(`Parsed ${nuggets.length} nuggets from ${topicFileName}`);
    return { topic, nuggets };
  } catch (error) {
    console.error('Error loading topic:', topicFileName, error);
    return {
      topic: {
        id: 'default',
        name: 'Default Topic',
        color: '#4A90E2'
      },
      nuggets: []
    };
  }
}