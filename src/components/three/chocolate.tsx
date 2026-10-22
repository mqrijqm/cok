"use client";

import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";

export type ChocoMats = { smooth: THREE.MeshPhysicalMaterial; faceted: THREE.MeshPhysicalMaterial };

export const IVORY = "#f1e3c6";
export const RASPBERRY = "#efc3cc";

export function makeChocoMats(tint: string = IVORY): ChocoMats {
  const base: THREE.MeshPhysicalMaterialParameters = {
    color: new THREE.Color(tint),
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
}

// A 4-sided cylinder is a square frustum: the bevelled plateau of a chocolate square.
const frustum = new THREE.CylinderGeometry(0.29 * Math.SQRT2, 0.43 * Math.SQRT2, 0.14, 4, 1);

/** One pillowed square, centred on its slab. */
export function Square({ mats, position }: { mats: ChocoMats; position?: [number, number, number] }) {
  return (
    <group position={position}>
      <RoundedBox args={[0.96, 0.2, 0.96]} radius={0.04} smoothness={3} material={mats.smooth} />
      <mesh position={[0, 0.17, 0]} rotation={[0, Math.PI / 4, 0]} material={mats.faceted} geometry={frustum} />
    </group>
  );
}

/** A block of cols × rows squares joined by a thin base, so the grooves read. */
export function Block({ mats, cols = 2, rows = 2 }: { mats: ChocoMats; cols?: number; rows?: number }) {
  const squares: [number, number, number][] = [];
  for (let c = 0; c < cols; c++)
    for (let r = 0; r < rows; r++) squares.push([(c - (cols - 1) / 2) * 1.0, 0, (r - (rows - 1) / 2) * 1.0]);
  return (
    <group>
      <RoundedBox args={[cols - 0.02, 0.1, rows - 0.02]} radius={0.04} smoothness={3} position={[0, -0.07, 0]} material={mats.smooth} />
      {squares.map((p) => (
        <Square key={p.join()} mats={mats} position={p} />
      ))}
    </group>
  );
}

export function seeded(seed: number) {
  let s = Math.abs(Math.floor(seed * 2147483646)) % 2147483646 || 1;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

/** A broken shard: square base with a jagged top-right edge, extruded with a soft bevel. */
export function makeShardGeometry(seed: number) {
  const r = seeded(seed + 0.137);
  const pts: [number, number][] = [
    [-0.5, -0.5],
    [0.5, -0.5],
    [0.5, -0.05 + r() * 0.25],
  ];
  const steps = 6;
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    pts.push([0.5 - t * 0.95 + (r() - 0.5) * 0.12, -0.05 + t * 0.55 + (r() - 0.5) * 0.22]);
  }
  pts.push([-0.5, 0.42 + r() * 0.08]);
  const shape = new THREE.Shape();
  shape.moveTo(pts[0][0], pts[0][1]);
  pts.slice(1).forEach(([x, y]) => shape.lineTo(x, y));
  shape.closePath();
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: 0.16,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.045,
    bevelSegments: 3,
    curveSegments: 1,
  });
  g.center();
  g.computeVertexNormals();
  return g;
}

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const smooth = (x: number) => x * x * (3 - 2 * x);
/** 0→1 between a and b, eased. */
export const seg = (p: number, a: number, b: number) => smooth(clamp01((p - a) / (b - a)));
export const lerp = THREE.MathUtils.lerp;

// Pointer across the whole window (R3F only tracks it over its own canvas).
export const windowPointer = { x: 0, y: 0 };
if (typeof window !== "undefined") {
  window.addEventListener(
    "pointermove",
    (e) => {
      windowPointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      windowPointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    },
    { passive: true }
  );
}

export function StudioLights({ rim = "#e3a7b6" }: { rim?: string }) {
  return (
    <>
      <hemisphereLight args={["#fff4e8", "#3f1521", 0.55]} />
      <directionalLight position={[3, 6, 5]} intensity={2.4} color="#fff1dc" />
      <directionalLight position={[-4, 1, 3]} intensity={0.6} color="#ffe6c4" />
      <pointLight position={[-4, 1.5, -2.5]} intensity={30} color={rim} />
    </>
  );
}
