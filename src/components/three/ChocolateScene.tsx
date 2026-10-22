"use client";

import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer, RoundedBox } from "@react-three/drei";

type MatPair = { smooth: THREE.Material; faceted: THREE.Material };

/** One pillowed square: a slab with a bevelled plateau on top. */
function Piece({ position, mats }: { position: [number, number, number]; mats: MatPair }) {
  return (
    <group position={position}>
      <RoundedBox args={[0.96, 0.2, 0.96]} radius={0.04} smoothness={4} material={mats.smooth} />
      {/* A 4-sided cylinder is a square frustum: perfect for the bevel */}
      <mesh position={[0, 0.17, 0]} rotation={[0, Math.PI / 4, 0]} material={mats.faceted}>
        <cylinderGeometry args={[0.29 * Math.SQRT2, 0.43 * Math.SQRT2, 0.14, 4, 1]} />
      </mesh>
    </group>
  );
}

// Pointer across the whole window (R3F only tracks it over the canvas itself).
const pointer = { x: 0, y: 0 };
if (typeof window !== "undefined") {
  window.addEventListener(
    "pointermove",
    (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    },
    { passive: true }
  );
}

function Chunk({ animate }: { animate: boolean }) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const spin = useRef(0);

  const mats = useMemo<MatPair>(() => {
    const base = {
      color: new THREE.Color("#f1e3c6"),
      roughness: 0.36,
      sheen: 0.8,
      sheenRoughness: 0.5,
      sheenColor: new THREE.Color("#fff8ee"),
      clearcoat: 0.25,
      clearcoatRoughness: 0.6,
    };
    return {
      smooth: new THREE.MeshPhysicalMaterial(base),
      faceted: new THREE.MeshPhysicalMaterial({ ...base, flatShading: true }),
    };
  }, []);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g || !animate) return;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, -0.5 + pointer.x * 0.6 + spin.current, 4, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.75 - pointer.y * 0.35, 4, dt);
    const s = THREE.MathUtils.damp(g.scale.x, hovered ? 1.1 : 1, 6, dt);
    g.scale.setScalar(s);
  });

  return (
    <group
      ref={group}
      rotation={[0.75, -0.5, 0.12]}
      onPointerOver={() => {
        setHovered(true);
        spin.current += Math.PI * 2;
      }}
      onPointerOut={() => setHovered(false)}
    >
      <RoundedBox args={[1.98, 0.1, 1.98]} radius={0.04} smoothness={4} position={[0, -0.07, 0]} material={mats.smooth} />
      {(
        [
          [-0.5, 0, -0.5],
          [0.5, 0, -0.5],
          [-0.5, 0, 0.5],
          [0.5, 0, 0.5],
        ] as [number, number, number][]
      ).map((p) => (
        <Piece key={p.join()} position={p} mats={mats} />
      ))}
    </group>
  );
}

export default function ChocolateScene({ active, reduced }: { active: boolean; reduced: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5.4], fov: 32 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={!active ? "never" : reduced ? "demand" : "always"}
    >
      <ambientLight intensity={0.45} color="#fff3e2" />
      <directionalLight position={[2, 5, 4]} intensity={2.6} color="#fff1dc" />
      <directionalLight position={[-3, 1, 4]} intensity={0.6} color="#ffe6c4" />
      <pointLight position={[-2.5, -0.5, -2.5]} intensity={22} color="#b5361c" />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 4, -2]} scale={[6, 2, 1]} color="#fff6ea" />
        <Lightformer form="rect" intensity={0.8} position={[0, 0, 5]} scale={[6, 3, 1]} color="#fff2e0" />
        <Lightformer form="rect" intensity={1.2} position={[-4, 1, 2]} scale={[2, 4, 1]} color="#ffe2c0" />
        <Lightformer form="rect" intensity={1.6} position={[4, 0, -3]} scale={[2, 4, 1]} color="#b5361c" />
      </Environment>
      {reduced ? (
        <Chunk animate={false} />
      ) : (
        <Float speed={1.4} rotationIntensity={0.35} floatIntensity={0.6}>
          <Chunk animate />
        </Float>
      )}
    </Canvas>
  );
}
