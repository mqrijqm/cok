"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { B, M } from "@/lib/content";
import { prefersReducedMotion } from "@/lib/motion";
import { useIntro } from "@/lib/useIntro";

gsap.registerPlugin(useGSAP);

/** Giant title whose letters flip up on arrival, with an optional serif line and intro. */
export default function PageHero({
  id,
  kicker,
  serif,
  lines,
  intro,
  bg = M,
  size = "text-[clamp(76px,19vw,360px)]",
  children,
}: {
  id?: string;
  kicker: string;
  serif?: string;
  lines: string[];
  intro?: string;
  bg?: string;
  size?: string;
  children?: React.ReactNode;
}) {
  const root = useRef<HTMLElement>(null);
  const fg = bg === M ? B : M;

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.set(".ph-letter", { rotateX: -100, yPercent: 30, autoAlpha: 0, transformOrigin: "50% 100% -0.2em" });
      gsap.set(".ph-serif", { clipPath: "inset(0 100% 0 0)" });
      gsap.set(".ph-fade", { rotateX: -90, transformPerspective: 900, transformOrigin: "50% 100%" });
    },
    { scope: root }
  );

  useIntro(() => {
    if (prefersReducedMotion()) return;
    const q = gsap.utils.selector(root);
    gsap
      .timeline()
      .to(q(".ph-letter"), { rotateX: 0, yPercent: 0, autoAlpha: 1, duration: 1.4, ease: "expo.out", stagger: 0.05 })
      .to(q(".ph-serif"), { clipPath: "inset(0 0% 0 0)", duration: 1.2, ease: "expo.out" }, 0.35)
      .to(q(".ph-fade"), { rotateX: 0, duration: 1, ease: "expo.out", stagger: 0.08 }, 0.5);
  });

  return (
    <section
      ref={root}
      id={id}
      data-nav={bg === M ? "dark" : "light"}
      className="relative flex min-h-[92svh] flex-col justify-end overflow-hidden px-[var(--gutter)] pb-10 pt-[120px]"
      style={{ backgroundColor: bg, color: fg }}
    >
      <p className="ph-fade label mb-auto">{kicker}</p>
      {serif && <p className="ph-serif serif relative z-10 -mb-[2.5vw] ml-[4vw] text-[clamp(48px,7.5vw,140px)] leading-none">{serif}</p>}
      <h1 className="p3d display leading-[0.8] tracking-[-0.07em]" aria-label={lines.join(" ")}>
        {lines.map((line, li) => (
          <span key={li} className={`block whitespace-nowrap ${size}`} aria-hidden>
            {[...line].map((ch, i) => (
              <span key={i} className="ph-letter inline-block">
                {ch === " " ? " " : ch}
              </span>
            ))}
          </span>
        ))}
      </h1>
      {(intro || children) && (
        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          {intro && <p className="ph-fade max-w-[520px] text-[15px] leading-[1.6]">{intro}</p>}
          {children}
        </div>
      )}
    </section>
  );
}
