export interface Topic {
  id: string;
  name: string;
  color: string;
}

export interface Nugget {
  id: string;
  topic: string;
  description: string;
  topicId: string;
}