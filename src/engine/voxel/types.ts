export const CHUNK_SIZE = 16; // xz size
export const WORLD_HEIGHT = 96; // y size

export enum BlockId {
  Air = 0,
  Grass = 1,
  Dirt = 2,
  Stone = 3,
  Diamond = 4,
}

export type Vec3 = [number, number, number];

export const chunkKey = (cx: number, cy: number, cz: number) => `${cx}:${cy}:${cz}`;

export const worldToChunk = (x: number, y: number, z: number) => [
  Math.floor(x / CHUNK_SIZE),
  Math.floor(y / WORLD_HEIGHT),
  Math.floor(z / CHUNK_SIZE),
] as const;

export const localInChunk = (x: number, y: number, z: number) => [
  ((x % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE,
  ((y % WORLD_HEIGHT) + WORLD_HEIGHT) % WORLD_HEIGHT,
  ((z % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE,
] as const;
