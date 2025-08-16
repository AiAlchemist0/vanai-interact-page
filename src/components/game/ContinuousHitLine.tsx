import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { FRET_POSITIONS, HIT_LINE_Z } from '@/game/constants';

interface ContinuousHitLineProps {
  combo: number;
  isStarPowerActive: boolean;
  pressedFrets: Set<number>;
}

const ContinuousHitLine = ({ combo, isStarPowerActive, pressedFrets }: ContinuousHitLineProps) => {
  const hitLineRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Animate hit line glow based on combo
    if (glowRef.current) {
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      const intensity = 0.3 + Math.sin(time * 3) * 0.2;
      const comboGlow = Math.min(combo / 50, 1) * 0.4;
      material.opacity = intensity + comboGlow;
      
      if (isStarPowerActive) {
        material.color.setHSL(0.15, 1, 0.8); // Golden glow
      } else {
        material.color.setHSL(0.55, 1, 0.6); // Cyan glow
      }
    }
  });

  return (
    <group ref={hitLineRef} position={[0, -2.6, HIT_LINE_Z]}>
      {/* Main continuous hit line spanning full width - aligned with actual hit zones */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 0.4]} />
        <meshStandardMaterial 
          color={isStarPowerActive ? "#ffd700" : "#00ffff"} 
          emissive={isStarPowerActive ? "#ffa500" : "#0088ff"}
          emissiveIntensity={0.6}
          transparent
          opacity={0.8}
          side={2}
        />
      </mesh>

      {/* Subtle glow effect */}
      <mesh ref={glowRef} position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12.5, 0.6]} />
        <meshBasicMaterial 
          color={isStarPowerActive ? "#ffd700" : "#00ffff"}
          transparent
          opacity={0.3}
          side={2}
        />
      </mesh>

      {/* Center line for precise alignment */}
      <mesh position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 0.1]} />
        <meshStandardMaterial 
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.8}
          transparent
          opacity={0.9}
          side={2}
        />
      </mesh>

      {/* Side markers for width reference */}
      <mesh position={[-6, 0.1, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.3]} />
        <meshStandardMaterial 
          color={isStarPowerActive ? "#ffd700" : "#00ffff"}
          emissive={isStarPowerActive ? "#ffa500" : "#0088ff"}
          emissiveIntensity={0.8}
        />
      </mesh>
      <mesh position={[6, 0.1, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.3]} />
        <meshStandardMaterial 
          color={isStarPowerActive ? "#ffd700" : "#00ffff"}
          emissive={isStarPowerActive ? "#ffa500" : "#0088ff"}
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
};

export default ContinuousHitLine;