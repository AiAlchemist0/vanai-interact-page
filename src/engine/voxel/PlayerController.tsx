import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';

export default function PlayerController() {
  const { camera } = useThree();
  const keys = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const down = (e: KeyboardEvent) => (keys.current[e.key.toLowerCase()] = true);
    const up = (e: KeyboardEvent) => (keys.current[e.key.toLowerCase()] = false);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  useFrame((_, delta) => {
    const speed = (keys.current['shift'] ? 30 : 15) * delta;
    const dir = new THREE.Vector3();
    const right = new THREE.Vector3();

    camera.getWorldDirection(dir);
    dir.y = 0; // stay level
    dir.normalize();
    right.crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize();

    if (keys.current['w']) camera.position.addScaledVector(dir, speed);
    if (keys.current['s']) camera.position.addScaledVector(dir, -speed);
    if (keys.current['a']) camera.position.addScaledVector(right, -speed);
    if (keys.current['d']) camera.position.addScaledVector(right, speed);

    // keep camera above ground roughly
    camera.position.y = Math.max(24, camera.position.y);
  });

  return null;
}
