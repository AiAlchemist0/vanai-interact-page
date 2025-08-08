import * as THREE from 'three';
import { BlockId, CHUNK_SIZE, WORLD_HEIGHT } from './types';
import { heightAt, rand2 } from './noise';

const DIRS = [
  { n: [ 1, 0, 0] as const, u: [0, 1, 0] as const, v: [0, 0, 1] as const }, // +x
  { n: [-1, 0, 0] as const, u: [0, 1, 0] as const, v: [0, 0,-1] as const }, // -x
  { n: [ 0, 1, 0] as const, u: [1, 0, 0] as const, v: [0, 0, 1] as const }, // +y
  { n: [ 0,-1, 0] as const, u: [1, 0, 0] as const, v: [0, 0,-1] as const }, // -y
  { n: [ 0, 0, 1] as const, u: [1, 0, 0] as const, v: [0, 1, 0] as const }, // +z
  { n: [ 0, 0,-1] as const, u: [1, 0, 0] as const, v: [0,-1, 0] as const }, // -z
];

export class Chunk {
  cx: number; cz: number; // horizontal chunk coords (y is single-slab)
  voxels: Uint8Array; // size CHUNK_SIZE * WORLD_HEIGHT * CHUNK_SIZE

  constructor(cx: number, cz: number) {
    this.cx = cx; this.cz = cz;
    this.voxels = new Uint8Array(CHUNK_SIZE * WORLD_HEIGHT * CHUNK_SIZE);
    this.generate();
  }

  index(x: number, y: number, z: number) {
    return x + CHUNK_SIZE * (z + CHUNK_SIZE * y);
  }

  get(x: number, y: number, z: number): BlockId {
    if (x < 0 || z < 0 || y < 0 || x >= CHUNK_SIZE || z >= CHUNK_SIZE || y >= WORLD_HEIGHT) return BlockId.Air;
    return this.voxels[this.index(x, y, z)] as BlockId;
  }

  set(x: number, y: number, z: number, id: BlockId) {
    if (x < 0 || z < 0 || y < 0 || x >= CHUNK_SIZE || z >= CHUNK_SIZE || y >= WORLD_HEIGHT) return;
    this.voxels[this.index(x, y, z)] = id;
  }

  generate() {
    const wx0 = this.cx * CHUNK_SIZE;
    const wz0 = this.cz * CHUNK_SIZE;

    for (let lx = 0; lx < CHUNK_SIZE; lx++) {
      for (let lz = 0; lz < CHUNK_SIZE; lz++) {
        const wx = wx0 + lx;
        const wz = wz0 + lz;
        const h = Math.max(1, Math.min(WORLD_HEIGHT - 1, heightAt(wx, wz)));
        for (let y = 0; y < WORLD_HEIGHT; y++) {
          let id = BlockId.Air;
          if (y <= h) {
            if (y === h) id = BlockId.Grass;
            else if (y >= h - 3) id = BlockId.Dirt;
            else id = BlockId.Stone;
          }
          // Sprinkle AI diamonds at depth with low probability
          if (id === BlockId.Stone && y < 24 && rand2(wx * 13 + y * 7, wz * 17) < 0.006) id = BlockId.Diamond;
          this.set(lx, y, lz, id);
        }
      }
    }
  }

  buildGeometry() {
    const positions: number[] = [];
    const normals: number[] = [];
    const colors: number[] = [];
    const indices: number[] = [];

    const colorFor = (id: BlockId) => {
      switch (id) {
        case BlockId.Grass: return new THREE.Color('#5fbf60');
        case BlockId.Dirt: return new THREE.Color('#8b5a3c');
        case BlockId.Stone: return new THREE.Color('#9aa0a8');
        case BlockId.Diamond: return new THREE.Color('#33e1ff');
        default: return new THREE.Color('#000000');
      }
    };

    const pushFace = (x: number, y: number, z: number, dirIndex: number, id: BlockId) => {
      const base = positions.length / 3;
      const { n, u, v } = DIRS[dirIndex];
      const c = colorFor(id);

      // Quad vertices for a unit cube face
      // Build corners depending on normal
      const getCorner = (a: number, b: number) => {
        return [x + 0.5 + (n[0] * 0.5) + (u[0] * (a - 0.5)) + (v[0] * (b - 0.5)),
                y + 0.5 + (n[1] * 0.5) + (u[1] * (a - 0.5)) + (v[1] * (b - 0.5)),
                z + 0.5 + (n[2] * 0.5) + (u[2] * (a - 0.5)) + (v[2] * (b - 0.5))];
      };

      const p0 = getCorner(0, 0);
      const p1 = getCorner(1, 0);
      const p2 = getCorner(1, 1);
      const p3 = getCorner(0, 1);

      positions.push(...p0, ...p1, ...p2, ...p3);
      for (let i = 0; i < 4; i++) normals.push(...n);

      const shade = 0.9 + (n[1] > 0 ? 0.1 : n[1] < 0 ? -0.1 : 0);
      const rc = c.clone().multiplyScalar(shade);
      for (let i = 0; i < 4; i++) colors.push(rc.r, rc.g, rc.b);

      indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
    };

    for (let x = 0; x < CHUNK_SIZE; x++) {
      for (let y = 0; y < WORLD_HEIGHT; y++) {
        for (let z = 0; z < CHUNK_SIZE; z++) {
          const id = this.get(x, y, z);
          if (id === BlockId.Air) continue;

          // neighbors
          const npx = this.get(x + 1, y, z);
          const nnx = this.get(x - 1, y, z);
          const npy = this.get(x, y + 1, z);
          const nny = this.get(x, y - 1, z);
          const npz = this.get(x, y, z + 1);
          const nnz = this.get(x, y, z - 1);

          if (npx === BlockId.Air) pushFace(this.cx * CHUNK_SIZE + x, y, this.cz * CHUNK_SIZE + z, 0, id);
          if (nnx === BlockId.Air) pushFace(this.cx * CHUNK_SIZE + x, y, this.cz * CHUNK_SIZE + z, 1, id);
          if (npy === BlockId.Air) pushFace(this.cx * CHUNK_SIZE + x, y, this.cz * CHUNK_SIZE + z, 2, id);
          if (nny === BlockId.Air) pushFace(this.cx * CHUNK_SIZE + x, y, this.cz * CHUNK_SIZE + z, 3, id);
          if (npz === BlockId.Air) pushFace(this.cx * CHUNK_SIZE + x, y, this.cz * CHUNK_SIZE + z, 4, id);
          if (nnz === BlockId.Air) pushFace(this.cx * CHUNK_SIZE + x, y, this.cz * CHUNK_SIZE + z, 5, id);
        }
      }
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geom.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geom.setIndex(indices);
    geom.computeBoundingSphere();
    return geom;
  }
}
