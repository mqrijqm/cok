"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { makeBlockGeometry, seeded, seg, lerp, windowPointer, BEIGE, MAGENTA } from "./chocolate";
import { makingState } from "@/lib/scrollState";

/* ───────────── timeline: seven acts across p ∈ [0,1] ───────────── */
const S = 1 / 7;
const A = (i: number, f = 0) => (i + f) * S;

/* ───────────── two-colour material ─────────────
   Every shape is either INK (the opposite of the background) or PAPER
   (the same as the background). The background wipes from the top between
   magenta and beige; this shader flips each pixel on the same line, so
   illustrations invert exactly where the wipe passes. No lighting at all. */
const U = {
  uM: { value: new THREE.Color(MAGENTA) },
  uB: { value: new THREE.Color(BEIGE) },
  uWipe: { value: 0 },
  uFromM: { value: 1 },
  uToM: { value: 1 },
  uRes: { value: new THREE.Vector2(1, 1) },
};

const VERT = /* glsl */ `
void main() {
  vec4 p = vec4(position, 1.0);
  #ifdef USE_INSTANCING
  p = instanceMatrix * p;
  #endif
  gl_Position = projectionMatrix * modelViewMatrix * p;
}`;

const FRAG = /* glsl */ `
uniform vec3 uM;
uniform vec3 uB;
uniform float uWipe;
uniform float uFromM;
uniform float uToM;
uniform vec2 uRes;
uniform float uRole;
void main() {
  float y = gl_FragCoord.y / uRes.y;
  float isNew = step(1.0 - uWipe, y);
  float bgIsM = mix(uFromM, uToM, isNew);
  float isM = mix(bgIsM, 1.0 - bgIsM, uRole);
  gl_FragColor = vec4(mix(uB, uM, isM), 1.0);
  #include <colorspace_fragment>
}`;

const INK = 1;
const PAPER = 0;
const flat = (role: number) =>
  new THREE.ShaderMaterial({ uniforms: { ...U, uRole: { value: role } }, vertexShader: VERT, fragmentShader: FRAG, side: THREE.DoubleSide });

/* ───────────── vector drawing helpers ───────────── */

type P = [number, number];
const strokeStyle = (w: number) => SVGLoader.getStrokeStyle(w, "#000", "round", "round", 4);
const strokeGeo = (pts: P[], w: number) => SVGLoader.pointsToStroke(pts.map(([x, y]) => new THREE.Vector2(x, y)), strokeStyle(w));
const strokes = (paths: P[][], w = 0.035, z = 0.004) => mergeGeometries(paths.map((p) => strokeGeo(p, w))).translate(0, 0, z);
const fill = (pts: P[]) => new THREE.ShapeGeometry(new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y))), 1);
const range = (n: number, f: (t: number) => P): P[] => Array.from({ length: n + 1 }, (_, i) => f(i / n));
const closed = (pts: P[]): P[] => [...pts, pts[0]];

/** Cacao pod outline: half-width at height y. */
const podW = 0.62;
const podH = 1.15;
const halfWidth = (y: number) => podW * Math.pow(Math.max(0, 1 - (y / podH) ** 2), 0.75) * (1 - 0.12 * (y / podH));

function podHalf(side: -1 | 1) {
  const edge = range(40, (t) => {
    const y = -podH + 2 * podH * t;
    return [side * halfWidth(y), y];
  });
  const shape = fill([...edge, [0, podH], [0, -podH]]);
  const ridges = [0.36, 0.7].map((f) =>
    range(30, (t) => {
      const y = -0.86 * podH + 1.72 * podH * t;
      return [side * f * halfWidth(y), y] as P;
    })
  );
  return { shape, ridges: strokes(ridges, 0.032) };
}

