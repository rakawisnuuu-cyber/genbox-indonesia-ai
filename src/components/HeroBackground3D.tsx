import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

const LIME = new THREE.Color("hsl(73, 100%, 50%)");
const DARK = new THREE.Color("hsl(0, 0%, 8%)");

/* Slowly rotating wireframe icosahedron */
const WireGlobe = () => {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, delta) => {
    ref.current.rotation.y += delta * 0.08;
    ref.current.rotation.x += delta * 0.04;
  });
  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.6}>
      <mesh ref={ref} position={[0, 0, 0]}>
        <icosahedronGeometry args={[2.6, 1]} />
        <meshBasicMaterial color={LIME} wireframe opacity={0.07} transparent />
      </mesh>
    </Float>
  );
};

/* Particle field orbiting */
const Particles = ({ count = 120 }) => {
  const ref = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    ref.current.rotation.y += delta * 0.03;
    ref.current.rotation.x += delta * 0.01;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} color={LIME} transparent opacity={0.35} sizeAttenuation />
    </points>
  );
};

/* Floating ring */
const GlowRing = ({ radius = 3.2, y = 0 }: { radius?: number; y?: number }) => {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, delta) => {
    ref.current.rotation.x += delta * 0.05;
    ref.current.rotation.z += delta * 0.02;
  });
  return (
    <mesh ref={ref} position={[0, y, -1]}>
      <torusGeometry args={[radius, 0.008, 16, 100]} />
      <meshBasicMaterial color={LIME} transparent opacity={0.1} />
    </mesh>
  );
};

const Scene = () => (
  <>
    <WireGlobe />
    <Particles />
    <GlowRing radius={3.5} y={0.3} />
    <GlowRing radius={4.2} y={-0.5} />
  </>
);

const HeroBackground3D = () => (
  <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden="true">
    <Canvas
      camera={{ position: [0, 0, 7], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Scene />
    </Canvas>
  </div>
);

export default HeroBackground3D;
