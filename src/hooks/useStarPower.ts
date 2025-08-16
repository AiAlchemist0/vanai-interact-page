import { useState, useCallback } from 'react';

export interface StarPowerState {
  isActive: boolean;
  meter: number;
  multiplier: number;
  duration: number;
}

export const useStarPower = () => {
  const [starPower, setStarPower] = useState<StarPowerState>({
    isActive: false,
    meter: 0,
    multiplier: 1,
    duration: 0
  });

  const addStarPower = useCallback((amount: number) => {
    setStarPower(prev => ({
      ...prev,
      meter: Math.min(100, prev.meter + amount)
    }));
  }, []);

  const activateStarPower = useCallback(() => {
    setStarPower(prev => {
      if (prev.meter >= 50 && !prev.isActive) {
        return {
          ...prev,
          isActive: true,
          multiplier: 2,
          duration: 10000, // 10 seconds
          meter: Math.max(0, prev.meter - 50)
        };
      }
      return prev;
    });
  }, []);

  const updateStarPower = useCallback((deltaTime: number) => {
    setStarPower(prev => {
      if (prev.isActive) {
        const newDuration = Math.max(0, prev.duration - deltaTime);
        if (newDuration === 0) {
          return {
            ...prev,
            isActive: false,
            multiplier: 1,
            duration: 0
          };
        }
        return {
          ...prev,
          duration: newDuration
        };
      }
      return prev;
    });
  }, []);

  const resetStarPower = useCallback(() => {
    setStarPower({
      isActive: false,
      meter: 0,
      multiplier: 1,
      duration: 0
    });
  }, []);

  return {
    starPower,
    addStarPower,
    activateStarPower,
    updateStarPower,
    resetStarPower
  };
};