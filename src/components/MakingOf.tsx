"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { B, M, MAKING } from "@/lib/content";
import { makingState } from "@/lib/scrollState";
import { useMediaQuery, useWebGL } from "@/lib/useMediaQuery";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const MakingScene = dynamic(() => import("./three/MakingScene"), { ssr: false });

const ACTS = MAKING.length;
const WIPE = 0.022; // half-width of each colour wipe, in progress units
const isMagenta = (act: number) => act % 2 === 0;
const ease = (x: number) => x * x * (3 - 2 * x);

/** Which colours sit above/below the wipe line at progress p. */
function wipeAt(p: number) {
  for (let k = 1; k < ACTS; k++) {
    const b = k / ACTS;
    if (p > b - WIPE && p < b + WIPE) return { from: isMagenta(k - 1), to: isMagenta(k), wipe: ease((p - (b - WIPE)) / (2 * WIPE)) };
  }
  const act = Math.min(ACTS - 1, Math.floor(p * ACTS));
  return { from: isMagenta(act), to: isMagenta(act), wipe: 0 };
}

const CLIP = "inset(0 0 calc((1 - var(--wipe)) * 100%) 0)";

function Overlay({ step, top }: { step: number; top: boolean }) {
  return (
    <div
      aria-hidden={top}
      className="mk-layer pointer-events-none absolute inset-0 flex flex-col justify-between px-[var(--gutter)] pb-6 pt-[96px]"
      style={top ? { color: "var(--ink-to)", clipPath: CLIP } : { color: "var(--ink-from)" }}
    >
      <div className="label flex justify-between">
        <span>Making of</span>
        <span className="hidden sm:inline">Dal seme alla tavoletta</span>
      </div>

      <div>
        <div className="p3d relative h-[calc(clamp(64px,13.5vw,260px)*0.84+44px)]">
          {MAKING.map((m, i) => (
            <div key={m.it} className="mk-step absolute inset-x-0 bottom-0 origin-bottom" style={{ visibility: i === 0 ? "visible" : "hidden" }}>
              <p className="text-[clamp(13px,1.05vw,16px)]">{m.line}</p>
              <h3 className="display mt-3 whitespace-nowrap text-[clamp(64px,13.5vw,260px)] leading-[0.84]">{m.it}</h3>
            </div>
          ))}
        </div>
        <ol className="mt-5 grid grid-cols-7 gap-1.5">
          {MAKING.map((m, i) => (
            <li key={m.it} className={`h-[5px] rounded-full border-[1.5px] border-current ${i <= step ? "bg-current" : ""}`} />
          ))}
        </ol>
      </div>
    </div>
  );
}

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
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=900%",
        pin: true,
        scrub: true,
        onToggle: (self) => setInView(self.isActive),
        onUpdate: (self) => {
          const p = self.progress;
          const w = wipeAt(p);
          makingState.p = p;
          makingState.wipe = w.wipe;
          makingState.fromM = w.from ? 1 : 0;
          makingState.toM = w.to ? 1 : 0;
          section.style.setProperty("--wipe", String(w.wipe));
          section.style.setProperty("--bg-from", w.from ? M : B);
          section.style.setProperty("--ink-from", w.from ? B : M);
          section.style.setProperty("--bg-to", w.to ? M : B);
          section.style.setProperty("--ink-to", w.to ? B : M);
          section.dataset.nav = (w.wipe > 0.05 ? w.to : w.from) ? "dark" : "light";
          const s = Math.min(ACTS - 1, Math.floor(p * ACTS));
          if (s !== prev.current) setStep(s);
        },
      });
    },
    { scope: root }
  );

  // The act title flips over on X: the old one tips away, the new one stands up.
  useEffect(() => {
    const from = prev.current;
    if (from === step) return;
    const dir = step > from ? 1 : -1;
    prev.current = step;
    root.current?.querySelectorAll<HTMLElement>(".mk-layer").forEach((layer) => {
      layer.querySelectorAll<HTMLElement>(".mk-step").forEach((b, i) => {
        if (reduced) {
          gsap.set(b, { autoAlpha: i === step ? 1 : 0 });
        } else if (i === step) {
          gsap.fromTo(
            b,
            { autoAlpha: 1, rotateX: -90 * dir, yPercent: 30 * dir },
            { rotateX: 0, yPercent: 0, duration: 0.9, ease: "expo.out", overwrite: true }
          );
        } else if (i === from) {
          gsap.to(b, { rotateX: 90 * dir, yPercent: -30 * dir, duration: 0.5, ease: "power3.in", overwrite: true, onComplete: () => gsap.set(b, { autoAlpha: 0 }) });
        } else {
          gsap.set(b, { autoAlpha: 0 });
        }
      });
    });
  }, [step, reduced]);

  return (
    <section
      ref={root}
      id="making"
      data-nav="dark"
      className="relative z-10 h-[100svh] overflow-hidden"
      style={{ ["--wipe" as string]: 0, ["--bg-from" as string]: M, ["--bg-to" as string]: M, ["--ink-from" as string]: B, ["--ink-to" as string]: B }}
    >
      <div className="absolute inset-0" style={{ background: "var(--bg-from)" }} />
      <div className="absolute inset-0" style={{ background: "var(--bg-to)", clipPath: CLIP }} />
      <div className="absolute inset-0">{near && webgl && <MakingScene active={inView} reduced={reduced} />}</div>
      <Overlay step={step} top={false} />
      <Overlay step={step} top />
    </section>
  );
}
