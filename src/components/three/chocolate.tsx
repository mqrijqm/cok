"use client";

import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { Edges } from "@react-three/drei";

export const MAGENTA = "#6a0c6f";
export const BEIGE = "#f1e7d6";

/* ───────────── geometry: sharp edges so the outlines read like a drawing ───────────── */

function squareParts(x = 0, z = 0) {
  const slab = new THREE.BoxGeometry(0.96, 0.2, 0.96).translate(x, 0, z);
  // A 4-sided cylinder is a square frustum: the bevelled plateau of a chocolate square.
  const top = new THREE.CylinderGeometry(0.29 * Math.SQRT2, 0.43 * Math.SQRT2, 0.14, 4, 1).rotateY(Math.PI / 4).translate(x, 0.17, z);
  return [slab, top];
}

/** cols × rows squares on a thin base, merged into one geometry. Top faces +Y. */
export function makeBlockGeometry(cols = 1, rows = 1) {
  const parts: THREE.BufferGeometry[] = [];
  for (let c = 0; c < cols; c++)
    for (let r = 0; r < rows; r++) parts.push(...squareParts((c - (cols - 1) / 2) * 1.0, (r - (rows - 1) / 2) * 1.0));
  if (cols * rows > 1) parts.push(new THREE.BoxGeometry(cols - 0.02, 0.1, rows - 0.02).translate(0, -0.07, 0));
  const merged = mergeGeometries(parts.map((g) => g.toNonIndexed()));
  parts.forEach((g) => g.dispose());
  return merged;
}

export function seeded(seed: number) {
  let s = Math.abs(Math.floor(seed * 2147483646)) % 2147483646 || 1;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

/** A broken shard: square base with a jagged top-right edge, extruded flat. */
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
  const g = new THREE.ExtrudeGeometry(shape, { depth: 0.22, bevelEnabled: false });
  g.center();
  return g;
}

/** Flat fill + outline in the other colour. No lights, no shading. */
export function FlatPiece({
  geometry,
  fill = BEIGE,
  line = MAGENTA,
  lineWidth = 2,
}: {
  geometry: THREE.BufferGeometry;
  fill?: string;
  line?: string;
  lineWidth?: number;
}) {
  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial color={fill} toneMapped={false} polygonOffset polygonOffsetFactor={1} polygonOffsetUnits={1} />
      <Edges threshold={15} lineWidth={lineWidth} color={line} toneMapped={false} />
    </mesh>
  );
}

/* ───────────── easing helpers ───────────── */

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
