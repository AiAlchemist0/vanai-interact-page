import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

interface Note3DProps {
  position: [number, number, number];
  fret: number;
  isChord: boolean;
  noteTime: number;
  currentTime: number;
}

const Note3D = ({ position, fret, isChord, noteTime, currentTime }: Note3DProps) => {
  const noteRef = useRef<Mesh>(null);
  
  // Fret colors matching the game
  const fretColors = ['#00ff00', '#ff0000', '#ffff00', '#0000ff', '#ff8800'];
  const color = fretColors[fret];

  useFrame(() => {
    if (noteRef.current) {
      // Rotation animation
      noteRef.current.rotation.y += 0.02;
      noteRef.current.rotation.x += 0.01;
      
      // Pulsing effect for chords
      if (isChord) {
        const scale = 1 + Math.sin(Date.now() * 0.005) * 0.2;
        noteRef.current.scale.setScalar(scale);
      }

      // Glow effect when close to hit zone
      const timeDiff = Math.abs(noteTime - currentTime);
      if (timeDiff < 200) {
        const intensity = 1 - (timeDiff / 200);
        noteRef.current.scale.setScalar(1 + intensity * 0.5);
      }
    }
  });

  return (
    <group position={position}>
      <mesh ref={noteRef}>
        {isChord ? (
          // Chord notes are star-shaped (using octahedron)
          <octahedronGeometry args={[0.3]} />
        ) : (
          // Single notes are spherical
          <sphereGeometry args={[0.25, 16, 16]} />
        )}
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={isChord ? 0.4 : 0.2}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Glow ring for chords */}
      {isChord && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.4, 0.6, 16]} />
          <meshStandardMaterial 
            color={color}
            emissive={color}
            emissiveIntensity={0.6}
            transparent
            opacity={0.7}
          />
        </mesh>
      )}

      {/* Trail effect */}
      <mesh position={[0, 0, 1]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  );
};

export default Note3D;