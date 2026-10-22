"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MAKING } from "@/lib/content";
import { makingState } from "@/lib/scrollState";
import { useMediaQuery, useWebGL } from "@/lib/useMediaQuery";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const MakingScene = dynamic(() => import("./three/MakingScene"), { ssr: false });

const LIGHT_FROM = 5; // acts 06 and 07 sit on light backgrounds

export default function MakingOf() {
  const root = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const [near, setNear] = useState(false);
  const [inView, setInView] = useState(false);
  const prev = useRef(0);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const webgl = useWebGL();

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "150% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      const section = root.current!;
      const bgAt = gsap.utils.interpolate(MAKING.map((m) => m.bg));
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=900%",
        pin: true,
        scrub: true,
        onToggle: (self) => setInView(self.isActive),
        onUpdate: (self) => {
          const p = self.progress;
          makingState.p = p;
          section.style.backgroundColor = bgAt(Math.min(1, p * 1.08));
          const s = Math.min(MAKING.length - 1, Math.floor(p * MAKING.length));
          if (s !== prev.current) setStep(s);
        },
      });
    },
    { scope: root }
  );

  // Rotational swap of the act titles.
  useEffect(() => {
    const blocks = root.current?.querySelectorAll<HTMLElement>(".mk-step");
    if (!blocks) return;
    const from = prev.current;
    const dir = step >= from ? 1 : -1;
    prev.current = step;
    if (reduced) {
      blocks.forEach((b, i) => gsap.set(b, { autoAlpha: i === step ? 1 : 0 }));
      return;
    }
    blocks.forEach((b, i) => {
      if (i === step) {
        gsap.fromTo(
          b,
          { autoAlpha: 0, rotateX: -80 * dir, yPercent: 40 * dir },
          { autoAlpha: 1, rotateX: 0, yPercent: 0, duration: 1, ease: "expo.out", transformPerspective: 1000, overwrite: true }
        );
      } else if (i === from) {
        gsap.to(b, { autoAlpha: 0, rotateX: 80 * dir, yPercent: -40 * dir, duration: 0.6, ease: "power3.in", transformPerspective: 1000, overwrite: true });
      } else {
        gsap.set(b, { autoAlpha: 0 });
      }
    });
  }, [step, reduced]);

  const light = step >= LIGHT_FROM;

  return (
    <section
      ref={root}
      id="making"
      data-nav={light ? "light" : "dark"}
      className={`relative z-10 h-[100svh] overflow-hidden transition-colors duration-700 ${light ? "text-wine-900" : "text-ivory-100"}`}
      style={{ backgroundColor: MAKING[0].bg }}
    >
      <div className="absolute inset-0">{near && webgl && <MakingScene active={inView} reduced={reduced} />}</div>

      <div className="pointer-events-none relative z-10 flex h-full flex-col justify-between px-[var(--gutter)] pb-6 pt-[96px]">
        <p className="label flex items-center gap-3 text-[10px]">
          <span className={`h-px w-10 ${light ? "bg-wine-900/40" : "bg-rose-300/60"}`} />
          Making of — dal seme alla tavoletta
        </p>

        <div className="relative h-[46svh] max-w-[620px] md:h-[52svh]">
          {MAKING.map((m, i) => (
            <div key={m.n} className="mk-step absolute inset-x-0 top-0 origin-bottom" style={{ opacity: i === 0 ? 1 : 0 }}>
              <div className="flex items-end gap-4">
                <span className={`serif text-[clamp(90px,13vw,230px)] leading-[0.75] ${i >= LIGHT_FROM ? "text-wine-500" : "text-rose-300"}`}>{m.n}</span>
                <span className="label mb-3 text-[10px] opacity-70">/ 07</span>
              </div>
              <h3 className="display mt-4 text-[clamp(54px,8.6vw,160px)] font-medium leading-[0.82]">{m.it}</h3>
              <p className="serif mt-2 text-[clamp(26px,2.6vw,42px)] leading-none opacity-80">{m.en}</p>
              <p className="mt-5 max-w-[380px] text-[15px] leading-[1.55] opacity-80">{m.body}</p>
              <p className="label mt-4 text-[10px] opacity-60">{m.fact}</p>
            </div>
          ))}
        </div>

        <ol className="grid grid-cols-7 gap-1.5">
          {MAKING.map((m, i) => (
            <li key={m.n}>
              <span className={`block h-[3px] rounded-full transition-colors duration-500 ${i <= step ? (light ? "bg-wine-900" : "bg-rose-300") : light ? "bg-wine-900/15" : "bg-ivory-100/15"}`} />
              <span className={`label mt-2 hidden text-[9px] transition-opacity duration-500 md:block ${i === step ? "opacity-100" : "opacity-40"}`}>
                {m.n} {m.it}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