function leafPoints(len = 1.75, wid = 0.42): P[] {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.bezierCurveTo(wid, len * 0.2, wid * 0.95, len * 0.66, 0, len);
  s.bezierCurveTo(-wid * 0.95, len * 0.66, -wid, len * 0.2, 0, 0);
  return s.getPoints(18).map((v) => [v.x, v.y]);
}
function leafVeins(len = 1.75, wid = 0.42): P[][] {
  const v: P[][] = [
    [
      [0, 0.05],
      [0, len * 0.94],
    ],
  ];
  for (const f of [0.28, 0.48, 0.68]) {
    v.push([
      [0, len * f],
      [wid * 0.62, len * (f + 0.12)],
    ]);
    v.push([
      [0, len * f],
      [-wid * 0.62, len * (f + 0.12)],
    ]);
  }
  return v;
}

const ellipse = (rx: number, ry: number, n = 28): P[] => range(n, (t) => [Math.cos(t * Math.PI * 2) * rx, Math.sin(t * Math.PI * 2) * ry]);
const roundRect = (w: number, h: number, r: number): P[] => {
  const pts: P[] = [];
  const corners: [number, number, number][] = [
    [w / 2 - r, h / 2 - r, 0],
    [-w / 2 + r, h / 2 - r, Math.PI / 2],
    [-w / 2 + r, -h / 2 + r, Math.PI],
    [w / 2 - r, -h / 2 + r, Math.PI * 1.5],
  ];
  corners.forEach(([cx, cy, a0]) => {
    for (let i = 0; i <= 6; i++) {
      const a = a0 + (i / 6) * (Math.PI / 2);
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
  });
  return pts;
};
const drop = (w: number, h: number): P[] => {
  const s = new THREE.Shape();
  s.moveTo(0, h * 0.6);
  s.bezierCurveTo(w * 0.55, 0, w * 0.6, -h * 0.4, 0, -h * 0.4);
  s.bezierCurveTo(-w * 0.6, -h * 0.4, -w * 0.55, 0, 0, h * 0.6);
  return s.getPoints(16).map((v) => [v.x, v.y]);
};
const flame = (w: number, h: number): P[] => {
  const s = new THREE.Shape();
  s.moveTo(0, h);
  s.bezierCurveTo(w * 0.2, h * 0.6, w * 0.75, h * 0.35, w * 0.45, 0);
  s.bezierCurveTo(w * 0.3, -h * 0.15, -w * 0.3, -h * 0.15, -w * 0.45, 0);
  s.bezierCurveTo(-w * 0.75, h * 0.35, -w * 0.15, h * 0.55, 0, h);
  return s.getPoints(16).map((v) => [v.x, v.y]);
};

/** The bar as a line drawing, matching the 3D bar seen straight on. */
function barDrawing(cols = 3, rows = 4) {
  const paths: P[][] = [];
  const sq = (h: number, cx: number, cy: number): P[] =>
    closed([
      [cx - h, cy - h],
      [cx + h, cy - h],
      [cx + h, cy + h],
      [cx - h, cy + h],
    ]);
  paths.push(sq(1, 0, 0).map(([x, y]) => [(x * (cols - 0.02)) / 2, (y * (rows - 0.02)) / 2] as P));
  for (let r = rows - 1; r >= 0; r--)
    for (let c = 0; c < cols; c++) {
      const cx = (c - (cols - 1) / 2) * 1.0;
      const cy = (r - (rows - 1) / 2) * 1.0;
      paths.push(sq(0.48, cx, cy), sq(0.43, cx, cy), sq(0.29, cx, cy));
      for (const [sx, sy] of [
        [1, 1],
        [-1, 1],
        [-1, -1],
        [1, -1],
      ])
        paths.push([
          [cx + sx * 0.43, cy + sy * 0.43],
          [cx + sx * 0.29, cy + sy * 0.29],
        ]);
    }
  return strokes(paths, 0.03, 0.02);
}

/* ───────────── the scene ───────────── */

const BEANS = 24;
const NIBS_PER = 3;
const DROPS = 8;
const SUGAR = 8;

function Process({ reduced }: { reduced: boolean }) {
  const { camera, size, gl } = useThree();
  const pd = useRef(0);

  const mats = useMemo(() => ({ ink: flat(INK), paper: flat(PAPER), barLines: flat(INK) }), []);

  const geo = useMemo(() => {
    const L = podHalf(-1);
    const R = podHalf(1);
    const bigLeafPts = leafPoints(3.4, 1.05);
    return {
      podL: L.shape,
      podLRidges: L.ridges,
      podR: R.shape,
      podRRidges: R.ridges,
      podSeam: strokes([range(20, (t) => [0, -0.9 * podH + 1.8 * podH * t])], 0.03),
      trunk: fill(roundRect(0.6, 6.4, 0.28).map(([x, y]) => [x, y + 1.25] as P)),
      bark: strokes([-0.14, 0.02, 0.15].map((x, i) => range(40, (t) => [x + Math.sin(t * 18 + i) * 0.03, -1.7 + 6.1 * t]))),
      leaf: fill(leafPoints()),
      leafVeins: strokes(leafVeins(), 0.03),
      stem: strokes(
        [
          [
            [-1.05, 1.32],
            [-0.82, 1.42],
            [-0.6, 1.38],
          ],
        ],
        0.06
      ),
      cut: strokes(
        [
          [
            [-0.4, 0],
            [0.4, 0],
          ],
        ],
        0.05
      ),
      bean: fill(ellipse(0.105, 0.16)),
      beanSeam: strokes([range(10, (t) => [Math.sin(t * Math.PI) * 0.02, -0.12 + 0.24 * t])], 0.022),
      bigLeaf: strokes([closed(bigLeafPts), ...leafVeins(3.4, 1.05)], 0.045),
      sun: strokes(
        [
          ellipse(0.32, 0.32, 40),
          ...Array.from({ length: 10 }, (_, i): P[] => {
            const a = (i / 10) * Math.PI * 2;
            return [
              [Math.cos(a) * 0.48, Math.sin(a) * 0.48],
              [Math.cos(a) * 0.72, Math.sin(a) * 0.72],
            ];
          }),
        ],
        0.05
      ),
      pan: strokes([ellipse(1.45, 1.45, 64), ellipse(1.3, 1.3, 64), closed(roundRect(0.9, 0.22, 0.1).map(([x, y]) => [x + 1.95, y] as P))], 0.05),
      flame: fill(flame(0.38, 0.62)),
      nib: fill([
        [0, 0.07],
        [0.065, -0.05],
        [-0.06, -0.04],
      ]),
      press: fill(roundRect(2.1, 0.62, 0.08)),
      pressLines: strokes(
        [
          [
            [-0.9, 0.08],
            [0.9, 0.08],
          ],
          [
            [-0.9, -0.12],
            [0.9, -0.12],
          ],
        ],
        0.035,
        0.01
      ),
      screw: fill(roundRect(0.22, 3.2, 0.06).map(([x, y]) => [x, y + 1.9] as P)),
      drop: fill(drop(0.3, 0.42)),
      pool: new THREE.CircleGeometry(1, 64),
      spiral: strokes(
        [0, 1, 2].map((arm) =>
          range(80, (t) => {
            const a = t * 9 + arm * 2.09;
            const r = 0.08 + t * 0.82;
            return [Math.cos(a) * r, Math.sin(a) * r];
          })
        ),
        0.04,
        0.01
      ),
      cube: fill(
        closed([
          [-0.08, -0.08],
          [0.08, -0.08],
          [0.08, 0.08],
          [-0.08, 0.08],
        ])
      ),
      vanilla: fill(roundRect(0.09, 1.6, 0.045)),
      barLines: barDrawing(),
      barFill: new THREE.PlaneGeometry(2.98, 3.98).translate(0, -1.99, 0),
      bar3d: makeBlockGeometry(3, 4).rotateX(Math.PI / 2),
    };
  }, []);

  const rnd = useMemo(() => seeded(0.31), []);
  const data = useMemo(() => {
    const inPod: P[] = [];
    for (let r = 0; r < 6; r++)
      for (let c = 0; c < 4; c++) {
        const y = -0.72 + r * 0.29;
        inPod.push([(-0.27 + c * 0.18) * (halfWidth(y) / podW) * 1.3, y]);
      }
    const leafPos: P[] = inPod.map(() => {
      const a = rnd() * Math.PI * 2;
      const rr = Math.sqrt(rnd());
      return [Math.cos(a) * rr * 1.05, Math.sin(a) * rr * 0.5];
    });
    const rotZ = inPod.map(() => rnd() * Math.PI);
    const nibOff = Array.from({ length: BEANS * NIBS_PER }, () => [(rnd() - 0.5) * 0.3, (rnd() - 0.5) * 0.3, rnd() * 6] as [number, number, number]);
    const pile = Array.from({ length: BEANS * NIBS_PER }, () => {
      const h = Math.pow(rnd(), 1.4);
      return [(rnd() - 0.5) * 1.5 * (1 - h), h * 0.75] as P;
    });
    const fall = Array.from({ length: DROPS + SUGAR }, () => ({ x: (rnd() - 0.5) * 1.8, d: rnd(), r: rnd() * 6 }));
    return { inPod, leafPos, rotZ, nibOff, pile, fall };
  }, [rnd]);

  const R = {
    root: useRef<THREE.Group>(null),
    tree: useRef<THREE.Group>(null),
    leaves: useRef<(THREE.Group | null)[]>([]),
    cut: useRef<THREE.Mesh>(null),
    pod: useRef<THREE.Group>(null),
    halfL: useRef<THREE.Group>(null),
    halfR: useRef<THREE.Group>(null),
    beans: useRef<THREE.InstancedMesh>(null),
    seams: useRef<THREE.InstancedMesh>(null),
    bigLeaf: useRef<THREE.Mesh>(null),
    sun: useRef<THREE.Mesh>(null),
    pan: useRef<THREE.Group>(null),
    flames: useRef<(THREE.Mesh | null)[]>([]),
    nibs: useRef<THREE.InstancedMesh>(null),
    press: useRef<THREE.Group>(null),
    drops: useRef<(THREE.Mesh | null)[]>([]),
    pool: useRef<THREE.Group>(null),
    spiral: useRef<THREE.Mesh>(null),
    falling: useRef<THREE.InstancedMesh>(null),
    cubes: useRef<THREE.InstancedMesh>(null),
    vanilla: useRef<THREE.Mesh>(null),
    bar2d: useRef<THREE.Group>(null),
    barFill: useRef<THREE.Mesh>(null),
    bar3d: useRef<THREE.Group>(null),
  };

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const v = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, dt) => {
    pd.current = reduced ? makingState.p : THREE.MathUtils.damp(pd.current, makingState.p, 8, dt);
    const p = pd.current;
    const t = reduced ? 0 : state.clock.elapsedTime;

    // Colour wipe, shared with the DOM through makingState.
    U.uWipe.value = makingState.wipe;
    U.uFromM.value = makingState.fromM;
    U.uToM.value = makingState.toM;
    gl.getDrawingBufferSize(U.uRes.value);

    /* layout + a little pointer parallax to show the layers sit in depth */
    const portrait = size.width / size.height < 1;
    const root = R.root.current!;
    root.position.set(portrait ? 0 : 1.25, portrait ? 0.95 : 0.72, 0);
    root.scale.setScalar(portrait ? 0.6 : 1);
    root.updateMatrixWorld();
    camera.position.x = THREE.MathUtils.damp(camera.position.x, windowPointer.x * 0.35, 3, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, windowPointer.y * 0.25, 3, dt);
    camera.lookAt(0, 0, 0);

    /* ── 01 Raccolta: tree, pod, a cut ── */
    const treeOut = seg(p, A(0, 0.7), A(1, 0.05));
    const tree = R.tree.current!;
    tree.visible = treeOut < 1;
    tree.position.x = -treeOut * 2.5;
    tree.rotation.y = treeOut * (Math.PI / 2);
    R.leaves.current.forEach((lf, i) => {
      if (lf) lf.rotation.y = Math.sin(t * 0.9 + i * 1.7) * 0.55;
    });
    const cut = seg(p, A(0, 0.52), A(0, 0.64));
    const cutM = R.cut.current!;
    cutM.visible = cut > 0 && cut < 1;
    cutM.scale.set(Math.sin(cut * Math.PI) * 1.4 + 0.001, 1, 1);

    const grow = seg(p, 0, A(0, 0.45));
    const fallIn = seg(p, A(0, 0.64), A(1, 0.05));
    const open = seg(p, A(1, 0.15), A(1, 0.6));
    const leave = seg(p, A(2, 0.0), A(2, 0.35));
    const pod = R.pod.current!;
    pod.visible = leave < 1;
    pod.position.set(lerp(-0.6, 0, fallIn), lerp(0.25, 0, fallIn) + Math.sin(fallIn * Math.PI) * 0.7, lerp(0.25, 0.1, fallIn));
    pod.rotation.set(0, fallIn * Math.PI * 2, lerp(0.15 + Math.sin(t * 0.8) * 0.04 * (1 - fallIn), Math.PI / 2, fallIn));
    pod.scale.setScalar(lerp(0.8 + grow * 0.2, 1.35, fallIn));
    pod.updateMatrixWorld();

    const hL = R.halfL.current!;
    const hR = R.halfR.current!;
    hL.position.set(-open * 0.32 - leave * 3, 0, 0);
    hR.position.set(open * 0.32 + leave * 3, 0, 0);
    hL.rotation.set(0, open * 1.15 + leave * 2, 0);
    hR.rotation.set(0, -open * 1.15 - leave * 2, 0);

    /* ── beans: inside the pod → onto the leaf → roasting → crack ── */
    const toLeaf = seg(p, A(2, 0.08), A(2, 0.5));
    const roast = seg(p, A(3, 0.15), A(3, 0.35)) * (1 - seg(p, A(3, 0.5), A(3, 0.62)));
    const crack = seg(p, A(3, 0.6), A(3, 0.85));
    const beans = R.beans.current!;
    const seams = R.seams.current!;
    beans.visible = seams.visible = open > 0 && crack < 1;
    if (beans.visible) {
      for (let n = 0; n < BEANS; n++) {
        const [lx, ly] = data.inPod[n];
        v.set(lx * (1 + open * 0.15), ly, 0.03).applyMatrix4(pod.matrixWorld);
        root.worldToLocal(v);
        const [tx, ty] = data.leafPos[n];
        const arc = Math.sin(toLeaf * Math.PI) * (1 + (n % 4) * 0.15);
        dummy.position.set(lerp(v.x, tx, toLeaf), lerp(v.y, ty - 0.35, toLeaf) + arc, lerp(v.z, 0.05, toLeaf));
        dummy.position.y += Math.abs(Math.sin(t * 12 + n * 1.3)) * 0.18 * roast;
        dummy.rotation.set(0, toLeaf * Math.PI * 2 + roast * t * 4, lerp(Math.PI / 2, data.rotZ[n], toLeaf));
        dummy.scale.setScalar(Math.min(1, open * 3) * (1 - crack) * (1 + Math.sin(t * 3 + n) * 0.04 * seg(p, A(2, 0.5), A(2, 0.8))));
        dummy.updateMatrix();
        beans.setMatrixAt(n, dummy.matrix);
        dummy.position.z += 0.01;
        dummy.updateMatrix();
        seams.setMatrixAt(n, dummy.matrix);
      }
      beans.instanceMatrix.needsUpdate = true;
      seams.instanceMatrix.needsUpdate = true;
    }

    /* ── 03 the banana leaf unfolds; the sun turns ── */
    const leafIn = seg(p, A(2, 0.2), A(2, 0.45));
    const leafOut = seg(p, A(3, 0.02), A(3, 0.2));
    const bigLeaf = R.bigLeaf.current!;
    bigLeaf.visible = leafIn > 0 && leafOut < 1;
    bigLeaf.rotation.set(lerp(-1.1, 0, leafIn) + leafOut * 1.1, 0, Math.PI / 2);
    bigLeaf.scale.setScalar(Math.max(0.001, leafIn * (1 - leafOut)));
    bigLeaf.position.set(1.7, -0.35, -0.02);
    const sunIn = seg(p, A(2, 0.4), A(2, 0.65)) * (1 - seg(p, A(3, 0.0), A(3, 0.15)));
    const sun = R.sun.current!;
    sun.visible = sunIn > 0;
    sun.scale.setScalar(sunIn + 0.001);
    sun.position.set(1.7, 1.5 - (1 - sunIn) * 0.8, -0.1);
    sun.rotation.z = t * 0.3;

    /* ── 04 Tostatura: pan, flames, beans jump, then crack into nibs ── */
    const panIn = seg(p, A(3, 0.0), A(3, 0.18));
    const panUp = seg(p, A(4, 0.0), A(4, 0.2));
    const panOut = seg(p, A(4, 0.72), A(4, 0.98));
    const pan = R.pan.current!;
    pan.visible = panIn > 0 && panOut < 1;
    pan.position.set(0, -0.35 + panUp * 0.2 + panOut * 5, -0.03);
    pan.scale.setScalar(0.9);
    pan.rotation.set(lerp(Math.PI / 2, 0, panIn), panOut * 1.5, 0);
    const flameAmt = seg(p, A(3, 0.12), A(3, 0.3)) * (1 - seg(p, A(3, 0.62), A(3, 0.8)));
    R.flames.current.forEach((f, i) => {
      if (!f) return;
      f.visible = flameAmt > 0;
      f.scale.set(flameAmt + 0.001, (flameAmt + 0.001) * (1 + Math.sin(t * 14 + i * 2) * 0.18), 1);
    });

    const gather = seg(p, A(4, 0.0), A(4, 0.22));
    const squash = seg(p, A(4, 0.3), A(4, 0.45));
    const nibs = R.nibs.current!;
    nibs.visible = crack > 0 && panOut < 1;
    if (nibs.visible) {
      for (let n = 0; n < BEANS * NIBS_PER; n++) {
        const [bx, by] = data.leafPos[Math.floor(n / NIBS_PER)];
        const [ox, oy, rz] = data.nibOff[n];
        const [px, py] = data.pile[n];
        const sx = bx + ox * crack;
        const sy = by - 0.35 + oy * crack;
        dummy.position.set(
          lerp(sx, px * (1 + squash * 0.5), gather),
          lerp(sy, -0.35 + panUp * 0.2 + py * (1 - squash * 0.75), gather) + panOut * 5,
          0.06
        );
        dummy.rotation.set(0, crack * 3 + rz, rz + crack * 2);
        dummy.scale.setScalar(crack);
        dummy.updateMatrix();
        nibs.setMatrixAt(n, dummy.matrix);
      }
      nibs.instanceMatrix.needsUpdate = true;
    }

    /* ── 05 Pressatura: the press comes down, butter drips into a pool ── */
    const pressDown = seg(p, A(4, 0.12), A(4, 0.32));
    const press = R.press.current!;
    press.visible = pressDown > 0 && panOut < 1;
    press.position.set(0, lerp(4, -0.15 + 0.75 * (1 - squash * 0.75) + 0.31, pressDown) + panOut * 5, 0.08);
    press.rotation.y = panOut * -1.2;

    R.drops.current.forEach((d, i) => {
      if (!d) return;
      const st = A(4, 0.38 + i * 0.1);
      const k = seg(p, st, st + S * 0.22);
      d.visible = k > 0 && k < 1;
      d.position.set(-0.4 + i * 0.4, lerp(-0.3, -1.45, k * k), 0.02);
      d.scale.setScalar(Math.min(1, k * 6) + 0.001);
    });

    const poolGrow = seg(p, A(4, 0.45), A(4, 0.9));
    const poolUp = seg(p, A(4, 0.8), A(5, 0.15));
    const poolShrink = seg(p, A(6, 0.02), A(6, 0.25));
    const pool = R.pool.current!;
    pool.visible = poolGrow > 0 && poolShrink < 1;
    const pr = poolGrow * 1.25 * (1 - poolShrink) + 0.001;
    pool.position.set(0, lerp(-1.55, -0.1, poolUp), 0);
    pool.scale.set(pr, pr * lerp(0.32, 1, poolUp), pr);
    pool.rotation.x = lerp(0, -0.55, poolUp) * (1 - seg(p, A(5, 0.85), A(6, 0.05)));
    const swirl = 0.4 + seg(p, A(5, 0.3), A(5, 0.6)) * 2.5;
    R.spiral.current!.rotation.z -= dt * swirl * (reduced ? 0 : 1);

    /* ── 06 Concaggio: milk, sugar, vanilla fall in and dissolve ── */
    const falling = R.falling.current!;
    const cubes = R.cubes.current!;
    falling.visible = cubes.visible = p > A(5) && p < A(6, 0.05);
    if (falling.visible) {
      data.fall.forEach((f, n) => {
        const st = A(5, 0.05 + f.d * 0.5);
        const k = seg(p, st, st + S * 0.3);
        dummy.position.set(f.x * (1 - k * 0.6), lerp(3.4, -0.1, k * k), 0.05);
        dummy.rotation.set(f.r + k * 5, f.r + k * 3, f.r);
        dummy.scale.setScalar(k > 0 && k < 0.97 ? 1 : 0);
        dummy.updateMatrix();
        if (n < DROPS) falling.setMatrixAt(n, dummy.matrix);
        else cubes.setMatrixAt(n - DROPS, dummy.matrix);
      });
      falling.instanceMatrix.needsUpdate = true;
      cubes.instanceMatrix.needsUpdate = true;
    }
    const van = R.vanilla.current!;
    const vk = seg(p, A(5, 0.1), A(5, 0.55));
    van.visible = vk > 0 && vk < 0.98;
    van.position.set(0.4, lerp(3.6, 0, vk), 0.06);
    van.rotation.set(vk * Math.PI * 2, vk * 1.5, lerp(0.9, 0.2, vk));

    /* ── 07 Tempera: a line drawing, inked, then it turns into a real bar ── */
    const draw = seg(p, A(6, 0.06), A(6, 0.42));
    const inked = seg(p, A(6, 0.42), A(6, 0.52));
    const to3d = seg(p, A(6, 0.55), A(6, 0.95));
    const bar2d = R.bar2d.current!;
    bar2d.visible = draw > 0 && to3d <= 0;
    geo.barLines.setDrawRange(0, Math.floor(geo.barLines.attributes.position.count * draw));
    const barFill = R.barFill.current!;
    barFill.visible = inked > 0;
    barFill.scale.set(1, inked + 0.001, 1);
    mats.barLines.uniforms.uRole.value = inked >= 1 ? PAPER : INK;

    const bar3d = R.bar3d.current!;
    bar3d.visible = to3d > 0;
    bar3d.rotation.set(lerp(0, -0.95, to3d), lerp(0, 0.6, to3d) + to3d * Math.sin(t * 0.6) * 0.06, lerp(0, -0.2, to3d));
    bar3d.position.y = lerp(0, -0.1, to3d);
  });

  const leaves: { pos: [number, number, number]; rot: number; s: number }[] = [
    { pos: [-1.25, 1.9, 0.3], rot: -0.9, s: 1.1 },
    { pos: [-1.45, 2.3, -0.3], rot: 0.8, s: 1.2 },
    { pos: [-1.3, 0.2, 0.35], rot: 1.9, s: 0.9 },
    { pos: [-1.2, -0.8, -0.25], rot: -2.0, s: 0.8 },
  ];

  return (
    <group ref={R.root}>
      {/* 01 the tree */}
      <group ref={R.tree}>
        <mesh geometry={geo.trunk} material={mats.ink} position={[-1.35, 0, -0.4]} />
        <mesh geometry={geo.bark} material={mats.paper} position={[-1.35, 0, -0.4]} />
        {leaves.map((l, i) => (
          <group key={i} position={l.pos} rotation={[0, 0, l.rot]} scale={l.s}>
            <group
              ref={(el) => {
                R.leaves.current[i] = el;
              }}
            >
              <mesh geometry={geo.leaf} material={mats.ink} />
              <mesh geometry={geo.leafVeins} material={mats.paper} />
            </group>
          </group>
        ))}
        <mesh geometry={geo.stem} material={mats.ink} position={[0, 0, -0.1]} />
        <group position={[-0.95, -1.45, -0.2]} rotation={[0, 0, -0.3]} scale={0.5}>
          <mesh geometry={geo.podL} material={mats.ink} />
          <mesh geometry={geo.podR} material={mats.ink} />
          <mesh geometry={geo.podLRidges} material={mats.paper} />
          <mesh geometry={geo.podRRidges} material={mats.paper} />
        </group>
      </group>
      <mesh ref={R.cut} geometry={geo.cut} material={mats.ink} position={[-0.8, 1.4, 0.4]} rotation={[0, 0, -0.6]} visible={false} />

      {/* 01–02 the pod, two halves that swing open like doors */}
      <group ref={R.pod}>
        <group ref={R.halfL}>
          <mesh geometry={geo.podL} material={mats.ink} />
          <mesh geometry={geo.podLRidges} material={mats.paper} />
        </group>
        <group ref={R.halfR}>
          <mesh geometry={geo.podR} material={mats.ink} />
          <mesh geometry={geo.podRRidges} material={mats.paper} />
          <mesh geometry={geo.podSeam} material={mats.paper} />
        </group>
      </group>

      <instancedMesh ref={R.beans} args={[geo.bean, mats.ink, BEANS]} frustumCulled={false} visible={false} />
      <instancedMesh ref={R.seams} args={[geo.beanSeam, mats.paper, BEANS]} frustumCulled={false} visible={false} />

      {/* 03 */}
      <mesh ref={R.bigLeaf} geometry={geo.bigLeaf} material={mats.ink} visible={false} />
      <mesh ref={R.sun} geometry={geo.sun} material={mats.ink} visible={false} />

      {/* 04–05 */}
      <group ref={R.pan} visible={false}>
        <mesh geometry={geo.pan} material={mats.ink} />
        {[-0.55, 0, 0.55].map((x, i) => (
          <mesh
            key={i}
            ref={(el) => {
              R.flames.current[i] = el;
            }}
            geometry={geo.flame}
            material={mats.ink}
            position={[x, -1.78, 0]}
            visible={false}
          />
        ))}
      </group>
      <instancedMesh ref={R.nibs} args={[geo.nib, mats.ink, BEANS * NIBS_PER]} frustumCulled={false} visible={false} />
      <group ref={R.press} visible={false}>
        <mesh geometry={geo.press} material={mats.ink} />
        <mesh geometry={geo.pressLines} material={mats.paper} />
        <mesh geometry={geo.screw} material={mats.ink} />
      </group>
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          ref={(el) => {
            R.drops.current[i] = el;
          }}
          geometry={geo.drop}
          material={mats.ink}
          visible={false}
        />
      ))}

      {/* 05–07 the pool of cocoa butter, then white chocolate */}
      <group ref={R.pool} visible={false}>
        <mesh geometry={geo.pool} material={mats.ink} />
        <mesh ref={R.spiral} geometry={geo.spiral} material={mats.paper} />
      </group>
      <instancedMesh ref={R.falling} args={[geo.drop, mats.ink, DROPS]} frustumCulled={false} visible={false} />
      <instancedMesh ref={R.cubes} args={[geo.cube, mats.ink, SUGAR]} frustumCulled={false} visible={false} />
      <mesh ref={R.vanilla} geometry={geo.vanilla} material={mats.ink} visible={false} />

      {/* 07 drawing → inked → 3D */}
      <group ref={R.bar2d} scale={0.64} visible={false}>
        <mesh ref={R.barFill} geometry={geo.barFill} material={mats.ink} position={[0, 1.99, 0]} visible={false} />
        <mesh geometry={geo.barLines} material={mats.barLines} />
      </group>
      <group ref={R.bar3d} scale={0.64} visible={false}>
        <mesh geometry={geo.bar3d}>
          <meshBasicMaterial color={BEIGE} toneMapped={false} polygonOffset polygonOffsetFactor={1} polygonOffsetUnits={1} />
          <Edges threshold={15} lineWidth={2.4} color={MAGENTA} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

export default function MakingScene({ active, reduced }: { active: boolean; reduced: boolean }) {
  return (
    <Canvas
      flat
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 10], fov: 30 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={active ? "always" : "never"}
    >
      <Process reduced={reduced} />
    </Canvas>
  );
}
