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
      {/* Background starfield */}
      <group ref={starsRef}>
        {[...Array(100)].map((_, i) => {
          const angle = (i / 100) * Math.PI * 2;
          const radius = 20 + Math.random() * 30;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const y = (Math.random() - 0.5) * 20;

          return (
            <mesh key={i} position={[x, y, z]}>
              <sphereGeometry args={[0.05, 4, 4]} />
              <meshBasicMaterial 
                color="#ffffff"
                transparent
                opacity={0.3 + Math.random() * 0.4}
              />
            </mesh>
          );
        })}
      </group>

      {/* Ambient light particles */}
      <group ref={particlesRef}>
        {[...Array(20)].map((_, i) => {
          const x = (Math.random() - 0.5) * 15;
          const y = Math.random() * 8 - 2;
          const z = (Math.random() - 0.5) * 40;

          return (
            <mesh key={i} position={[x, y, z]}>
              <sphereGeometry args={[0.1, 6, 6]} />
              <meshBasicMaterial 
                color={isStarPowerActive ? "#ffd700" : "#4488ff"}
                transparent
                opacity={0.4 + intensity * 0.3}
              />
            </mesh>
          );
        })}
      </group>

      {/* Energy aura around highway */}
      <group ref={auraRef} position={[0, -3, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[4, 6, 32]} />
          <meshBasicMaterial 
            color={isStarPowerActive ? "#ffd700" : "#2244aa"}
            transparent
            opacity={0.1 + intensity * 0.2}
            side={2}
          />
        </mesh>
      </group>

      {/* Distant mountains/landscape silhouette */}
      <group position={[0, -8, -50]}>
        {[...Array(5)].map((_, i) => {
          const x = (i - 2) * 15;
          const height = 3 + Math.random() * 4;
          const width = 8 + Math.random() * 6;

          return (
            <mesh key={i} position={[x, height / 2, 0]}>
              <boxGeometry args={[width, height, 2]} />
              <meshBasicMaterial 
                color="#111133"
                transparent
                opacity={0.6}
              />
            </mesh>
          );
        })}
      </group>

      {/* Ground plane with subtle pattern */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial 
          color={isStarPowerActive ? "#332200" : "#001122"}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Highway underglow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.9, 0]}>
        <planeGeometry args={[8, 60]} />
        <meshBasicMaterial 
          color={isStarPowerActive ? "#ffd700" : "#4488ff"}
          transparent
          opacity={0.1 + intensity * 0.1}
        />
      </mesh>
    </group>
  );
};

export default Atmosphere;