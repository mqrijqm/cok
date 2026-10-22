"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import { registerCurtain } from "@/lib/transition";
import { INTRO_DONE, prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

const HIDDEN_BELOW = "inset(100% 0% 0% 0%)";
const FULL = "inset(0% 0% 0% 0%)";
const HIDDEN_ABOVE = "inset(0% 0% 100% 0%)";

/**
 * Beige then magenta panels rise over the page with the destination's name,
 * the route changes underneath, then they lift away. Also opens the intro
 * gate on pages that have no preloader.
 */
export default function Curtain() {
  const beige = useRef<HTMLDivElement>(null);
  const magenta = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLSpanElement>(null);
  const covered = useRef(false);
  const first = useRef(true);
  const pathname = usePathname();
  const lenis = useLenis();
  const lenisRef = useRef(lenis);

  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

  useEffect(() => {
    registerCurtain({
      cover: (label) =>
        new Promise<void>((resolve) => {
          if (word.current) word.current.textContent = label;
          covered.current = true;
          if (prefersReducedMotion()) {
            gsap.set([beige.current, magenta.current], { clipPath: FULL });
            return resolve();
          }
          gsap
            .timeline({ onComplete: resolve })
            .fromTo(beige.current, { clipPath: HIDDEN_BELOW }, { clipPath: FULL, duration: 0.55, ease: "expo.inOut" })
            .fromTo(magenta.current, { clipPath: HIDDEN_BELOW }, { clipPath: FULL, duration: 0.6, ease: "expo.inOut" }, 0.12)
            .fromTo(word.current, { yPercent: 110, rotateX: -80 }, { yPercent: 0, rotateX: 0, duration: 0.7, ease: "expo.out" }, 0.35);
        }),
    });
    // Subpages have no preloader: open the intro gate straight away.
    if (!document.querySelector("[data-preloader]") && !window.__avorioIntroDone) {
      window.__avorioIntroDone = true;
      window.dispatchEvent(new Event(INTRO_DONE));
    }
    return () => registerCurtain(null);
  }, []);

  // New route is in the DOM (before paint): jump to the top, re-measure, lift the curtain.
  useLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const hash = window.location.hash;
    lenisRef.current?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      if (!hash) return;
      // Wait until pins have added their spacing, then jump to the measured position.
      window.setTimeout(() => {
        ScrollTrigger.refresh();
        const el = document.querySelector(hash);
        if (!el) return;
        const y = el.getBoundingClientRect().top + window.scrollY;
        lenisRef.current?.scrollTo(y, { immediate: true, force: true });
        window.scrollTo(0, y);
      }, 150);
    });

    if (!covered.current) return;
    covered.current = false;
    window.__avorioRevealAt = performance.now() + 450;
    if (prefersReducedMotion()) {
      gsap.set([beige.current, magenta.current], { clipPath: HIDDEN_BELOW });
      return;
    }
    gsap
      .timeline({ delay: 0.1 })
      .to(word.current, { yPercent: -110, rotateX: 80, duration: 0.45, ease: "power3.in" })
      .to(magenta.current, { clipPath: HIDDEN_ABOVE, duration: 0.75, ease: "expo.inOut" }, 0.2)
      .to(beige.current, { clipPath: HIDDEN_ABOVE, duration: 0.75, ease: "expo.inOut" }, 0.32)
      .set([beige.current, magenta.current], { clipPath: HIDDEN_BELOW });
  }, [pathname]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[96]">
      <div ref={beige} className="absolute inset-0 bg-beige" style={{ clipPath: HIDDEN_BELOW }} />
      <div ref={magenta} className="p3d absolute inset-0 grid place-items-center overflow-hidden bg-magenta text-beige" style={{ clipPath: HIDDEN_BELOW }}>
        <span ref={word} className="display block origin-bottom px-[var(--gutter)] text-center text-[clamp(64px,14vw,260px)] leading-[0.85]" />
      </div>
    </div>
  );
}
