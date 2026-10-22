"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { EASE, prefersReducedMotion } from "@/lib/motion";
import { useIntro } from "@/lib/useIntro";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Tag = "h1" | "h2" | "h3" | "p" | "div";

/**
 * Lines that rise out of a mask. `mode="intro"` waits for the preloader,
 * `mode="scroll"` plays when the block enters the viewport.
 */
export function RevealLines({
  lines,
  as: As = "h2",
  className = "",
  lineClassNames = [],
  mode = "scroll",
  stagger = 0.08,
  delay = 0,
}: {
  lines: React.ReactNode[];
  as?: Tag;
  className?: string;
  lineClassNames?: string[];
  mode?: "scroll" | "intro";
  stagger?: number;
  delay?: number;
}) {
  const root = useRef<HTMLElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const inner = gsap.utils.toArray<HTMLElement>(".line-mask > span", root.current);
      if (prefersReducedMotion()) return;
      gsap.set(inner, { yPercent: 110, rotate: 2 });
      tl.current = gsap
        .timeline({
          paused: true,
          scrollTrigger:
            mode === "scroll"
              ? { trigger: root.current, start: "top 85%", once: true, onEnter: () => tl.current?.play() }
              : undefined,
        })
        .to(inner, { yPercent: 0, rotate: 0, duration: 1.2, ease: EASE.expo, stagger, delay });
    },
    { scope: root }
  );

  useIntro(() => {
    if (mode === "intro") tl.current?.play();
  });

  return (
    <As ref={root as React.Ref<never>} className={className}>
      {lines.map((line, i) => (
        <span key={i} className={`line-mask ${lineClassNames[i] ?? ""}`}>
          <span>{line}</span>
        </span>
      ))}
    </As>
  );
}

/**
 * Scroll-scrubbed typewriter: characters appear as you scroll,
 * a caret sits on the last visible one. `strong` is full colour,
 * `soft` is muted — exactly how the reference writes its statements.
 */
export function TypeOnScroll({
  strong,
  soft,
  as: As = "p",
  className = "",
  softClassName = "opacity-45",
  caret = "bar",
  start = "top 80%",
  end = "bottom 45%",
}: {
  strong: string;
  soft?: string;
  as?: Tag;
  className?: string;
  softClassName?: string;
  caret?: "bar" | "block";
  start?: string;
  end?: string;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const chars = gsap.utils.toArray<HTMLElement>("[data-c]", root.current);
      if (prefersReducedMotion() || !chars.length) return;
      let shown = 0;
      const render = (n: number) => {
        if (n === shown) return;
        if (n > shown) for (let i = shown; i < n; i++) chars[i].style.opacity = "1";
        else for (let i = n; i < shown; i++) chars[i].style.opacity = "0";
        chars[shown - 1]?.classList.remove("is-caret");
        chars[n - 1]?.classList.add("is-caret");
        shown = n;
      };
      chars.forEach((c) => (c.style.opacity = "0"));
      ScrollTrigger.create({
        trigger: root.current,
        start,
        end,
        scrub: true,
        onUpdate: (self) => render(Math.round(self.progress * chars.length)),
      });
    },
    { scope: root }
  );

  const renderWords = (text: string, extra = "") =>
    text.split(" ").map((word, wi) => (
      <span key={wi}>
        {wi > 0 && " "}
        <span className={`inline-block whitespace-nowrap ${extra}`}>
          {[...word].map((ch, ci) => (
            <span key={ci} data-c>
              {ch}
            </span>
          ))}
        </span>
      </span>
    ));

  return (
    <As ref={root as React.Ref<never>} className={`type-on-scroll caret-${caret} ${className}`}>
      {renderWords(strong)}
      {soft && (
        <>
          {" "}
          {renderWords(soft, softClassName)}
        </>
      )}
    </As>
  );
}
