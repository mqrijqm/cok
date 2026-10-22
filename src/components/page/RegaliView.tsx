"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import PageHero from "./PageHero";
import FlipWords from "./FlipWords";
import TLink from "../TLink";
import { useRise } from "./useRise";
import { B, M, REGALI } from "@/lib/content";
import { prefersReducedMotion } from "@/lib/motion";

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const panels = useRef<(HTMLDivElement | null)[]>([]);

  const toggle = (i: number) => {
    const next = open === i ? null : i;
    panels.current.forEach((p, k) => {
      if (!p) return;
      const show = k === next;
      gsap.to(p, {
        height: show ? "auto" : 0,
        rotateX: show ? 0 : -60,
        duration: prefersReducedMotion() ? 0 : 0.7,
        ease: "expo.out",
        transformPerspective: 900,
        transformOrigin: "50% 0%",
      });
    });
    setOpen(next);
  };

  return (
    <ul className="border-b-[1.5px] border-magenta">
      {REGALI.faq.map((f, i) => (
        <li key={f.q} className="rise border-t-[1.5px] border-magenta">
          <button type="button" aria-expanded={open === i} onClick={() => toggle(i)} className="flex w-full items-center justify-between gap-6 py-6 text-left">
            <span className="display min-w-0 text-[clamp(24px,3vw,48px)] leading-[0.95]">{f.q}</span>
            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border-[1.5px] border-magenta text-[20px] transition-transform duration-500 ${open === i ? "rotate-45" : ""}`}>+</span>
          </button>
          <div
            ref={(el) => {
              panels.current[i] = el;
            }}
            className="overflow-hidden"
            style={{ height: i === 0 ? "auto" : 0 }}
          >
            <p className="max-w-[640px] pb-7 text-[15px] leading-[1.7]">{f.a}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function RegaliView() {
  const root = useRef<HTMLDivElement>(null);
  useRise(root);

  return (
    <div ref={root}>
      <PageHero kicker={REGALI.kicker} serif={REGALI.serif} lines={REGALI.title} intro={REGALI.intro} />

      {/* three ways to give */}
      {REGALI.offers.map((o, i) => {
        const bg = i % 2 === 0 ? B : M;
        const fg = bg === B ? M : B;
        return (
          <section
            key={o.name}
            data-nav={bg === M ? "dark" : "light"}
            className="grid gap-8 px-[var(--gutter)] py-[14vh] md:grid-cols-[1.4fr_1fr] md:items-end"
            style={{ backgroundColor: bg, color: fg }}
          >
            <h2 className="rise display text-[clamp(56px,10vw,200px)] leading-[0.82]">{o.name}</h2>
            <div className="rise" data-delay="0.08">
              <p className="label">{o.price}</p>
              <p className="mt-4 max-w-[400px] text-[15px] leading-[1.65]">{o.line}</p>
              <TLink href={o.href} label={o.href === "/collezione" ? "Collezione" : "Scrivici"} className={`btn mt-7 ${bg === B ? "btn-dark" : ""}`}>
                {o.cta} <span aria-hidden>→</span>
              </TLink>
            </div>
          </section>
        );
      })}

      {/* occasions */}
      <section data-nav="light" className="bg-beige px-[var(--gutter)] py-[16vh] text-magenta">
        <FlipWords as="h2" text={`${REGALI.occasions.title[0]} *${REGALI.occasions.title[1].split(" ")[0]}* ${REGALI.occasions.title[1].split(" ").slice(1).join(" ")}`} className="display max-w-[14ch] text-[clamp(52px,9vw,180px)] leading-[0.86]" />
        <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <p className="rise max-w-[460px] text-[15px] leading-[1.65]">{REGALI.occasions.line}</p>
          <TLink href="/contatto" label="Scrivici" className="rise btn btn-dark self-start">
            {REGALI.occasions.cta} <span aria-hidden>→</span>
          </TLink>
        </div>
      </section>

      {/* how it travels */}
      <section data-nav="dark" className="grid gap-px bg-beige md:grid-cols-3">
        {REGALI.shipping.map((s, i) => (
          <div key={s} className="flex min-h-[44svh] items-end bg-magenta px-[var(--gutter)] py-10 text-beige">
            <p className="rise display text-[clamp(40px,4.6vw,84px)] leading-[0.88]" data-delay={i * 0.08}>
              {s}
            </p>
          </div>
        ))}
      </section>

      {/* questions */}
      <section data-nav="light" className="grid gap-12 bg-beige px-[var(--gutter)] py-[14vh] text-magenta md:grid-cols-[1fr_2fr] [&>*]:min-w-0">
        <h2 className="rise display text-[clamp(52px,7vw,130px)] leading-[0.86]">
          Domande
          <br />
          <span className="serif text-[1.08em]">frequenti</span>
        </h2>
        <Faq />
      </section>
    </div>
  );
}
