import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useKeyboard } from '@/hooks/useKeyboard';
import type { Building, District, GameState, InsightData } from '@/types/game';

interface Building3DProps {
  building: Building;
  district: District;
  gameState: GameState;
  onInsightClick: (insight: InsightData, buildingType?: string) => void;
  onStateUpdate: (updates: Partial<GameState>) => void;
  position: [number, number, number];
}

const Building3D = ({ 
  building, 
  district, 
  gameState, 
  onInsightClick, 
  onStateUpdate, 
  position 
}: Building3DProps) => {
  const buildingRef = useRef<any>(null);
  const [hovered, setHovered] = useState(false);
  const [isNearby, setIsNearby] = useState(false);
  const keys = useKeyboard();
  const lastInteractionRef = useRef<number>(0);
  
  const isVisited = gameState.visitedBuildings.includes(building.id);
  
  // Building type configurations
  const buildingConfigs = {
    'npc': { height: 2, color: '#4F46E5', icon: '👥' },
    'data-center': { height: 3, color: '#059669', icon: '💾' },
    'mini-game': { height: 2.5, color: '#DC2626', icon: '🎮' },
    'insight': { height: 2, color: '#7C3AED', icon: '💡' }
  };
  
  const config = buildingConfigs[building.type];
  
  useFrame((state) => {
    if (!buildingRef.current) return;
    
    // Check distance to player
    const playerPos = {
      x: gameState.playerPosition.x / 50,
      z: gameState.playerPosition.y / 50
    };
    
    const buildingPos = {
      x: position[0],
      z: position[2]
    };
    
    const distance = Math.sqrt(
      Math.pow(playerPos.x - buildingPos.x, 2) + 
      Math.pow(playerPos.z - buildingPos.z, 2)
    );
    
    const wasNearby = isNearby;
    const nowNearby = distance < 1.5;
    setIsNearby(nowNearby);
    
    // Handle interaction
    if (nowNearby && keys.space) {
      const now = Date.now();
      if (now - lastInteractionRef.current > 500) {
        lastInteractionRef.current = now;
        
        if (building.insight && !isVisited) {
          onInsightClick(building.insight, building.type);
          onStateUpdate({
            visitedBuildings: [...gameState.visitedBuildings, building.id],
            discoveredInsights: [...gameState.discoveredInsights, building.id]
          });
        }
      }
    }
    
    // Floating animation for interactable buildings
    if (nowNearby) {
      buildingRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.1;
    } else {
      buildingRef.current.position.y = position[1];
    }
  });

  return (
    <group 
      ref={buildingRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Building Structure */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, config.height, 1]} />
        <meshStandardMaterial 
          color={isVisited ? '#00ff00' : (isNearby ? '#ffff00' : config.color)}
          emissive={isVisited ? '#00ff00' : (isNearby ? '#ffff00' : config.color)}
          emissiveIntensity={isNearby ? 0.4 : (isVisited ? 0.2 : 0.1)}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      
      {/* Building Top Glow */}
      <mesh position={[0, config.height / 2 + 0.1, 0]}>
        <boxGeometry args={[1.1, 0.1, 1.1]} />
        <meshStandardMaterial 
          color={district.color}
          emissive={district.color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.7}
        />
      </mesh>
      
      {/* Building Type Icon */}
      <Text
        position={[0, config.height / 2 + 0.2, 0.51]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {config.icon}
      </Text>
      
      {/* Building Name (when nearby or hovered) */}
      {(isNearby || hovered) && (
        <Text
          position={[0, config.height + 0.5, 0]}
          fontSize={0.12}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
        >
          {building.name}
        </Text>
      )}
      
      {/* Interaction Hint */}
      {isNearby && !isVisited && (
        <Text
          position={[0, config.height + 1, 0]}
          fontSize={0.1}
          color="#ffff00"
          anchorX="center"
          anchorY="middle"
        >
          Press SPACE
        </Text>
      )}
      
      {/* Visited Checkmark */}
      {isVisited && (
        <Text
          position={[0.7, config.height + 0.3, 0]}
          fontSize={0.2}
          color="#00ff00"
          anchorX="center"
          anchorY="middle"
        >
          ✓
        </Text>
      )}
      
      {/* Interactive Glow Effect */}
      {isNearby && (
        <pointLight
          position={[0, config.height / 2, 0]}
          color="#ffff00"
          intensity={0.8}
          distance={3}
          decay={2}
        />
      )}
    </group>
  );
};

export default Building3D;