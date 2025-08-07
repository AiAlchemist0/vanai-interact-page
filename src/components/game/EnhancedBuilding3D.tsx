import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import { useKeyboard } from '@/hooks/useKeyboard';
import type { Building, District, GameState, InsightData } from '@/types/game';
import { gameDistricts } from '@/utils/gameData';
import Chart3D from './Chart3D';

interface EnhancedBuilding3DProps {
  building: Building;
  district: District;
  gameState: GameState;
  onInsightClick: (insight: InsightData, buildingType?: string) => void;
  onStateUpdate: (updates: Partial<GameState>) => void;
  position: [number, number, number];
}

const EnhancedBuilding3D = ({ 
  building, 
  district, 
  gameState, 
  onInsightClick, 
  onStateUpdate, 
  position 
}: EnhancedBuilding3DProps) => {
  const buildingRef = useRef<any>(null);
  const [hovered, setHovered] = useState(false);
  const [isNearby, setIsNearby] = useState(false);
  const [interactionCooldown, setInteractionCooldown] = useState(false);
  const keys = useKeyboard();
  const lastInteractionRef = useRef<number>(0);
  
  const isVisited = gameState.visitedBuildings.includes(building.id);
  
  // Enhanced building type configurations with multiple levels
  const buildingConfigs = {
    'npc': { 
      height: 3, 
      width: 1.2, 
      color: '#4F46E5', 
      icon: '👥',
      levels: 2,
      style: 'residential'
    },
    'data-center': { 
      height: 4.5, 
      width: 1.5, 
      color: '#059669', 
      icon: '💾',
      levels: 3,
      style: 'corporate'
    },
    'mini-game': { 
      height: 3.5, 
      width: 1.3, 
      color: '#DC2626', 
      icon: '🎮',
      levels: 2,
      style: 'entertainment'
    },
    'insight': { 
      height: 2.8, 
      width: 1.1, 
      color: '#7C3AED', 
      icon: '💡',
      levels: 2,
      style: 'research'
    }
  };
  
  const config = buildingConfigs[building.type];
  
  // Animated properties with enhanced effects
  const [{ scale, elevationY, glowIntensity, rotationY }, springApi] = useSpring(() => ({
    scale: 1,
    elevationY: 0,
    glowIntensity: 0.1,
    rotationY: 0,
    config: { tension: 300, friction: 20 }
  }));

  useFrame((state) => {
    if (!buildingRef.current) return;
    
    // Enhanced distance check with different interaction zones
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
    const nowNearby = distance < 2;
    const veryClose = distance < 1.2;
    
    setIsNearby(nowNearby);
    
    // Smooth animation transitions
    if (nowNearby && !wasNearby) {
      springApi.start({ 
        scale: 1.1, 
        elevationY: 0.2,
        glowIntensity: veryClose ? 0.8 : 0.5
      });
    } else if (!nowNearby && wasNearby) {
      springApi.start({ 
        scale: 1, 
        elevationY: 0,
        glowIntensity: 0.1
      });
    }
    
    // Handle interaction with enhanced feedback
    if (veryClose && keys.space && !interactionCooldown) {
      const now = Date.now();
      if (now - lastInteractionRef.current > 500) {
        lastInteractionRef.current = now;
        setInteractionCooldown(true);
        
        // Interaction animation
        springApi.start({ 
          scale: 1.3,
          rotationY: Math.PI * 2
        });
        
        setTimeout(() => {
          springApi.start({ 
            scale: 1.1,
            rotationY: 0
          });
          setInteractionCooldown(false);
        }, 300);
        
        if (building.insight && !isVisited) {
          onInsightClick(building.insight, building.type);
          onStateUpdate({
            visitedBuildings: [...gameState.visitedBuildings, building.id],
            discoveredInsights: [...gameState.discoveredInsights, building.id]
          });

          // District progression: unlock next district when all buildings in current are visited
          const currentVisited = [...gameState.visitedBuildings, building.id];
          const allVisited = district.buildings.every(b => currentVisited.includes(b.id));
          if (allVisited) {
            const order = gameDistricts.map(d => d.id);
            const currentIndex = order.indexOf(district.id);
            const nextId = order[currentIndex + 1];
            if (nextId && !gameState.unlockedDistricts.includes(nextId)) {
              onStateUpdate({
                unlockedDistricts: [...gameState.unlockedDistricts, nextId]
              });
            }
          }
        }
      }
    }
    
    // Subtle idle floating animation
    if (!nowNearby) {
      buildingRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0] * 5) * 0.05;
    }
  });

  return (
    <animated.group 
      ref={buildingRef}
      position={position}
      scale={scale}
      rotation-y={rotationY}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Multi-level Building Structure */}
      {Array.from({ length: config.levels }).map((_, level) => (
        <animated.mesh 
          key={level}
          position={[0, level * (config.height / config.levels) + (config.height / config.levels) / 2, 0]}
          position-y={level * (config.height / config.levels) + (config.height / config.levels) / 2}
          castShadow 
          receiveShadow
        >
          <boxGeometry args={[
            config.width - (level * 0.1), 
            config.height / config.levels, 
            config.width - (level * 0.1)
          ]} />
          <animated.meshStandardMaterial 
            color={isVisited ? '#00ff00' : (isNearby ? '#ffff00' : config.color)}
            emissive={isVisited ? '#00ff00' : (isNearby ? '#ffff00' : config.color)}
            emissiveIntensity={glowIntensity}
            roughness={0.2}
            metalness={0.8}
            transparent={level > 0}
            opacity={level > 0 ? 0.9 : 1}
          />
        </animated.mesh>
      ))}
      
      {/* Building Top Features */}
      <animated.mesh position={[0, config.height + 0.2, 0]} position-y={elevationY}>
        <cylinderGeometry args={[0.2, 0.2, 0.2, 8]} />
        <meshStandardMaterial 
          color={district.color}
          emissive={district.color}
          emissiveIntensity={0.8}
        />
      </animated.mesh>
      
      {/* Enhanced Building Type Icon with Background */}
      <group position={[0, config.height / 2 + 0.3, config.width / 2 + 0.1]}>
        <mesh>
          <circleGeometry args={[0.3, 16]} />
          <meshStandardMaterial 
            color="#000000"
            transparent
            opacity={0.7}
          />
        </mesh>
        <Text
          position={[0, 0, 0.01]}
          fontSize={0.4}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {config.icon}
        </Text>
      </group>
      
      {/* Building Name with Enhanced Visibility */}
      {(isNearby || hovered) && (
        <Text
          position={[0, config.height + 0.8, 0]}
          fontSize={0.15}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={3}
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {building.name}
        </Text>
      )}
      
      {/* Enhanced Interaction Hint */}
      {isNearby && !isVisited && (
        <animated.group position={[0, config.height + 1.3, 0]}>
          <Text
            fontSize={0.12}
            color="#ffff00"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.01}
            outlineColor="#000000"
          >
            {interactionCooldown ? 'Processing...' : 'Press SPACE to Interact'}
          </Text>
          {/* Pulsing interaction indicator */}
          <mesh position={[0, -0.3, 0]}>
            <ringGeometry args={[0.2, 0.3, 16]} />
            <meshStandardMaterial 
              color="#ffff00"
              transparent
              opacity={0.6}
              emissive="#ffff00"
              emissiveIntensity={0.4}
            />
          </mesh>
        </animated.group>
      )}
      
      {/* Enhanced Visited Indicator */}
      {isVisited && (
        <group position={[config.width / 2 + 0.3, config.height + 0.3, 0]}>
          <mesh>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial 
              color="#00ff00"
              emissive="#00ff00"
              emissiveIntensity={0.5}
            />
          </mesh>
          <Text
            position={[0, 0, 0.21]}
            fontSize={0.25}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            ✓
          </Text>
        </group>
      )}
      
      {/* Enhanced Interactive Effects */}
      {isNearby && (
        <>
          {/* Ground entrance hotspot */}
          <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.6, 0.8, 24]} />
            <meshStandardMaterial color="#ffff00" transparent opacity={0.4} emissive="#ffff00" emissiveIntensity={0.5} />
          </mesh>

          <pointLight
            position={[0, config.height / 2, 0]}
            color="#ffff00"
            intensity={1.2}
            distance={4}
            decay={2}
          />
          {/* Energy field effect */}
          <mesh position={[0, config.height / 2, 0]}>
            <sphereGeometry args={[config.width * 0.8, 16, 16]} />
            <meshStandardMaterial 
              color="#ffff00"
              transparent
              opacity={0.1}
              emissive="#ffff00"
              emissiveIntensity={0.2}
            />
          </mesh>

          {/* In-world 3D chart preview */}
          {building.insight && (
            <group position={[0, config.height + 1.8, 0]}>
              <Chart3D insight={building.insight} />
            </group>
          )}
        </>
      )}
      
      {/* Building Windows/Details */}
      {config.levels > 1 && Array.from({ length: config.levels }).map((_, level) => (
        <group key={`windows-${level}`}>
          <mesh position={[config.width / 2 - 0.05, level * (config.height / config.levels) + 0.5, 0.2]}>
            <boxGeometry args={[0.1, 0.3, 0.1]} />
            <meshStandardMaterial 
              color="#87CEEB"
              emissive="#87CEEB"
              emissiveIntensity={0.3}
              transparent
              opacity={0.8}
            />
          </mesh>
          <mesh position={[-config.width / 2 + 0.05, level * (config.height / config.levels) + 0.5, 0.2]}>
            <boxGeometry args={[0.1, 0.3, 0.1]} />
            <meshStandardMaterial 
              color="#87CEEB"
              emissive="#87CEEB"
              emissiveIntensity={0.3}
              transparent
              opacity={0.8}
            />
          </mesh>
        </group>
      ))}
    </animated.group>
  );
};

export default EnhancedBuilding3D;