"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { TRANSITION_WORDS } from "@/lib/content";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Beige / magenta banners; the last one is the making-of's opening magenta.
const PANELS = [
  { bg: "#f1e7d6", fg: "#6a0c6f", nav: "light" },
  { bg: "#6a0c6f", fg: "#f1e7d6", nav: "dark" },
  { bg: "#f1e7d6", fg: "#6a0c6f", nav: "light" },
  { bg: "#6a0c6f", fg: "#f1e7d6", nav: "dark" },
];

/** Colour banners swing down on a top hinge, one after another, each carrying a word. */
export default function FlipTransition() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const panels = gsap.utils.toArray<HTMLElement>(".flip-panel");
      if (prefersReducedMotion()) {
        gsap.set(panels, { rotateX: 0 });
        return;
      }
      gsap.set(panels, { rotateX: -105, transformOrigin: "50% 0%" });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.7 },
      });
      panels.forEach((panel, i) => {
        tl.to(panel, { rotateX: 0, ease: "power2.out", duration: 1 }, i);
        tl.fromTo(panel.querySelector(".flip-word"), { yPercent: 40, scale: 0.85 }, { yPercent: 0, scale: 1, ease: "power3.out", duration: 1 }, i);
        if (i > 0) tl.to(panels[i - 1], { scale: 0.92, ease: "none", duration: 1 }, i);
      });
      tl.to({}, { duration: 0.3 });
    },
    { scope: root }
  );

  return (
    <section ref={root} aria-hidden className="relative z-10 h-[420svh] bg-magenta">
      <div className="p3d-deep sticky top-0 h-[100svh] overflow-hidden" style={{ perspectiveOrigin: "50% 0%" }}>
        {PANELS.map((p, i) => (
          <div
            key={i}
            data-nav={p.nav}
            className="flip-panel absolute inset-0 grid place-items-center overflow-hidden backface-hidden"
            style={{ backgroundColor: p.bg, color: p.fg }}
          >
            <span className={`flip-word ${i % 2 ? "serif text-[30vw]" : "display text-[27vw] font-medium"} leading-none`}>{TRANSITION_WORDS[i]}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
