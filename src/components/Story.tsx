"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { M, STORY } from "@/lib/content";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** The one text section: each line on its own solid colour, hard edges between them. */
export default function Story() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>(".story-line").forEach((line) => {
        // Words stand up out of the floor, scrubbed to the scroll. No fading.
        gsap.fromTo(
          line.querySelectorAll(".sw"),
          { rotateX: -92 },
          { rotateX: 0, ease: "power2.out", stagger: 0.12, scrollTrigger: { trigger: line, start: "top 85%", end: "center 55%", scrub: 0.6 } }
        );
        // …and the whole line tips back as it leaves.
        gsap.to(line, {
          rotateX: 38,
          yPercent: -12,
          transformPerspective: 1200,
          transformOrigin: "50% 0%",
          ease: "none",
          scrollTrigger: { trigger: line, start: "center 35%", end: "bottom top", scrub: true },
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="story" className="relative z-10">
      {STORY.map((s, i) => (
        <div
          key={i}
          data-nav={s.bg === M ? "dark" : "light"}
          className="flex min-h-[100svh] items-center overflow-hidden px-[var(--gutter)] py-[12vh]"
          style={{ backgroundColor: s.bg, color: s.fg }}
        >
          <p
            className={`story-line p3d display max-w-[16ch] text-[clamp(50px,8.4vw,168px)] leading-[0.9] ${i % 2 ? "ml-auto text-right" : ""}`}
          >
            {s.pre.split(" ").map((w, k) => (
              <span key={`a${k}`} className="sw mr-[0.22em] inline-block origin-bottom">
                {w}
              </span>
            ))}
            <span className="sw serif mr-[0.22em] inline-block origin-bottom text-[1.12em] leading-[0.8]">{s.em}</span>
            {s.post.split(" ").map((w, k) => (
              <span key={`b${k}`} className="sw mr-[0.22em] inline-block origin-bottom">
                {w}
              </span>
            ))}
          </p>
        </div>
      ))}
    </section>
  );
}
