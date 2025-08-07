import { useMemo, useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import * as THREE from 'three';

const RainParticles = () => {
  const count = 600;
  const area = 50; // cover the ground plane
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * area;
      arr[i * 3 + 1] = Math.random() * 12 + 4; // height 4-16
      arr[i * 3 + 2] = (Math.random() - 0.5) * area;
    }
    return arr;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    const pts = pointsRef.current;
    if (!pts) return;
    const pos = pts.geometry.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    const speed = 12; // rain fall speed
    for (let i = 0; i < arr.length; i += 3) {
      arr[i + 1] -= speed * delta;
      if (arr[i + 1] < 0) {
        arr[i + 0] = (Math.random() - 0.5) * area;
        arr[i + 1] = Math.random() * 12 + 4;
        arr[i + 2] = (Math.random() - 0.5) * area;
      }
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color={'#9ecbff'} size={0.06} sizeAttenuation transparent opacity={0.7} />
    </points>
  );
};

const EnvironmentController3D = ({ isRaining = true, cycleSpeed = 1 }: { isRaining?: boolean; cycleSpeed?: number; }) => {
  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const ambLightRef = useRef<THREE.AmbientLight>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight>(null);
  const { scene } = useThree();

  // Custom fog so we can update color dynamically
  const fog = useMemo(() => new THREE.Fog(new THREE.Color('#0b1220'), 20, 90), []);

  // Day/Night cycle time [0..1]
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current = (timeRef.current + delta * 0.02 * cycleSpeed) % 1; // adjustable cycle speed
    const t = timeRef.current;

    // compute lighting values
    const dayFactor = Math.max(0, Math.sin(t * Math.PI * 2)); // 0 at night, 1 midday
    const amb = 0.15 + 0.35 * dayFactor;
    const dir = 0.4 + 0.9 * dayFactor;

    if (ambLightRef.current) ambLightRef.current.intensity = amb;
    if (hemiLightRef.current) hemiLightRef.current.intensity = 0.2 + 0.3 * dayFactor;
    if (dirLightRef.current) {
      dirLightRef.current.intensity = dir;
      // Move sun in a circle
      const radius = 60;
      const angle = t * Math.PI * 2;
      dirLightRef.current.position.set(
        Math.cos(angle) * radius,
        30 + Math.sin(angle) * 20,
        Math.sin(angle) * radius
      );
      dirLightRef.current.target.position.set(0, 0, 0);
      dirLightRef.current.target.updateMatrixWorld();
    }

    // Fog color: darker at night
    const nightColor = new THREE.Color('#0b1220');
    const dayColor = new THREE.Color('#1e293b');
    const fogColor = nightColor.clone().lerp(dayColor, dayFactor);
    fog.color.copy(fogColor);
  });

  // Configure directional light shadow properties once
  useEffect(() => {
    const light = dirLightRef.current;
    if (!light) return;
    light.castShadow = true;
    // Shadow map size
    light.shadow.mapSize.set(1024, 1024);
    // Orthographic shadow camera bounds
    const cam = light.shadow.camera as THREE.OrthographicCamera;
    cam.left = -50;
    cam.right = 50;
    cam.top = 50;
    cam.bottom = -50;
    cam.updateProjectionMatrix();
  }, []);

  // Attach fog to scene
  scene.fog = fog;

  return (
    <group>
      {/* Sky dome */}
      <Sky distance={450000} inclination={0} azimuth={0.25} />

      {/* Lights controlled in useFrame */}
      <ambientLight ref={ambLightRef} intensity={0.3} />
      <hemisphereLight ref={hemiLightRef} intensity={0.3} groundColor={'#0b1220'} color={'#ffffff'} />
      <directionalLight
        ref={dirLightRef}
        position={[50, 50, 25]}
        intensity={1}
        castShadow
      />

      {/* Weather */}
      {isRaining && <RainParticles />}
    </group>
  );
};

export default EnvironmentController3D;
