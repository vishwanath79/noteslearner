import HomePage from '@/components/HomePage';
import { getAllTopics, loadTopic } from '@/lib/topicParser';

export default async function Home() {
  const topicFiles = getAllTopics();
  
  if (!topicFiles.length) {
    console.warn('No topic files found. Using default data.');
    return <HomePage 
      nuggets={[]} 
      topics={[{
        id: 'default',
        name: 'Default Topic',
        color: '#4A90E2'
      }]} 
    />;
  }

  const allData = topicFiles.map(filename => loadTopic(filename));
  const nuggets = allData.flatMap(({ nuggets }) => nuggets);
  const topics = allData.map(({ topic }) => topic);

  return <HomePage nuggets={nuggets} topics={topics} />;
}