import { useRef, useEffect, Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, Environment, Text } from '@react-three/drei';
import { useKeyboard } from '@/hooks/useKeyboard';
import { gameDistricts } from '@/utils/gameData';
import type { GameState, InsightData } from '@/types/game';
import Player3D from './Player3D';
import District3D from './District3D';
import GameUI3D from './GameUI3D';

interface GameCanvas3DProps {
  gameState: GameState;
  onInsightClick: (insight: InsightData, buildingType?: string) => void;
  onStateUpdate: (updates: Partial<GameState>) => void;
}

const GameCanvas3D = ({ gameState, onInsightClick, onStateUpdate }: GameCanvas3DProps) => {
  const [cameraTarget, setCameraTarget] = useState([0, 0, 0]);
  
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
          
          {/* Districts */}
          {gameDistricts.map((district) => (
            <District3D
              key={district.id}
              district={district}
              gameState={gameState}
              onInsightClick={onInsightClick}
              onStateUpdate={onStateUpdate}
            />
          ))}
          
          {/* Player */}
          <Player3D
            gameState={gameState}
            onStateUpdate={onStateUpdate}
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
          
          {/* Camera Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={10}
            maxDistance={50}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.2}
          />
        </Suspense>
      </Canvas>
      
      {/* 3D UI Overlay */}
      <GameUI3D gameState={gameState} />
    </div>
  );
};

export default GameCanvas3D;