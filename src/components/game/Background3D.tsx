import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Color } from 'three';
import { Float, Sphere, Box, Torus } from '@react-three/drei';

const Background3D = () => {
  const groupRef = useRef<any>();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Floating geometric shapes */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <Sphere position={[-8, 4, -10]} scale={0.5}>
          <meshStandardMaterial 
            color="#00ffff" 
            emissive="#004444"
            transparent
            opacity={0.7}
          />
        </Sphere>
      </Float>

      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.8}>
        <Box position={[8, 6, -12]} scale={0.8}>
          <meshStandardMaterial 
            color="#ff00ff" 
            emissive="#440044"
            transparent
            opacity={0.6}
          />
        </Box>
      </Float>

      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
        <Torus position={[-6, -2, -8]} scale={0.6} args={[1, 0.3, 16, 32]}>
          <meshStandardMaterial 
            color="#ffff00" 
            emissive="#444400"
            transparent
            opacity={0.8}
          />
        </Torus>
      </Float>

      <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.4}>
        <Sphere position={[6, -3, -9]} scale={0.7}>
          <meshStandardMaterial 
            color="#00ff00" 
            emissive="#004400"
            transparent
            opacity={0.5}
          />
        </Sphere>
      </Float>

      <Float speed={2.2} rotationIntensity={0.5} floatIntensity={0.7}>
        <Box position={[0, 8, -15]} scale={1.2}>
          <meshStandardMaterial 
            color="#ff8800" 
            emissive="#442200"
            transparent
            opacity={0.4}
          />
        </Box>
      </Float>

      {/* Particle-like smaller objects */}
      {Array.from({ length: 20 }, (_, i) => (
        <Float 
          key={i}
          speed={1 + Math.random() * 2} 
          rotationIntensity={0.1 + Math.random() * 0.3}
          floatIntensity={0.3 + Math.random() * 0.5}
        >
          <Sphere 
            position={[
              (Math.random() - 0.5) * 30,
              (Math.random() - 0.5) * 20,
              -20 - Math.random() * 10
            ]} 
            scale={0.1 + Math.random() * 0.2}
          >
            <meshStandardMaterial 
              color={new Color().setHSL(Math.random(), 0.8, 0.6)}
              emissive={new Color().setHSL(Math.random(), 0.5, 0.2)}
              transparent
              opacity={0.6}
            />
          </Sphere>
        </Float>
      ))}

      {/* Background grid/highway effect */}
      <mesh position={[0, -5, -50]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100, 20, 20]} />
        <meshStandardMaterial 
          color="#001122"
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
};

export default Background3D;