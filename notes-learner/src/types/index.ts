export interface Topic {
  id: string;
  name: string;
  color: string;
}
export interface Nugget {
  id: string;
  title: string;  // Add this line
  description: string;
  topicId: string;
}