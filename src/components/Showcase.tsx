"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SHOWCASE, paintings } from "@/lib/content";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** The "showreel": a painting in the middle of a marquee that grows to fill the screen. */
export default function Showcase() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          mobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const { desktop } = ctx.conditions as { desktop: boolean };
          // The whole painting in miniature, growing to fill the screen.
          const from = desktop ? { width: "34vw", height: "25.5vw" } : { width: "80vw", height: "60vw" };
          const tl = gsap.timeline({
            scrollTrigger: { trigger: root.current, start: "top top", end: "+=160%", pin: true, scrub: 0.8 },
          });
          tl.fromTo(
            ".sc-clip",
            { ...from, borderRadius: 10 },
            { width: "100vw", height: "100svh", borderRadius: 0, ease: "power2.inOut", duration: 1 }
          )
            .to(".sc-hint", { autoAlpha: 0, duration: 0.2 }, 0)
            .fromTo(".sc-caption", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.2 }, 0.85);
        }
      );
    },
    { scope: root }
  );

  const phrase = `${SHOWCASE.marquee} ✦ `;

  return (
    <section ref={root} id="collezione-reel" data-nav="light" className="relative h-[100svh] overflow-hidden bg-ivory-200 text-cocoa-800">
      <div aria-hidden className="absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden">
        <div className="flex w-max animate-[marquee_38s_linear_infinite] whitespace-nowrap">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="display pr-[0.25em] text-[clamp(110px,15vw,240px)] font-medium leading-none">
              {phrase}
            </span>
          ))}
        </div>
      </div>

      <div className="sc-clip absolute left-1/2 top-1/2 h-[60vw] w-[80vw] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[10px] md:h-[25.5vw] md:w-[34vw] motion-reduce:h-[80svh] motion-reduce:w-[90vw]">
        <Image
          src={paintings.laTentazione}
          alt="La Tentazione: three Renaissance figures, a woman holding an unwrapped Avorio bar"
          fill
          sizes="100vw"
          quality={90}
          placeholder="blur"
          className="object-cover"
          style={{ objectPosition: "50% 45%" }}
        />
      </div>

      <p className="sc-hint label absolute left-1/2 top-[calc(50%+30vw+18px)] flex -translate-x-1/2 items-center gap-2 whitespace-nowrap text-[10px] text-cocoa-800/70 md:top-[calc(50%+12.75vw+18px)]">
        <span className="h-1.5 w-1.5 rounded-full bg-vermilion" />
        {SHOWCASE.hint}
      </p>

      <span className="sc-caption label invisible absolute bottom-6 right-[var(--gutter)] rounded-full bg-ivory-100 px-3.5 py-2 text-[10px] text-cocoa-800 opacity-0">
        {SHOWCASE.caption}
      </span>
    </section>
  );
}
