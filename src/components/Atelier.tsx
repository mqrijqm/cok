"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { TypeOnScroll } from "./Reveal";
import { CRAFT_TABS, STATEMENT, paintings } from "@/lib/content";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const TAB_MS = 7;

function CraftTabs() {
  const root = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState(0);
  const [item, setItem] = useState(0);
  const [inView, setInView] = useState(false);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);

  useGSAP(
    () => {
      ScrollTrigger.create({ trigger: root.current, start: "top 75%", end: "bottom 20%", onToggle: (s) => setInView(s.isActive) });
    },
    { scope: root }
  );

  // Auto-advance: the active bar fills, then the next tab takes over.
  useEffect(() => {
    bars.current.forEach((b, i) => b && gsap.set(b, { scaleX: i < tab ? 1 : 0 }));
    const bar = bars.current[tab];
    if (!bar || !inView || prefersReducedMotion()) return;
    const tw = gsap.fromTo(
      bar,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: TAB_MS,
        ease: "none",
        onComplete: () => {
          setTab((t) => (t + 1) % CRAFT_TABS.length);
          setItem(0);
        },
      }
    );
    return () => {
      tw.kill();
    };
  }, [tab, inView]);

  // Crossfade the framed painting when the tab changes.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(".ct-frame", { autoAlpha: 0, scale: 1.04, y: 14 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.9, ease: "expo.out" });
      gsap.fromTo(".ct-blur", { autoAlpha: 0 }, { autoAlpha: 0.75, duration: 1.2, ease: "power2.out" });
    },
    { scope: root, dependencies: [tab] }
  );

  const active = CRAFT_TABS[tab];
  const img = paintings[active.image];

  return (
    <div ref={root} className="overflow-hidden rounded-[24px] bg-ivory-100 text-cocoa-800">
      <div role="tablist" aria-label="The craft" className="grid grid-cols-2 sm:flex">
        {CRAFT_TABS.map((t, i) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={i === tab}
            onClick={() => {
              setTab(i);
              setItem(0);
            }}
            className={`flex items-baseline gap-1.5 px-6 py-5 font-display text-[15px] font-bold uppercase tracking-[-0.02em] transition-colors duration-300 sm:py-7 lg:px-7 ${
              i === tab ? "bg-vermilion text-ivory-50" : "hover:bg-cocoa-800/5"
            }`}
          >
            {t.key}
            <span className="font-mono text-[9px] font-normal opacity-60">0{i + 1}</span>
          </button>
        ))}
      </div>

      <div className="flex gap-1.5 px-5 pt-5 lg:px-7">
        {CRAFT_TABS.map((t, i) => (
          <span key={t.key} className="relative h-[3px] w-full max-w-[100px] overflow-hidden rounded-full bg-cocoa-800/10">
            <span
              ref={(el) => {
                bars.current[i] = el;
              }}
              className="absolute inset-0 origin-left bg-vermilion"
            />
          </span>
        ))}
      </div>

      <div className="grid gap-6 p-5 lg:min-h-[560px] lg:grid-cols-[minmax(300px,1fr)_2fr] lg:p-7">
        <div className="order-2 flex flex-col gap-2.5 lg:order-1">
          {active.items.map((it, i) =>
            i === item ? (
              <div key={it.title} className="rounded-[20px] bg-ivory-300/70 p-5">
                <p className="text-[14px] font-semibold">{it.title}</p>
                <p className="mt-3 max-w-[320px] text-[13px] leading-[1.55] text-cocoa-800/75">{it.body}</p>
                <a href="#abbonamento" className="btn btn-ghost btn-sm mt-4 !text-[12px] text-cocoa-800">
                  Taste it <span aria-hidden>→</span>
                </a>
              </div>
            ) : (
              <button
                key={it.title}
                onClick={() => setItem(i)}
                className="flex items-center justify-between self-start rounded-full bg-ivory-300/70 py-2.5 pl-4 pr-2.5 font-display text-[13px] font-bold uppercase tracking-[-0.01em] transition-colors hover:bg-ivory-300"
              >
                {it.title}
                <span className="ml-3 grid h-5 w-5 place-items-center rounded-full bg-cocoa-800/10 text-[13px] leading-none">+</span>
              </button>
            )
          )}
        </div>

        <div className="relative order-1 grid min-h-[380px] place-items-center overflow-hidden rounded-[18px] lg:order-2">
          <Image
            src={img}
            alt=""
            fill
            sizes="60vw"
            className="ct-blur scale-125 object-cover opacity-75 blur-[40px]"
            style={{ objectPosition: active.focus }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ivory-100 via-ivory-100/40 to-transparent" />
          <div className="ct-frame relative aspect-[4/3] w-[78%] max-w-[560px] overflow-hidden rounded-[6px] shadow-[0_30px_70px_-20px_rgb(20_15_11/0.6)] ring-1 ring-gold/60">
            <Image
              src={img}
              alt={`${active.key}: detail of a painting with Avorio white chocolate`}
              fill
              sizes="(min-width: 1024px) 40vw, 80vw"
              className="scale-[1.6] object-cover"
              style={{ objectPosition: active.focus, transformOrigin: active.focus }}
            />
            <span className="label absolute bottom-3 left-3 rounded-full bg-cocoa-950/60 px-2.5 py-1 text-[9px] text-ivory-100 backdrop-blur">
              {active.key} · 0{tab + 1}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Dark → cream: chocolate squares set row by row as you scroll. */
function SquaresTransition() {
  const root = useRef<HTMLDivElement>(null);
  const COLS = 14;
  const ROWS = 4;

  useGSAP(
    () => {
      const cells = gsap.utils.toArray<HTMLElement>(".sq-cell", root.current);
      if (prefersReducedMotion()) {
        gsap.set(cells, { scale: 1 });
        return;
      }
      gsap.set(cells, { scale: 0 });
      // Bottom rows first, with a little randomness inside each row.
      const order = cells
        .map((el, i) => ({ el, w: (ROWS - 1 - Math.floor(i / COLS)) + Math.random() * 1.6 }))
        .sort((a, b) => a.w - b.w)
        .map((o) => o.el);
      gsap.to(order, {
        scale: 1.04,
        ease: "power2.out",
        stagger: { each: 0.02 },
        scrollTrigger: { trigger: root.current, start: "top 95%", end: "bottom 65%", scrub: 0.6 },
      });
    },
    { scope: root }
  );

  return (
    <div
      ref={root}
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 grid h-[clamp(150px,20vw,300px)]"
      style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}
    >
      {Array.from({ length: COLS * ROWS }).map((_, i) => (
        <span key={i} className="sq-cell rounded-[3px] bg-ivory-200" />
      ))}
    </div>
  );
}

export default function Atelier() {
  return (
    <section id="atelier" data-nav="dark" className="relative bg-cocoa-950 px-[var(--gutter)] pb-[clamp(220px,28vw,420px)] pt-[clamp(80px,12vw,180px)]">
      <TypeOnScroll
        strong={STATEMENT.strong}
        soft={STATEMENT.soft}
        className="ml-auto max-w-[960px] text-right font-display text-[clamp(30px,4.3vw,62px)] font-medium leading-[1.06] tracking-[-0.055em] text-ivory-100"
        softClassName="text-ivory-100/40"
      />
      <div className="mt-[clamp(60px,8vw,120px)]">
        <CraftTabs />
      </div>
      <SquaresTransition />
    </section>
  );
}
