import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import { Chunk } from './Chunk';
import { CHUNK_SIZE, WORLD_HEIGHT, chunkKey } from './types';

const RENDER_DISTANCE = 4; // in chunks

export const VoxelWorldPort: React.FC<{ onReady?: () => void }> = ({ onReady }) => {
  const { camera, scene } = useThree();
  const [ready, setReady] = useState(false);
  const material = useMemo(() => new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true }), []);

  const chunksRef = useRef(new Map<string, THREE.Mesh>());

  const ensureChunks = (cx: number, cz: number) => {
    const toKeep = new Set<string>();
    for (let dx = -RENDER_DISTANCE; dx <= RENDER_DISTANCE; dx++) {
      for (let dz = -RENDER_DISTANCE; dz <= RENDER_DISTANCE; dz++) {
        const k = chunkKey(cx + dx, 0, cz + dz);
        toKeep.add(k);
        if (!chunksRef.current.has(k)) {
          const chunk = new Chunk(cx + dx, cz + dz);
          const geom = chunk.buildGeometry();
          const mesh = new THREE.Mesh(geom, material);
          mesh.castShadow = false;
          mesh.receiveShadow = true;
          chunksRef.current.set(k, mesh);
          scene.add(mesh);
        }
      }
    }
    // Remove far chunks
    for (const [k, mesh] of chunksRef.current) {
      if (!toKeep.has(k)) {
        scene.remove(mesh);
        mesh.geometry.dispose();
        chunksRef.current.delete(k);
      }
    }
  };

  useEffect(() => {
    // initial chunks around origin
    ensureChunks(0, 0);
    setReady(true);
    onReady?.();
  }, []);

  useFrame(() => {
    const cx = Math.floor(camera.position.x / CHUNK_SIZE);
    const cz = Math.floor(camera.position.z / CHUNK_SIZE);
    ensureChunks(cx, cz);
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[40, 60, 20]} intensity={1.0} castShadow />
      <Sky sunPosition={[100, 50, 100]} turbidity={6} rayleigh={3} mieCoefficient={0.02} mieDirectionalG={0.9} />
    </>
  );
};
