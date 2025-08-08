import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import * as THREE from "three";
import { toast } from "sonner";

// Types for blocks
type BlockType = "grass" | "dirt" | "stone" | "diamond";

interface Block {
  x: number;
  y: number;
  z: number;
  type: BlockType;
}

// Utility: position key
const keyOf = (x: number, y: number, z: number) => `${x}:${y}:${z}`;

// World generation (simple flat world + some diamonds)
function generateWorld(size = 32): Map<string, Block> {
  const blocks = new Map<string, Block>();
  const half = Math.floor(size / 2);
  for (let x = -half; x < half; x++) {
    for (let z = -half; z < half; z++) {
      // ground layer
      blocks.set(keyOf(x, 0, z), { x, y: 0, z, type: "grass" });
      // rare diamonds at y=1
      if (Math.random() < 0.02) {
        blocks.set(keyOf(x, 1, z), { x, y: 1, z, type: "diamond" });
      }
      // a bit of stone at y=-1
      if (Math.random() < 0.3) {
        blocks.set(keyOf(x, -1, z), { x, y: -1, z, type: "stone" });
      }
    }
  }
  return blocks;
}

// Instanced mesh per block type for performance
function BlocksInstanced({
  blocks,
  onClickBlock,
}: {
  blocks: Map<string, Block>;
  onClickBlock: (info: { point: THREE.Vector3; normal: THREE.Vector3; block: Block | null }) => void;
}) {
  const meshRefs = {
    grass: useRef<THREE.InstancedMesh>(null),
    dirt: useRef<THREE.InstancedMesh>(null),
    stone: useRef<THREE.InstancedMesh>(null),
    diamond: useRef<THREE.InstancedMesh>(null),
  } as const;

  const grouped = useMemo(() => {
    const g: Record<BlockType, Block[]> = { grass: [], dirt: [], stone: [], diamond: [] };
    blocks.forEach((b) => g[b.type].push(b));
    return g;
  }, [blocks]);

  // Update instance matrices
  useEffect(() => {
    const temp = new THREE.Object3D();
    (Object.keys(meshRefs) as BlockType[]).forEach((type) => {
      const mesh = meshRefs[type].current;
      if (!mesh) return;
      const arr = grouped[type];
      mesh.count = arr.length;
      arr.forEach((b, i) => {
        temp.position.set(b.x + 0.5, b.y + 0.5, b.z + 0.5);
        temp.updateMatrix();
        mesh.setMatrixAt(i, temp.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
    });
  }, [grouped, meshRefs]);

  // Raycast handling: we forward clicks via pointer down
  const handlePointerDown = (e: any) => {
    // e.instanceId available when intersecting InstancedMesh
    const mesh = e.eventObject as THREE.InstancedMesh;
    const type = (mesh.userData.type as BlockType) || "grass";
    const index = e.instanceId as number;
    const arr = grouped[type];
    const block = arr?.[index] ?? null;
    const normal = e.face?.normal?.clone() || new THREE.Vector3(0, 1, 0);
    onClickBlock({ point: e.point, normal, block });
  };

  // Materials (basic colors via HSL vars where possible)
  const grassColor = new THREE.Color("#55aa55");
  const dirtColor = new THREE.Color("#8a5a3a");
  const stoneColor = new THREE.Color("#888888");
  const diamondColor = new THREE.Color("#33e1ff");

  return (
    <group>
      <instancedMesh
        ref={meshRefs.grass}
        args={[undefined as any, undefined as any, grouped.grass.length]}
        userData={{ type: "grass" }}
        onPointerDown={handlePointerDown}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={grassColor} />
      </instancedMesh>

      <instancedMesh
        ref={meshRefs.dirt}
        args={[undefined as any, undefined as any, grouped.dirt.length]}
        userData={{ type: "dirt" }}
        onPointerDown={handlePointerDown}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={dirtColor} />
      </instancedMesh>

      <instancedMesh
        ref={meshRefs.stone}
        args={[undefined as any, undefined as any, grouped.stone.length]}
        userData={{ type: "stone" }}
        onPointerDown={handlePointerDown}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={stoneColor} />
      </instancedMesh>

      <instancedMesh
        ref={meshRefs.diamond}
        args={[undefined as any, undefined as any, grouped.diamond.length]}
        userData={{ type: "diamond" }}
        onPointerDown={handlePointerDown}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={diamondColor} emissive={diamondColor} emissiveIntensity={0.4} />
      </instancedMesh>
    </group>
  );
}

function PlayerController({
  onBreak,
  onPlace,
  placeType,
}: {
  onBreak: (block: Block) => void;
  onPlace: (position: { x: number; y: number; z: number }) => void;
  placeType: BlockType;
}) {
  const { camera, gl, scene } = useThree();
  const [locked, setLocked] = useState(false);

  // WASD keys
  const keys = useRef<{ [k: string]: boolean }>({});
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true;
      // Block placing types 1-4
      if (e.key >= "1" && e.key <= "4") e.preventDefault();
    };
    const up = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  // Movement
  useFrame((_, delta) => {
    const speed = (keys.current["shift"] ? 10 : 5) * delta;
    const dir = new THREE.Vector3();
    const right = new THREE.Vector3();

    camera.getWorldDirection(dir);
    dir.y = 0; // keep on ground
    dir.normalize();
    right.crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize();

    if (keys.current["w"]) camera.position.addScaledVector(dir, speed);
    if (keys.current["s"]) camera.position.addScaledVector(dir, -speed);
    if (keys.current["a"]) camera.position.addScaledVector(right, -speed);
    if (keys.current["d"]) camera.position.addScaledVector(right, speed);

    // keep camera above ground
    camera.position.y = Math.max(camera.position.y, 1.6);
  });

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!locked) return;
      // Raycast from camera center
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      const hit = intersects.find((i) => (i.object as any).isInstancedMesh);
      if (!hit) return;
      const mesh = hit.object as THREE.InstancedMesh & { userData: any };
      const type = (mesh.userData.type as BlockType) || "grass";
      const instanceId = (hit as any).instanceId as number | undefined;
      if (instanceId === undefined) return;
      const arr: Block[] = [];
      // we encoded block lookup via onBreak/onPlace callbacks using hit point
      const normal = hit.face?.normal?.clone() || new THREE.Vector3(0, 1, 0);
      const point = hit.point.clone().addScaledVector(normal, -0.01); // inside block
      const bx = Math.floor(point.x);
      const by = Math.floor(point.y);
      const bz = Math.floor(point.z);
      const block: Block = { x: bx, y: by, z: bz, type };

      if (e.button === 0) {
        onBreak(block);
      } else if (e.button === 2) {
        // place next to face
        const placePos = hit.point.clone().add(hit.face?.normal || new THREE.Vector3(0, 1, 0));
        onPlace({ x: Math.floor(placePos.x), y: Math.floor(placePos.y), z: Math.floor(placePos.z) });
      }
    };

    const onPointerLockChange = () => setLocked(document.pointerLockElement === gl.domElement);

    window.addEventListener("mousedown", onClick);
    window.addEventListener("contextmenu", (e) => locked && e.preventDefault());
    document.addEventListener("pointerlockchange", onPointerLockChange);
    return () => {
      window.removeEventListener("mousedown", onClick);
      document.removeEventListener("pointerlockchange", onPointerLockChange);
    };
  }, [camera, gl.domElement, scene, locked, onBreak, onPlace, placeType]);

  return <PointerLockControls selector="#voxel-canvas" />;
}

