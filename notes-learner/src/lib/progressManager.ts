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
      
      // If already completed, don't update
      if (progress[nuggetId]?.completed) {
        return;
      }
      
      progress[nuggetId] = {
        completed: true,
        lastReviewed: new Date().toISOString()
      };
      
      // Save progress
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
      
      // Update streak
      const streak = this.getCurrentStreak();
      localStorage.setItem(STREAK_KEY, streak.toString());
      
      // Dispatch storage event for cross-tab updates
      window.dispatchEvent(new StorageEvent('storage', {
        key: PROGRESS_KEY,
        newValue: JSON.stringify(progress)
      }));

      // Dispatch custom event with progress data
      window.dispatchEvent(new CustomEvent('nuggetCompleted', {
        detail: { 
          nuggetId, 
          progress,
          streak,
          timestamp: new Date().toISOString()
        }
      }));
      
      console.log('Marked as completed:', { 
        nuggetId, 
        progress, 
        streak,
        timestamp: new Date().toISOString() 
      });
    } catch (error) {
      console.error('Error marking as completed:', error);
    }
  },

  toggleCompletion(nuggetId: string): void {
    if (isServer()) return;
    try {
      const progress = this.getProgress();
      const isCurrentlyCompleted = progress[nuggetId]?.completed || false;
      
      if (isCurrentlyCompleted) {
        // Remove the completion status
        delete progress[nuggetId];
      } else {
        // Mark as completed
        progress[nuggetId] = {
          completed: true,
          lastReviewed: new Date().toISOString()
        };
      }
      
      // Save progress
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
      
      // Update streak
      const streak = this.getCurrentStreak();
      localStorage.setItem(STREAK_KEY, streak.toString());
      
      // Dispatch storage event for cross-tab updates
      window.dispatchEvent(new StorageEvent('storage', {
        key: PROGRESS_KEY,
        newValue: JSON.stringify(progress)
      }));

      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('nuggetToggled', {
        detail: { 
          nuggetId, 
          progress,
          streak,
          isCompleted: !isCurrentlyCompleted,
          timestamp: new Date().toISOString()
        }
      }));
    } catch (error) {
      console.error('Error toggling completion:', error);
    }
  }
};