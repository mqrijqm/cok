"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import { RevealLines } from "./Reveal";
import { HERO, paintings } from "@/lib/content";
import { EASE, prefersReducedMotion } from "@/lib/motion";
import { useIntro } from "@/lib/useIntro";

gsap.registerPlugin(useGSAP);

type Daypart = { time: string; label: string; night: boolean; dim: number };

function florenceNow(): Daypart {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Rome",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? 12);
  const m = parts.find((p) => p.type === "minute")?.value ?? "00";
  const label = h < 5 ? "Notte" : h < 12 ? "Mattina" : h < 18 ? "Pomeriggio" : h < 22 ? "Sera" : "Notte";
  const night = h < 7 || h >= 19;
  // Daylight lets more of the painting show; at night only the candle remains.
  const dim = h >= 9 && h < 17 ? 0.5 : night ? 0.74 : 0.64;
  return { time: `${String(h).padStart(2, "0")}:${m}`, label, night, dim };
}

function Sun({ night }: { night: boolean }) {
  return night ? (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-vermilion" aria-hidden>
      <path d="M10.5 1.5a6.5 6.5 0 1 0 4 11.6A7 7 0 0 1 10.5 1.5Z" fill="currentColor" />
    </svg>
  ) : (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-vermilion" aria-hidden>
      <circle cx="8" cy="8" r="3.4" fill="currentColor" />
      {Array.from({ length: 8 }).map((_, i) => (
        <rect key={i} x="7.4" y="0.6" width="1.2" height="2.4" rx="0.6" fill="currentColor" transform={`rotate(${i * 45} 8 8)`} />
      ))}
    </svg>
  );
}

