import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import GameCanvas from '@/components/game/GameCanvas';
import GameHUD from '@/components/game/GameHUD';
import InsightModal from '@/components/game/InsightModal';
import { useGameState } from '@/hooks/useGameState';
import type { InsightData } from '@/types/game';

const GamePage = () => {
  const navigate = useNavigate();
  const { gameState, updateGameState } = useGameState();
  const [selectedInsight, setSelectedInsight] = useState<InsightData | null>(null);

  useEffect(() => {
    if (!gameState.selectedCharacter) {
      navigate('/character-select');
    }
  }, [gameState.selectedCharacter, navigate]);

  const handleInsightClick = (insight: InsightData) => {
    setSelectedInsight(insight);
  };

  const handleCloseInsight = () => {
    setSelectedInsight(null);
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
    </div>
  );
};

export default GamePage;