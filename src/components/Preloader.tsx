"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import Logo from "./Logo";
import { INTRO_DONE, prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const lenis = useLenis();
  const lenisRef = useRef(lenis);

  // Lenis arrives after the first render — lock scroll as soon as it does.
  useEffect(() => {
    lenisRef.current = lenis;
    if (!window.__avorioIntroDone) lenis?.stop();
  }, [lenis]);

  useGSAP(
    () => {
      window.scrollTo(0, 0);

      const progress = { v: 0 };
      const paint = () => {
        const v = Math.round(progress.v);
        if (count.current) count.current.textContent = String(v);
        if (bar.current) bar.current.style.transform = `scaleX(${progress.v / 100})`;
      };

      const finish = () => {
        window.__avorioIntroDone = true;
        window.dispatchEvent(new Event(INTRO_DONE));
        lenisRef.current?.start();
        ScrollTrigger.refresh();
      };

      if (prefersReducedMotion()) {
        gsap.to(root.current, { autoAlpha: 0, duration: 0.3, delay: 0.2, onStart: finish });
        return;
      }

      // Crawl to 80 while fonts and the hero painting arrive, then sprint home.
      const crawl = gsap.to(progress, { v: 80, duration: 1.8, ease: "power2.out", onUpdate: paint });
      const ready = Promise.all([
        document.fonts.ready,
        new Promise<void>((r) => (document.readyState === "complete" ? r() : window.addEventListener("load", () => r(), { once: true }))),
      ]);
      const timeout = new Promise<void>((r) => setTimeout(r, 4000));

      Promise.race([ready, timeout]).then(() => {
        const wait = Math.max(0, 1.8 - crawl.time());
        gsap
          .timeline({ delay: wait })
          .to(progress, { v: 100, duration: 0.5, ease: "power2.inOut", onUpdate: paint })
          .to(".pl-content", { yPercent: -40, autoAlpha: 0, duration: 0.6, ease: "power3.in" }, "+=0.15")
          .to(root.current, { clipPath: "inset(0 0 100% 0)", duration: 1.1, ease: "expo.inOut" }, "-=0.2")
          .add(finish, "-=0.75")
          .set(root.current, { display: "none" });
      });
    },
    { scope: root }
  );

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[95] grid place-items-center bg-cocoa-950 text-ivory-100"
      style={{ clipPath: "inset(0 0 0% 0)" }}
      aria-hidden
    >
      <div className="pl-content flex flex-col items-center gap-3">
        <span className="label text-[10px] text-ivory-500">Benvenuti da</span>
        <Logo className="text-[clamp(30px,3vw,40px)]" />
      </div>
      <div className="pl-content absolute bottom-[56px] left-1/2 flex -translate-x-1/2 items-center gap-6">
        <span className="relative block h-px w-[240px] bg-ivory-100/15">
          <span ref={bar} className="absolute inset-0 origin-left bg-ivory-100" style={{ transform: "scaleX(0)" }} />
        </span>
        <span ref={count} className="w-8 font-display text-[13px] font-semibold tabular-nums">
          0
        </span>
      </div>
    </div>
  );
}
