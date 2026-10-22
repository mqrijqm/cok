"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { TypeOnScroll } from "./Reveal";
import { COLLECTION_INTRO, EDITIONS, paintings, type Edition } from "@/lib/content";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Scattered two-column layout: width, aspect, offsets, where the detail inset pops up.
const LAYOUT = [
  { wrap: "lg:w-[40%]", aspect: "aspect-[4/5]", inset: "left-[46%] top-[34%]" },
  { wrap: "lg:w-[30%] lg:mt-[24vh]", aspect: "aspect-[4/5]", inset: "-left-[14%] top-[44%]" },
  { wrap: "lg:w-[30%] lg:ml-[8%]", aspect: "aspect-[4/5]", inset: "left-[52%] top-[18%]" },
  { wrap: "lg:w-[46%] lg:mt-[14vh]", aspect: "aspect-[4/3]", inset: "left-[8%] top-[40%]" },
  { wrap: "lg:w-[38%]", aspect: "aspect-[4/5]", inset: "left-[44%] top-[46%]" },
];

function EditionCard({ e, i }: { e: Edition; i: number }) {
  const L = LAYOUT[i];
  const img = paintings[e.image];
  return (
    <a href="#abbonamento" data-cursor="View" className={`ed-card group relative block w-full ${L.wrap}`}>
      <div className={`relative ${L.aspect}`}>
        <div className="absolute inset-0 overflow-hidden rounded-[24px] bg-cocoa-900">
          <div className="ed-par absolute inset-[-8%_0]">
            <Image
              src={img}
              alt={`${e.name}: Renaissance portrait with Avorio white chocolate`}
              fill
              sizes="(min-width: 1024px) 46vw, 100vw"
              placeholder="blur"
              className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.05]"
              style={{ objectPosition: e.focus }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-cocoa-950/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="absolute inset-x-4 bottom-4 flex flex-wrap justify-center gap-1.5 text-ivory-100 opacity-0 transition-all duration-500 group-hover:opacity-100 [@media(hover:none)]:opacity-100">
            {e.tags.map((t) => (
              <span key={t} className="chip bg-cocoa-950/35">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Detail inset: a close-up of the chocolate, like the reference's preview clip */}
        <div
          className={`pointer-events-none absolute z-10 hidden aspect-[16/10] w-[46%] translate-y-4 overflow-hidden rounded-[18px] opacity-0 shadow-[0_24px_50px_-12px_rgb(0_0_0/0.6)] ring-1 ring-ivory-100/20 transition-all duration-700 ease-[var(--ease-out-expo)] group-hover:translate-y-0 group-hover:opacity-100 lg:block ${L.inset}`}
        >
          <Image
            src={img}
            alt=""
            fill
            sizes="24vw"
            className="scale-[2.4] object-cover"
            style={{ objectPosition: e.detail, transformOrigin: e.detail }}
          />
        </div>
      </div>
      <h3 className="mt-4 font-display text-[clamp(22px,2.1vw,30px)] font-bold uppercase leading-none tracking-[-0.04em] text-ivory-100">{e.name}</h3>
      <p className="label mt-2 text-[10px] text-ivory-100/45">{e.meta}</p>
    </a>
  );
}

export default function Collection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>(".ed-card").forEach((card) => {
        gsap.from(card, { y: 80, autoAlpha: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: card, start: "top 88%", once: true } });
        gsap.fromTo(
          card.querySelector(".ed-par"),
          { yPercent: -5 },
          { yPercent: 5, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true } }
        );
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="collezione" data-nav="dark" className="relative bg-cocoa-950 px-[var(--gutter)] pb-[clamp(90px,11vw,170px)] pt-[clamp(90px,12vw,180px)]">
      <TypeOnScroll
        strong={COLLECTION_INTRO.strong}
        soft={COLLECTION_INTRO.soft}
        className="mx-auto max-w-[880px] text-center font-display text-[clamp(30px,3.4vw,50px)] font-medium leading-[1.06] tracking-[-0.05em] text-ivory-100"
        softClassName="text-ivory-100/40"
      />

      <div className="mt-[clamp(70px,9vw,140px)] flex flex-col gap-16 lg:flex-row lg:flex-wrap lg:justify-between lg:gap-x-0 lg:gap-y-[clamp(80px,9vw,140px)]">
        {EDITIONS.map((e, i) => (
          <EditionCard key={e.name} e={e} i={i} />
        ))}
        <div className="flex items-center justify-center lg:w-[46%]">
          <a href="#abbonamento" className="btn btn-ghost btn-sm text-ivory-100">
            View all editions
          </a>
        </div>
      </div>
    </section>
  );
}
