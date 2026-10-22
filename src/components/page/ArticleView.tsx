"use client";

import { useRef } from "react";
import PageHero from "./PageHero";
import FlipWords from "./FlipWords";
import TLink from "../TLink";
import { useRise } from "./useRise";
import { B } from "@/lib/content";
import type { Article } from "@/lib/journal";

export default function ArticleView({ a, next }: { a: Article; next: Article }) {
  const root = useRef<HTMLDivElement>(null);
  useRise(root);
  const firstP = a.body.findIndex((b) => b.type === "p");

  return (
    <div ref={root}>
      <PageHero kicker={`${a.kicker} · ${a.readTime} · ${a.date}`} lines={a.titleLines} bg={B} size="text-[clamp(64px,13vw,260px)]" intro={a.excerpt}>
        <TLink href="/journal" label="Journal" className="ph-fade label link-under self-start md:self-end">
          ← All notes
        </TLink>
      </PageHero>

      <article data-nav="dark" className="bg-magenta px-[var(--gutter)] py-[12vh] text-beige">
        <div className="mx-auto max-w-[680px]">
          {a.body.map((b, i) => {
            if (b.type === "p") {
              const drop = i === firstP;
              return (
                <p
                  key={i}
                  className={`rise mb-6 text-[17px] leading-[1.75] ${drop ? "first-letter:float-left first-letter:mr-3 first-letter:font-[family-name:var(--font-display)] first-letter:text-[88px] first-letter:leading-[0.8]" : ""}`}
                >
                  {b.text}
                </p>
              );
            }
            if (b.type === "h")
              return (
                <h2 key={i} className="rise display mb-6 mt-16 text-[clamp(40px,4.6vw,72px)] leading-[0.9]">
                  {b.text}
                </h2>
              );
            if (b.type === "facts")
              return (
                <aside key={i} className="rise my-12 rounded-[16px] border-[1.5px] border-beige p-7">
                  <p className="label">{b.title}</p>
                  <ul className="mt-5 space-y-3">
                    {b.items.map((it) => (
                      <li key={it} className="flex gap-3 text-[15px] leading-[1.5]">
                        <span className="mt-[7px] h-2 w-2 shrink-0 bg-beige" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </aside>
              );
            // quote: breaks out to full width on the other colour
            return (
              <div key={i} data-nav="light" className="relative left-1/2 my-16 w-screen -translate-x-1/2 bg-beige px-[var(--gutter)] py-[12vh] text-magenta">
                <FlipWords as="blockquote" text={b.text} className="serif mx-auto max-w-[18ch] text-center text-[clamp(40px,5.8vw,110px)] leading-[0.98]" />
              </div>
            );
          })}
        </div>
      </article>

      <TLink href={`/journal/${next.slug}`} label={next.title} data-cursor="Read" data-nav="light" className="group block bg-beige px-[var(--gutter)] py-[12vh] text-magenta">
        <span className="label flex justify-between">
          <span>Next note · {next.kicker}</span>
          <span>{next.readTime}</span>
        </span>
        <span className="p3d mt-4 block">
          <span className="display block origin-bottom text-[clamp(56px,11vw,220px)] leading-[0.84] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:[transform:rotateX(18deg)_translateY(-4%)]">
            {next.title} →
          </span>
        </span>
      </TLink>
    </div>
  );
}
