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
    id: topicFileName.replace('.md', ''),
    name: data.name,
    description: data.description,
    color: data.color,
  };
  
  const nuggets = parseNuggets(content).map(nugget => ({
    ...nugget,
    topicId: topic.id,
  }));
  
  return { topic, nuggets };
}

// Function to get all topics
export function getAllTopics(): string[] {
  const topicsDirectory = path.join(process.cwd(), 'src/data/topics');
  return fs.readdirSync(topicsDirectory);
}