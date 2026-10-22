"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Words stand up one by one as you scroll. `*word*` is set in italic serif. */
export default function FlipWords({ text, className = "", as: As = "p" }: { text: string; className?: string; as?: "p" | "h2" | "h3" | "blockquote" }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        ".fw",
        { rotateX: -92 },
        { rotateX: 0, ease: "power2.out", stagger: 0.1, scrollTrigger: { trigger: root.current, start: "top 88%", end: "center 55%", scrub: 0.6 } }
      );
    },
    { scope: root }
  );

  return (
    <As ref={root as React.Ref<never>} className={`p3d ${className}`}>
      {text.split(" ").map((w, i) => {
        const em = w.startsWith("*");
        const clean = w.replace(/\*/g, "");
        return (
          <span key={i} className={`fw mr-[0.22em] inline-block origin-bottom ${em ? "serif text-[1.1em] leading-[0.8]" : ""}`}>
            {clean}
          </span>
        );
      })}
    </As>
  );
}
