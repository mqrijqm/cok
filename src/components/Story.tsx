"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { STATS, STORY } from "@/lib/content";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const STATS_THEME = { bg: "#f5dce1", fg: "#3f1521", accent: "#a23b5a" };

const isLight = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return ((n >> 16) * 0.299 + ((n >> 8) & 255) * 0.587 + (n & 255) * 0.114) / 255 > 0.6;
};

export default function Story() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current!;
      const reduced = prefersReducedMotion();
      const themes = [...STORY, STATS_THEME];

      // Background, text and accent colour follow whichever block holds the middle of the screen.
      gsap.utils.toArray<HTMLElement>(".story-block").forEach((block, i) => {
        const th = themes[i];
        ScrollTrigger.create({
          trigger: block,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (!self.isActive) return;
            gsap.to(section, { backgroundColor: th.bg, color: th.fg, "--accent": th.accent, duration: reduced ? 0 : 1, ease: "power2.out", overwrite: true });
          },
        });
      });

      if (reduced) return;

      // Words flip up out of the floor, scrubbed to the scroll.
      gsap.utils.toArray<HTMLElement>(".story-line").forEach((line) => {
        gsap.fromTo(
          line.querySelectorAll(".sw"),
          { rotateX: -85, yPercent: 40, opacity: 0.08 },
          {
            rotateX: 0,
            yPercent: 0,
            opacity: 1,
            ease: "power2.out",
            stagger: 0.12,
            scrollTrigger: { trigger: line, start: "top 85%", end: "center 52%", scrub: 0.6 },
          }
        );
        // …and keep drifting as the line leaves, for depth.
        gsap.to(line, {
          yPercent: -18,
          rotateX: 14,
          opacity: 0.25,
          transformPerspective: 1200,
          ease: "none",
          scrollTrigger: { trigger: line, start: "center 40%", end: "bottom top", scrub: true },
        });
      });

      // Count the stats up as they arrive.
      gsap.utils.toArray<HTMLElement>(".stat-num").forEach((el) => {
        const target = Number(el.dataset.value);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.8,
          ease: "expo.out",
          onUpdate: () => (el.textContent = String(Math.round(obj.v))),
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });
      gsap.from(".stat", {
        rotateY: -70,
        x: -60,
        opacity: 0,
        duration: 1.4,
        ease: "expo.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ".stats", start: "top 80%", once: true },
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="story"
      className="relative z-10"
      style={{ backgroundColor: STORY[0].bg, color: STORY[0].fg, ["--accent" as string]: STORY[0].accent }}
    >
      {STORY.map((s, i) => (
        <div
          key={i}
          data-nav={isLight(s.bg) ? "light" : "dark"}
          className="story-block flex min-h-[100svh] items-center px-[var(--gutter)] py-[12vh]"
        >
          <p
            className={`story-line p3d display max-w-[16ch] text-[clamp(50px,8.4vw,168px)] font-medium leading-[0.9] ${i % 2 ? "ml-auto text-right" : ""}`}
          >
            {s.pre.split(" ").map((w, k) => (
              <span key={`a${k}`} className="sw mr-[0.22em] inline-block origin-bottom">
                {w}
              </span>
            ))}
            <span className="sw serif mr-[0.22em] inline-block origin-bottom text-[1.12em] leading-[0.8] text-[var(--accent)]">{s.em}</span>
            {s.post.split(" ").map((w, k) => (
              <span key={`b${k}`} className="sw mr-[0.22em] inline-block origin-bottom">
                {w}
              </span>
            ))}
          </p>
        </div>
      ))}

      <div data-nav="light" className="story-block stats p3d grid min-h-[100svh] content-center gap-12 px-[var(--gutter)] py-[14vh] md:grid-cols-3 md:gap-6">
        {STATS.map((s) => (
          <div key={s.label} className="stat">
            <p className="display flex items-start text-[clamp(110px,15vw,280px)] font-medium leading-[0.8]">
              <span className="stat-num" data-value={s.value}>
                {s.value}
              </span>
              <span className="serif mt-[0.06em] text-[0.42em] text-[var(--accent)]">{s.unit}</span>
            </p>
            <p className="mt-5 max-w-[260px] text-[15px] leading-[1.5] opacity-75">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
