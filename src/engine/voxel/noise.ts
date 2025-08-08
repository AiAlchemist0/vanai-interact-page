import { createNoise2D } from 'simplex-noise';

const noise2D = createNoise2D(()=> 0.42); // deterministic PRNG

// 2D fractal noise heightmap
export function heightAt(x: number, z: number) {
  const s = 1 / 64; // scale
  const n1 = noise2D(x * s, z * s);
  const n2 = noise2D(x * s * 2, z * s * 2) * 0.5;
  const n3 = noise2D(x * s * 4, z * s * 4) * 0.25;
  const n = (n1 + n2 + n3) / (1 + 0.5 + 0.25);
  const base = 40; // base height
  const amp = 22;
  return Math.floor(base + n * amp);
}

export function rand2(x: number, z: number) {
  // deterministic pseudo-random based on coordinates
  const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
