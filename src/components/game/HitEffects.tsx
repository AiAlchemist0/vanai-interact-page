import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';

export type HitGrade = 'perfect' | 'good' | 'okay' | 'miss';

interface HitEffect {
  id: string;
  position: { x: number; y: number; z: number };
  grade: HitGrade;
  age: number;
  maxAge: number;
}

interface HitEffectsProps {
  effects: HitEffect[];
  onEffectComplete: (id: string) => void;
}

const HitEffects = ({ effects, onEffectComplete }: HitEffectsProps) => {
  const groupRef = useRef<Group>(null);

  useFrame((state, delta) => {
    effects.forEach(effect => {
      effect.age += delta * 1000; // Convert to milliseconds
      if (effect.age >= effect.maxAge) {
        onEffectComplete(effect.id);
      }
    });
  });

  const getEffectColor = (grade: HitGrade) => {
    switch (grade) {
      case 'perfect': return '#ffd700'; // Gold
      case 'good': return '#00ff00';    // Green
      case 'okay': return '#ffaa00';    // Orange
      case 'miss': return '#ff0000';    // Red
    }
  };

  const getEffectScale = (effect: HitEffect) => {
    const progress = effect.age / effect.maxAge;
    if (effect.grade === 'miss') {
      return 1 + progress * 0.5; // Miss effects grow
    } else {
      return 1 - progress * 0.3; // Hit effects shrink
    }
  };

  const getEffectOpacity = (effect: HitEffect) => {
    const progress = effect.age / effect.maxAge;
    return Math.max(0, 1 - progress);
  };

  return (
    <group ref={groupRef}>
      {effects.map((effect) => {
        const scale = getEffectScale(effect);
        const opacity = getEffectOpacity(effect);
        const color = getEffectColor(effect.grade);

        return (
          <group key={effect.id} position={[effect.position.x, effect.position.y, effect.position.z]}>
            {/* Particle burst for hits */}
            {effect.grade !== 'miss' && (
              <>
                {/* Main explosion */}
                <mesh scale={[scale, scale, scale]}>
                  <sphereGeometry args={[0.3, 8, 6]} />
                  <meshBasicMaterial 
                    color={color}
                    transparent
                    opacity={opacity * 0.8}
                  />
                </mesh>
                
                {/* Sparkle particles */}
                {[...Array(6)].map((_, i) => {
                  const angle = (i / 6) * Math.PI * 2;
                  const distance = effect.age * 0.01;
                  const x = Math.cos(angle) * distance;
                  const z = Math.sin(angle) * distance;
                  
                  return (
                    <mesh key={i} position={[x, 0, z]} scale={[0.1, 0.1, 0.1]}>
                      <boxGeometry args={[1, 1, 1]} />
                      <meshBasicMaterial 
                        color={color}
                        transparent
                        opacity={opacity}
                      />
                    </mesh>
                  );
                })}
              </>
            )}

            {/* Miss effect - X mark */}
            {effect.grade === 'miss' && (
              <>
                <mesh rotation={[0, 0, Math.PI / 4]} scale={[scale, scale, scale]}>
                  <boxGeometry args={[1, 0.2, 0.1]} />
                  <meshBasicMaterial 
                    color={color}
                    transparent
                    opacity={opacity}
                  />
                </mesh>
                <mesh rotation={[0, 0, -Math.PI / 4]} scale={[scale, scale, scale]}>
                  <boxGeometry args={[1, 0.2, 0.1]} />
                  <meshBasicMaterial 
                    color={color}
                    transparent
                    opacity={opacity}
                  />
                </mesh>
              </>
            )}
          </group>
        );
      })}
    </group>
  );
};

export default HitEffects;
export type { HitEffect };