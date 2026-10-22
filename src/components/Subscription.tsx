"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { RevealLines } from "./Reveal";
import { SUBSCRIPTION as S, paintings } from "@/lib/content";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function Check() {
  return (
    <svg viewBox="0 0 14 14" className="mt-[3px] h-3.5 w-3.5 shrink-0 text-vermilion" aria-hidden>
      <path d="M2 7.5 5.5 11 12 3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Subscription() {
  const root = useRef<HTMLElement>(null);
  const [tab, setTab] = useState(0);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".plan", { y: 70, autoAlpha: 0, duration: 1.2, ease: "expo.out", stagger: 0.12, scrollTrigger: { trigger: ".plans", start: "top 85%", once: true } });
      gsap.from(".arch", { yPercent: 30, autoAlpha: 0, duration: 1.4, ease: "expo.out", stagger: 0.15, delay: 0.3, scrollTrigger: { trigger: ".plans", start: "top 80%", once: true } });
      gsap.from(".math-fill", { scaleX: 0, duration: 1.6, ease: "expo.out", stagger: 0.2, scrollTrigger: { trigger: ".math", start: "top 85%", once: true } });
    },
    { scope: root }
  );

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(".tab-col", { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: "expo.out", stagger: 0.06 });
    },
    { scope: root, dependencies: [tab] }
  );

  return (
    <section
      ref={root}
      id="abbonamento"
      data-nav="light"
      className="relative bg-ivory-200 px-[var(--gutter)] pb-[clamp(60px,7vw,110px)] pt-[clamp(70px,9vw,140px)] text-cocoa-800"
    >
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div>
          <span className="pill">{S.pill}</span>
          <RevealLines
            lines={S.heading}
            lineClassNames={["", "pl-[0.45em]"]}
            className="display mt-6 text-[clamp(52px,7.4vw,108px)] leading-[0.86]"
          />
        </div>
        <p className="max-w-[440px] pb-2 text-[15px] leading-[1.6] text-cocoa-800/80">{S.intro}</p>
      </div>

      <div className="plans mt-[clamp(40px,5vw,72px)] grid gap-5 lg:grid-cols-2">
        {S.plans.map((p, i) => (
          <article
            key={p.tier}
            className="plan relative flex min-h-[420px] flex-col lg:min-h-[540px] overflow-hidden rounded-[24px] p-[clamp(22px,2.2vw,34px)] ring-1 ring-cocoa-800/8"
            style={{
              background:
                "linear-gradient(118deg, rgb(255 255 255 / 0) 30%, rgb(255 255 255 / 0.38) 44%, rgb(255 255 255 / 0) 58%), linear-gradient(160deg, #efe5d3 0%, #ddcdb0 100%)",
            }}
          >
            <div className="flex items-center gap-3">
              <span className="label text-[10px] text-cocoa-800/60">{p.tier}</span>
              {"badge" in p && p.badge && <span className="pill !px-2.5 !py-1.5 !text-[9px]">{p.badge}</span>}
            </div>
            <p className="mt-6 font-display text-[clamp(64px,6.2vw,92px)] font-medium leading-none tracking-[-0.06em]">{p.price}</p>
            <p className="mt-2 text-[12px] text-cocoa-800/60">{p.per}</p>
            <h3 className="mt-8 text-[22px] font-semibold tracking-[-0.01em]">{p.title}</h3>
            <p className="mt-3 max-w-[330px] text-[14px] leading-[1.55] text-cocoa-800/70">{p.body}</p>
            <p className="label mt-6 text-[10px] text-cocoa-800/50">{p.footnote}</p>
            <div className="mt-auto pt-8">
              <a href="#contatto" className={`btn btn-sm ${i === 0 ? "btn-ghost text-cocoa-800" : ""}`}>
                {p.cta} {i === 1 && <span aria-hidden>→</span>}
              </a>
            </div>

            {/* A Renaissance window instead of a mascot */}
            <div className="arch absolute right-5 top-5 h-[150px] w-[104px] overflow-hidden rounded-b-[6px] rounded-t-full ring-[3px] ring-gold/70 ring-offset-4 ring-offset-[#e8dcc6] sm:h-[190px] sm:w-[132px] lg:bottom-0 lg:right-[clamp(20px,3vw,48px)] lg:top-auto lg:h-[46%] lg:w-[clamp(140px,15vw,220px)] lg:rounded-b-none lg:ring-offset-[#e3d5bb]">
              <Image src={paintings[p.image]} alt="" fill sizes="220px" className="scale-[1.7] object-cover" style={{ objectPosition: p.focus, transformOrigin: p.focus }} />
            </div>
          </article>
        ))}
      </div>

      <div className="mt-5 flex flex-col items-start gap-4 rounded-[18px] bg-ivory-100/50 px-5 py-4 ring-1 ring-cocoa-800/10 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] text-cocoa-800/80">
          <span className="label mr-3 text-[10px] text-cocoa-800">{S.atelier.label}</span>
          {S.atelier.body}
        </p>
        <a href="#contatto" className="btn btn-ghost btn-sm shrink-0 text-cocoa-800">
          {S.atelier.cta}
        </a>
      </div>

      <div className="mt-[clamp(48px,6vw,90px)] grid gap-12 lg:grid-cols-2">
        <div>
          <p className="label text-[10px] text-cocoa-800/60">Always included</p>
          <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {S.included.map((x) => (
              <li key={x} className="flex gap-2.5 text-[14px]">
                <Check />
                {x}
              </li>
            ))}
          </ul>
          <a href="#contatto" className="link-draw mt-6 inline-block text-[13px] text-cocoa-800/70">
            {S.includedLink}
          </a>
        </div>

        <div className="math">
          <p className="label text-[10px] text-cocoa-800/60">{S.math.label}</p>
          <div className="mt-5 flex flex-col gap-7">
            {S.math.rows.map((r) => (
              <div key={r.name}>
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-[14px] font-medium">{r.name}</p>
                  <p className={`font-display text-[22px] font-medium tracking-[-0.04em] ${r.accent ? "text-vermilion" : ""}`}>{r.value}</p>
                </div>
                <div className="mt-2 h-[7px] overflow-hidden rounded-full bg-cocoa-800/10">
                  <div
                    className={`math-fill h-full origin-left rounded-full ${r.accent ? "bg-vermilion" : "bg-cocoa-500/60"}`}
                    style={{ width: `${r.pct}%` }}
                  />
                </div>
                <p className="mt-2 text-[12px] text-cocoa-800/55">{r.note}</p>
              </div>
            ))}
            <p className="text-[12px] text-cocoa-800/55">{S.math.footnote}</p>
          </div>
        </div>
      </div>

      <div className="mt-[clamp(56px,7vw,110px)]">
        <div role="tablist" aria-label="Ways to enjoy Avorio" className="inline-flex rounded-full bg-cocoa-800/8 p-1">
          {S.tabs.map((t, i) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={i === tab}
              onClick={() => setTab(i)}
              className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-colors duration-300 ${i === tab ? "bg-cocoa-800 text-ivory-100" : "text-cocoa-800/70 hover:text-cocoa-800"}`}
            >
              {t.key}
            </button>
          ))}
        </div>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {S.tabs[tab].cols.map((c) => (
            <div key={c.title} className="tab-col">
              <p className="label text-[10px] text-vermilion">{c.n}</p>
              <h4 className="mt-2 text-[17px] font-semibold">{c.title}</h4>
              <p className="mt-2 max-w-[340px] text-[14px] leading-[1.55] text-cocoa-800/70">{c.body}</p>
              <p className="label mt-4 text-[9.5px] text-cocoa-800/50">{c.meta}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
