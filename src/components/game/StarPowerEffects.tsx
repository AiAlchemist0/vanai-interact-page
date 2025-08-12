import { useRef, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';

interface StarPowerSystem {
  isActive: boolean;
  energy: number; // 0-100
  multiplier: number;
  duration: number;
  maxDuration: number;
}

export const useStarPower = () => {
  const [starPower, setStarPower] = useState<StarPowerSystem>({
    isActive: false,
    energy: 0,
    multiplier: 1,
    duration: 0,
    maxDuration: 8000 // 8 seconds
  });

  const addStarPowerEnergy = useCallback((amount: number) => {
    setStarPower(prev => ({
      ...prev,
      energy: Math.min(100, prev.energy + amount)
    }));
  }, []);

  const activateStarPower = useCallback(() => {
    setStarPower(prev => {
      if (prev.energy >= 50 && !prev.isActive) {
        return {
          ...prev,
          isActive: true,
          multiplier: 2,
          duration: prev.maxDuration,
          energy: 0 // Consume all energy
        };
      }
      return prev;
    });
  }, []);

  const updateStarPower = useCallback((deltaTime: number) => {
    setStarPower(prev => {
      if (prev.isActive) {
        const newDuration = prev.duration - deltaTime;
        if (newDuration <= 0) {
          return {
            ...prev,
            isActive: false,
            multiplier: 1,
            duration: 0
          };
        }
        return {
          ...prev,
          duration: newDuration
        };
      }
      return prev;
    });
  }, []);

  const resetStarPower = useCallback(() => {
    setStarPower({
      isActive: false,
      energy: 0,
      multiplier: 1,
      duration: 0,
      maxDuration: 8000
    });
  }, []);

  return {
    starPower,
    addStarPowerEnergy,
    activateStarPower,
    updateStarPower,
    resetStarPower
  };
};

interface StarPowerEffectsProps {
  isActive: boolean;
  energy: number;
  duration: number;
  maxDuration: number;
}

const StarPowerEffects = ({ isActive, energy, duration, maxDuration }: StarPowerEffectsProps) => {
  const groupRef = useRef<Group>(null);
  const energyBarRef = useRef<Group>(null);

  useFrame((state) => {
    if (groupRef.current && isActive) {
      // Intense rotation during star power
      groupRef.current.rotation.y += 0.05;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }

    if (energyBarRef.current) {
      // Gentle floating animation for energy bar
      energyBarRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  const energyPercent = energy / 100;
  const durationPercent = duration / maxDuration;

  return (
    <group>
      {/* Star Power Energy Bar */}
      <group ref={energyBarRef} position={[-3, 2, 0]}>
        {/* Background bar */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2, 0.2, 0.1]} />
          <meshBasicMaterial color="#333333" transparent opacity={0.7} />
        </mesh>
        
        {/* Energy fill */}
        <mesh position={[-1 + energyPercent, 0, 0.05]} scale={[energyPercent, 1, 1]}>
          <boxGeometry args={[2, 0.18, 0.05]} />
          <meshBasicMaterial 
            color={energy >= 50 ? "#ffd700" : "#4444ff"}
            transparent 
            opacity={0.9}
          />
        </mesh>

        {/* Energy bar glow when ready */}
        {energy >= 50 && (
          <mesh position={[0, 0, 0.1]}>
            <boxGeometry args={[2.2, 0.3, 0.05]} />
            <meshBasicMaterial 
              color="#ffd700"
              transparent 
              opacity={0.3 + Math.sin(Date.now() * 0.01) * 0.2}
            />
          </mesh>
        )}
      </group>

      {/* Active Star Power Effects */}
      {isActive && (
        <group ref={groupRef} position={[0, 0, 0]}>
          {/* Central star burst */}
          <mesh>
            <sphereGeometry args={[1, 16, 12]} />
            <meshBasicMaterial 
              color="#ffd700"
              transparent
              opacity={0.3}
            />
          </mesh>

          {/* Radiating energy beams */}
          {[...Array(8)].map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const length = 3 + Math.sin(Date.now() * 0.005 + i) * 0.5;
            const x = Math.cos(angle) * length;
            const z = Math.sin(angle) * length;

            return (
              <mesh 
                key={i} 
                position={[x / 2, 0, z / 2]}
                rotation={[0, angle, 0]}
              >
                <boxGeometry args={[0.1, 0.2, length]} />
                <meshBasicMaterial 
                  color="#ffffff"
                  transparent
                  opacity={0.8}
                />
              </mesh>
            );
          })}

          {/* Rotating star field */}
          {[...Array(20)].map((_, i) => {
            const angle = (i / 20) * Math.PI * 2 + Date.now() * 0.001;
            const radius = 2 + (i % 3) * 0.5;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = Math.sin(Date.now() * 0.003 + i) * 0.5;

            return (
              <mesh key={i} position={[x, y, z]} rotation={[0, 0, Math.PI / 4]}>
                <boxGeometry args={[0.15, 0.15, 0.05]} />
                <meshBasicMaterial 
                  color="#ffd700"
                  transparent
                  opacity={0.9}
                />
              </mesh>
            );
          })}

          {/* Duration indicator ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
            <ringGeometry args={[2, 2.2, 32, 1, 0, Math.PI * 2 * durationPercent]} />
            <meshBasicMaterial 
              color="#ff4444"
              transparent
              opacity={0.8}
              side={2}
            />
          </mesh>
        </group>
      )}
    </group>
  );
};

export default StarPowerEffects;