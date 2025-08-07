import { useRef, useEffect, Suspense, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Sky, Environment, Text } from '@react-three/drei';
import { useKeyboard } from '@/hooks/useKeyboard';
import { gameDistricts } from '@/utils/gameData';
import type { GameState, InsightData } from '@/types/game';
import EnhancedPlayer3D from './EnhancedPlayer3D';
import EnhancedDistrict3D from './EnhancedDistrict3D';
import GameUI3D from './GameUI3D';
import EnvironmentController3D from './EnvironmentController3D';
import SettingsPanel3D from './SettingsPanel3D';
import PauseMenu3D from './PauseMenu3D';
import { Button } from '@/components/ui/button';

// Expose a capture function from inside the Canvas
const CaptureController = ({ onReady }: { onReady: (fn: () => string) => void }) => {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    const fn = () => {
      gl.render(scene, camera);
      return gl.domElement.toDataURL('image/png');
    };
    onReady(fn);
  }, [gl, scene, camera, onReady]);
  return null;
};

interface GameCanvas3DProps {
  gameState: GameState;
  onInsightClick: (insight: InsightData, buildingType?: string) => void;
  onStateUpdate: (updates: Partial<GameState>) => void;
}

const GameCanvas3D = ({ gameState, onInsightClick, onStateUpdate }: GameCanvas3DProps) => {
  // Environment & view settings
  const [isRaining, setIsRaining] = useState(true);
  const [cycleSpeed, setCycleSpeed] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [fov, setFov] = useState(60);
  const [paused, setPaused] = useState(false);
  const [photoMode, setPhotoMode] = useState(false);
  const [doCapture, setDoCapture] = useState<(() => string) | null>(null);

  // Toggle pause with Escape key and photo mode with H
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPaused(p => !p);
      if (e.key.toLowerCase() === 'h') setPhotoMode(m => !m);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Persist settings
  useEffect(() => {
    const saved = localStorage.getItem('bc-ai-quest-settings');
    if (saved) {
      try {
        const s = JSON.parse(saved);
        setIsRaining(s.isRaining ?? true);
        setCycleSpeed(s.cycleSpeed ?? 1);
        setShowGrid(s.showGrid ?? true);
        setFov(s.fov ?? 60);
      } catch {}
    }
  }, []);
  useEffect(() => {
    const s = { isRaining, cycleSpeed, showGrid, fov };
    localStorage.setItem('bc-ai-quest-settings', JSON.stringify(s));
  }, [isRaining, cycleSpeed, showGrid, fov]);

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
          <EnvironmentController3D isRaining={isRaining} cycleSpeed={cycleSpeed} />
          <CaptureController onReady={setDoCapture} />
          {photoMode && <OrbitControls makeDefault enableDamping dampingFactor={0.1} />}

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
          {showGrid && (<gridHelper args={[100, 50, '#333333', '#333333']} position={[0, 0, 0]} />)}
          
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
            paused={paused}
            fov={fov}
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
      {!photoMode && <GameUI3D gameState={gameState} />}

      {/* Floating Controls */}
      <div className="absolute top-4 left-4 z-20 flex gap-2">
        {!photoMode ? (
          <>
            <Button size="sm" variant="secondary" onClick={() => setPaused(true)}>Pause</Button>
            <Button size="sm" onClick={() => { setPhotoMode(true); setPaused(true); }}>Photo Mode</Button>
          </>
        ) : (
          <>
            <Button size="sm" variant="secondary" onClick={() => { setPhotoMode(false); setPaused(false); }}>Exit Photo</Button>
            <Button size="sm" onClick={() => { const url = doCapture?.(); if (url) { const a = document.createElement('a'); a.href = url; a.download = 'bc-ai-quest.png'; a.click(); } }}>Capture</Button>
          </>
        )}
      </div>
      {!photoMode && (
        <div className="absolute top-4 right-4 z-20">
          <SettingsPanel3D
            isRaining={isRaining}
            onToggleRaining={() => setIsRaining(v => !v)}
            cycleSpeed={cycleSpeed}
            onChangeCycleSpeed={setCycleSpeed}
            showGrid={showGrid}
            onToggleGrid={() => setShowGrid(v => !v)}
            fov={fov}
            onChangeFov={setFov}
          />
        </div>
      )}

      {/* Pause Overlay */}
      {paused && (
        <PauseMenu3D
          paused={paused}
          onResume={() => setPaused(false)}
        />
      )}
    </div>
  );
};

export default GameCanvas3D;
