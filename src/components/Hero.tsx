"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import { HERO } from "@/lib/content";
import { prefersReducedMotion } from "@/lib/motion";
import { useIntro } from "@/lib/useIntro";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function ScrollSeal() {
  return (
    <div className="relative grid h-[92px] w-[92px] place-items-center">
      <svg viewBox="0 0 100 100" className="absolute inset-0 animate-[spin-slow_16s_linear_infinite]" aria-hidden>
        <defs>
          <path id="hero-seal" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <text className="fill-current font-mono text-[9.5px] uppercase tracking-[0.22em]">
          <textPath href="#hero-seal">Scorri · Scroll · Scorri · Scroll ·</textPath>
        </text>
      </svg>
      <span className="text-[18px]">↓</span>
    </div>
  );
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const lenis = useLenis();

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      // Selector strings are scoped to the hero, so look the story up globally.
      const story = document.getElementById("story");
      gsap.set(".hero-letter", { rotateX: -100, yPercent: 35, autoAlpha: 0, transformOrigin: "50% 100% -0.2em" });
      gsap.set(".hero-serif", { clipPath: "inset(0 100% 0 0)", x: -40 });
      gsap.set(".hero-fade", { autoAlpha: 0, y: 24 });

      // Rotational exit: the hero tips backwards while the story slides over it.
      gsap.to(".hero-inner", {
        rotateX: 32,
        scale: 0.84,
        yPercent: -4,
        transformPerspective: 1100,
        transformOrigin: "50% 100%",
        ease: "none",
        scrollTrigger: { trigger: story, start: "top bottom", end: "top top", scrub: true },
      });
      gsap.to(".hero-shade", {
        opacity: 0.75,
        ease: "none",
        scrollTrigger: { trigger: story, start: "top bottom", end: "top top", scrub: true },
      });
      // Hide it once fully covered so it doesn't paint under the whole page.
      ScrollTrigger.create({
        trigger: story,
        start: "top top",
        onEnter: () => gsap.set(root.current, { autoAlpha: 0 }),
        onLeaveBack: () => gsap.set(root.current, { autoAlpha: 1 }),
      });
    },
    { scope: root }
  );

  useIntro(() => {
    if (prefersReducedMotion()) return;
    const tl = gsap.timeline();
    tl.to(".hero-letter", { rotateX: 0, yPercent: 0, autoAlpha: 1, duration: 1.6, ease: "expo.out", stagger: 0.075 }, 0.1)
      .to(".hero-serif", { clipPath: "inset(0 0% 0 0)", x: 0, duration: 1.4, ease: "expo.out" }, 0.55)
      .to(".hero-fade", { autoAlpha: 1, y: 0, duration: 1.1, ease: "power3.out", stagger: 0.08 }, 0.8);
  });

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    lenis?.scrollTo(id, { duration: 2 });
  };

  return (
    <section ref={root} id="top" data-nav="dark" className="sticky top-0 z-0 h-[100svh] overflow-hidden bg-wine-900 text-ivory-100">
      <div
        className="hero-inner relative flex h-full flex-col justify-between px-[var(--gutter)] pb-6 pt-[100px]"
        style={{ background: "radial-gradient(90% 70% at 70% 30%, #6e2337 0%, #3f1521 55%, #2a0e16 100%)" }}
      >
        <div className="hero-fade label flex justify-between text-[10px] text-rose-300">
          {HERO.kicker.map((k) => (
            <span key={k}>{k}</span>
          ))}
        </div>

        <div className="relative -mx-[0.5vw]">
          <p className="hero-serif serif relative z-10 -mb-[4.2vw] ml-[5vw] text-[clamp(64px,11vw,210px)] leading-none text-rose-300">
            {HERO.serif}
          </p>
          <h1 className="p3d display whitespace-nowrap text-[26.5vw] font-medium leading-[0.8] tracking-[-0.075em]" aria-label={`${HERO.serif} ${HERO.giant}`}>
            {[...HERO.giant].map((ch, i) => (
              <span key={i} className="hero-letter inline-block will-change-transform" aria-hidden>
                {ch}
              </span>
            ))}
          </h1>
        </div>

        <div className="grid items-end gap-6 md:grid-cols-[1fr_auto_auto]">
          <div className="hero-fade max-w-[380px]">
            <p className="text-[16px] leading-[1.5] text-ivory-100/80">{HERO.body}</p>
            <a href="#making" onClick={go("#making")} className="btn mt-5 font-bold">
              {HERO.cta} <span aria-hidden>→</span>
            </a>
          </div>
          <ul className="hero-fade label hidden flex-col gap-2 text-[10px] text-ivory-100/60 md:flex md:pr-16">
            {HERO.facts.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-rose-300" />
                {f}
              </li>
            ))}
          </ul>
          <div className="hero-fade hidden text-rose-300 md:block">
            <ScrollSeal />
          </div>
        </div>
      </div>
      <div className="hero-shade pointer-events-none absolute inset-0 bg-wine-950 opacity-0" />
    </section>
  );
}
