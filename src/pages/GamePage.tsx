import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import GameCanvas from '@/components/game/GameCanvas';
import GameHUD from '@/components/game/GameHUD';
import InsightModal from '@/components/game/InsightModal';
import MiniGame from '@/components/game/MiniGame';
import AchievementSystem from '@/components/game/AchievementSystem';
import { useGameState } from '@/hooks/useGameState';
import { gameAudio } from '@/utils/gameAudio';
import type { InsightData } from '@/types/game';

const GamePage = () => {
  const navigate = useNavigate();
  const { gameState, updateGameState } = useGameState();
  const [selectedInsight, setSelectedInsight] = useState<InsightData | null>(null);
  const [miniGameType, setMiniGameType] = useState<'ai-training' | 'policy-puzzle' | 'creativity-challenge' | null>(null);
  const [showAchievements, setShowAchievements] = useState(false);

  useEffect(() => {
    // Initialize audio system
    gameAudio.preloadSounds();
  }, []);

  useEffect(() => {
    console.log('GamePage: useEffect triggered, gameState:', gameState);
    console.log('GamePage: selectedCharacter:', gameState.selectedCharacter);
    
    if (!gameState.selectedCharacter) {
      console.log('GamePage: No character selected, redirecting to character-select');
      navigate('/character-select');
    } else {
      console.log('GamePage: Character found, loading game...');
    }
  }, [gameState.selectedCharacter, navigate]);

  const handleInsightClick = (insight: InsightData, buildingType?: string) => {
    // Play discovery sound
    gameAudio.playDiscoverySound();
    
    // Check if this should trigger a mini-game
    if (buildingType === 'mini-game') {
      const gameTypes: ('ai-training' | 'policy-puzzle' | 'creativity-challenge')[] = ['ai-training', 'policy-puzzle', 'creativity-challenge'];
      const randomType = gameTypes[Math.floor(Math.random() * gameTypes.length)];
      setMiniGameType(randomType);
    } else {
      setSelectedInsight(insight);
    }
  };

  const handleMiniGameComplete = (score: number) => {
    gameAudio.playSuccessSound();
    setMiniGameType(null);
    
    // Show achievement if high score
    if (score >= 80) {
      setShowAchievements(true);
    }
  };

  const handleCloseInsight = () => {
    setSelectedInsight(null);
  };

  const handleCloseAchievements = () => {
    setShowAchievements(false);
  };

  if (!gameState.selectedCharacter) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Back button */}
      <Button
        variant="outline"
        size="sm"
        className="absolute top-4 left-4 z-10 border-gradient"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Exit Game
      </Button>

      {/* Game HUD */}
      <GameHUD 
        character={gameState.selectedCharacter}
        progress={{
          totalDistricts: 6,
          unlockedDistricts: gameState.unlockedDistricts.length,
          totalInsights: 24,
          discoveredInsights: gameState.discoveredInsights.length
        }}
      />

      {/* Game Canvas */}
      <GameCanvas
        gameState={gameState}
        onInsightClick={handleInsightClick}
        onStateUpdate={updateGameState}
      />

      {/* Insight Modal */}
      {selectedInsight && (
        <InsightModal
          insight={selectedInsight}
          character={gameState.selectedCharacter}
          onClose={handleCloseInsight}
        />
      )}

      {/* Mini Game */}
      {miniGameType && (
        <MiniGame
          gameType={miniGameType}
          onComplete={handleMiniGameComplete}
          onClose={() => setMiniGameType(null)}
        />
      )}

      {/* Achievement System */}
      {showAchievements && (
        <AchievementSystem
          gameState={gameState}
          onClose={handleCloseAchievements}
        />
      )}
    </div>
  );
};

export default GamePage;