import { Canvas } from '@react-three/fiber';
import { Environment, PerspectiveCamera, Effects } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import NoteHighway from './NoteHighway';
import Background3D from './Background3D';
import { NotePattern } from '@/pages/Game';

interface GameBoard3DProps {
  activeNotes: NotePattern[];
  currentTime: number;
  pressedFrets: Set<number>;
}

const GameBoard3D = ({ activeNotes, currentTime, pressedFrets }: GameBoard3DProps) => {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        camera={{ position: [0, 3, 8], fov: 60 }}
      >
        <PerspectiveCamera makeDefault position={[0, 3, 8]} fov={60} />
        
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[0, 0, 0]} intensity={0.5} color="#00ffff" />
        <pointLight position={[-5, 5, -5]} intensity={0.3} color="#ff00ff" />
        <pointLight position={[5, 5, -5]} intensity={0.3} color="#ffff00" />

        {/* 3D Background */}
        <Background3D />

        {/* Note Highway */}
        <NoteHighway 
          activeNotes={activeNotes}
          currentTime={currentTime}
          pressedFrets={pressedFrets}
        />

        {/* Environment and Post-processing */}
        <Environment preset="night" />
        
        <EffectComposer>
          <Bloom 
            intensity={0.5}
            luminanceThreshold={0.9}
            luminanceSmoothing={0.025}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default GameBoard3D;