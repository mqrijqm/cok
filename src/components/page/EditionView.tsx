"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import TLink from "../TLink";
import FlipWords from "./FlipWords";
import { useRise } from "./useRise";
import { B, M, paintings } from "@/lib/content";
import type { EditionDetail } from "@/lib/editions";
import { prefersReducedMotion } from "@/lib/motion";
import { useIntro } from "@/lib/useIntro";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const nav = (bg: string) => (bg === M ? "dark" : "light");

export default function EditionView({ e, index, next }: { e: EditionDetail; index: number; next: EditionDetail }) {
  const root = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const A = index % 2 === 0 ? M : B; // hero colour
  const Z = A === M ? B : M; // the other one
  useRise(root);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.set(".ed-letter", { rotateX: -100, yPercent: 30, autoAlpha: 0, transformOrigin: "50% 100% -0.2em" });
      gsap.set(card.current, { rotateY: -95, transformPerspective: 1400 });

      // The framed painting leans towards the pointer.
      const tilt = (ev: PointerEvent) => {
        const r = card.current!.getBoundingClientRect();
        const dx = (ev.clientX - (r.left + r.width / 2)) / window.innerWidth;
        const dy = (ev.clientY - (r.top + r.height / 2)) / window.innerHeight;
        gsap.to(card.current, { rotateY: dx * 22, rotateX: -dy * 16, duration: 0.9, ease: "power3.out", overwrite: "auto" });
      };
      window.addEventListener("pointermove", tilt);

      // Detail crops drift at their own pace.
      gsap.utils.toArray<HTMLElement>(".ed-par").forEach((el, i) => {
        gsap.fromTo(el, { yPercent: 8 + i * 6 }, { yPercent: -8 - i * 6, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
      });
      return () => window.removeEventListener("pointermove", tilt);
    },
    { scope: root }
  );

  useIntro(() => {
    if (prefersReducedMotion()) return;
    const q = gsap.utils.selector(root);
    gsap
      .timeline()
      .to(q(".ed-letter"), { rotateX: 0, yPercent: 0, autoAlpha: 1, duration: 1.4, ease: "expo.out", stagger: 0.04 })
      .to(card.current, { rotateY: 0, duration: 1.8, ease: "expo.out" }, 0.2);
  });

  return (
    <div ref={root}>
      {/* 1 — name + framed portrait */}
      <section
        id="ed-hero"
        data-nav={nav(A)}
        className="relative grid min-h-[100svh] gap-10 px-[var(--gutter)] pb-10 pt-[110px] md:grid-cols-[1.25fr_1fr] md:items-end [&>*]:min-w-0"
        style={{ backgroundColor: A, color: Z }}
      >
        <div className="flex flex-col justify-between gap-10 md:h-full">
          <div className="label flex gap-6">
            <TLink href="/collezione" label="Collezione" className="link-under">
              ← Collezione
            </TLink>
            <span>{e.n}</span>
          </div>
          <div>
            <h1 className="p3d display leading-[0.8] tracking-[-0.07em]" aria-label={e.name}>
              {e.nameLines.map((line, li) => (
                <span key={li} className="block whitespace-nowrap text-[clamp(44px,12.5vw,250px)]" aria-hidden>
                  {[...line].map((ch, i) => (
                    <span key={i} className="ed-letter inline-block">
                      {ch}
                    </span>
                  ))}
                </span>
              ))}
            </h1>
            <p className="serif mt-4 text-[clamp(30px,3.6vw,64px)] leading-none">{e.flavour}</p>
            <div className="label mt-8 flex flex-wrap gap-x-8 gap-y-2">
              <span>{e.weight}</span>
              <span>{e.price}</span>
              <span>{e.allergens}</span>
            </div>
          </div>
        </div>
        <div className="flex justify-center md:justify-end">
          <div ref={card} className="preserve relative aspect-[3/4] w-[min(78vw,440px)] rounded-[18px] p-3" style={{ backgroundColor: Z }}>
            <div className="relative h-full w-full overflow-hidden rounded-[10px]">
              <Image src={paintings[e.image]} alt={`${e.name}: a Renaissance portrait with a bar of Avorio`} fill preload sizes="(min-width: 768px) 440px, 78vw" placeholder="blur" className="object-cover" style={{ objectPosition: e.focus }} />
            </div>
            <span className="label absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1.5" style={{ backgroundColor: A, color: Z, boxShadow: `0 0 0 1.5px ${Z}` }}>
              {e.n} · {e.name}
            </span>
          </div>
        </div>
      </section>

      {/* 2 — tagline */}
      <section data-nav={nav(Z)} className="px-[var(--gutter)] py-[18vh]" style={{ backgroundColor: Z, color: A }}>
        <FlipWords text={e.tagline} className="display max-w-[14ch] text-[clamp(48px,8vw,160px)] leading-[0.9]" />
      </section>

      {/* 3 — tasting notes */}
      <section data-nav={nav(A)} className="px-[var(--gutter)] py-[12vh]" style={{ backgroundColor: A, color: Z }}>
        <p className="rise label mb-10">Note di degustazione</p>
        <ul>
          {e.notes.map((n, i) => (
            <li key={n.label} className="rise grid items-end gap-x-6 gap-y-2 border-t-[1.5px] border-current py-6 md:grid-cols-[140px_1fr_280px]" data-delay={i * 0.06}>
              <span className="label">{n.label}</span>
              <span className="display text-[clamp(52px,9vw,180px)] leading-[0.82]">{n.word}</span>
              <span className="text-[14px] leading-[1.5] md:text-right">{n.line}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 4 — the painting */}
      <section data-nav={nav(Z)} className="grid gap-12 px-[var(--gutter)] py-[16vh] md:grid-cols-2" style={{ backgroundColor: Z, color: A }}>
        <div>
          <p className="rise label">Il dipinto</p>
          <p className="rise serif mt-6 text-[clamp(40px,5.4vw,96px)] leading-[0.95]">“{e.tagline}”</p>
          <div className="mt-10 max-w-[480px] space-y-5 text-[15px] leading-[1.7]">
            {e.story.map((para, i) => (
              <p key={i} className="rise" data-delay={i * 0.08}>
                {para}
              </p>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 md:pt-[14vh]">
          {e.details.map((focus, i) => (
            <div key={focus} className={`ed-par relative aspect-[3/4] overflow-hidden rounded-[14px] ring-2 ${i === 1 ? "mt-[12vh]" : ""}`} style={{ ["--tw-ring-color" as string]: A }}>
              <Image src={paintings[e.image]} alt="" fill sizes="25vw" className="scale-[2.2] object-cover" style={{ objectPosition: focus, transformOrigin: focus }} />
            </div>
          ))}
        </div>
      </section>

      {/* 5 — ingredients & pairings */}
      <section data-nav={nav(A)} className="grid gap-16 px-[var(--gutter)] py-[14vh] md:grid-cols-2" style={{ backgroundColor: A, color: Z }}>
        <div>
          <p className="rise label">Ingredienti</p>
          <ul className="mt-6 border-b-[1.5px] border-current">
            {e.ingredients.map((g) => (
              <li key={g.name} className="rise flex justify-between border-t-[1.5px] border-current py-3 text-[15px]">
                <span>{g.name}</span>
                <span className="font-bold">{g.pct}</span>
              </li>
            ))}
          </ul>
          <p className="rise mt-4 text-[13px]">{e.allergens} Made in a kitchen that handles nuts.</p>
          <div className="rise mt-10 flex flex-wrap items-center gap-4">
            <TLink href="/regali" label="Regali" className={`btn ${A === B ? "btn-dark" : ""}`}>
              Add to a box · {e.price} <span aria-hidden>→</span>
            </TLink>
            <span className="label">{e.weight}</span>
          </div>
        </div>
        <div>
          <p className="rise label">Con</p>
          <ul className="mt-6 space-y-2">
            {e.pairings.map((pair, i) => (
              <li key={pair} className="rise display text-[clamp(40px,5.6vw,104px)] leading-[0.9]" data-delay={i * 0.06}>
                {pair}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6 — next */}
      <TLink
        href={`/collezione/${next.slug}`}
        label={next.name}
        data-cursor="Next"
        data-nav={nav(Z)}
        className="group block px-[var(--gutter)] py-[12vh]"
        style={{ backgroundColor: Z, color: A }}
      >
        <span className="label flex justify-between">
          <span>Prossima · {next.n}</span>
          <span>{next.flavour}</span>
        </span>
        <span className="p3d mt-4 block">
          <span className="display block origin-bottom text-[clamp(44px,12vw,240px)] leading-[0.82] md:whitespace-nowrap transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:[transform:rotateX(18deg)_translateY(-4%)]">
            {next.name} →
          </span>
        </span>
      </TLink>
    </div>
  );
}
