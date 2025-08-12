import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';

interface ComboEffectsProps {
  combo: number;
  position: [number, number, number];
}

const ComboEffects = ({ combo, position }: ComboEffectsProps) => {
  const groupRef = useRef<Group>(null);

  // Show effects for combos of 10 or higher
  const showEffects = combo >= 10;
  const intensity = Math.min(combo / 50, 1); // Max intensity at 50 combo
  
  useFrame((state) => {
    if (groupRef.current && showEffects) {
      // Rotate the entire effect group
      groupRef.current.rotation.y += 0.02;
    }
  });

  if (!showEffects) return null;

  const getComboColor = () => {
    if (combo >= 50) return '#ff00ff'; // Magenta for high combos
    if (combo >= 30) return '#00ffff'; // Cyan for medium-high combos
    if (combo >= 20) return '#ffff00'; // Yellow for medium combos
    return '#ff8800'; // Orange for starting combos
  };

  return (
    <group ref={groupRef} position={position}>
      {/* Central energy ball */}
      <mesh>
        <sphereGeometry args={[0.3 + intensity * 0.2, 16, 12]} />
        <meshBasicMaterial 
          color={getComboColor()}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Orbiting particles */}
      {[...Array(Math.min(Math.floor(combo / 5), 8))].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2 + Date.now() * 0.001;
        const radius = 0.8 + intensity * 0.3;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(Date.now() * 0.002 + i) * 0.2;

        return (
          <mesh key={i} position={[x, y, z]}>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshBasicMaterial 
              color={getComboColor()}
              transparent
              opacity={0.8}
            />
          </mesh>
        );
      })}

      {/* Energy rings for high combos */}
      {combo >= 20 && (
        <>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1, 1.2, 32]} />
            <meshBasicMaterial 
              color={getComboColor()}
              transparent
              opacity={0.4}
              side={2}
            />
          </mesh>
          
          {combo >= 40 && (
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <ringGeometry args={[1.3, 1.5, 32]} />
              <meshBasicMaterial 
                color={getComboColor()}
                transparent
                opacity={0.3}
                side={2}
              />
            </mesh>
          )}
        </>
      )}

      {/* Lightning effects for very high combos */}
      {combo >= 30 && (
        <>
          {[...Array(4)].map((_, i) => {
            const angle = (i / 4) * Math.PI * 2;
            const length = 1.5 + Math.sin(Date.now() * 0.01 + i) * 0.3;
            const x = Math.cos(angle) * length;
            const z = Math.sin(angle) * length;

            return (
              <mesh 
                key={i} 
                position={[x / 2, 0, z / 2]}
                rotation={[0, angle, 0]}
              >
                <boxGeometry args={[0.05, 0.1, length]} />
                <meshBasicMaterial 
                  color="#ffffff"
                  transparent
                  opacity={0.8}
                />
              </mesh>
            );
          })}
        </>
      )}
    </group>
  );
};

export default ComboEffects;