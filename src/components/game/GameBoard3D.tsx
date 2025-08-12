import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import NoteHighway from './NoteHighway';
import HitEffects, { HitEffect } from './HitEffects';
import FloatingText, { FloatingTextItem } from './FloatingText';
import { NotePattern } from '@/pages/Game';

interface GameBoard3DProps {
  activeNotes: NotePattern[];
  currentTime: number;
  pressedFrets: Set<number>;
  combo: number;
  hitEffects: HitEffect[];
  floatingTexts: FloatingTextItem[];
  onEffectComplete: (id: string) => void;
  onTextComplete: (id: string) => void;
}

const GameBoard3D = ({ 
  activeNotes, 
  currentTime, 
  pressedFrets,
  combo,
  hitEffects, 
  floatingTexts,
  onEffectComplete,
  onTextComplete 
}: GameBoard3DProps) => {
  return (
    <div className="w-full h-full">
      <Canvas
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        style={{ 
          width: '100%', 
          height: '100%',
          background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)'
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 4, 10]} fov={75} />
        
        {/* Lighting Setup */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1.2}
          color="#ffffff"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[0, 2, 0]} intensity={0.8} color="#00ffff" />
        <pointLight position={[-3, 3, -3]} intensity={0.4} color="#ff00ff" />
        <pointLight position={[3, 3, -3]} intensity={0.4} color="#ffff00" />

        {/* Note Highway */}
        <NoteHighway 
          activeNotes={activeNotes}
          currentTime={currentTime}
          pressedFrets={pressedFrets}
          combo={combo}
        />

        {/* Hit Effects */}
        <HitEffects 
          effects={hitEffects}
          onEffectComplete={onEffectComplete}
        />

        {/* Floating Score Text */}
        <FloatingText 
          texts={floatingTexts}
          onTextComplete={onTextComplete}
        />
      </Canvas>
      
      {/* Canvas Status Indicator */}
      <div className="absolute top-4 right-4 bg-green-500 w-3 h-3 rounded-full animate-pulse"></div>
    </div>
  );
};

export default GameBoard3D;