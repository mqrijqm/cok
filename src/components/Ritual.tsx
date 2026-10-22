"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { TypeOnScroll } from "./Reveal";
import { RITUAL } from "@/lib/content";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const CARD_STYLES = [
  "bg-cocoa-850 text-ivory-100 ring-1 ring-ivory-100/8",
  "bg-vermilion text-ivory-50",
  "bg-[#0c0907] text-ivory-100 ring-1 ring-ivory-100/10",
  "bg-cocoa-800 text-ivory-100 ring-1 ring-ivory-100/8",
];

// Final resting place of each card, as a fraction of card width/height.
const FAN = [
  { x: -0.68, y: -0.02, r: -5 },
  { x: -0.3, y: -0.08, r: 3 },
  { x: 0.08, y: -0.02, r: -1.5 },
  { x: 0.32, y: 0.16, r: 3.5 },
];

export default function Ritual() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop: "(min-width: 1024px)",
          mobile: "(max-width: 1023px)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { desktop, reduce } = ctx.conditions as { desktop: boolean; reduce: boolean };
          const cards = gsap.utils.toArray<HTMLElement>(".rt-card");
          const w = cards[0].offsetWidth;
          const h = cards[0].offsetHeight;
          const spread = desktop ? 1 : 0.18;
          const place = (i: number) => ({
            x: FAN[i].x * w * spread,
            y: FAN[i].y * h * (desktop ? 1 : 0.5) + (desktop ? 0 : i * 18),
            rotate: FAN[i].r,
          });

          if (reduce) {
            cards.forEach((c, i) => gsap.set(c, place(i)));
            return;
          }

          const tl = gsap.timeline({
            scrollTrigger: { trigger: root.current, start: "top top", end: "+=260%", pin: true, scrub: 0.9 },
          });
          cards.forEach((c, i) => {
            const p = place(i);
            tl.fromTo(
              c,
              { x: p.x + (desktop ? 120 : 20), y: window.innerHeight * (i === 0 ? 0.55 : 1.05), rotate: p.rotate + 14 },
              { ...p, ease: "power3.out", duration: 1 },
              i === 0 ? 0 : ">-0.35"
            );
          });
          tl.to({}, { duration: 0.4 });
        }
      );
    },
    { scope: root }
  );

  return (
    <section ref={root} id="rito" data-nav="dark" className="relative h-[100svh] overflow-hidden bg-cocoa-950 px-[var(--gutter)] pt-[96px]">
      <p className="label text-[12px] text-ivory-100/70">{RITUAL.label}</p>
      <TypeOnScroll
        as="h2"
        strong={RITUAL.heading}
        start="top 85%"
        end="top 20%"
        className="mt-3 max-w-[560px] font-display text-[clamp(30px,3.2vw,48px)] font-bold uppercase leading-[0.96] tracking-[-0.05em] text-ivory-100"
      />

      <div className="absolute inset-x-0 bottom-[6svh] top-[34svh] lg:left-[18%] lg:top-[30svh]">
        {RITUAL.steps.map((s, i) => (
          <article
            key={s.n}
            className={`rt-card absolute left-1/2 top-1/2 -ml-[min(39vw,190px)] -mt-[min(52vw,250px)] flex h-[min(104vw,500px)] w-[min(78vw,380px)] flex-col justify-between rounded-[24px] p-7 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.8)] ${CARD_STYLES[i]}`}
            style={{ zIndex: i + 1 }}
          >
            <span className="font-display text-[64px] font-semibold leading-none tracking-[-0.06em]">{s.n}</span>
            <div>
              <h3 className="font-display text-[clamp(26px,2.4vw,34px)] font-bold uppercase leading-[0.95] tracking-[-0.05em]">{s.title}</h3>
              <p className="mt-4 max-w-[280px] text-[14px] leading-[1.5] opacity-75">{s.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
