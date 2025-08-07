import { useRef, useEffect, Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, Environment, Text } from '@react-three/drei';
import { useKeyboard } from '@/hooks/useKeyboard';
import { gameDistricts } from '@/utils/gameData';
import type { GameState, InsightData } from '@/types/game';
import EnhancedPlayer3D from './EnhancedPlayer3D';
import EnhancedDistrict3D from './EnhancedDistrict3D';
import GameUI3D from './GameUI3D';

interface GameCanvas3DProps {
  gameState: GameState;
  onInsightClick: (insight: InsightData, buildingType?: string) => void;
  onStateUpdate: (updates: Partial<GameState>) => void;
}

const GameCanvas3D = ({ gameState, onInsightClick, onStateUpdate }: GameCanvas3DProps) => {
  // Precompute simple collision obstacles for buildings
  const obstacles = gameDistricts.flatMap(d => d.buildings.map(b => {
    const districtPos = { x: d.position.x / 50 - 8, z: d.position.y / 50 - 6 };
    const localPos = { x: (b.position.x - d.position.x) / 50, z: (b.position.y - d.position.y) / 50 };
    return { x: districtPos.x + localPos.x, z: districtPos.z + localPos.z, radius: 0.6 };
  }));
  
  return (
  <div className="flex-1 relative">
      <Canvas
        camera={{ 
          position: [20, 15, 20], 
          fov: 60,
          near: 0.1,
          far: 1000
        }}
        shadows
        className="bg-gradient-to-b from-slate-900 to-slate-800"
      >
        <Suspense fallback={null}>
          {/* Lighting Setup */}
          <ambientLight intensity={0.3} />
          <directionalLight
            position={[50, 50, 25]}
            intensity={1}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-left={-50}
            shadow-camera-right={50}
            shadow-camera-top={50}
            shadow-camera-bottom={-50}
          />
          
          {/* Environment */}
          <Sky
            distance={450000}
            sunPosition={[0, 1, 0]}
            inclination={0}
            azimuth={0.25}
          />
          
          {/* Ground Plane */}
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -0.1, 0]}
            receiveShadow
          >
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial 
              color="#1a1a1a" 
              roughness={0.8}
              metalness={0.1}
            />
          </mesh>
          
          {/* Grid Pattern */}
          <gridHelper args={[100, 50, '#333333', '#333333']} position={[0, 0, 0]} />
          
          {/* Enhanced Districts */}
          {gameDistricts.map((district) => (
            <EnhancedDistrict3D
              key={district.id}
              district={district}
              gameState={gameState}
              onInsightClick={onInsightClick}
              onStateUpdate={onStateUpdate}
            />
          ))}
          
          {/* Enhanced Player */}
          <EnhancedPlayer3D
            gameState={gameState}
            onStateUpdate={onStateUpdate}
            obstacles={obstacles}
          />
          
          {/* Title */}
          <Text
            position={[0, 8, -20]}
            fontSize={2}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            font="/fonts/Inter-Bold.woff"
          >
            BC AI Quest - 3D World
          </Text>
          
          {/* Enhanced Camera Controls - Now camera is controlled by player */}
          {/* OrbitControls disabled when player is active */}
        </Suspense>
      </Canvas>
      
      {/* 3D UI Overlay */}
      <GameUI3D gameState={gameState} />
    </div>
  );
};

export default GameCanvas3D;