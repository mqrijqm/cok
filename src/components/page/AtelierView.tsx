"use client";

import { useRef } from "react";
import Image from "next/image";
import PageHero from "./PageHero";
import FlipWords from "./FlipWords";
import TLink from "../TLink";
import { useRise } from "./useRise";
import { ATELIER, CONTACT, M, paintings } from "@/lib/content";

export default function AtelierView() {
  const root = useRef<HTMLDivElement>(null);
  useRise(root);

  return (
    <div ref={root}>
      <PageHero id="atelier-hero" kicker={ATELIER.kicker} serif={ATELIER.serif} lines={ATELIER.title} intro={ATELIER.intro} />

      {/* manifesto: one line per colour */}
      {ATELIER.manifesto.map((m, i) => (
        <section key={i} data-nav={m.bg === M ? "dark" : "light"} className="flex min-h-[80svh] items-center px-[var(--gutter)] py-[14vh]" style={{ backgroundColor: m.bg, color: m.fg }}>
          <FlipWords text={m.text} className={`display max-w-[15ch] text-[clamp(48px,8.4vw,168px)] leading-[0.9] ${i % 2 ? "ml-auto text-right" : ""}`} />
        </section>
      ))}

      {/* the hands */}
      <section data-nav="light" className="bg-beige px-[var(--gutter)] py-[14vh] text-magenta">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="rise display text-[clamp(56px,10vw,200px)] leading-[0.82]">
            Le <span className="serif text-[1.1em]">mani</span>
          </h2>
          <p className="rise max-w-[380px] text-[14px] leading-[1.6]" data-delay="0.1">
            No factory and no middlemen. The same two people temper, pour, wrap and answer your letters.
          </p>
        </div>
        <div className="mt-14 grid gap-x-4 gap-y-12 md:grid-cols-3">
          {ATELIER.people.map((p, i) => (
            <figure key={p.name} className="rise group" data-delay={i * 0.08}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[18px] ring-2 ring-magenta">
                <Image
                  src={paintings[p.image]}
                  alt={`${p.name}, ${p.role}`}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-[scale] duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.05]"
                  style={{ objectPosition: p.focus, filter: "url(#duotone)" }}
                />
              </div>
              <figcaption className="mt-5">
                <p className="flex items-baseline justify-between gap-4">
                  <span className="display text-[clamp(30px,2.6vw,44px)] leading-none">{p.name}</span>
                  <span className="label">{p.role}</span>
                </p>
                <p className="mt-3 max-w-[340px] text-[14px] leading-[1.55]">{p.line}</p>
              </figcaption>
            </figure>
          ))}
          <figure className="rise" data-delay="0.16">
            <a href={`mailto:${CONTACT.email}?subject=Bottega`} className="group relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-[18px] bg-magenta p-7 text-beige" data-cursor="Write">
              <span className="label">Apprendista</span>
              <span>
                <span className="display block text-[clamp(40px,3.6vw,60px)] leading-[0.86]">{ATELIER.bottega.title}</span>
                <span className="mt-4 block max-w-[300px] text-[14px] leading-[1.55]">{ATELIER.bottega.line}</span>
              </span>
              <span className="label link-under self-start">Write to us →</span>
            </a>
            <figcaption className="mt-5 flex items-baseline justify-between gap-4">
              <span className="display text-[clamp(30px,2.6vw,44px)] leading-none">You?</span>
              <span className="label">One a year</span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* visit */}
      <section data-nav="dark" className="grid gap-14 bg-magenta px-[var(--gutter)] py-[16vh] text-beige md:grid-cols-[1.2fr_1fr] md:items-end">
        <h2 className="rise display text-[clamp(64px,12vw,240px)] leading-[0.8]">
          {ATELIER.visit.title[0]}
          <br />
          <span className="serif text-[1.08em]">{ATELIER.visit.title[1]}</span>
        </h2>
        <div>
          <ul className="border-b-[1.5px] border-beige">
            {ATELIER.visit.hours.map(([d, h]) => (
              <li key={d} className="rise flex justify-between border-t-[1.5px] border-beige py-3 text-[14px]">
                <span>{d}</span>
                <span className="font-bold">{h}</span>
              </li>
            ))}
          </ul>
          <p className="rise mt-6 max-w-[380px] text-[14px] leading-[1.6]">{ATELIER.visit.line}</p>
          <p className="rise label mt-3">Oltrarno · Firenze</p>
          <TLink href="/contatto" label="Scrivici" className="rise btn mt-8">
            Book a tasting <span aria-hidden>→</span>
          </TLink>
        </div>
      </section>
    </div>
  );
}
