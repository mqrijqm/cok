"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { TypeOnScroll } from "./Reveal";
import ChocolateSquare from "./ChocolateSquare";
import { CRAFT_STATEMENT } from "@/lib/content";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Floating pieces: position (%), size (vw), rotation, parallax speed
const PIECES = [
  { x: 8, y: 38, s: 7, r: -18, v: -60 },
  { x: 30, y: 58, s: 4.2, r: 24, v: -140 },
  { x: 54, y: 30, s: 9.5, r: 12, v: -40 },
  { x: 74, y: 56, s: 5.5, r: -32, v: -180 },
  { x: 88, y: 26, s: 3.4, r: 40, v: -220 },
  { x: 64, y: 72, s: 3, r: -8, v: -260 },
];

export default function Craft() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>(".piece").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 0, rotate: Number(el.dataset.r) },
          {
            y: Number(el.dataset.v),
            rotate: Number(el.dataset.r) + 40,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      data-nav="light"
      className="relative flex min-h-[100svh] flex-col justify-between gap-[40svh] overflow-hidden bg-ivory-200 px-[var(--gutter)] pb-[clamp(60px,8vw,110px)] pt-[clamp(40px,5vw,80px)] text-cocoa-800"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {PIECES.map((p, i) => (
          <div
            key={i}
            className="piece absolute drop-shadow-[0_30px_30px_rgb(43_32_25/0.22)]"
            data-r={p.r}
            data-v={p.v}
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: `max(${p.s}vw, ${p.s * 7}px)`, rotate: `${p.r}deg` }}
          >
            <ChocolateSquare className="block h-auto w-full" />
          </div>
        ))}
      </div>

      <TypeOnScroll
        as="h2"
        strong={CRAFT_STATEMENT.strong}
        soft={CRAFT_STATEMENT.soft}
        caret="block"
        start="top 75%"
        end="center 40%"
        className="relative max-w-[900px] font-display text-[clamp(34px,5vw,72px)] font-bold uppercase leading-[0.98] tracking-[-0.05em]"
        softClassName="text-cocoa-800/40"
      />
      <p className="relative max-w-[440px] text-[15px] leading-[1.65] text-cocoa-800/80">{CRAFT_STATEMENT.body}</p>
    </section>
  );
}
