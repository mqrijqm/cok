"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { Square, StudioLights, makeChocoMats, seeded, seg, lerp } from "./chocolate";
import { makingState } from "@/lib/scrollState";

/* ───────────── timeline ─────────────
   Seven acts across p ∈ [0,1]. S = one act. */
const S = 1 / 7;
const A = (i: number, f = 0) => (i + f) * S; // start of act i, plus a fraction of an act

/* ───────────── geometry builders ───────────── */

function podProfile() {
  const pts: THREE.Vector2[] = [];
  const N = 30;
  const L = 1.15;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    let r = Math.pow(Math.sin(Math.PI * t), 0.72) * 0.6;
    r *= 1 - 0.3 * Math.max(0, (t - 0.68) / 0.32); // pointed tip
    pts.push(new THREE.Vector2(Math.max(r, 0.002), -L + 2 * L * t));
  }
  return pts;
}

/** Ridged cacao pod (or one half of it). Long axis = local Y. */
function makePod(phiStart = 0, phiLength = Math.PI * 2) {
  const g = new THREE.LatheGeometry(podProfile(), 56, phiStart, phiLength);
  const pos = g.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const phi = Math.atan2(v.x, v.z);
    const r = Math.hypot(v.x, v.z);
    const k = 1 + 0.075 * Math.cos(phi * 10) * Math.min(1, r / 0.25);
    pos.setXYZ(i, v.x * k, v.y, v.z * k);
  }
  g.computeVertexNormals();
  return g;
}

function makeLeaf() {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.bezierCurveTo(0.42, 0.35, 0.4, 1.15, 0, 1.75);
  s.bezierCurveTo(-0.4, 1.15, -0.42, 0.35, 0, 0);
  return new THREE.ShapeGeometry(s, 16);
}

function makeSpiralTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 512, 512);
  ctx.strokeStyle = "rgba(140,96,52,0.09)";
  ctx.lineWidth = 5;
  for (let arm = 0; arm < 3; arm++) {
    ctx.beginPath();
    for (let a = 0; a < 26; a += 0.04) {
      const r = a * 9.5;
      ctx.lineTo(256 + Math.cos(a + arm * 2.09) * r, 256 + Math.sin(a + arm * 2.09) * r);
    }
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* ───────────── colours ───────────── */

const C = {
  podGreen: new THREE.Color("#6f8f3a"),
  podGold: new THREE.Color("#e3a13a"),
  podAmber: new THREE.Color("#c7612a"),
  pulp: new THREE.Color("#f2ece3"),
  ferment: new THREE.Color("#8a4a45"),
  dried: new THREE.Color("#6b3a28"),
  roasted: new THREE.Color("#3f2117"),
  butter: new THREE.Color("#eed592"),
  ivory: new THREE.Color("#f3e6cc"),
};

const tmp = new THREE.Color();
const mix3 = (a: THREE.Color, b: THREE.Color, c: THREE.Color, t: number) =>
  t < 0.5 ? tmp.copy(a).lerp(b, t * 2) : tmp.copy(b).lerp(c, (t - 0.5) * 2);

/* ───────────── camera path, one key per act boundary ───────────── */

const CAM: [number, number, number, number, number, number][] = [
  // pos x,y,z        look x,y,z
  [-0.5, 0.7, 6.2, -0.5, 0.35, 0],
  [0, 0.8, 6.4, 0, 0, 0],
  [0, 3.4, 6.6, 0, -0.8, 0],
  [0, 2.9, 6.0, 0, -0.8, 0],
  [0, 1.7, 6.8, 0, -0.45, 0],
  [0, 3.8, 5.6, 0, -0.9, 0],
  [0, 0.9, 7.2, 0, -0.1, 0],
  [0, 0.7, 6.6, 0, 0.05, 0],
];

/* ───────────── the scene ───────────── */

const BEANS = 35;
const NIBS_PER = 3;
const DROPS = 12;
const SUGAR = 10;

function Process({ reduced }: { reduced: boolean }) {
  const { camera, size } = useThree();
  const pd = useRef(0);

  const rnd = useMemo(() => seeded(0.77), []);
  const data = useMemo(() => {
    // Beans inside the pod (pod-local) and scattered on the leaf (world)
    const inPod: THREE.Vector3[] = [];
    const tray: THREE.Vector3[] = [];
    const trayRot: number[] = [];
    for (let i = 0; i < BEANS; i++) {
      const row = Math.floor(i / 5);
      const a = (i % 5) * ((Math.PI * 2) / 5) + row * 0.63;
      inPod.push(new THREE.Vector3(Math.sin(a) * 0.27, -0.82 + row * 0.27, Math.cos(a) * 0.27));
      const rr = Math.sqrt(rnd()) * 1.45;
      const ta = rnd() * Math.PI * 2;
      tray.push(new THREE.Vector3(Math.cos(ta) * rr * 1.1, -0.88, Math.sin(ta) * rr * 0.75));
      trayRot.push(rnd() * Math.PI);
    }
    const nibOff: THREE.Vector3[] = [];
    const pile: THREE.Vector3[] = [];
    for (let i = 0; i < BEANS * NIBS_PER; i++) {
      nibOff.push(new THREE.Vector3((rnd() - 0.5) * 0.32, rnd() * 0.06, (rnd() - 0.5) * 0.32));
      const h = Math.pow(rnd(), 1.6);
      const pr = Math.sqrt(rnd()) * 0.85 * (1 - h);
      const pa = rnd() * Math.PI * 2;
      pile.push(new THREE.Vector3(Math.cos(pa) * pr, -0.86 + h * 0.95, Math.sin(pa) * pr));
    }
    const qTray = trayRot.map((ry) => new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, ry, 0)));
    const drops = Array.from({ length: DROPS }, () => ({ x: (rnd() - 0.5) * 1.8, z: (rnd() - 0.5) * 1.3, d: rnd() }));
    const sugar = Array.from({ length: SUGAR }, () => ({ x: (rnd() - 0.5) * 1.9, z: (rnd() - 0.5) * 1.3, d: rnd(), r: rnd() * 6 }));
    return { inPod, tray, qTray, nibOff, pile, drops, sugar };
  }, [rnd]);

  const geo = useMemo(
    () => ({
      podA: makePod(0, Math.PI),
      podB: makePod(Math.PI, Math.PI),
      podFull: makePod(),
      leaf: makeLeaf(),
      bean: new THREE.SphereGeometry(1, 18, 12),
      nib: new THREE.IcosahedronGeometry(0.075, 0),
      drop: new THREE.SphereGeometry(0.09, 16, 12),
      cube: new THREE.BoxGeometry(0.11, 0.11, 0.11),
    }),
    []
  );

  const mat = useMemo(
    () => ({
      pod: new THREE.MeshStandardMaterial({ color: C.podGreen, roughness: 0.55 }),
      podInner: new THREE.MeshStandardMaterial({ color: "#efe3c8", roughness: 0.7, side: THREE.BackSide }),
      smallPodA: new THREE.MeshStandardMaterial({ color: "#7e9a3f", roughness: 0.55 }),
      smallPodB: new THREE.MeshStandardMaterial({ color: "#d9a640", roughness: 0.55 }),
      bark: new THREE.MeshStandardMaterial({ color: "#4a2a1e", roughness: 0.95 }),
      leaf: new THREE.MeshStandardMaterial({ color: "#3f6b36", roughness: 0.6, side: THREE.DoubleSide }),
      leafDark: new THREE.MeshStandardMaterial({ color: "#2f5530", roughness: 0.6, side: THREE.DoubleSide }),
      blade: new THREE.MeshStandardMaterial({ color: "#d9d4ce", metalness: 0.95, roughness: 0.22 }),
      bean: new THREE.MeshPhysicalMaterial({ color: C.pulp, roughness: 0.32, clearcoat: 0.6, emissive: "#ff6a1f", emissiveIntensity: 0 }),
      nib: new THREE.MeshStandardMaterial({ color: C.roasted, roughness: 0.75, flatShading: true }),
      plate: new THREE.MeshStandardMaterial({ color: "#2a1712", roughness: 0.5, metalness: 0.4 }),
      press: new THREE.MeshStandardMaterial({ color: "#e2dbd3", metalness: 0.55, roughness: 0.32 }),
      pool: new THREE.MeshPhysicalMaterial({ color: C.butter, roughness: 0.14, clearcoat: 1, clearcoatRoughness: 0.15, map: makeSpiralTexture() }),
      milk: new THREE.MeshPhysicalMaterial({ color: "#fffaf3", roughness: 0.2, clearcoat: 1 }),
      sugar: new THREE.MeshPhysicalMaterial({ color: "#ffffff", roughness: 0.15, clearcoat: 1 }),
      vanilla: new THREE.MeshStandardMaterial({ color: "#2b1a12", roughness: 0.6 }),
    }),
    []
  );
  const choco = useMemo(() => makeChocoMats(), []);

  const r = {
    root: useRef<THREE.Group>(null),
    tree: useRef<THREE.Group>(null),
    pod: useRef<THREE.Group>(null),
    halfA: useRef<THREE.Group>(null),
    halfB: useRef<THREE.Group>(null),
    blade: useRef<THREE.Mesh>(null),
    beans: useRef<THREE.InstancedMesh>(null),
    nibs: useRef<THREE.InstancedMesh>(null),
    leafTray: useRef<THREE.Mesh>(null),
    plate: useRef<THREE.Mesh>(null),
    press: useRef<THREE.Mesh>(null),
    pool: useRef<THREE.Mesh>(null),
    drops: useRef<THREE.InstancedMesh>(null),
    sugar: useRef<THREE.InstancedMesh>(null),
    vanilla: useRef<THREE.Mesh>(null),
    bar: useRef<THREE.Group>(null),
    pieces: useRef<(THREE.Group | null)[]>([]),
    heat: useRef<THREE.PointLight>(null),
  };

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const v = useMemo(() => new THREE.Vector3(), []);
  const v2 = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  const qPod = useMemo(() => new THREE.Quaternion(), []);

  useFrame((state, dt) => {
    pd.current = reduced ? makingState.p : THREE.MathUtils.damp(pd.current, makingState.p, 7, dt);
    const p = pd.current;
    const t = state.clock.elapsedTime;
    const portrait = size.width / size.height < 1;

    /* layout: scene sits right of the text on desktop, lower on mobile */
    const root = r.root.current!;
    // Portrait: the text owns the top, the process plays in the lower third.
    root.position.set(portrait ? 0 : 1.55, portrait ? -1.6 : 0, 0);
    root.scale.setScalar(portrait ? 0.62 : 1);
    root.updateMatrixWorld();

    /* camera */
    const f = Math.min(p * 7, 6.999);
    const i = Math.floor(f);
    const k = THREE.MathUtils.smootherstep(f - i, 0, 1);
    const a = CAM[i];
    const b = CAM[i + 1];
    camera.position.set(lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k) * (portrait ? 1.35 : 1));
    look.set(lerp(a[3], b[3], k), lerp(a[4], b[4], k), lerp(a[5], b[5], k));
    camera.lookAt(look);

    /* ── 01 tree & ripening ── */
    const exitTree = seg(p, A(0, 0.75), A(1, 0.15));
    const tree = r.tree.current!;
    tree.visible = p < A(1, 0.2);
    tree.position.x = -exitTree * 7;
    tree.rotation.z = Math.sin(t * 0.6) * 0.01;

    const ripen = seg(p, A(0, 0.02), A(0, 0.5));
    mat.pod.color.copy(mix3(C.podGreen, C.podGold, C.podAmber, ripen));

    const cut = seg(p, A(0, 0.5), A(0, 0.66));
    const blade = r.blade.current!;
    blade.visible = cut > 0 && cut < 1;
    blade.position.set(lerp(0.9, -1.6, cut), lerp(2.4, 1.0, cut), 0.7);
    blade.rotation.z = lerp(-0.9, -0.2, cut);

    /* pod: hanging → falls to centre → opens → halves leave */
    const fall = seg(p, A(0, 0.66), A(1, 0.02));
    const open = seg(p, A(1, 0.15), A(1, 0.7));
    const leave = seg(p, A(2, 0.05), A(2, 0.45));
    const pod = r.pod.current!;
    pod.visible = p < A(2, 0.5);
    pod.position.set(lerp(-0.42, 0, fall), lerp(0.25, 0.05, fall) + Math.sin(fall * Math.PI) * 0.6, lerp(0.42, 0, fall));
    pod.rotation.set(fall * 0.25, fall * Math.PI * 2 + (p > A(1) ? Math.sin(t * 0.5) * 0.05 : 0), lerp(0.18, Math.PI / 2, fall));
    pod.updateMatrixWorld();

    const hA = r.halfA.current!;
    const hB = r.halfB.current!;
    const o = open + leave * 2.5;
    hA.position.set(o * 0.75, 0, 0);
    hA.rotation.set(0, o * 0.85, 0);
    hB.position.set(-o * 0.75, 0, 0);
    hB.rotation.set(0, -o * 0.85, 0);
    hA.scale.setScalar(1 - leave);
    hB.scale.setScalar(1 - leave);

    /* ── beans ── */
    const toTray = seg(p, A(2, 0.02), A(2, 0.62));
    const fermentCol = seg(p, A(2, 0.25), A(2, 0.95));
    const roastCol = seg(p, A(3, 0.0), A(3, 0.55));
    const bounce = seg(p, A(3, 0.05), A(3, 0.3)) * (1 - seg(p, A(3, 0.55), A(3, 0.7)));
    const crack = seg(p, A(3, 0.62), A(3, 0.92));

    if (roastCol > 0) mat.bean.color.copy(tmp.copy(C.dried).lerp(C.roasted, roastCol));
    else mat.bean.color.copy(mix3(C.pulp, C.ferment, C.dried, fermentCol));
    mat.bean.roughness = lerp(0.32, 0.65, fermentCol);
    mat.bean.clearcoat = lerp(0.6, 0.05, fermentCol);
    mat.bean.emissiveIntensity = bounce * (0.25 + Math.sin(t * 9) * 0.12);

    const beans = r.beans.current!;
    beans.visible = p > A(1, 0.05) && crack < 1;
    if (beans.visible) {
      pod.getWorldQuaternion(qPod);
      const pop = 0.27 + open * 0.09;
      for (let n = 0; n < BEANS; n++) {
        const lp = data.inPod[n];
        v.set(lp.x * (pop / 0.27), lp.y, lp.z * (pop / 0.27)).applyMatrix4(pod.matrixWorld);
        r.root.current!.worldToLocal(v);
        const tp = data.tray[n];
        const arc = Math.sin(toTray * Math.PI) * (1.2 + (n % 5) * 0.1);
        dummy.position.set(lerp(v.x, tp.x, toTray), lerp(v.y, tp.y, toTray) + arc, lerp(v.z, tp.z, toTray));
        dummy.position.y += Math.abs(Math.sin(t * 13 + n * 1.7)) * 0.14 * bounce;
        dummy.quaternion.slerpQuaternions(qPod, data.qTray[n], toTray);
        const shrink = 1 - fermentCol * 0.12;
        const s = (1 - crack) * shrink;
        dummy.scale.set(0.12 * s, 0.19 * s, 0.085 * s);
        dummy.updateMatrix();
        beans.setMatrixAt(n, dummy.matrix);
      }
      beans.instanceMatrix.needsUpdate = true;
    }

    /* ── nibs: crack → pile → pressed → recede ── */
    const gather = seg(p, A(4, 0.0), A(4, 0.32));
    const squash = seg(p, A(4, 0.32), A(4, 0.55));
    const recede = seg(p, A(4, 0.7), A(5, 0.05));
    const nibs = r.nibs.current!;
    nibs.visible = crack > 0 && recede < 1;
    if (nibs.visible) {
      for (let n = 0; n < BEANS * NIBS_PER; n++) {
        const bean = data.tray[Math.floor(n / NIBS_PER)];
        const off = data.nibOff[n];
        v.set(bean.x + off.x * crack, bean.y + 0.04 + off.y, bean.z + off.z * crack);
        const pl = data.pile[n];
        v2.set(pl.x * (1 + squash * 0.6), -0.86 + (pl.y + 0.86) * (1 - squash * 0.82), pl.z * (1 + squash * 0.6));
        dummy.position.lerpVectors(v, v2, gather);
        dummy.position.z -= recede * 2.5;
        dummy.position.y -= recede * 0.6;
        dummy.rotation.set(n * 1.3, n * 0.7 + crack, n * 2.1);
        dummy.scale.setScalar(crack * (1 - recede) * (1 - squash * 0.25));
        dummy.updateMatrix();
        nibs.setMatrixAt(n, dummy.matrix);
      }
      nibs.instanceMatrix.needsUpdate = true;
    }

    /* trays: banana leaf for fermenting, iron plate for roasting */
    const leafIn = seg(p, A(2, 0.0), A(2, 0.3)) * (1 - seg(p, A(3, 0.0), A(3, 0.25)));
    r.leafTray.current!.visible = leafIn > 0.001;
    r.leafTray.current!.scale.set(leafIn * 4.4, leafIn * 2.05, 1);
    const plateIn = seg(p, A(3, 0.05), A(3, 0.3)) * (1 - seg(p, A(4, 0.05), A(4, 0.3)));
    r.plate.current!.visible = plateIn > 0.001;
    r.plate.current!.scale.set(plateIn, 1, plateIn);
    r.heat.current!.intensity = bounce * 28;

    /* press plate */
    const down = seg(p, A(4, 0.2), A(4, 0.55));
    const up = seg(p, A(4, 0.62), A(4, 0.9));
    const press = r.press.current!;
    press.visible = down > 0 && up < 1;
    press.position.y = lerp(4.2, -0.86 + 0.95 * (1 - 0.82 * squash) + 0.14, down) + up * 4.5;

    /* ── cocoa butter pool → conching → shrinks into the bar ── */
    const spread = seg(p, A(4, 0.45), A(4, 0.95));
    const shrinkPool = seg(p, A(6, 0.0), A(6, 0.45));
    const pool = r.pool.current!;
    pool.visible = spread > 0 && shrinkPool < 1;
    const pr = Math.max(0.001, spread * 1.45 * (1 - shrinkPool) + Math.sin(t * 2) * 0.01 * spread);
    pool.scale.set(pr, 1, pr);
    const toIvory = seg(p, A(5, 0.2), A(5, 0.92));
    mat.pool.color.copy(tmp.copy(C.butter).lerp(C.ivory, toIvory));
    const swirl = seg(p, A(5, 0.0), A(5, 0.2)) * (1 - seg(p, A(5, 0.85), A(6, 0.1)));
    pool.rotation.y += dt * (0.25 + swirl * 2.2);

    /* ingredients falling in */
    const drops = r.drops.current!;
    drops.visible = p > A(5) && p < A(6);
    if (drops.visible) {
      data.drops.forEach((d, n) => {
        const st = A(5, 0.05 + d.d * 0.45);
        const ft = seg(p, st, st + S * 0.25);
        dummy.position.set(d.x, lerp(3.2, -0.86, ft * ft), d.z);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(1, 1 + ft * 0.4, 1).multiplyScalar(ft > 0 && ft < 0.98 ? 1 : 0);
        dummy.updateMatrix();
        drops.setMatrixAt(n, dummy.matrix);
      });
      drops.instanceMatrix.needsUpdate = true;
    }
    const sugar = r.sugar.current!;
    sugar.visible = drops.visible;
    if (sugar.visible) {
      data.sugar.forEach((d, n) => {
        const st = A(5, 0.15 + d.d * 0.45);
        const ft = seg(p, st, st + S * 0.22);
        dummy.position.set(d.x, lerp(3.2, -0.84, ft * ft), d.z);
        dummy.rotation.set(d.r + ft * 4, d.r, d.r * 0.5);
        dummy.scale.setScalar(ft > 0 && ft < 0.98 ? 1 : 0);
        dummy.updateMatrix();
        sugar.setMatrixAt(n, dummy.matrix);
      });
      sugar.instanceMatrix.needsUpdate = true;
    }
    const van = r.vanilla.current!;
    const vt = seg(p, A(5, 0.1), A(5, 0.55));
    const sink = seg(p, A(5, 0.55), A(5, 0.8));
    van.visible = vt > 0 && sink < 1;
    van.position.set(0.3, lerp(3.4, -0.84, vt) - sink * 0.1, -0.2);
    van.rotation.set(Math.PI / 2, 0, lerp(1.2, 0.3, vt) + t * 0.1 * (1 - vt));
    van.scale.set(1, 1, 1 - sink);

    /* ── 07 the bar rises out of the pool and turns to you ── */
    const bar = r.bar.current!;
    const rise = seg(p, A(6, 0.08), A(6, 0.6));
    const pose = seg(p, A(6, 0.4), A(6, 0.95));
    bar.visible = rise > 0;
    bar.position.set(0, lerp(-0.86, 0.05, pose), 0);
    bar.rotation.set(lerp(0, 1.05, pose), lerp(0, -0.55, pose) + pose * Math.sin(t * 0.5) * 0.08, lerp(0, 0.12, pose));
    r.pieces.current.forEach((pc, n) => {
      if (!pc) return;
      const st = seg(p, A(6, 0.08 + n * 0.022), A(6, 0.34 + n * 0.022));
      pc.scale.set(st, Math.max(0.001, st), st);
      pc.position.y = lerp(-0.25, 0, st);
    });
  });

  // 3 × 4 bar layout
  const barSquares: [number, number, number][] = [];
  for (let c = 0; c < 3; c++) for (let rr = 0; rr < 4; rr++) barSquares.push([(c - 1) * 1.0, 0, (rr - 1.5) * 1.0]);

  return (
    <group ref={r.root}>
      {/* trunk with cauliflorous pods and leaves */}
      <group ref={r.tree}>
        <mesh position={[-0.98, 0.4, 0]} rotation={[0, 0, 0.05]} material={mat.bark}>
          <cylinderGeometry args={[0.32, 0.4, 9, 24]} />
        </mesh>
        <mesh position={[-0.62, 1.35, 0.3]} rotation={[0, 0, -1.1]} material={mat.bark}>
          <cylinderGeometry args={[0.035, 0.05, 0.36, 8]} />
        </mesh>
        <mesh geometry={geo.podFull} material={mat.smallPodA} position={[-1.35, -1.25, 0.25]} rotation={[0.2, 0, -0.35]} scale={0.55} />
        <mesh geometry={geo.podFull} material={mat.smallPodB} position={[-0.68, -2.0, -0.3]} rotation={[-0.1, 0, 0.3]} scale={0.48} />
        <mesh geometry={geo.leaf} material={mat.leaf} position={[-0.9, 2.1, 0.2]} rotation={[0.3, 0.4, -0.9]} scale={1.2} />
        <mesh geometry={geo.leaf} material={mat.leafDark} position={[-1.1, 2.5, -0.2]} rotation={[-0.2, -0.5, 0.7]} scale={1.35} />
        <mesh geometry={geo.leaf} material={mat.leaf} position={[-1.0, 1.0, -0.4]} rotation={[0.5, 1.2, 1.5]} scale={1.0} />
        <mesh geometry={geo.leaf} material={mat.leafDark} position={[-0.8, -0.6, 0.4]} rotation={[0.2, -0.3, -1.9]} scale={0.9} />
      </group>

      <mesh ref={r.blade} material={mat.blade} visible={false}>
        <boxGeometry args={[1.3, 0.13, 0.02]} />
      </mesh>

      {/* the pod: two halves, cream inside */}
      <group ref={r.pod}>
        <group ref={r.halfA}>
          <mesh geometry={geo.podA} material={mat.pod} />
          <mesh geometry={geo.podA} material={mat.podInner} scale={0.985} />
        </group>
        <group ref={r.halfB}>
          <mesh geometry={geo.podB} material={mat.pod} />
          <mesh geometry={geo.podB} material={mat.podInner} scale={0.985} />
        </group>
      </group>

      <instancedMesh ref={r.beans} args={[geo.bean, mat.bean, BEANS]} frustumCulled={false} />
      <instancedMesh ref={r.nibs} args={[geo.nib, mat.nib, BEANS * NIBS_PER]} frustumCulled={false} />

      <mesh ref={r.leafTray} geometry={geo.leaf} material={mat.leaf} position={[0, -0.95, 1.78]} rotation={[-Math.PI / 2, 0, 0]} visible={false} />
      <mesh ref={r.plate} material={mat.plate} position={[0, -0.97, 0]} visible={false}>
        <cylinderGeometry args={[1.85, 1.85, 0.06, 64]} />
      </mesh>
      <pointLight ref={r.heat} position={[0, -0.4, 0.5]} color="#ff7a2a" intensity={0} distance={6} />

      <mesh ref={r.press} material={mat.press} visible={false}>
        <cylinderGeometry args={[1.05, 1.05, 0.26, 48]} />
      </mesh>

      <mesh ref={r.pool} material={mat.pool} position={[0, -0.9, 0]} visible={false}>
        <cylinderGeometry args={[1, 1, 0.06, 64]} />
      </mesh>

      <instancedMesh ref={r.drops} args={[geo.drop, mat.milk, DROPS]} frustumCulled={false} visible={false} />
      <instancedMesh ref={r.sugar} args={[geo.cube, mat.sugar, SUGAR]} frustumCulled={false} visible={false} />
      <mesh ref={r.vanilla} material={mat.vanilla} visible={false}>
        <capsuleGeometry args={[0.035, 1.5, 4, 10]} />
      </mesh>

      <group ref={r.bar} visible={false} scale={0.62}>
        {barSquares.map((pos, n) => (
          <group
            key={n}
            position={[pos[0], 0, pos[2]]}
            ref={(el) => {
              r.pieces.current[n] = el;
            }}
          >
            <Square mats={choco} />
          </group>
        ))}
      </group>
    </group>
  );
}

export default function MakingScene({ active, reduced }: { active: boolean; reduced: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.8, 6.4], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={active ? "always" : "never"}
    >
      <StudioLights />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={2.6} position={[0, 5, -2]} scale={[8, 2, 1]} color="#fff6ea" />
        <Lightformer form="rect" intensity={1} position={[0, 0, 6]} scale={[8, 3, 1]} color="#fff2e0" />
        <Lightformer form="rect" intensity={1.4} position={[5, 0, -3]} scale={[2, 5, 1]} color="#e3a7b6" />
      </Environment>
      <Process reduced={reduced} />
    </Canvas>
  );
}
