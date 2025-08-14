import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

interface Note3DProps {
  position: [number, number, number];
  fret: number;
  isChord: boolean;
  noteTime: number;
  currentTime: number;
  noteSpeed?: number;
  scale?: number; // External scale multiplier for depth perception
  hitWindow?: {
    perfect: number;
    good: number;
    okay: number;
  };
  isHit?: boolean;
}

const Note3D = ({ position, fret, isChord, noteTime, currentTime, noteSpeed = 1.0, scale = 1.0, hitWindow, isHit = false }: Note3DProps) => {
  const noteRef = useRef<Mesh>(null);
  
  // Guitar Hero accurate fret colors
  const fretColors = ['#22c55e', '#ef4444', '#eab308', '#3b82f6', '#f97316']; // Green, Red, Yellow, Blue, Orange
  const color = fretColors[fret];

  // Calculate timing and hit zone effects with calibration
  const timeDiff = noteTime - currentTime;
  const isApproaching = timeDiff <= (1000 / noteSpeed) && timeDiff >= 0; // Adjust approach window for speed
  
  // Use custom hit windows if provided, otherwise use defaults
  const perfectWindow = hitWindow?.perfect || 25;
  const goodWindow = hitWindow?.good || 50;
  const okayWindow = hitWindow?.okay || 100;
  
  const isInHitZone = Math.abs(timeDiff) <= okayWindow;
  const isInPerfectZone = Math.abs(timeDiff) <= perfectWindow;
  
  // Calculate intensity based on approach (adjusted for note speed)
  const approachProgress = isApproaching ? 1 - (timeDiff / (1000 / noteSpeed)) : 0;
  const hitIntensity = isInHitZone ? 1 - (Math.abs(timeDiff) / okayWindow) : 0;
  const perfectIntensity = isInPerfectZone ? 1 - (Math.abs(timeDiff) / perfectWindow) : 0;

  // Optimized animation with throttled updates
  const lastUpdateTime = useRef(0);
  
  useFrame((state) => {
    if (!noteRef.current) return;
    
    // Throttle animations to 30fps for better performance
    const now = state.clock.getElapsedTime() * 1000;
    if (now - lastUpdateTime.current < 33) return; // 30fps
    lastUpdateTime.current = now;
    
    // Reduced rotation speed for smoother animation
    noteRef.current.rotation.y += 0.003 * noteSpeed;
    
    // Simplified scaling effects
    let baseScale = isChord ? 1.2 : 1.0;
    
    if (isInPerfectZone) {
      // Perfect zone - simplified pulsing
      baseScale += 0.3 + Math.sin(now * 0.005) * 0.05;
    } else if (isInHitZone) {
      // Hit zone - reduced intensity
      baseScale += hitIntensity * 0.2;
    } else if (isApproaching) {
      // Approaching - minimal scale change
      baseScale += approachProgress * 0.1;
    }
    
    if (isHit) {
      baseScale += 0.2; // Reduced hit scale
    }
    
    noteRef.current.scale.setScalar(baseScale * scale);
    
    // Simplified bounce effect for chords
    if (isChord) {
      noteRef.current.position.y = position[1] + Math.sin(now * 0.003) * 0.03;
    }
  });

  return (
    <group position={position}>
      {/* Outer glow effect for approaching notes */}
      {isApproaching && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[isChord ? 1.6 : 1.3, 32]} />
          <meshBasicMaterial 
            color={color}
            transparent
            opacity={approachProgress * 0.5}
          />
        </mesh>
      )}

      {/* Perfect zone indicator */}
      {isInPerfectZone && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[isChord ? 1.9 : 1.7, 32]} />
          <meshBasicMaterial 
            color="#ffd700"
            transparent
            opacity={perfectIntensity * 0.6}
          />
        </mesh>
      )}

      {/* Main note gem - rectangular like Guitar Hero */}
      <mesh ref={noteRef}>
        <sphereGeometry args={[isChord ? 0.7 : 0.55, 24, 24]} />
        <meshStandardMaterial 
          color={isHit ? '#ffffff' : color}
          emissive={isHit ? '#ffffff' : color}
          emissiveIntensity={
            isHit ? 1.4 : (
              isInPerfectZone ? 0.8 + perfectIntensity * 0.4 :
              isInHitZone ? 0.6 + hitIntensity * 0.3 :
              isApproaching ? 0.3 + approachProgress * 0.35 : 0.25
            )
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
          {[-0.3, 0.3].map((offset, i) => (
            <mesh key={i} position={[offset, offset, 0]}>
              <sphereGeometry args={[0.18, 16, 16]} />
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
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[isChord ? 1.9 : 1.7, 32]} />
          <meshBasicMaterial 
            color={isInPerfectZone ? "#ffd700" : color}
            transparent
            opacity={hitIntensity * 0.5}
          />
        </mesh>
      )}

      {/* Streak trail effect for fast approaching notes (adjusted for speed) */}
      {isApproaching && timeDiff < (500 / noteSpeed) && (
        <>
          {[...Array(3)].map((_, i) => (
            <mesh 
              key={i} 
              position={[0, 0, -0.3 * (i + 1)]}
            >
              <sphereGeometry args={[isChord ? 0.45 : 0.35, 16, 16]} />
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