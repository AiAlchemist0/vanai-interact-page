import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboard } from '@/hooks/useKeyboard';
import { Text } from '@react-three/drei';
import type { GameState } from '@/types/game';
import * as THREE from 'three';

interface Player3DProps {
  gameState: GameState;
  onStateUpdate: (updates: Partial<GameState>) => void;
}

const Player3D = ({ gameState, onStateUpdate }: Player3DProps) => {
  const playerRef = useRef<THREE.Group>(null);
  const keys = useKeyboard();
  const speed = 0.2;
  
  const playerPosition = useRef({
    x: gameState.playerPosition.x / 50, // Scale down from 2D coordinates
    z: gameState.playerPosition.y / 50
  });

  useFrame((state, delta) => {
    if (!playerRef.current) return;
    
    let moved = false;
    const newPosition = { ...playerPosition.current };
    
    if (keys.up) {
      newPosition.z -= speed * delta * 60;
      moved = true;
    }
    if (keys.down) {
      newPosition.z += speed * delta * 60;
      moved = true;
    }
    if (keys.left) {
      newPosition.x -= speed * delta * 60;
      moved = true;
    }
    if (keys.right) {
      newPosition.x += speed * delta * 60;
      moved = true;
    }
    
    // Boundary constraints
    newPosition.x = Math.max(-20, Math.min(20, newPosition.x));
    newPosition.z = Math.max(-20, Math.min(20, newPosition.z));
    
    if (moved) {
      playerPosition.current = newPosition;
      playerRef.current.position.set(newPosition.x, 1, newPosition.z);
      
      // Update game state (scale back up to 2D coordinates)
      onStateUpdate({
        playerPosition: { 
          x: newPosition.x * 50, 
          y: newPosition.z * 50 
        }
      });
    }
    
    // Add subtle floating animation
    if (playerRef.current) {
      playerRef.current.position.y = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.position.set(
        gameState.playerPosition.x / 50,
        1,
        gameState.playerPosition.y / 50
      );
      playerPosition.current = {
        x: gameState.playerPosition.x / 50,
        z: gameState.playerPosition.y / 50
      };
    }
  }, [gameState.playerPosition]);

  return (
    <group ref={playerRef}>
      {/* Player Body - Glowing Cylinder */}
      <mesh castShadow>
        <cylinderGeometry args={[0.3, 0.3, 1.5, 8]} />
        <meshStandardMaterial 
          color={gameState.selectedCharacter?.color || '#3B82F6'}
          emissive={gameState.selectedCharacter?.color || '#3B82F6'}
          emissiveIntensity={0.3}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      
      {/* Player Head */}
      <mesh position={[0, 1, 0]} castShadow>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial 
          color={gameState.selectedCharacter?.color || '#3B82F6'}
          emissive={gameState.selectedCharacter?.color || '#3B82F6'}
          emissiveIntensity={0.2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      
      {/* Character Avatar Text */}
      <Text
        position={[0, 1, 0.41]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {gameState.selectedCharacter?.avatar || '🤖'}
      </Text>
      
      {/* Movement Indicator Ring */}
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.6, 0.8, 16]} />
        <meshStandardMaterial 
          color={gameState.selectedCharacter?.color || '#3B82F6'}
          transparent
          opacity={0.5}
          emissive={gameState.selectedCharacter?.color || '#3B82F6'}
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Player Name */}
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.15}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {gameState.selectedCharacter?.name || 'Player'}
      </Text>
    </group>
  );
};

export default Player3D;