export default function VoxelWorld() {
  const [blocks, setBlocks] = useState<Map<string, Block>>(() => generateWorld(32));
  const [placeType, setPlaceType] = useState<BlockType>("stone");
  const [diamonds, setDiamonds] = useState(0);

  // Keyboard 1-4 to choose place block
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "1") setPlaceType("stone");
      if (e.key === "2") setPlaceType("dirt");
      if (e.key === "3") setPlaceType("grass");
      if (e.key === "4") setPlaceType("diamond");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const breakBlock = (b: Block) => {
    const k = keyOf(b.x, b.y, b.z);
    const target = blocks.get(k);
    if (!target) return;
    setBlocks((prev) => {
      const next = new Map(prev);
      next.delete(k);
      return next;
    });
    if (target.type === "diamond") {
      setDiamonds((d) => d + 1);
      toast.success("AI Diamond mined!", { description: "Knowledge shard added to your inventory." });
    }
  };

  const placeBlock = (pos: { x: number; y: number; z: number }) => {
    const k = keyOf(pos.x, pos.y, pos.z);
    if (blocks.has(k)) return; // don't place inside existing
    setBlocks((prev) => {
      const next = new Map(prev);
      next.set(k, { x: pos.x, y: pos.y, z: pos.z, type: placeType });
      return next;
    });
  };

  return (
    <div className="relative h-[calc(100vh-0px)] w-full">
      {/* HUD */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-start justify-between p-4">
        <div className="rounded-md bg-background/70 px-3 py-2 shadow" aria-label="AI Diamonds">
          <span className="font-medium">AI Diamonds:</span> <span className="ml-1 text-primary">{diamonds}</span>
        </div>
        <div className="rounded-md bg-background/70 px-3 py-2 shadow">
          <span className="font-medium">Place [1-4]:</span>
          <span className="ml-2">1 Stone • 2 Dirt • 3 Grass • 4 Diamond</span>
        </div>
      </div>

      {/* Crosshair */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2" aria-hidden>
        <div className="h-4 w-0.5 bg-foreground/70" />
        <div className="h-0.5 w-4 bg-foreground/70 -mt-[2px]" />
      </div>

      <Canvas id="voxel-canvas" shadows camera={{ position: [0, 4, 6], fov: 75 }}>
        {/* Lights */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 20, 10]} intensity={0.8} castShadow />
        {/* World */}
        <BlocksInstanced
          blocks={blocks}
          onClickBlock={({ block, normal, point }) => {
            // handled via PlayerController mouse events
          }}
        />

        <PlayerController onBreak={breakBlock} onPlace={placeBlock} placeType={placeType} />
      </Canvas>

      {/* CTA overlay for pointer lock */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex justify-center">
        <div className="pointer-events-auto rounded-full bg-background/80 px-4 py-2 text-sm shadow">
          Click on the scene to look around • Left click: mine • Right click: place
        </div>
      </div>
    </div>
  );
}
