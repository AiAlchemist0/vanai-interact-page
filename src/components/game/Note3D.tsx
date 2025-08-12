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

  // Calculate timing and hit zone effects
  const timeDiff = noteTime - currentTime;
  const isApproaching = timeDiff <= 1000 && timeDiff >= 0; // 1 second approach window
  const isInHitZone = Math.abs(timeDiff) <= 100; // 100ms hit window
  const isInPerfectZone = Math.abs(timeDiff) <= 25; // 25ms perfect window
  
  // Calculate intensity based on approach
  const approachProgress = isApproaching ? 1 - (timeDiff / 1000) : 0;
  const hitIntensity = isInHitZone ? 1 - (Math.abs(timeDiff) / 100) : 0;
  const perfectIntensity = isInPerfectZone ? 1 - (Math.abs(timeDiff) / 25) : 0;

  useFrame(() => {
    if (noteRef.current) {
      // Continuous subtle rotation for visual interest
      noteRef.current.rotation.y += 0.01;
      
      // Enhanced scaling effects based on timing
      let baseScale = isChord ? 1.2 : 1.0;
      
      if (isInPerfectZone) {
        // Perfect zone - large scale with pulsing
        baseScale += 0.4 + Math.sin(Date.now() * 0.01) * 0.1;
      } else if (isInHitZone) {
        // Hit zone - moderate scale
        baseScale += hitIntensity * 0.3;
      } else if (isApproaching) {
        // Approaching - slight scale increase
        baseScale += approachProgress * 0.15;
      }
      
      noteRef.current.scale.setScalar(baseScale);
      
      // Add subtle bounce effect for chords
      if (isChord) {
        noteRef.current.position.y = position[1] + Math.sin(Date.now() * 0.005) * 0.05;
      }
    }
  });

  return (
    <group position={position}>
      {/* Outer glow effect for approaching notes */}
      {isApproaching && (
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={isChord ? [1.4, 1.4, 0.1] : [1.1, 1.1, 0.1]} />
          <meshBasicMaterial 
            color={color}
            transparent
            opacity={approachProgress * 0.3}
          />
        </mesh>
      )}

      {/* Perfect zone indicator */}
      {isInPerfectZone && (
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={isChord ? [1.6, 1.6, 0.1] : [1.3, 1.3, 0.1]} />
          <meshBasicMaterial 
            color="#ffd700"
            transparent
            opacity={perfectIntensity * 0.6}
          />
        </mesh>
      )}

      {/* Main note gem - rectangular like Guitar Hero */}
      <mesh ref={noteRef} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={isChord ? [0.8, 0.8, 0.3] : [0.6, 0.6, 0.25]} />
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={
            isInPerfectZone ? 0.8 + perfectIntensity * 0.4 :
            isInHitZone ? 0.6 + hitIntensity * 0.3 :
            isApproaching ? 0.2 + approachProgress * 0.3 : 0.2
          }
          metalness={0.4}
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
          <boxGeometry args={[1.4, 1.4, 0.1]} />
          <meshBasicMaterial 
            color={isInPerfectZone ? "#ffd700" : color}
            transparent
            opacity={hitIntensity * 0.5}
          />
        </mesh>
      )}

      {/* Streak trail effect for fast approaching notes */}
      {isApproaching && timeDiff < 500 && (
        <>
          {[...Array(3)].map((_, i) => (
            <mesh 
              key={i} 
              position={[0, 0, -0.3 * (i + 1)]} 
              rotation={[0, 0, Math.PI / 4]}
            >
              <boxGeometry args={isChord ? [0.6, 0.6, 0.1] : [0.4, 0.4, 0.1]} />
              <meshBasicMaterial 
                color={color}
                transparent
                opacity={approachProgress * 0.3 * (1 - i * 0.3)}
              />
            </mesh>
          ))}
        </>
      )}
    </group>
  );
};

export default Note3D;