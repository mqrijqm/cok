"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { flyIntro } from "@/lib/scrollState";
import type { FlyZone } from "@/lib/flyZones";
import { useIntro } from "@/lib/useIntro";
import { useMediaQuery, useWebGL } from "@/lib/useMediaQuery";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const FlyingScene = dynamic(() => import("./three/FlyingScene"), { ssr: false });

/**
 * One fixed WebGL layer of white-chocolate pieces. It renders only while one
 * of its zones is on screen. Render it last on a page so its triggers measure
 * after every pin.
 */
export default function FlyingLayer({ zones }: { zones: FlyZone[] }) {
  const [active, setActive] = useState<boolean[]>(() => zones.map((z, i) => i === 0 && z.start === -1));
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const mobile = useMediaQuery("(max-width: 767px)");
  const webgl = useWebGL();

  useGSAP(() => {
    zones.forEach((z, i) => {
      const set = (s: ScrollTrigger) => setActive((a) => (a[i] === s.isActive ? a : a.map((v, k) => (k === i ? s.isActive : v))));
      // onRefresh re-syncs after jumps or a restored scroll position.
      ScrollTrigger.create({ ...z, onToggle: set, onRefresh: set });
    });
  });

  useIntro(() => {
    gsap.fromTo(flyIntro, { t: 0 }, { t: 1, duration: 2.6, ease: "power2.out", delay: 0.2 });
  });

  if (!webgl || reduced) return null;
  const on = active.some(Boolean);

  return (
    <div aria-hidden className={`pointer-events-none fixed inset-0 z-30 transition-opacity duration-700 ${on ? "opacity-100" : "opacity-0"}`}>
      <FlyingScene active={on} count={mobile ? 8 : 16} />
    </div>
  );
}
