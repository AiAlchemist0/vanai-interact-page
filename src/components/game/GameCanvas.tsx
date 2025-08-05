import { useRef, useEffect, useCallback } from 'react';
import { useKeyboard } from '@/hooks/useKeyboard';
import { gameDistricts } from '@/utils/gameData';
import type { GameState, InsightData, PlayerSprite, District, Building } from '@/types/game';

interface GameCanvasProps {
  gameState: GameState;
  onInsightClick: (insight: InsightData) => void;
  onStateUpdate: (updates: Partial<GameState>) => void;
}

const GameCanvas = ({ gameState, onInsightClick, onStateUpdate }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const keys = useKeyboard();
  const lastInteractionRef = useRef<number>(0);
  
  const playerRef = useRef<PlayerSprite>({
    x: gameState.playerPosition.x,
    y: gameState.playerPosition.y,
    width: 32,
    height: 32,
    moving: false,
    direction: 'down'
  });

  const drawBackground = useCallback((ctx: CanvasRenderingContext2D) => {
    // Draw grid pattern
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    
    for (let x = 0; x <= 800; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 600);
      ctx.stroke();
    }
    
    for (let y = 0; y <= 600; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(800, y);
      ctx.stroke();
    }
  }, []);

  const drawDistrict = useCallback((ctx: CanvasRenderingContext2D, district: District) => {
    const isUnlocked = gameState.unlockedDistricts.includes(district.id);
    const playerDistance = Math.sqrt(
      Math.pow(playerRef.current.x - district.position.x, 2) + 
      Math.pow(playerRef.current.y - district.position.y, 2)
    );
    const isNearby = playerDistance < 100;
    
    // District area with glow effect
    if (isUnlocked) {
      ctx.shadowColor = district.color;
      ctx.shadowBlur = isNearby ? 20 : 10;
    } else {
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    }
    
    ctx.fillStyle = isUnlocked ? district.color + '30' : '#333333';
    ctx.fillRect(district.position.x - 80, district.position.y - 80, 160, 160);
    
    // District border
    ctx.shadowBlur = 0;
    ctx.strokeStyle = isUnlocked ? district.color : '#666666';
    ctx.lineWidth = isNearby ? 3 : 2;
    ctx.strokeRect(district.position.x - 80, district.position.y - 80, 160, 160);
    
    // District name
    ctx.fillStyle = isUnlocked ? '#ffffff' : '#999999';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(district.name, district.position.x, district.position.y - 90);
    
    // District description (when nearby)
    if (isNearby && isUnlocked) {
      ctx.fillStyle = '#cccccc';
      ctx.font = '10px Arial';
      ctx.fillText(district.description, district.position.x, district.position.y - 75);
    }
    
    // Buildings
    if (isUnlocked) {
      district.buildings.forEach((building) => {
        drawBuilding(ctx, building, district);
      });
    } else {
      // Lock icon for locked districts
      ctx.fillStyle = '#666666';
      ctx.font = '32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🔒', district.position.x, district.position.y + 10);
    }
  }, [gameState.unlockedDistricts, gameState.visitedBuildings]);

  const drawBuilding = useCallback((ctx: CanvasRenderingContext2D, building: Building, district: District) => {
    const isVisited = gameState.visitedBuildings.includes(building.id);
    const playerDistance = Math.sqrt(
      Math.pow(playerRef.current.x - building.position.x, 2) + 
      Math.pow(playerRef.current.y - building.position.y, 2)
    );
    const isInteractable = playerDistance < 25;
    
    // Building glow when interactable
    if (isInteractable) {
      ctx.shadowColor = '#ffff00';
      ctx.shadowBlur = 15;
    } else {
      ctx.shadowBlur = 0;
    }
    
    // Building base
    ctx.fillStyle = isVisited ? '#00ff00' : (isInteractable ? '#ffff00' : '#888888');
    ctx.fillRect(building.position.x - 12, building.position.y - 12, 24, 24);
    
    ctx.shadowBlur = 0;
    ctx.strokeStyle = district.color;
    ctx.lineWidth = isInteractable ? 2 : 1;
    ctx.strokeRect(building.position.x - 12, building.position.y - 12, 24, 24);
    
    // Building type icon
    const icons = {
      'npc': '👥',
      'data-center': '💾',
      'mini-game': '🎮',
      'insight': '💡'
    };
    
    ctx.fillStyle = '#000000';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(icons[building.type], building.position.x, building.position.y + 5);
    
    // Building name (when nearby)
    if (isInteractable) {
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px Arial';
      ctx.fillText(building.name, building.position.x, building.position.y - 20);
      
      // Interaction hint
      ctx.fillStyle = '#ffff00';
      ctx.font = '8px Arial';
      ctx.fillText('Press SPACE', building.position.x, building.position.y + 30);
    }
    
    // Checkmark for visited buildings
    if (isVisited) {
      ctx.fillStyle = '#00ff00';
      ctx.font = '12px Arial';
      ctx.fillText('✓', building.position.x + 15, building.position.y - 10);
    }
  }, [gameState.visitedBuildings]);

  const drawPlayer = useCallback((ctx: CanvasRenderingContext2D, player: PlayerSprite) => {
    // Player shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.ellipse(player.x, player.y + 20, 12, 6, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Player character with glow
    ctx.shadowColor = gameState.selectedCharacter?.color || '#3B82F6';
    ctx.shadowBlur = 10;
    
    ctx.fillStyle = gameState.selectedCharacter?.color || '#3B82F6';
    ctx.fillRect(player.x - player.width/2, player.y - player.height/2, player.width, player.height);
    
    ctx.shadowBlur = 0;
    
    // Character emoji
    ctx.font = '28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(
      gameState.selectedCharacter?.avatar || '🤖',
      player.x,
      player.y + 8
    );
    
    // Movement indicator
    if (player.moving) {
      ctx.strokeStyle = gameState.selectedCharacter?.color || '#3B82F6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.width/2 + 5, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }, [gameState.selectedCharacter]);

  const drawUI = useCallback((ctx: CanvasRenderingContext2D) => {
    // Mini-map in top-right corner
    const mapSize = 120;
    const mapX = 800 - mapSize - 10;
    const mapY = 10;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(mapX, mapY, mapSize, mapSize);
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(mapX, mapY, mapSize, mapSize);
    
    // Districts on mini-map
    gameDistricts.forEach(district => {
      const miniX = mapX + (district.position.x / 800) * mapSize;
      const miniY = mapY + (district.position.y / 600) * mapSize;
      
      ctx.fillStyle = gameState.unlockedDistricts.includes(district.id) ? 
        district.color : '#666666';
      ctx.fillRect(miniX - 8, miniY - 6, 16, 12);
    });
    
    // Player on mini-map
    const playerMiniX = mapX + (playerRef.current.x / 800) * mapSize;
    const playerMiniY = mapY + (playerRef.current.y / 600) * mapSize;
    
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(playerMiniX, playerMiniY, 3, 0, 2 * Math.PI);
    ctx.fill();
  }, [gameState.unlockedDistricts]);

  const updatePlayer = useCallback(() => {
    const player = playerRef.current;
    const speed = 4;
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
    const now = Date.now();
    if (now - lastInteractionRef.current < 500) return; // Debounce interactions
    
    const player = playerRef.current;
    
    gameDistricts.forEach(district => {
      const isUnlocked = gameState.unlockedDistricts.includes(district.id);
      if (!isUnlocked) return;
      
      district.buildings.forEach(building => {
        const distance = Math.sqrt(
          Math.pow(player.x - building.position.x, 2) + 
          Math.pow(player.y - building.position.y, 2)
        );
        
        if (distance < 25 && keys.space) {
          lastInteractionRef.current = now;
          
          if (building.insight && !gameState.visitedBuildings.includes(building.id)) {
            onInsightClick(building.insight);
            onStateUpdate({
              visitedBuildings: [...gameState.visitedBuildings, building.id],
              discoveredInsights: [...gameState.discoveredInsights, building.id]
            });
            
            // Unlock adjacent districts based on progress
            checkDistrictUnlocks();
          }
        }
      });
    });
  }, [gameState, keys.space, onInsightClick, onStateUpdate]);

  const checkDistrictUnlocks = useCallback(() => {
    const discoveredCount = gameState.discoveredInsights.length;
    const unlockThresholds = {
      'business-quarter': 1,
      'creative-district': 2,
      'government-center': 3,
      'medical-campus': 4,
      'education-zone': 5
    };
    
    Object.entries(unlockThresholds).forEach(([districtId, threshold]) => {
      if (discoveredCount >= threshold && !gameState.unlockedDistricts.includes(districtId)) {
        onStateUpdate({
          unlockedDistricts: [...gameState.unlockedDistricts, districtId]
        });
      }
    });
  }, [gameState.discoveredInsights.length, gameState.unlockedDistricts, onStateUpdate]);

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with dark background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw background grid
    drawBackground(ctx);

    // Update game state
    updatePlayer();
    checkInteractions();

    // Draw game elements
    gameDistricts.forEach(district => drawDistrict(ctx, district));
    drawPlayer(ctx, playerRef.current);
    drawUI(ctx);

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [drawBackground, drawDistrict, drawPlayer, drawUI, updatePlayer, checkInteractions]);

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
        className="border border-gradient rounded-lg shadow-elegant bg-black cursor-crosshair"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
};

export default GameCanvas;