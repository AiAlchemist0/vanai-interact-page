import { useRef, useEffect, useCallback } from 'react';
import { useKeyboard } from '@/hooks/useKeyboard';
import type { GameState, InsightData, PlayerSprite } from '@/types/game';

interface GameCanvasProps {
  gameState: GameState;
  onInsightClick: (insight: InsightData) => void;
  onStateUpdate: (updates: Partial<GameState>) => void;
}

const GameCanvas = ({ gameState, onInsightClick, onStateUpdate }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const keys = useKeyboard();
  
  const playerRef = useRef<PlayerSprite>({
    x: gameState.playerPosition.x,
    y: gameState.playerPosition.y,
    width: 32,
    height: 32,
    moving: false,
    direction: 'down'
  });

  // Game districts data
  const districts = [
    {
      id: 'tech-hub',
      name: 'Tech Hub',
      color: 'hsl(var(--ai-cyan))',
      position: { x: 150, y: 150 },
      buildings: [
        { id: 'ai-center', name: 'AI Research Center', position: { x: 180, y: 120 } },
        { id: 'startup-office', name: 'Startup Offices', position: { x: 120, y: 180 } }
      ]
    },
    {
      id: 'business-quarter',
      name: 'Business Quarter',
      color: 'hsl(var(--ai-orange))',
      position: { x: 450, y: 150 },
      buildings: [
        { id: 'corporate-tower', name: 'Corporate Tower', position: { x: 480, y: 120 } },
        { id: 'job-center', name: 'Employment Center', position: { x: 420, y: 180 } }
      ]
    },
    {
      id: 'creative-district',
      name: 'Creative Arts District',
      color: 'hsl(var(--ai-purple))',
      position: { x: 150, y: 350 },
      buildings: [
        { id: 'art-studio', name: 'Digital Art Studio', position: { x: 180, y: 320 } },
        { id: 'media-lab', name: 'Media Lab', position: { x: 120, y: 380 } }
      ]
    },
    {
      id: 'government-center',
      name: 'Government Center',
      color: 'hsl(var(--ai-green))',
      position: { x: 450, y: 350 },
      buildings: [
        { id: 'policy-building', name: 'Policy Building', position: { x: 480, y: 320 } },
        { id: 'regulation-office', name: 'Regulation Office', position: { x: 420, y: 380 } }
      ]
    },
    {
      id: 'medical-campus',
      name: 'Medical Campus',
      color: 'hsl(var(--ai-blue))',
      position: { x: 300, y: 100 },
      buildings: [
        { id: 'hospital', name: 'AI Hospital', position: { x: 330, y: 70 } },
        { id: 'research-lab', name: 'Medical AI Lab', position: { x: 270, y: 130 } }
      ]
    },
    {
      id: 'education-zone',
      name: 'Education Zone',
      color: 'hsl(var(--accent))',
      position: { x: 300, y: 400 },
      buildings: [
        { id: 'university', name: 'AI University', position: { x: 330, y: 370 } },
        { id: 'training-center', name: 'Training Center', position: { x: 270, y: 430 } }
      ]
    }
  ];

  const drawPlayer = useCallback((ctx: CanvasRenderingContext2D, player: PlayerSprite) => {
    // Draw player character
    ctx.fillStyle = gameState.selectedCharacter?.color || 'hsl(var(--primary))';
    ctx.fillRect(player.x - player.width/2, player.y - player.height/2, player.width, player.height);
    
    // Draw character emoji
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(
      gameState.selectedCharacter?.avatar || '🤖',
      player.x,
      player.y + 8
    );
  }, [gameState.selectedCharacter]);

  const drawDistrict = useCallback((ctx: CanvasRenderingContext2D, district: any) => {
    const isUnlocked = gameState.unlockedDistricts.includes(district.id);
    
    // District background
    ctx.fillStyle = isUnlocked ? district.color + '40' : '#333333';
    ctx.fillRect(district.position.x - 60, district.position.y - 60, 120, 120);
    
    // District border
    ctx.strokeStyle = isUnlocked ? district.color : '#666666';
    ctx.lineWidth = 2;
    ctx.strokeRect(district.position.x - 60, district.position.y - 60, 120, 120);
    
    // District name
    ctx.fillStyle = isUnlocked ? '#ffffff' : '#999999';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(district.name, district.position.x, district.position.y - 70);
    
    // Buildings
    if (isUnlocked) {
      district.buildings.forEach((building: any) => {
        const isVisited = gameState.visitedBuildings.includes(building.id);
        
        ctx.fillStyle = isVisited ? '#00ff00' : '#ffff00';
        ctx.fillRect(building.position.x - 8, building.position.y - 8, 16, 16);
        
        // Building icon
        ctx.fillStyle = '#000000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🏢', building.position.x, building.position.y + 4);
      });
    }
  }, [gameState.unlockedDistricts, gameState.visitedBuildings]);

  const updatePlayer = useCallback(() => {
    const player = playerRef.current;
    const speed = 3;
    let moved = false;

    if (keys.up) {
      player.y = Math.max(player.height/2, player.y - speed);
      player.direction = 'up';
      moved = true;
    }
    if (keys.down) {
      player.y = Math.min(600 - player.height/2, player.y + speed);
      player.direction = 'down';
      moved = true;
    }
    if (keys.left) {
      player.x = Math.max(player.width/2, player.x - speed);
      player.direction = 'left';
      moved = true;
    }
    if (keys.right) {
      player.x = Math.min(800 - player.width/2, player.x + speed);
      player.direction = 'right';
      moved = true;
    }

    player.moving = moved;

    if (moved) {
      onStateUpdate({
        playerPosition: { x: player.x, y: player.y }
      });
    }
  }, [keys, onStateUpdate]);

  const checkInteractions = useCallback(() => {
    const player = playerRef.current;
    
    districts.forEach(district => {
      const isUnlocked = gameState.unlockedDistricts.includes(district.id);
      if (!isUnlocked) return;
      
      district.buildings.forEach(building => {
        const distance = Math.sqrt(
          Math.pow(player.x - building.position.x, 2) + 
          Math.pow(player.y - building.position.y, 2)
        );
        
        if (distance < 30 && keys.space && !gameState.visitedBuildings.includes(building.id)) {
          // Create sample insight data
          const insight: InsightData = {
            title: `${building.name} Data`,
            description: `Insights from ${building.name} in ${district.name}`,
            data: { value: Math.random() * 100 },
            quote: "AI is transforming how we work and live in BC."
          };
          
          onInsightClick(insight);
          onStateUpdate({
            visitedBuildings: [...gameState.visitedBuildings, building.id],
            discoveredInsights: [...gameState.discoveredInsights, building.id]
          });
        }
      });
    });
  }, [gameState, keys.space, onInsightClick, onStateUpdate]);

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update game state
    updatePlayer();
    checkInteractions();

    // Draw districts
    districts.forEach(district => drawDistrict(ctx, district));

    // Draw player
    drawPlayer(ctx, playerRef.current);

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [updatePlayer, checkInteractions, drawDistrict, drawPlayer]);

  useEffect(() => {
    playerRef.current.x = gameState.playerPosition.x;
    playerRef.current.y = gameState.playerPosition.y;
  }, [gameState.playerPosition]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameLoop]);

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="border border-gradient rounded-lg shadow-elegant bg-black"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
};

export default GameCanvas;