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

// Function to load a specific topic and its nuggets
export function loadTopic(topicFileName: string): { topic: Topic; nuggets: Nugget[] } {
  const fullPath = path.join(process.cwd(), 'src/data/topics', topicFileName);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  
  // Parse frontmatter and content
  const { data, content } = matter(fileContents);
  
  const topic: Topic = {
    id: data.name.toLowerCase().replace(/\s+/g, '-'),
    name: data.name,
    color: data.color || '#4A90E2'
  };
  
  // Parse nuggets
  const nuggets: Nugget[] = [];
  
  // Split content by double newlines and filter out empty sections
  const sections = content.split('\n\n').filter(section => section.trim());
  
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const lines = section.split('\n').map(line => line.trim()).filter(Boolean);
    
    let topic = '';
    let description = '';
    
    for (const line of lines) {
      if (line.startsWith('T:')) {
        topic = line.substring(2).trim();
      } else if (line.startsWith('D:')) {
        description = line.substring(2).trim();
      }
    }
    
    if (topic && description) {
      nuggets.push({
        id: `${topic.id}-${i}`,
        topic,
        description,
        topicId: topic.id
      });
    }
  }
  
  console.log(`Parsed ${nuggets.length} nuggets from ${topicFileName}`);
  return { topic, nuggets };
}

// Function to get all topics
export function getAllTopics(): string[] {
  const topicsDir = path.join(process.cwd(), 'src/data/topics');
  return fs.readdirSync(topicsDir)
    .filter(filename => filename.endsWith('.md'));
}