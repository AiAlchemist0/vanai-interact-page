import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useKeyboard } from '@/hooks/useKeyboard';
import { Text } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import type { GameState } from '@/types/game';
import * as THREE from 'three';

interface EnhancedPlayer3DProps {
  gameState: GameState;
  onStateUpdate: (updates: Partial<GameState>) => void;
  obstacles?: { x: number; z: number; radius: number }[];
  paused?: boolean;
  fov?: number;
}

const EnhancedPlayer3D = ({ gameState, onStateUpdate, obstacles = [], paused = false, fov = 60 }: EnhancedPlayer3DProps) => {
  const playerRef = useRef<any>(null);
  const cameraTargetRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const cameraPositionRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const keys = useKeyboard();
  const { camera } = useThree();
  
  const [isMoving, setIsMoving] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [direction, setDirection] = useState<'idle' | 'forward' | 'backward' | 'left' | 'right'>('idle');
  
  // Movement physics state
  const velocityRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const positionRef = useRef({
    x: gameState.playerPosition.x / 50,
    y: 0,
    z: gameState.playerPosition.y / 50
  });
  
// Enhanced movement parameters
  const moveSpeed = 8;
  const acceleration = 0.8;
  const friction = 0.85;
  const jumpForce = 12;
  const gravity = -25;
  const playerRadius = 0.45;
  
  // Animated character properties for smooth animations
  const [{ scale, rotationY }, springApi] = useSpring(() => ({
    scale: 1,
    rotationY: 0,
    config: { tension: 300, friction: 30 }
  }));

  useFrame((state, delta) => {
    if (!playerRef.current) return;

    // If paused, keep camera steady on current position and skip movement
    if (paused) {
      const pos = positionRef.current;
      playerRef.current.position.set(pos.x, pos.y, pos.z);

      const idealCameraPosition = new THREE.Vector3(pos.x + 8, pos.y + 6, pos.z + 8);
      const idealCameraTarget = new THREE.Vector3(pos.x, pos.y + 1, pos.z);
      cameraPositionRef.current.lerp(idealCameraPosition, 2 * delta);
      cameraTargetRef.current.lerp(idealCameraTarget, 3 * delta);
      camera.position.copy(cameraPositionRef.current);
      camera.lookAt(cameraTargetRef.current);
      setIsMoving(false);
      return;
    }
    
    // Ensure camera FOV matches settings (Perspective camera only)
    if (typeof fov === 'number' && 'fov' in camera) {
      const persp = camera as THREE.PerspectiveCamera;
      if (persp.fov !== fov) {
        persp.fov = fov;
        persp.updateProjectionMatrix();
      }
    }

    const velocity = velocityRef.current;
    const position = positionRef.current;
    
    // Input handling with momentum-based movement
    let inputX = 0;
    let inputZ = 0;
    let currentDirection: typeof direction = 'idle';
    
    if (keys.up) {
      inputZ = -1;
      currentDirection = 'forward';
    }
    if (keys.down) {
      inputZ = 1;
      currentDirection = 'backward';
    }
    if (keys.left) {
      inputX = -1;
      currentDirection = 'left';
    }
    if (keys.right) {
      inputX = 1;
      currentDirection = 'right';
    }
    
    // Normalize diagonal movement
    if (inputX !== 0 && inputZ !== 0) {
      inputX *= 0.707;
      inputZ *= 0.707;
    }
    
    // Apply acceleration or friction
    if (inputX !== 0 || inputZ !== 0) {
      velocity.x += inputX * acceleration * delta * 60;
      velocity.z += inputZ * acceleration * delta * 60;
      setIsMoving(true);
      
      // Character rotation to face movement direction
      if (inputX !== 0 || inputZ !== 0) {
        const targetRotation = Math.atan2(inputX, inputZ);
        springApi.start({ rotationY: targetRotation });
      }
    } else {
      setIsMoving(false);
    }
    
    setDirection(currentDirection);
    
    // Apply friction to horizontal movement
    velocity.x *= friction;
    velocity.z *= friction;
    
    // Limit max speed
    const maxSpeed = moveSpeed;
    const currentSpeed = Math.sqrt(velocity.x * velocity.x + velocity.z * velocity.z);
    if (currentSpeed > maxSpeed) {
      velocity.x = (velocity.x / currentSpeed) * maxSpeed;
      velocity.z = (velocity.z / currentSpeed) * maxSpeed;
    }
    
    // Jump mechanics
    if (keys.space && !isJumping && position.y <= 0.1) {
      velocity.y = jumpForce;
      setIsJumping(true);
      springApi.start({ scale: 1.2 });
      setTimeout(() => springApi.start({ scale: 1 }), 200);
    }
    
    // Apply gravity
    velocity.y += gravity * delta;
    
    // Update position
    position.x += velocity.x * delta;
    position.y += velocity.y * delta;
    position.z += velocity.z * delta;
    
    // Ground collision
    if (position.y <= 0) {
      position.y = 0;
      velocity.y = 0;
      setIsJumping(false);
    }

    // Simple circular collision against building obstacles
    if (obstacles.length) {
      for (const ob of obstacles) {
        const dx = position.x - ob.x;
        const dz = position.z - ob.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        const minDist = (playerRadius) + ob.radius;
        if (dist > 0 && dist < minDist) {
          const overlap = minDist - dist;
          const nx = dx / dist;
          const nz = dz / dist;
          position.x += nx * overlap;
          position.z += nz * overlap;
          // Reduce velocity when colliding
          velocity.x *= 0.2;
          velocity.z *= 0.2;
        }
      }
    }
    
    // Boundary constraints
    position.x = Math.max(-25, Math.min(25, position.x));
    position.z = Math.max(-25, Math.min(25, position.z));
    
    // Update player position
    playerRef.current.position.set(position.x, position.y, position.z);
    
    // Smooth camera following with third-person view
    const idealCameraPosition = new THREE.Vector3(
      position.x + 8,
      position.y + 6,
      position.z + 8
    );
    
    const idealCameraTarget = new THREE.Vector3(position.x, position.y + 1, position.z);
    
    // Smooth camera interpolation
    cameraPositionRef.current.lerp(idealCameraPosition, 2 * delta);
    cameraTargetRef.current.lerp(idealCameraTarget, 3 * delta);
    
    camera.position.copy(cameraPositionRef.current);
    camera.lookAt(cameraTargetRef.current);
    
    // Update game state less frequently for performance
    if (state.clock.elapsedTime % 0.1 < delta) {
      onStateUpdate({
        playerPosition: { 
          x: position.x * 50, 
          y: position.z * 50 
        }
      });
    }
  });

  return (
    <animated.group 
      ref={playerRef}
      scale={scale}
      rotation-y={rotationY}
    >
      {/* Enhanced Player Body with Animation States */}
      <animated.mesh castShadow>
        <cylinderGeometry args={[0.4, 0.4, 1.8, 12]} />
        <meshStandardMaterial 
          color={gameState.selectedCharacter?.color || '#3B82F6'}
          emissive={gameState.selectedCharacter?.color || '#3B82F6'}
          emissiveIntensity={isMoving ? 0.4 : 0.2}
          roughness={0.2}
          metalness={0.8}
        />
      </animated.mesh>
      
      {/* Animated Head with Movement Effects */}
      <animated.mesh position={[0, 1.2, 0]} castShadow>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial 
          color={gameState.selectedCharacter?.color || '#3B82F6'}
          emissive={gameState.selectedCharacter?.color || '#3B82F6'}
          emissiveIntensity={isJumping ? 0.6 : 0.3}
          roughness={0.1}
          metalness={0.9}
        />
      </animated.mesh>
      
      {/* Character Avatar */}
      <Text
        position={[0, 1.2, 0.51]}
        fontSize={0.4}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {gameState.selectedCharacter?.avatar || '🤖'}
      </Text>
      
      {/* Dynamic Movement Ring */}
      <animated.mesh 
        position={[0, 0.1, 0]} 
        rotation={[-Math.PI / 2, 0, 0]}
        scale={isMoving ? 1.2 : 1}
      >
        <ringGeometry args={[0.6, 0.9, 16]} />
        <meshStandardMaterial 
          color={gameState.selectedCharacter?.color || '#3B82F6'}
          transparent
          opacity={isMoving ? 0.8 : 0.4}
          emissive={gameState.selectedCharacter?.color || '#3B82F6'}
          emissiveIntensity={isMoving ? 0.4 : 0.1}
        />
      </animated.mesh>
      
      {/* Jump/Movement Effect */}
      {isJumping && (
        <pointLight
          position={[0, 0, 0]}
          color={gameState.selectedCharacter?.color || '#3B82F6'}
          intensity={2}
          distance={5}
          decay={2}
        />
      )}
      
      {/* Character Status Display */}
      <Text
        position={[0, 3, 0]}
        fontSize={0.12}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {isJumping ? '🚀 Jumping' : isMoving ? '🏃 Moving' : '🧍 Idle'}
      </Text>
      
      {/* Character Name */}
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.15}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {gameState.selectedCharacter?.name || 'Player'}
      </Text>
      
      {/* Enhanced Particle Effects for Movement */}
      {isMoving && (
        <>
          <pointLight
            position={[0, 0.5, 0]}
            color={gameState.selectedCharacter?.color || '#3B82F6'}
            intensity={1}
            distance={3}
            decay={2}
          />
          <mesh position={[0.8, 0.2, 0]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial 
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={0.5}
              transparent
              opacity={0.7}
            />
          </mesh>
          <mesh position={[-0.8, 0.2, 0]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial 
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={0.5}
              transparent
              opacity={0.7}
            />
          </mesh>
        </>
      )}
    </animated.group>
  );
};

export default EnhancedPlayer3D;