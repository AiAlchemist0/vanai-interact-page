import { useState } from 'react';
import { Text, Box } from '@react-three/drei';
import type { District, GameState, InsightData } from '@/types/game';
import Building3D from './Building3D';

interface District3DProps {
  district: District;
  gameState: GameState;
  onInsightClick: (insight: InsightData, buildingType?: string) => void;
  onStateUpdate: (updates: Partial<GameState>) => void;
}

const District3D = ({ district, gameState, onInsightClick, onStateUpdate }: District3DProps) => {
  const isUnlocked = gameState.unlockedDistricts.includes(district.id);
  const [hovered, setHovered] = useState(false);
  
  // Convert 2D positions to 3D coordinates
  const position3D = [
    district.position.x / 50 - 8, // Scale and center
    0,
    district.position.y / 50 - 6
  ] as [number, number, number];

  return (
    <group position={position3D}>
      {/* District Base Platform */}
      <mesh 
        position={[0, -0.05, 0]} 
        receiveShadow
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[6, 0.1, 6]} />
        <meshStandardMaterial 
          color={isUnlocked ? district.color : '#333333'}
          emissive={isUnlocked ? district.color : '#000000'}
          emissiveIntensity={hovered && isUnlocked ? 0.3 : 0.1}
          transparent
          opacity={isUnlocked ? 0.8 : 0.3}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      
      {/* District Border */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[6.2, 0.2, 6.2]} />
        <meshStandardMaterial 
          color={isUnlocked ? district.color : '#666666'}
          wireframe
          transparent
          opacity={0.6}
        />
      </mesh>
      
      {/* District Name */}
      <Text
        position={[0, 3, -3.5]}
        fontSize={0.3}
        color={isUnlocked ? '#ffffff' : '#999999'}
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        {district.name}
      </Text>
      
      {/* District Description (when hovered) */}
      {hovered && isUnlocked && (
        <Text
          position={[0, 2.5, -3.5]}
          fontSize={0.15}
          color="#cccccc"
          anchorX="center"
          anchorY="middle"
          maxWidth={4}
        >
          {district.description}
        </Text>
      )}
      
      {/* Buildings */}
      {isUnlocked ? (
        district.buildings.map((building, index) => (
          <Building3D
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
        // Lock icon for locked districts
        <mesh position={[0, 2, 0]}>
          <boxGeometry args={[1, 1, 0.2]} />
          <meshStandardMaterial color="#666666" />
          <Text
            position={[0, 0, 0.11]}
            fontSize={0.5}
            color="#999999"
            anchorX="center"
            anchorY="middle"
          >
            🔒
          </Text>
        </mesh>
      )}
      
      {/* Atmospheric Effects */}
      {isUnlocked && (
        <pointLight
          position={[0, 5, 0]}
          color={district.color}
          intensity={0.5}
          distance={10}
          decay={2}
        />
      )}
    </group>
  );
};

export default District3D;