function HeroPanel() {
  const panel = useRef<HTMLDivElement>(null);
  const [day, setDay] = useState<Daypart | null>(null);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const tick = () => setDay(florenceNow());
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);

  useGSAP(
    () => {
      const el = panel.current!;
      const light = { x: 52, y: 36 };
      const apply = () => {
        el.style.setProperty("--sx", `${light.x}%`);
        el.style.setProperty("--sy", `${light.y}%`);
      };
      apply();
      const toX = gsap.quickTo(light, "x", { duration: 1.1, ease: "power3", onUpdate: apply });
      const toY = gsap.quickTo(light, "y", { duration: 1.1, ease: "power3", onUpdate: apply });

      const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      if (!finePointer && !prefersReducedMotion()) {
        // No mouse: let the light drift slowly over face, hands and chocolate.
        gsap.to(light, {
          keyframes: [
            { x: 46, y: 34 },
            { x: 62, y: 62 },
            { x: 40, y: 70 },
            { x: 52, y: 36 },
          ],
          duration: 14,
          ease: "sine.inOut",
          repeat: -1,
          onUpdate: apply,
        });
      }

      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        toX(((e.clientX - r.left) / r.width) * 100);
        toY(((e.clientY - r.top) / r.height) * 100);
        setTouched(true);
      };
      el.addEventListener("pointermove", move);

      // Gentle parallax as the hero scrolls away
      gsap.to(".hero-img", {
        yPercent: 10,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
      return () => el.removeEventListener("pointermove", move);
    },
    { scope: panel }
  );

  useIntro(() => {
    if (prefersReducedMotion()) return;
    gsap.fromTo(panel.current, { clipPath: "inset(100% 0% 0% 0% round 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 1.6, ease: "expo.inOut" });
    gsap.fromTo(panel.current!.querySelector(".hero-scale"), { scale: 1.3 }, { scale: 1, duration: 2.2, ease: EASE.expo });
    gsap.fromTo(panel.current!.querySelectorAll(".hero-ui"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 1, ease: EASE.out, stagger: 0.1, delay: 1 });
  });

  return (
    <div
      ref={panel}
      className="relative h-[72svh] overflow-hidden rounded-[28px] bg-cocoa-900 lg:absolute lg:bottom-[22px] lg:right-[var(--gutter)] lg:top-[104px] lg:h-auto lg:w-[54%]"
      style={{ clipPath: "inset(0% 0% 0% 0% round 28px)", ["--dim" as string]: day?.dim ?? 0.72 }}
    >
      <div className="hero-scale absolute inset-0">
        <Image
          src={paintings.laDama}
          alt="Renaissance portrait of a lady holding an unwrapped bar of Avorio white chocolate"
          fill
          preload
          quality={90}
          sizes="(min-width: 1024px) 54vw, 100vw"
          placeholder="blur"
          className="hero-img scale-[1.12] object-cover"
          style={{ objectPosition: "50% 42%" }}
        />
      </div>

      {/* The gallery light */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at var(--sx) var(--sy), rgb(20 15 11 / 0) 0%, rgb(20 15 11 / calc(var(--dim) * 0.3)) 20%, rgb(20 15 11 / var(--dim)) 50%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 mix-blend-soft-light"
        style={{ background: "radial-gradient(circle at var(--sx) var(--sy), rgb(255 205 140 / 0.55) 0%, transparent 30%)" }}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-cocoa-950/70 to-transparent" />

      {/* Florence clock */}
      <div className="hero-ui group absolute right-4 top-4 lg:right-5 lg:top-5">
        <div className="flex items-center gap-2 rounded-full border border-ivory-100/15 bg-cocoa-950/45 px-4 py-2.5 backdrop-blur-md">
          <Sun night={day?.night ?? false} />
          <span className="font-display text-[13px] font-bold tabular-nums">{day?.time ?? "--:--"}</span>
          <span className="font-display text-[11px] font-medium uppercase tracking-[0.08em] text-ivory-100/85">
            {day ? `${day.label} a Firenze` : "Firenze"}
          </span>
        </div>
        <p className="label pointer-events-none absolute right-0 top-full mt-2 whitespace-nowrap rounded-full bg-ivory-100 px-3 py-1.5 text-[9px] text-cocoa-800 opacity-0 transition-opacity group-hover:opacity-100">
          La luce segue l&apos;ora di Firenze
        </p>
      </div>

      {/* Hint bubble */}
      <div
        className={`hero-ui pointer-events-none absolute left-[30%] top-[46%] hidden transition-opacity duration-700 [@media(hover:hover)]:block ${touched ? "!opacity-0" : ""}`}
      >
        <span className="relative block rounded-[12px] bg-ivory-50 px-3.5 py-2 text-[14px] font-medium text-cocoa-800 shadow-xl">
          Move to light the painting
          <span className="absolute left-1/2 top-full h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-ivory-50" />
        </span>
      </div>

      {/* Museum placard */}
      <div className="hero-ui absolute bottom-4 left-4 rounded-[10px] bg-ivory-100/92 px-4 py-3 text-cocoa-800 backdrop-blur lg:bottom-5 lg:left-5">
        <p className="text-[13px] font-semibold italic">{HERO.placard.title}</p>
        <p className="label mt-1 text-[9px] text-cocoa-800/60">{HERO.placard.meta}</p>
      </div>
    </div>
  );
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const lenis = useLenis();

  useGSAP(
    () => {
      if (!prefersReducedMotion()) gsap.set(".hero-fade", { autoAlpha: 0, y: 18 });
    },
    { scope: root }
  );

  useIntro(() => {
    if (prefersReducedMotion()) return;
    gsap.to(root.current!.querySelectorAll(".hero-fade"), { autoAlpha: 1, y: 0, duration: 1.1, ease: EASE.out, stagger: 0.08, delay: 0.55 });
  });

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    lenis?.scrollTo(id, { offset: -20, duration: 1.6 });
  };

  return (
    <section
      ref={root}
      id="top"
      data-nav="dark"
      className="relative px-[var(--gutter)] pb-6 pt-[104px] lg:min-h-[max(100svh,760px)]"
      style={{ background: "radial-gradient(120% 90% at 20% 0%, #2b2019 0%, #1a130e 45%, #140f0b 75%)" }}
    >
      <div className="relative z-10 flex flex-col lg:min-h-[calc(max(100svh,760px)-130px)] lg:w-[48%]">
        <div className="hero-fade pt-2 pb-4">
          <span className="pill">{HERO.pill}</span>
        </div>

        <RevealLines
          as="h1"
          mode="intro"
          lines={HERO.lines}
          lineClassNames={["", "pl-[0.82em]", "", "pl-[0.82em]"]}
          className="display pointer-events-none whitespace-nowrap text-[clamp(60px,min(9vw,14.2svh),156px)] font-medium leading-[0.86] text-ivory-100"
        />

        <p className="hero-fade mt-6 max-w-[520px] text-[clamp(17px,1.3vw,20px)] leading-[1.45] text-ivory-100/80">{HERO.body}</p>

        <div className="hero-fade mt-6 flex flex-wrap items-center gap-3">
          <a href="#collezione" onClick={go("#collezione")} className="btn font-bold">
            {HERO.primary} <span aria-hidden>→</span>
          </a>
          <a href="#rito" onClick={go("#rito")} className="btn btn-ghost text-ivory-100">
            {HERO.secondary}
          </a>
        </div>
        <a href="#atelier" onClick={go("#atelier")} className="hero-fade link-draw mt-5 self-start pb-0.5 text-[16px] font-medium text-ivory-100/90">
          {HERO.tertiary}
        </a>

        <div className="hero-fade mt-8 flex items-center gap-5 pb-2 lg:mt-auto">
          <span className="font-display text-[11px] font-bold uppercase leading-[1.2] tracking-[0.06em] text-ivory-100/70">
            {HERO.notesLabel.split(" ")[0]}
            <br />
            {HERO.notesLabel.split(" ")[1]}
          </span>
          <span className="h-8 w-px bg-ivory-100/20" />
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {HERO.notes.map((n) => (
              <li key={n} className="font-display text-[13px] font-medium uppercase tracking-[0.14em] text-ivory-100/45">
                {n}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-10 lg:mt-0">
        <HeroPanel />
      </div>
    </section>
  );
}
