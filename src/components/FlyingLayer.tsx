"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { flyIntro } from "@/lib/scrollState";
import { useIntro } from "@/lib/useIntro";
import { useMediaQuery, useWebGL } from "@/lib/useMediaQuery";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const FlyingScene = dynamic(() => import("./three/FlyingScene"), { ssr: false });

/**
 * One fixed WebGL layer of white-chocolate pieces flying over the hero,
 * the story and the footer. It stops rendering everywhere else.
 * Rendered last on the page so its triggers measure after every pin.
 */
export default function FlyingLayer() {
  const [inHero, setInHero] = useState(true);
  const [inFooter, setInFooter] = useState(false);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const mobile = useMediaQuery("(max-width: 767px)");
  const webgl = useWebGL();

  useGSAP(() => {
    // start: -1 so the very top counts as "inside"; onRefresh re-syncs after jumps or a restored scroll position.
    ScrollTrigger.create({
      start: -1,
      endTrigger: "#story",
      end: "bottom top",
      onToggle: (s) => setInHero(s.isActive),
      onRefresh: (s) => setInHero(s.isActive),
    });
    ScrollTrigger.create({
      trigger: "#contatto",
      start: "top bottom",
      end: "bottom top",
      onToggle: (s) => setInFooter(s.isActive),
      onRefresh: (s) => setInFooter(s.isActive),
    });
  });

  useIntro(() => {
    gsap.to(flyIntro, { t: 1, duration: 2.6, ease: "power2.out", delay: 0.2 });
  });

  if (!webgl || reduced) return null;
  const active = inHero || inFooter;

  return (
    <div aria-hidden className={`pointer-events-none fixed inset-0 z-30 transition-opacity duration-700 ${active ? "opacity-100" : "opacity-0"}`}>
      <FlyingScene active={active} count={mobile ? 8 : 16} />
    </div>
  );
}
