import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import NoteHighway from './NoteHighway';
import HitEffects, { HitEffect } from './HitEffects';
import FloatingText, { FloatingTextItem } from './FloatingText';
import StarPowerEffects from './StarPowerEffects';
import Atmosphere from './Atmosphere';
import { NotePattern } from '@/pages/Game';
import { useIsMobile } from '@/hooks/use-mobile';

interface GameBoard3DProps {
  activeNotes: NotePattern[];
  currentTime: number;
  pressedFrets: Set<number>;
  combo: number;
  hitEffects: HitEffect[];
  floatingTexts: FloatingTextItem[];
  onEffectComplete: (id: string) => void;
  onTextComplete: (id: string) => void;
  noteSpeed: number;
  hitWindow: {
    perfect: number;
    good: number;
    okay: number;
  };
  starPower: {
    isActive: boolean;
    energy: number;
    duration: number;
    maxDuration: number;
  };
  hitFlashTimes: Set<number>;
}

const GameBoard3D = ({ 
  activeNotes, 
  currentTime, 
  pressedFrets,
  combo,
  hitEffects, 
  floatingTexts,
  onEffectComplete,
  onTextComplete,
  noteSpeed,
  hitWindow,
  starPower,
  hitFlashTimes
}: GameBoard3DProps) => {
  const isMobile = useIsMobile();
  return (
    <div className="w-full h-full overflow-hidden">
      <Canvas
        gl={{ 
          antialias: !isMobile, 
          alpha: false,
          powerPreference: isMobile ? "low-power" : "high-performance"
        }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        style={{ 
          width: '100%', 
          height: '100%',
          background: starPower.isActive ? 'var(--gradient-warm)' : 'var(--gradient-secondary)'
        }}
      >
        <PerspectiveCamera 
          makeDefault 
          position={isMobile ? [0, 16, 12] : [0, 18, 14]} 
          rotation={[-0.85, 0, 0]} 
          fov={isMobile ? 65 : 55} 
        />
        
        {/* Optimized Lighting Setup - reduced for performance */}
        <ambientLight intensity={starPower.isActive ? 0.5 : 0.3} />
        <directionalLight 
          position={[5, 8, 3]} 
          intensity={starPower.isActive ? 1.5 : 1.0}
          color={starPower.isActive ? "#fff8dc" : "#ffffff"}
          castShadow={false}
        />
        <pointLight 
          position={[0, 2, 0]} 
          intensity={starPower.isActive ? 1.0 : 0.6} 
          color={starPower.isActive ? "#ffd700" : "#00ffff"} 
        />

        {/* Scene content wrapper with responsive scaling */}
        <group 
          position={[0, 1.5, 0]} 
          scale={isMobile ? [1, 1, 1] : [1.25, 1, 1]}
        >
          {/* Atmosphere and Background */}
          <Atmosphere 
            intensity={Math.min(combo / 50, 1)}
            isStarPowerActive={starPower.isActive}
          />

          {/* Note Highway */}
          <NoteHighway 
            activeNotes={activeNotes}
            currentTime={currentTime}
            pressedFrets={pressedFrets}
            combo={combo}
            noteSpeed={noteSpeed}
            hitWindow={hitWindow}
            hitFlashTimes={hitFlashTimes}
            isStarPowerActive={starPower.isActive}
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

          {/* Star Power Effects */}
          <StarPowerEffects 
            isActive={starPower.isActive}
            energy={starPower.energy}
            duration={starPower.duration}
            maxDuration={starPower.maxDuration}
          />
        </group>
      </Canvas>
      
      {/* Canvas Status Indicator removed */}
    </div>
  );
};

export default GameBoard3D;