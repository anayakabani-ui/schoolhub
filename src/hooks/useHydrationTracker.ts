import { useState, useEffect } from 'react';

export function useHydrationTracker(hydrationGoal: number) {
  const [hydrationProgress, setHydrationProgress] = useState(() => {
    const saved = localStorage.getItem('hydration-progress');
    const lastResetDate = localStorage.getItem('hydration-last-reset');
    const today = new Date().toDateString();
    
    // Check if we need to reset for a new day
    if (lastResetDate !== today) {
      localStorage.setItem('hydration-last-reset', today);
      localStorage.setItem('hydration-progress', '0');
      return 0;
    }
    
    return saved ? parseInt(saved) : 0;
  });

  const [showGoalPopup, setShowGoalPopup] = useState(false);

  // Check for daily reset on component mount and when the component updates
  useEffect(() => {
    const checkDailyReset = () => {
      const lastResetDate = localStorage.getItem('hydration-last-reset');
      const today = new Date().toDateString();
      
      if (lastResetDate !== today) {
        setHydrationProgress(0);
        localStorage.setItem('hydration-progress', '0');
        localStorage.setItem('hydration-last-reset', today);
      }
    };

    checkDailyReset();
    
    // Check every minute for date changes
    const interval = setInterval(checkDailyReset, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('hydration-progress', hydrationProgress.toString());
  }, [hydrationProgress]);

  // Show popup when goal is reached
  useEffect(() => {
    if (hydrationProgress === hydrationGoal && hydrationGoal > 0) {
      setShowGoalPopup(true);
    }
  }, [hydrationProgress, hydrationGoal]);

  const incrementHydration = () => {
    setHydrationProgress(prev => Math.min(prev + 1, hydrationGoal));
  };

  const decrementHydration = () => {
    setHydrationProgress(prev => Math.max(prev - 1, 0));
  };

  const resetHydration = () => {
    setHydrationProgress(0);
  };

  const closeGoalPopup = () => {
    setShowGoalPopup(false);
  };

  return {
    hydrationProgress,
    showGoalPopup,
    incrementHydration,
    decrementHydration,
    resetHydration,
    closeGoalPopup
  };
}