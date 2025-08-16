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
    <group ref={hitLineRef} position={[0, 0, HIT_LINE_Z]}>
      {/* Main continuous hit line spanning full width */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[12, 0.15, 0.8]} />
        <meshStandardMaterial 
          color={isStarPowerActive ? "#ffd700" : "#00ffff"} 
          emissive={isStarPowerActive ? "#ffa500" : "#0088ff"}
          emissiveIntensity={0.6}
          metalness={0.3}
          roughness={0.1}
        />
      </mesh>

      {/* Subtle glow effect */}
      <mesh ref={glowRef} position={[0, 0, 0]}>
        <boxGeometry args={[12.5, 0.3, 1.2]} />
        <meshBasicMaterial 
          color={isStarPowerActive ? "#ffd700" : "#00ffff"}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Fret position markers - precisely aligned */}
      {FRET_POSITIONS.map((x, index) => {
        const isPressed = pressedFrets.has(index);
        return (
          <mesh key={index} position={[x, 0, 0.1]}>
            <cylinderGeometry args={[0.25, 0.25, 0.2]} />
            <meshStandardMaterial 
              color={isPressed ? "#ffffff" : (isStarPowerActive ? "#ffd700" : "#aaaaaa")}
              emissive={isPressed ? "#ffffff" : (isStarPowerActive ? "#ffa500" : "#000000")}
              emissiveIntensity={isPressed ? 0.5 : 0.2}
              transparent
              opacity={isPressed ? 1.0 : 0.7}
              metalness={0.4}
              roughness={0.1}
            />
          </mesh>
        );
      })}

      {/* Side caps for clean appearance */}
      <mesh position={[-6.2, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.8]} />
        <meshStandardMaterial 
          color={isStarPowerActive ? "#ffd700" : "#00ffff"}
          emissive={isStarPowerActive ? "#ffa500" : "#0088ff"}
          emissiveIntensity={0.6}
        />
      </mesh>
      <mesh position={[6.2, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.8]} />
        <meshStandardMaterial 
          color={isStarPowerActive ? "#ffd700" : "#00ffff"}
          emissive={isStarPowerActive ? "#ffa500" : "#0088ff"}
          emissiveIntensity={0.6}
        />
      </mesh>
    </group>
  );
};

export default ContinuousHitLine;