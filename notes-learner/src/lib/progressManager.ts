const isServer = () => typeof window === 'undefined';
const PROGRESS_KEY = 'notes-learner-progress';
const STREAK_KEY = 'notes-learner-streak';

export const progressManager = {
  getProgress(): Record<string, { completed: boolean; lastReviewed: string }> {
    if (isServer()) return {};
    try {
      const stored = localStorage.getItem(PROGRESS_KEY) || '{}';
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error getting progress:', error);
      return {};
    }
  },

  getCurrentStreak(): number {
    if (isServer()) return 0;
    try {
      const progress = this.getProgress();
      const today = new Date().toISOString().split('T')[0];
      
      // Get all review dates
      const reviewDates = Object.values(progress)
        .map(p => p.lastReviewed.split('T')[0])
        .sort();

      if (reviewDates.length === 0) return 0;
      
      // Check if reviewed today
      const lastReviewDate = reviewDates[reviewDates.length - 1];
      if (lastReviewDate !== today) return 0;

      let streak = 1;
      let currentDate = new Date(today);

      // Count consecutive days
      for (let i = reviewDates.length - 2; i >= 0; i--) {
        const prevDate = new Date(reviewDates[i]);
        const diffDays = Math.floor(
          (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        
        if (diffDays === 1) {
          streak++;
          currentDate = prevDate;
        } else {
          break;
        }
      }

      localStorage.setItem(STREAK_KEY, streak.toString());
      return streak;
    } catch (error) {
      console.error('Error calculating streak:', error);
      return 0;
    }
  },

  markAsCompleted(nuggetId: string): void {
    if (isServer()) return;
    try {
      const progress = this.getProgress();
      progress[nuggetId] = {
        completed: true,
        lastReviewed: new Date().toISOString()
      };
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
      this.getCurrentStreak(); // Update streak immediately
    } catch (error) {
      console.error('Error marking as completed:', error);
    }
  }
};