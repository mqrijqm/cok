"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Every `.rise` inside `scope` stands up (rotateX from flat) the first
 * time it enters the viewport. No fading: edge-on is invisible on its own.
 */
export function useRise(scope: React.RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>(".rise").forEach((el) => {
        // +90 tips the top edge away from the viewer. (-90 brings tall elements
        // through the perspective plane and their projection blows up the page width.)
        gsap.from(el, {
          rotateX: 90,
          yPercent: 25,
          transformPerspective: 900,
          transformOrigin: "50% 100%",
          duration: 1.2,
          ease: "expo.out",
          delay: Number(el.dataset.delay ?? 0),
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        });
      });
    },
    { scope }
  );
}
