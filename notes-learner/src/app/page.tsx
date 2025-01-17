import HomePage from '@/components/HomePage';
import { getAllTopics, loadTopic } from '@/lib/topicParser';

export default async function Home() {
  const topicFiles = getAllTopics();
  const allData = topicFiles.map(filename => loadTopic(filename));
  
  const nuggets = allData.flatMap(({ nuggets }) => nuggets);
  const topics = allData.map(({ topic }) => topic);

  return <HomePage nuggets={nuggets} topics={topics} />;
}