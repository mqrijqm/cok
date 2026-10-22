"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { FlatPiece, makeBlockGeometry, makeShardGeometry, seeded, windowPointer, BEIGE, MAGENTA } from "./chocolate";
import { flyIntro, scrollState } from "@/lib/scrollState";

type Spec = {
  kind: "square" | "block" | "shard";
  inverted: boolean;
  x: number;
  y: number;
  z: number;
  scale: number;
  spin: THREE.Vector3;
  bob: number;
  phase: number;
  depth: number;
  delay: number;
  shard: number;
};

function makeSpecs(count: number, width: number): Spec[] {
  const r = seeded(0.42);
  const kinds: Spec["kind"][] = ["shard", "square", "shard", "block", "square", "shard"];
  return Array.from({ length: count }, (_, i) => {
    const z = -4 + r() * 7;
    // Keep most pieces away from the centre column so the type stays readable.
    const side = r() < 0.5 ? -1 : 1;
    const x = r() < 0.75 ? side * (width * 0.18 + r() * width * 0.34) : (r() - 0.5) * width * 0.3;
    return {
      kind: kinds[i % kinds.length],
      inverted: r() < 0.25,
      x,
      y: (r() - 0.5) * 12,
      z,
      scale: 0.35 + r() * 0.55 + (z + 4) * 0.05,
      spin: new THREE.Vector3((r() - 0.5) * 0.9, (r() - 0.5) * 1.1, (r() - 0.5) * 0.7),
      bob: 0.3 + r() * 0.5,
      phase: r() * Math.PI * 2,
      depth: 0.6 + r() * 1.2,
      delay: r() * 0.35,
      shard: r(),
    };
  });
}

function Flyer({ spec, geometry }: { spec: Spec; geometry: THREE.BufferGeometry }) {
  const ref = useRef<THREE.Group>(null);
  const rot = useRef(new THREE.Euler(spec.phase, spec.phase * 0.7, spec.phase * 0.3));

  useFrame((state, dt) => {
    const g = ref.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const boost = 1 + Math.min(6, Math.abs(scrollState.velocity) * 0.12);
    rot.current.x += spec.spin.x * dt * boost;
    rot.current.y += spec.spin.y * dt * boost;
    rot.current.z += spec.spin.z * dt * boost;
    g.rotation.copy(rot.current);

    // Rise with the page at a depth-dependent rate, wrapping around forever.
    const span = 14;
    let y = spec.y + scrollState.y * 0.0028 * spec.depth + Math.sin(t * spec.bob + spec.phase) * 0.35;
    y = ((((y + span / 2) % span) + span) % span) - span / 2;

    const k = THREE.MathUtils.clamp(flyIntro.t * 1.35 - spec.delay, 0, 1);
    const e = 1 - Math.pow(1 - k, 3);
    g.position.set(spec.x * e, y * e, spec.z * e - (1 - e) * 2);
    g.scale.setScalar(spec.scale * e);
  });

  return (
    <group ref={ref}>
      <FlatPiece geometry={geometry} fill={spec.inverted ? MAGENTA : BEIGE} line={spec.inverted ? BEIGE : MAGENTA} />
    </group>
  );
}

function Swarm({ count }: { count: number }) {
  const group = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const specs = useMemo(() => makeSpecs(count, Math.max(viewport.width, 8)), [count, viewport.width]);
  const geo = useMemo(
    () => ({
      square: makeBlockGeometry(1, 1),
      block: makeBlockGeometry(2, 2).scale(0.62, 0.62, 0.62),
      shards: [0.11, 0.53, 0.87].map(makeShardGeometry).map((g) => g.scale(1.1, 1.1, 1.1)),
    }),
    []
  );

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, windowPointer.x * 0.18, 3, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -windowPointer.y * 0.12, 3, dt);
  });

  return (
    <group ref={group}>
      {specs.map((s, i) => (
        <Flyer
          key={i}
          spec={s}
          geometry={s.kind === "square" ? geo.square : s.kind === "block" ? geo.block : geo.shards[Math.floor(s.shard * geo.shards.length)]}
        />
      ))}
    </group>
  );
}

export default function FlyingScene({ active, count }: { active: boolean; count: number }) {
  return (
    <Canvas
      flat
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 12], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={active ? "always" : "never"}
      style={{ pointerEvents: "none" }}
    >
      <Swarm count={count} />
    </Canvas>
  );
}
