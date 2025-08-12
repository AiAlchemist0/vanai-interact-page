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
  
  // Guitar Hero accurate fret colors
  const fretColors = ['#22c55e', '#ef4444', '#eab308', '#3b82f6', '#f97316']; // Green, Red, Yellow, Blue, Orange
  const color = fretColors[fret];

  // Calculate if note is in hit zone
  const timeDiff = Math.abs(noteTime - currentTime);
  const isInHitZone = timeDiff < 200;
  const hitIntensity = isInHitZone ? 1 - (timeDiff / 200) : 0;

  useFrame(() => {
    if (noteRef.current) {
      // Subtle rotation for visual interest
      noteRef.current.rotation.y += 0.005;
      
      // Scale effect when approaching hit zone
      if (isInHitZone) {
        const baseScale = isChord ? 1.2 : 1.0;
        noteRef.current.scale.setScalar(baseScale + hitIntensity * 0.3);
      } else {
        const baseScale = isChord ? 1.2 : 1.0;
        noteRef.current.scale.setScalar(baseScale);
      }
    }
  });

  return (
    <group position={position}>
      {/* Main note gem - rectangular like Guitar Hero */}
      <mesh ref={noteRef} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={isChord ? [0.8, 0.8, 0.3] : [0.6, 0.6, 0.25]} />
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={isInHitZone ? 0.6 : 0.2}
          metalness={0.3}
          roughness={0.1}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Chord indicator - additional visual elements */}
      {isChord && (
        <>
          {/* Star points for chord notes */}
          {[-0.3, 0.3].map((offset, i) => (
            <mesh key={i} position={[offset, offset, 0]} rotation={[0, 0, Math.PI / 4]}>
              <boxGeometry args={[0.3, 0.3, 0.15]} />
              <meshStandardMaterial 
                color={color}
                emissive={color}
                emissiveIntensity={0.4}
                transparent
                opacity={0.8}
              />
            </mesh>
          ))}
        </>
      )}

      {/* Hit zone glow effect */}
      {isInHitZone && (
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[1.2, 1.2, 0.1]} />
          <meshBasicMaterial 
            color={color}
            transparent
            opacity={hitIntensity * 0.5}
          />
        </mesh>
      )}
    </group>
  );
};

export default Note3D;