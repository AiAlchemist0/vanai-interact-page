import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { FRET_POSITIONS } from '@/game/constants';

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
      {/* Enhanced main hit line - longer and more prominent */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[16, 0.25, 1.2]} />
        <meshStandardMaterial 
          color={isStarPowerActive ? "#ffd700" : "#00ffff"} 
          emissive={isStarPowerActive ? "#ffa500" : "#0088ff"}
          emissiveIntensity={0.8}
          metalness={0.3}
          roughness={0.1}
        />
      </mesh>

      {/* Enhanced glowing effect - larger and brighter */}
      <mesh ref={glowRef} position={[0, 0, 0]}>
        <boxGeometry args={[17, 0.6, 2]} />
        <meshBasicMaterial 
          color={isStarPowerActive ? "#ffd700" : "#00ffff"}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Precisely aligned fret position indicators using FRET_POSITIONS */}
      {FRET_POSITIONS.map((x, index) => (
        <mesh key={index} position={[x, 0, 0.2]}>
          <cylinderGeometry args={[0.4, 0.4, 0.15]} />
          <meshStandardMaterial 
            color={isStarPowerActive ? "#ffd700" : "#ffffff"}
            emissive={isStarPowerActive ? "#ffa500" : "#ffffff"}
            emissiveIntensity={0.3}
            transparent
            opacity={0.9}
            metalness={0.5}
            roughness={0.1}
          />
        </mesh>
      ))}

      {/* Extended side rails for longer appearance */}
      <mesh position={[-8.5, 0, 0]}>
        <boxGeometry args={[0.3, 0.4, 1.2]} />
        <meshStandardMaterial 
          color={isStarPowerActive ? "#ffd700" : "#00ffff"}
          emissive={isStarPowerActive ? "#ffa500" : "#0088ff"}
          emissiveIntensity={0.6}
        />
      </mesh>
      <mesh position={[8.5, 0, 0]}>
        <boxGeometry args={[0.3, 0.4, 1.2]} />
        <meshStandardMaterial 
          color={isStarPowerActive ? "#ffd700" : "#00ffff"}
          emissive={isStarPowerActive ? "#ffa500" : "#0088ff"}
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Additional outer glow for maximum visibility */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[18, 0.8, 2.5]} />
        <meshBasicMaterial 
          color={isStarPowerActive ? "#ffd700" : "#00ffff"}
          transparent
          opacity={0.2}
        />
      </mesh>
    </group>
  );
};

export default VisualHitLine;