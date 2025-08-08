import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import { VoxelWorldPort } from '@/engine/voxel/VoxelWorldPort';
import PlayerController from '@/engine/voxel/PlayerController';

const McPortPage: React.FC = () => {
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    document.title = 'AI Quest World – Minecraft-like Port';
  }, []);

  useEffect(() => {
    const onLockChange = () => setLocked(document.pointerLockElement !== null);
    document.addEventListener('pointerlockchange', onLockChange);
    return () => document.removeEventListener('pointerlockchange', onLockChange);
  }, []);

  return (
    <main className="min-h-screen">
      <div className="relative h-[calc(100vh-0px)] w-full">

        {/* HUD */}
        <div className="pointer-events-none absolute inset-0 z-10 flex items-start justify-between p-4">
          <div className="rounded-md bg-background/70 px-3 py-2 shadow">
            <span className="font-medium">AI Diamonds:</span> <span className="ml-1 text-primary">0</span>
          </div>
          <div className="rounded-md bg-background/70 px-3 py-2 shadow">
            <span className="font-medium">Move:</span> <span className="ml-1">WASD • Mouse Look</span>
          </div>
        </div>

        {/* Crosshair */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2" aria-hidden>
          <div className="h-4 w-0.5 bg-foreground/70" />
          <div className="h-0.5 w-4 bg-foreground/70 -mt-[2px]" />
        </div>

        <Canvas id="mc-canvas" shadows camera={{ position: [0, 32, 0], fov: 75 }}>
          <VoxelWorldPort />
          <PointerLockControls selector="#mc-canvas" />
        </Canvas>

        {/* CTA overlay for pointer lock */}
        <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex justify-center">
          <div className="pointer-events-auto rounded-full bg-background/80 px-4 py-2 text-sm shadow">
            Click on the scene to look around • WASD to move
          </div>
        </div>
      </div>
    </main>
  );
};

export default McPortPage;
