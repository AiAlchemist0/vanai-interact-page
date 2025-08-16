import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface VisualHitLineProps {
  combo: number;
  isStarPowerActive: boolean;
}

const VisualHitLine = ({ combo, isStarPowerActive }: VisualHitLineProps) => {
  const hitLineRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Animate hit line glow based on combo
    if (glowRef.current) {
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      const intensity = 0.5 + Math.sin(time * 4) * 0.3;
      const comboGlow = Math.min(combo / 50, 1) * 0.5;
      material.opacity = intensity + comboGlow;
      
      if (isStarPowerActive) {
        material.color.setHSL(0.15, 1, 0.8); // Golden glow
      } else {
        material.color.setHSL(0.55, 1, 0.6); // Cyan glow
      }
    }

    // Keep hit line at fixed position - no floating animation
    // This ensures visual alignment with hit detection zones
  });

  return (
    <group ref={hitLineRef} position={[0, 0, 5]}>
      {/* Main hit line */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[12, 0.1, 0.5]} />
        <meshStandardMaterial 
          color={isStarPowerActive ? "#ffd700" : "#00ffff"} 
          emissive={isStarPowerActive ? "#ffa500" : "#0088ff"}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Glowing effect */}
      <mesh ref={glowRef} position={[0, 0, 0]}>
        <boxGeometry args={[12.5, 0.3, 1]} />
        <meshBasicMaterial 
          color={isStarPowerActive ? "#ffd700" : "#00ffff"}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Fret position indicators */}
      {[-5, -2.5, 0, 2.5, 5].map((x, index) => (
        <mesh key={index} position={[x, 0, 0.1]}>
          <cylinderGeometry args={[0.3, 0.3, 0.1]} />
          <meshStandardMaterial 
            color={isStarPowerActive ? "#ffd700" : "#ffffff"}
            emissive={isStarPowerActive ? "#ffa500" : "#ffffff"}
            emissiveIntensity={0.2}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
};

export default VisualHitLine;