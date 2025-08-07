import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import type { InsightData } from '@/types/game';
import * as THREE from 'three';

interface Chart3DProps {
  insight: InsightData;
}

const Chart3D = ({ insight }: Chart3DProps) => {
  const entries = useMemo(() => Object.entries(insight.data || {} as Record<string, number>), [insight]);
  const maxVal = useMemo(() => Math.max(1, ...entries.map(([, v]) => Number(v) || 0)), [entries]);

  // Simple rotation animation
  useFrame(({ scene }, delta) => {
    // no-op placeholder if needed in future
  });

  if (insight.chartType === 'bar') {
    const barWidth = 0.18;
    const gap = 0.08;
    const totalWidth = entries.length * barWidth + (entries.length - 1) * gap;
    const startX = -totalWidth / 2 + barWidth / 2;

    return (
      <group>
        {entries.map(([label, value], i) => {
          const h = Math.max(0.1, (Number(value) / maxVal) * 1.2);
          const x = startX + i * (barWidth + gap);
          return (
            <group key={label} position={[x, 0, 0]}>
              <mesh position={[0, h / 2, 0]} castShadow>
                <boxGeometry args={[barWidth, h, barWidth]} />
                <meshStandardMaterial color={'#61dafb'} emissive={'#61dafb'} emissiveIntensity={0.3} roughness={0.4} metalness={0.2} />
              </mesh>
            </group>
          );
        })}
        {/* Base */}
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.4, 0.45, 32]} />
          <meshStandardMaterial color={'#888888'} transparent opacity={0.6} />
        </mesh>
      </group>
    );
  }

  // Fallback "radial bars" for pie-like view
  const total = entries.reduce((acc, [, v]) => acc + (Number(v) || 0), 0) || 1;
  let angle = 0;
  return (
    <group>
      {entries.map(([label, value], i) => {
        const frac = (Number(value) || 0) / total;
        const radius = 0.6;
        const a = angle + frac * Math.PI * 2 * 0.95; // leave small gap
        const mid = angle + (a - angle) / 2;
        angle = a + 0.02;
        const x = Math.cos(mid) * radius;
        const z = Math.sin(mid) * radius;
        const h = Math.max(0.08, frac * 1.0);
        return (
          <group key={label} position={[x, h / 2, z]} rotation={[0, -mid, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.1, h, 0.25]} />
              <meshStandardMaterial color={'#f59e0b'} emissive={'#f59e0b'} emissiveIntensity={0.3} roughness={0.4} metalness={0.2} />
            </mesh>
          </group>
        );
      })}
      {/* Base ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.55, 48]} />
        <meshStandardMaterial color={'#888888'} transparent opacity={0.6} />
      </mesh>
    </group>
  );
};

export default Chart3D;
