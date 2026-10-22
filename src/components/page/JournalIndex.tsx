"use client";

import { useRef } from "react";
import PageHero from "./PageHero";
import TLink from "../TLink";
import { useRise } from "./useRise";
import { B } from "@/lib/content";
import { ARTICLES } from "@/lib/journal";

export default function JournalIndex() {
  const root = useRef<HTMLDivElement>(null);
  useRise(root);

  return (
    <div ref={root}>
      <PageHero
        kicker="Il giornale · Notes from the atelier"
        serif="notes"
        lines={["Journal"]}
        bg={B}
        intro="What we have learned about cocoa butter, cold marble and patience, written down so we do not forget it."
      />
      <section data-nav="dark" className="bg-magenta px-[var(--gutter)] py-[12vh] text-beige">
        <ul className="border-b-[1.5px] border-beige">
          {ARTICLES.map((a) => (
            <li key={a.slug} className="rise border-t-[1.5px] border-beige">
              <TLink href={`/journal/${a.slug}`} label={a.title} data-cursor="Read" className="group relative block overflow-hidden py-8 md:py-10">
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-beige transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-y-100" />
                <span className="relative grid gap-4 transition-colors duration-300 group-hover:text-magenta md:grid-cols-[180px_1fr_320px] md:items-end">
                  <span className="label flex gap-4 md:flex-col md:gap-1">
                    <span>{a.kicker}</span>
                    <span>{a.readTime}</span>
                  </span>
                  <span className="display text-[clamp(48px,8vw,160px)] leading-[0.84]">{a.title}</span>
                  <span className="text-[14px] leading-[1.55] md:text-right">{a.excerpt}</span>
                </span>
              </TLink>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
