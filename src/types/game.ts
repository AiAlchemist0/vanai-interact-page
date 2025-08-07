export interface Character {
  id: string;
  name: string;
  title: string;
  description: string;
  avatar: string;
  aiExperience: 'low' | 'medium' | 'high';
  specialization: string;
  color: string;
}

export interface GameState {
  selectedCharacter: Character | null;
  unlockedDistricts: string[];
  visitedBuildings: string[];
  discoveredInsights: string[];
  playerPosition: { x: number; y: number };
  gameStarted: boolean;
  health: number;
  stamina: number;
}

export interface District {
  id: string;
  name: string;
  description: string;
  color: string;
  position: { x: number; y: number };
  buildings: Building[];
  unlocked: boolean;
}

export interface Building {
  id: string;
  name: string;
  type: 'npc' | 'data-center' | 'mini-game' | 'insight';
  position: { x: number; y: number };
  insight?: InsightData;
  visited: boolean;
}

export interface InsightData {
  title: string;
  description: string;
  data: any;
  quote?: string;
  chartType?: 'bar' | 'pie' | 'line' | 'area';
}

export interface PlayerSprite {
  x: number;
  y: number;
  width: number;
  height: number;
  moving: boolean;
  direction: 'up' | 'down' | 'left' | 'right';
}