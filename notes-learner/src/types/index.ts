export interface Nugget {
    id: string;
    topic: string;
    description: string;
    topicId: string;
  }
  
  export interface Topic {
    id: string;
    name: string;
    description: string;
    color: string;
  }
  
  export interface StudyProgress {
    nuggetId: string;
    lastReviewed: Date;
    status: 'new' | 'seen' | 'mastered';
  }