import { useState, useCallback } from 'react';
import type { GameState } from '@/types/game';

const initialGameState: GameState = {
  selectedCharacter: null,
  unlockedDistricts: [],
  visitedBuildings: [],
  discoveredInsights: [],
  playerPosition: { x: 400, y: 300 },
  gameStarted: false
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('bc-ai-quest-state');
    return saved ? { ...initialGameState, ...JSON.parse(saved) } : initialGameState;
  });

  const updateGameState = useCallback((updates: Partial<GameState>) => {
    setGameState(prev => {
      const newState = { ...prev, ...updates };
      // Save to localStorage
      localStorage.setItem('bc-ai-quest-state', JSON.stringify(newState));
      return newState;
    });
  }, []);

  const resetGameState = useCallback(() => {
    setGameState(initialGameState);
    localStorage.removeItem('bc-ai-quest-state');
  }, []);

  const unlockDistrict = useCallback((districtId: string) => {
    updateGameState({
      unlockedDistricts: [...gameState.unlockedDistricts, districtId]
    });
  }, [gameState.unlockedDistricts, updateGameState]);

  const visitBuilding = useCallback((buildingId: string) => {
    updateGameState({
      visitedBuildings: [...gameState.visitedBuildings, buildingId]
    });
  }, [gameState.visitedBuildings, updateGameState]);

  const discoverInsight = useCallback((insightId: string) => {
    updateGameState({
      discoveredInsights: [...gameState.discoveredInsights, insightId]
    });
  }, [gameState.discoveredInsights, updateGameState]);

  return {
    gameState,
    updateGameState,
    resetGameState,
    unlockDistrict,
    visitBuilding,
    discoverInsight
  };
};