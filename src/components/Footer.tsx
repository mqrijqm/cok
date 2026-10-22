"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import { CONTACT, FOOTER, NAV } from "@/lib/content";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Footer() {
  const root = useRef<HTMLElement>(null);
  const lenis = useLenis();

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      // Hinged entrance: the footer swings open from its top edge.
      gsap.fromTo(
        ".ft-inner",
        { rotateX: -38, scale: 0.9, transformOrigin: "50% 0%", transformPerspective: 1300 },
        { rotateX: 0, scale: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "top 25%", scrub: true } }
      );
      gsap.fromTo(
        ".ft-letter",
        { rotateX: -100, yPercent: 50, opacity: 0, transformOrigin: "50% 100%" },
        {
          rotateX: 0,
          yPercent: 0,
          opacity: 1,
          ease: "expo.out",
          duration: 1.4,
          stagger: 0.06,
          scrollTrigger: { trigger: ".ft-wordmark", start: "top 95%", once: true },
        }
      );
      gsap.fromTo(
        ".ft-taste",
        { rotateX: -90, yPercent: 30, opacity: 0, transformOrigin: "50% 100%" },
        { rotateX: 0, yPercent: 0, opacity: 1, ease: "expo.out", duration: 1.4, stagger: 0.06, scrollTrigger: { trigger: ".ft-title", start: "top 80%", once: true } }
      );
    },
    { scope: root }
  );

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    lenis?.scrollTo(id, { duration: 1.8 });
  };

  return (
    <footer ref={root} id="contatto" data-nav="dark" className="relative z-10 overflow-hidden bg-wine-950">
      <div className="ft-inner flex min-h-[100svh] flex-col bg-wine-900 px-[var(--gutter)] pb-6 pt-[16vh] text-ivory-100">
        <div className="ft-title p3d text-center">
          <p className="serif text-[clamp(56px,9vw,170px)] leading-[0.8] text-rose-300">{FOOTER.serif}</p>
          <h2 className="display mt-[-0.04em] text-[clamp(96px,19vw,360px)] font-medium leading-[0.8]" aria-label={FOOTER.giant}>
            {[...FOOTER.giant].map((ch, i) => (
              <span key={i} className="ft-taste inline-block" aria-hidden>
                {ch}
              </span>
            ))}
          </h2>
          <p className="mx-auto mt-8 max-w-[420px] text-[16px] leading-[1.55] text-ivory-100/75">{FOOTER.body}</p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <a href={`mailto:${CONTACT.email}?subject=Tasting`} className="btn font-bold">
              {FOOTER.cta} <span aria-hidden>→</span>
            </a>
            <a href={`mailto:${CONTACT.email}`} className="btn btn-ghost btn-sm text-ivory-100">
              {CONTACT.email}
            </a>
          </div>
        </div>

        <ul className="label mt-auto flex flex-wrap justify-center gap-x-8 gap-y-3 pt-20 text-[10px] text-ivory-100/70">
          {NAV.map((n) => (
            <li key={n.label}>
              <a href={n.href} onClick={go(n.href)} className="transition-colors hover:text-rose-300">
                {n.label}
              </a>
            </li>
          ))}
          <li>
            <a href={CONTACT.instagram} className="transition-colors hover:text-rose-300">
              Instagram
            </a>
          </li>
          <li>
            <a href={CONTACT.pinterest} className="transition-colors hover:text-rose-300">
              Pinterest
            </a>
          </li>
        </ul>

        <p className="ft-wordmark p3d display mt-6 whitespace-nowrap text-center text-[25vw] font-medium leading-[0.78] tracking-[-0.075em] text-rose-300" aria-label={FOOTER.wordmark}>
          {[...FOOTER.wordmark].map((ch, i) => (
            <span key={i} className="ft-letter inline-block" aria-hidden>
              {ch}
            </span>
          ))}
        </p>

        <div className="mt-6 flex flex-col gap-3 text-[12px] text-ivory-100/50 sm:flex-row sm:justify-between">
          <span>© 2026 Avorio · Firenze</span>
          <span className="flex gap-6">
            <a href="#" className="hover:text-ivory-100">
              Privacy
            </a>
            <a href="#" className="hover:text-ivory-100">
              Terms
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
