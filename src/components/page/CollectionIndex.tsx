"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import PageHero from "./PageHero";
import TLink from "../TLink";
import { useRise } from "./useRise";
import { paintings } from "@/lib/content";
import { EDITION_DETAILS } from "@/lib/editions";
import { useMediaQuery } from "@/lib/useMediaQuery";

gsap.registerPlugin(useGSAP);

export default function CollectionIndex() {
  const root = useRef<HTMLDivElement>(null);
  const follower = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)");
  useRise(root);

  // The hovered painting follows the cursor and leans with its speed.
  useGSAP(
    () => {
      if (!fine || !follower.current) return;
      const el = follower.current;
      gsap.set(el, { transformPerspective: 900 });
      const x = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
      const y = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
      const r = gsap.quickTo(el, "rotateY", { duration: 0.8, ease: "power3" });
      let last = 0;
      const move = (e: PointerEvent) => {
        x(e.clientX);
        y(e.clientY);
        r(gsap.utils.clamp(-35, 35, (e.clientX - last) * 1.2));
        last = e.clientX;
      };
      window.addEventListener("pointermove", move);
      return () => window.removeEventListener("pointermove", move);
    },
    { dependencies: [fine] }
  );

  return (
    <div ref={root}>
      <PageHero
        kicker="La collezione · Cinque ritratti"
        serif="cinque"
        lines={["Ritratti"]}
        intro="Five editions, five portraits. Each bar is a different white chocolate and each sleeve carries its own painting. Start anywhere."
      />

      <section data-nav="light" className="bg-beige px-[var(--gutter)] py-[12vh] text-magenta" onPointerLeave={() => setHover(null)}>
        <ul className="border-b-[1.5px] border-magenta">
          {EDITION_DETAILS.map((e, i) => (
            <li key={e.slug} className="rise border-t-[1.5px] border-magenta">
              <TLink
                href={`/collezione/${e.slug}`}
                label={e.name}
                data-cursor="Open"
                onPointerEnter={() => setHover(i)}
                className="group relative grid grid-cols-[1fr_auto] items-center gap-x-6 overflow-hidden py-5 md:grid-cols-[110px_1fr_auto_40px] md:py-6"
              >
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-magenta transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-y-100" />
                <span className="label relative hidden transition-colors duration-300 group-hover:text-beige md:block">{e.n}</span>
                <span className="relative flex items-center gap-4">
                  <span className="relative block h-[64px] w-[48px] shrink-0 overflow-hidden rounded-[6px] ring-[1.5px] ring-magenta md:hidden">
                    <Image src={paintings[e.image]} alt="" fill sizes="48px" className="object-cover" style={{ objectPosition: e.focus }} />
                  </span>
                  <span className="display text-[clamp(44px,8.6vw,170px)] leading-[0.86] transition-colors duration-300 group-hover:text-beige">{e.name}</span>
                </span>
                <span className="label relative hidden text-right transition-colors duration-300 group-hover:text-beige md:block">{e.flavour}</span>
                <span className="relative text-[28px] transition-[color,translate] duration-300 group-hover:translate-x-1 group-hover:text-beige">→</span>
              </TLink>
            </li>
          ))}
        </ul>
      </section>

      <section data-nav="dark" className="flex flex-col items-start gap-8 bg-magenta px-[var(--gutter)] py-[14vh] text-beige md:flex-row md:items-end md:justify-between">
        <h2 className="rise display text-[clamp(52px,8vw,150px)] leading-[0.86]">
          All five,
          <br />
          <span className="serif text-[1.1em]">in one box</span>
        </h2>
        <div className="rise max-w-[360px]" data-delay="0.1">
          <p className="text-[14px] leading-[1.6]">A linen gallery box with every portrait, a numbered certificate and a tasting card to write on.</p>
          <TLink href="/regali" label="Regali" className="btn mt-6">
            La collezione · €68 <span aria-hidden>→</span>
          </TLink>
        </div>
      </section>

      {fine && (
        <div
          ref={follower}
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-40"
          style={{ visibility: hover === null ? "hidden" : "visible" }}
        >
          <div className="relative -ml-[130px] -mt-[170px] h-[340px] w-[260px] overflow-hidden rounded-[14px] ring-2 ring-beige">
            {EDITION_DETAILS.map((e, i) => (
              <Image
                key={e.slug}
                src={paintings[e.image]}
                alt=""
                fill
                sizes="260px"
                className="object-cover"
                style={{ objectPosition: e.focus, visibility: hover === i ? "visible" : "hidden" }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
