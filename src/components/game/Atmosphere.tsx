import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';

interface AtmosphereProps {
  intensity: number; // 0-1, affected by combo/star power
  isStarPowerActive: boolean;
}

const Atmosphere = ({ intensity, isStarPowerActive }: AtmosphereProps) => {
  const starsRef = useRef<Group>(null);
  const particlesRef = useRef<Group>(null);
  const auraRef = useRef<Group>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Rotating starfield
    if (starsRef.current) {
      starsRef.current.rotation.z += 0.0005;
    }

    // Floating particles
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.001;
      particlesRef.current.children.forEach((child, i) => {
        child.position.y = Math.sin(time * 0.5 + i) * 0.3;
      });
    }

    // Pulsing aura
    if (auraRef.current) {
      const pulseIntensity = isStarPowerActive ? 0.3 : 0.1;
      auraRef.current.scale.setScalar(1 + Math.sin(time * 2) * pulseIntensity);
    }
  });

  return (
    <group>
      {/* Minimal background elements only */}
      
      {/* Simple ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshBasicMaterial 
          color={isStarPowerActive ? "#1a1008" : "#000511"}
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Subtle highway underglow - minimal and focused */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.9, 0]}>
        <planeGeometry args={[6, 30]} />
        <meshBasicMaterial 
          color={isStarPowerActive ? "#443300" : "#001133"}
          transparent
          opacity={0.1}
        />
      </mesh>
    </group>
  );
};

export default Atmosphere;