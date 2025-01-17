const isServer = () => typeof window === 'undefined';

export const progressManager = {
  // Remove the nuggets parameter since it's not being used
  getProgress(): Record<string, { completed: boolean; lastReviewed: string }> {
    if (isServer()) return {};
    
    try {
      const stored = localStorage.getItem('notes-learner-progress') || '{}';
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error getting progress:', error);
      return {};
    }
  },

  getCurrentStreak() {
    if (isServer()) return 0;
    
    try {
      const stored = localStorage.getItem('notes-learner-streak') || '0';
      return parseInt(stored, 10);
    } catch (error) {
      console.error('Error getting streak:', error);
      return 0;
    }
  },

  markAsCompleted(nuggetId: string) {
    if (isServer()) return;
    
    try {
      const progress = this.getProgress();
      progress[nuggetId] = { completed: true, lastReviewed: new Date().toISOString() };
      localStorage.setItem('notes-learner-progress', JSON.stringify(progress));
    } catch (error) {
      console.error('Error marking as completed:', error);
    }
  }
};