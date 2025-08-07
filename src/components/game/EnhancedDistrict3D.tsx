import { useState, useMemo } from 'react';
import { Text, Box } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import type { District, GameState, InsightData } from '@/types/game';
import EnhancedBuilding3D from './EnhancedBuilding3D';

interface EnhancedDistrict3DProps {
  district: District;
  gameState: GameState;
  onInsightClick: (insight: InsightData, buildingType?: string) => void;
  onStateUpdate: (updates: Partial<GameState>) => void;
}

const EnhancedDistrict3D = ({ district, gameState, onInsightClick, onStateUpdate }: EnhancedDistrict3DProps) => {
  const isUnlocked = gameState.unlockedDistricts.includes(district.id);
  const [hovered, setHovered] = useState(false);
  
  // Convert 2D positions to 3D coordinates
  const position3D = [
    district.position.x / 50 - 8,
    0,
    district.position.y / 50 - 6
  ] as [number, number, number];

  // Animated effects for district unlocking and interaction
  const [{ platformY, glowIntensity, borderScale }, springApi] = useSpring(() => ({
    platformY: isUnlocked ? 0 : -0.5,
    glowIntensity: isUnlocked ? 0.3 : 0,
    borderScale: 1,
    config: { tension: 200, friction: 25 }
  }));

  const platformPos = useMemo(() => platformY.to((y) => [0, y, 0] as [number, number, number]), [platformY]);

  // Update animations when hovered
  const handlePointerOver = () => {
    setHovered(true);
    if (isUnlocked) {
      springApi.start({ 
        glowIntensity: 0.6, 
        borderScale: 1.05 
      });
    }
  };

  const handlePointerOut = () => {
    setHovered(false);
    springApi.start({ 
      glowIntensity: isUnlocked ? 0.3 : 0, 
      borderScale: 1 
    });
  };

  return (
    <group position={position3D}>
      {/* Enhanced District Base Platform with Animation */}
      <animated.mesh 
        position={platformPos}
        receiveShadow
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[8, 0.2, 8]} />
        <animated.meshStandardMaterial 
          color={isUnlocked ? district.color : '#333333'}
          emissive={isUnlocked ? district.color : '#000000'}
          emissiveIntensity={glowIntensity}
          transparent
          opacity={isUnlocked ? 0.9 : 0.3}
          roughness={0.2}
          metalness={0.8}
        />
      </animated.mesh>
      
      {/* Animated District Border */}
      <animated.mesh 
        position={[0, 0.2, 0]}
        scale={borderScale}
      >
        <boxGeometry args={[8.4, 0.4, 8.4]} />
        <meshStandardMaterial 
          color={isUnlocked ? district.color : '#666666'}
          wireframe
          transparent
          opacity={hovered && isUnlocked ? 0.9 : 0.6}
        />
      </animated.mesh>
      
      {/* Elevated District Corners */}
      {isUnlocked && (
        <>
          <mesh position={[3.5, 0.5, 3.5]}>
            <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
            <meshStandardMaterial 
              color={district.color}
              emissive={district.color}
              emissiveIntensity={0.4}
            />
          </mesh>
          <mesh position={[-3.5, 0.5, 3.5]}>
            <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
            <meshStandardMaterial 
              color={district.color}
              emissive={district.color}
              emissiveIntensity={0.4}
            />
          </mesh>
          <mesh position={[3.5, 0.5, -3.5]}>
            <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
            <meshStandardMaterial 
              color={district.color}
              emissive={district.color}
              emissiveIntensity={0.4}
            />
          </mesh>
          <mesh position={[-3.5, 0.5, -3.5]}>
            <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
            <meshStandardMaterial 
              color={district.color}
              emissive={district.color}
              emissiveIntensity={0.4}
            />
          </mesh>
        </>
      )}
      
      {/* Enhanced District Name with 3D Effect */}
      <Text
        position={[0, 4, -4.5]}
        fontSize={0.4}
        color={isUnlocked ? '#ffffff' : '#999999'}
        anchorX="center"
        anchorY="middle"
        
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {district.name}
      </Text>
      
      {/* District Description (enhanced visibility) */}
      {hovered && isUnlocked && (
        <Text
          position={[0, 3.2, -4.5]}
          fontSize={0.18}
          color="#cccccc"
          anchorX="center"
          anchorY="middle"
          maxWidth={6}
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          {district.description}
        </Text>
      )}
      
      {/* Enhanced Buildings */}
      {isUnlocked ? (
        district.buildings.map((building, index) => (
          <EnhancedBuilding3D
            key={building.id}
            building={building}
            district={district}
            gameState={gameState}
            onInsightClick={onInsightClick}
            onStateUpdate={onStateUpdate}
            position={[
              (building.position.x - district.position.x) / 50,
              0,
              (building.position.y - district.position.y) / 50
            ]}
          />
        ))
      ) : (
        // Enhanced Lock Display
        <group position={[0, 2, 0]}>
          <mesh>
            <boxGeometry args={[1.5, 1.5, 0.3]} />
            <meshStandardMaterial 
              color="#444444"
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          <Text
            position={[0, 0, 0.16]}
            fontSize={0.8}
            color="#999999"
            anchorX="center"
            anchorY="middle"
          >
            🔒
          </Text>
          <Text
            position={[0, -1, 0]}
            fontSize={0.15}
            color="#666666"
            anchorX="center"
            anchorY="middle"
          >
            Locked District
          </Text>
        </group>
      )}
      
      {/* Enhanced Atmospheric Effects */}
      {isUnlocked && (
        <>
          <pointLight
            position={[0, 6, 0]}
            color={district.color}
            intensity={hovered ? 1.2 : 0.8}
            distance={12}
            decay={2}
          />
          {/* Ambient district lighting */}
          <spotLight
            position={[0, 8, 0]}
            color={district.color}
            intensity={0.3}
            distance={15}
            angle={Math.PI / 3}
            penumbra={0.5}
            decay={2}
          />
        </>
      )}
      
      {/* District Progress Indicator */}
      {isUnlocked && (
        <mesh position={[0, 0.3, 4]}>
          <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
          <meshStandardMaterial 
            color={district.buildings.every(b => gameState.visitedBuildings.includes(b.id)) ? '#00ff00' : '#ffff00'}
            emissive={district.buildings.every(b => gameState.visitedBuildings.includes(b.id)) ? '#00ff00' : '#ffff00'}
            emissiveIntensity={0.3}
          />
        </mesh>
      )}
    </group>
  );
};

export default EnhancedDistrict3D;