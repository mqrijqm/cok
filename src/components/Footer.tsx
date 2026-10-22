"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useLenis } from "lenis/react";
import { RevealLines } from "./Reveal";
import Logo from "./Logo";
import ChocolateSquare from "./ChocolateSquare";
import { CONTACT, FOOTER } from "@/lib/content";
import { useMediaQuery, useWebGL } from "@/lib/useMediaQuery";

const ChocolateScene = dynamic(() => import("./three/ChocolateScene"), { ssr: false });

export default function Footer() {
  const stage = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const webgl = useWebGL();
  const lenis = useLenis();

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    // Load the 3D early, but only render frames while it's on screen.
    const loader = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "800px 0px" });
    const viewer = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    loader.observe(el);
    viewer.observe(el);
    return () => {
      loader.disconnect();
      viewer.disconnect();
    };
  }, []);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    lenis?.scrollTo(id, { offset: -20, duration: 1.6 });
  };
  const anchors: Record<string, string> = {
    Collezione: "#collezione",
    "Il Rito": "#rito",
    Atelier: "#atelier",
    Abbonamento: "#abbonamento",
    "Le Muse": "#muse",
  };

  return (
    <footer id="contatto" data-nav="light" className="relative z-10 overflow-hidden bg-ivory-200 px-[var(--gutter)] pb-6 pt-[clamp(60px,8vw,120px)] text-cocoa-800">
      <div className="relative mx-auto w-fit">
        <RevealLines
          lines={FOOTER.title}
          lineClassNames={["", "pl-[1.3em]"]}
          className="display text-[clamp(64px,11vw,160px)] leading-[0.84]"
        />

        <div
          ref={stage}
          className="relative mx-auto mt-6 h-[200px] w-[200px] lg:absolute lg:-right-[clamp(200px,17vw,280px)] lg:-top-[clamp(30px,3vw,50px)] lg:mt-0 lg:h-[clamp(220px,19vw,300px)] lg:w-[clamp(220px,19vw,300px)]"
          data-cursor="Taste"
        >
          <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle,rgb(181_54_28/0.18),transparent_65%)]" />
          {near && webgl ? (
            <ChocolateScene active={visible} reduced={reduced} />
          ) : (
            <ChocolateSquare className="absolute inset-[22%] rotate-12 drop-shadow-[0_30px_30px_rgb(43_32_25/0.25)]" />
          )}
          <div className="pointer-events-none absolute -bottom-2 left-1/2 hidden -translate-x-[110%] items-end gap-2 text-vermilion lg:flex">
            <span className="label whitespace-nowrap text-[10px] font-medium">{FOOTER.hint}</span>
            <svg viewBox="0 0 48 30" className="h-6 w-10" aria-hidden>
              <path d="M2 28C14 26 30 20 40 6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              <path d="M33 6.5 40.5 5l1 7.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      <p className="mx-auto mt-10 max-w-[440px] text-center text-[15px] leading-[1.6] text-cocoa-800/80">{FOOTER.body}</p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <a href={`mailto:${CONTACT.email}?subject=Tasting`} className="btn font-bold">
          {FOOTER.cta} <span aria-hidden>→</span>
        </a>
        <a href={`mailto:${CONTACT.email}`} className="btn btn-ghost btn-sm text-cocoa-800">
          {CONTACT.email}
        </a>
      </div>

      <div className="mt-[clamp(70px,9vw,140px)] grid gap-10 border-t border-cocoa-800/15 pt-8 sm:grid-cols-3">
        <div>
          <p className="label text-[10px] text-cocoa-800/55">{FOOTER.cols.pages.label}</p>
          <ul className="mt-4 flex flex-col gap-1.5 text-[15px]">
            {FOOTER.cols.pages.links.map((l) => (
              <li key={l}>
                <a href={anchors[l]} onClick={go(anchors[l])} className="transition-opacity hover:opacity-60">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="label text-[10px] text-cocoa-800/55">{FOOTER.cols.follow.label}</p>
          <ul className="mt-4 flex flex-col gap-1.5 text-[15px]">
            <li>
              <a href={CONTACT.instagram} className="transition-opacity hover:opacity-60">
                Instagram
              </a>
            </li>
            <li>
              <a href={CONTACT.pinterest} className="transition-opacity hover:opacity-60">
                Pinterest
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="label text-[10px] text-cocoa-800/55">{FOOTER.cols.contact.label}</p>
          <ul className="mt-4 flex flex-col gap-1.5 text-[15px]">
            <li>
              <a href={`mailto:${CONTACT.email}`} className="transition-opacity hover:opacity-60">
                {CONTACT.email}
              </a>
            </li>
            <li className="text-cocoa-800/70">Firenze, Italia</li>
          </ul>
        </div>
      </div>

      <div className="mt-[clamp(50px,7vw,100px)] flex flex-col gap-4 text-[12px] text-cocoa-800/60 sm:flex-row sm:items-center sm:justify-between">
        <span className="flex items-center gap-3">
          <Logo className="text-[13px] text-cocoa-800" />© 2026
        </span>
        <span className="flex gap-6">
          <a href="#" className="hover:text-cocoa-800">
            Privacy
          </a>
          <a href="#" className="hover:text-cocoa-800">
            Terms
          </a>
          <span className="label text-[10px]">
            <b className="font-medium text-cocoa-800">IT</b> / EN
          </span>
        </span>
      </div>
    </footer>
  );
}
