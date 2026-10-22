"use client";

import Image from "next/image";
import { RevealLines } from "./Reveal";
import { LogoMark } from "./Logo";
import { MUSE, CONTACT, paintings } from "@/lib/content";

function Seal({ text }: { text: string }) {
  return (
    <div className="absolute bottom-6 right-6 grid h-[88px] w-[88px] place-items-center rounded-full bg-vermilion text-ivory-50">
      <svg viewBox="0 0 100 100" className="absolute inset-0 animate-[spin-slow_14s_linear_infinite]" aria-hidden>
        <defs>
          <path id="seal-circle" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
        </defs>
        <text className="fill-current font-mono text-[10.5px] uppercase tracking-[0.18em]">
          <textPath href="#seal-circle">{text}</textPath>
        </text>
      </svg>
      <LogoMark className="h-5 w-5" />
    </div>
  );
}

export default function Muse() {
  return (
    <section id="muse" data-nav="light" className="relative bg-ivory-200 px-[var(--gutter)] pb-[clamp(70px,9vw,130px)] pt-[clamp(40px,5vw,80px)] text-cocoa-800">
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div>
          <span className="pill">{MUSE.pill}</span>
          <RevealLines lines={MUSE.heading} lineClassNames={["", "pl-[0.5em]"]} className="display mt-6 text-[clamp(50px,7vw,102px)] leading-[0.86]" />
        </div>
        <p className="max-w-[440px] pb-2 text-[15px] leading-[1.6] text-cocoa-800/80">{MUSE.intro}</p>
      </div>

      <div className="mt-[clamp(40px,5vw,72px)] grid gap-x-4 gap-y-10 md:grid-cols-3">
        {MUSE.people.map((p) => (
          <figure key={p.name} className="group">
            <div className="relative aspect-square overflow-hidden rounded-[24px] bg-cocoa-900">
              <Image
                src={paintings[p.image]}
                alt={`${p.name}, ${p.role}`}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover contrast-[1.05] grayscale transition-[filter,scale] duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04] group-hover:grayscale-0"
                style={{ objectPosition: p.focus }}
              />
            </div>
            <figcaption className="mt-4 flex items-baseline justify-between gap-4">
              <span className="font-display text-[clamp(22px,2vw,28px)] font-medium uppercase leading-none tracking-[-0.05em]">{p.name}</span>
              <span className="label text-[9.5px] text-cocoa-800/60">{p.role}</span>
            </figcaption>
          </figure>
        ))}

        <figure>
          <div className="relative flex aspect-square flex-col justify-between overflow-hidden rounded-[24px] bg-cocoa-900 p-[clamp(24px,2.4vw,40px)] text-ivory-50">
            <div>
              <p className="label text-[10px] text-ivory-100/60">{MUSE.bottega.label}</p>
              <h3 className="mt-5 font-display text-[clamp(28px,2.4vw,34px)] font-medium uppercase leading-[0.95] tracking-[-0.05em]">{MUSE.bottega.title}</h3>
              <p className="mt-4 max-w-[300px] text-[13px] leading-[1.55] text-ivory-100/75">{MUSE.bottega.body}</p>
            </div>
            <a href={`mailto:${CONTACT.email}`} className="label self-start rounded-full bg-ivory-100 px-3.5 py-2 text-[10px] text-cocoa-800 transition-colors hover:bg-ivory-50">
              {MUSE.bottega.cta} →
            </a>
            <Seal text={MUSE.bottega.seal.repeat(2)} />
          </div>
          <figcaption className="mt-4 flex items-baseline justify-between gap-4">
            <span className="font-display text-[clamp(22px,2vw,28px)] font-medium uppercase leading-none tracking-[-0.05em]">{MUSE.bottega.name}</span>
            <span className="label text-[9.5px] text-cocoa-800/60">{MUSE.bottega.role}</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
