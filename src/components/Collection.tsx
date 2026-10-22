"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import TLink from "./TLink";
import { EDITIONS, paintings } from "@/lib/content";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const STEP = 360 / EDITIONS.length;

/** The five editions on a ring that turns as you scroll. */
export default function Collection() {
  const root = useRef<HTMLElement>(null);
  const [front, setFront] = useState(0);

  useGSAP(
    () => {
      const ring = root.current!.querySelector<HTMLElement>(".col-ring")!;
      const tilt = root.current!.querySelector<HTMLElement>(".ring-tilt")!;
      const turns = (EDITIONS.length - 1) * STEP;
      if (prefersReducedMotion()) {
        gsap.set(tilt, { rotateX: -8 });
        return;
      }
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=320%",
          pin: true,
          scrub: 0.8,
          onUpdate: (self) => {
            const angle = Math.max(0, (self.progress - 0.12) / 0.8) * turns;
            setFront(Math.min(EDITIONS.length - 1, Math.round(angle / STEP)));
          },
        },
      });
      // Arrive tilted and far, then turn through every edition.
      tl.fromTo(tilt, { rotateX: -38, scale: 0.6 }, { rotateX: -8, scale: 1, ease: "power2.out", duration: 0.12 })
        .fromTo(ring, { rotateY: 40 }, { rotateY: 0, ease: "power2.out", duration: 0.12 }, 0)
        .to(ring, { rotateY: -turns, ease: "none", duration: 0.8 })
        .to(tilt, { rotateX: 12, scale: 0.9, ease: "power1.in", duration: 0.08 });
      tl.fromTo(".col-title", { yPercent: 30, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.12, ease: "power2.out" }, 0);
    },
    { scope: root }
  );

  const e = EDITIONS[front];

  return (
    <section ref={root} id="collezione" data-nav="light" className="relative z-10 h-[100svh] overflow-hidden bg-beige text-magenta">
      <div className="col-title pointer-events-none absolute inset-x-0 top-[13svh] text-center">
        <p className="serif text-[clamp(40px,5vw,90px)] leading-none">la</p>
        <h2 className="display -mt-[0.1em] text-[17.5vw] font-medium leading-[0.8]">Collezione</h2>
      </div>

      <div className="p3d-deep absolute inset-0 grid place-items-center pt-[10svh]">
        <div className="ring-tilt preserve">
        <div
          className="col-ring preserve relative [--r:calc(var(--w)*1.05)] [--w:min(56vw,300px)] md:[--r:calc(var(--w)*1.3)] md:[--w:clamp(200px,20vw,340px)]"
          style={{ width: "var(--w)", height: "calc(var(--w) * 1.3)" }}
        >
          {EDITIONS.map((ed, i) => (
            <div
              key={ed.name}
              className="preserve absolute inset-0"
              style={{ transform: `rotateY(${i * STEP}deg) translateZ(var(--r))` }}
              data-cursor="Taste"
            >
              <TLink href={`/collezione/${ed.slug}`} label={ed.name} className="backface-hidden absolute inset-0 overflow-hidden rounded-[20px] ring-2 ring-magenta">
                <Image src={paintings[ed.image]} alt={`${ed.name}, ${ed.notes}`} fill sizes="340px" placeholder="blur" className="object-cover" style={{ objectPosition: ed.focus }} />
                <span className="label absolute left-3 top-3 rounded-full bg-beige px-2.5 py-1.5 text-[9px] text-magenta">{ed.meta}</span>
              </TLink>
              <div className="backface-hidden absolute inset-0 grid place-items-center rounded-[20px] bg-magenta text-beige" style={{ transform: "rotateY(180deg)" }}>
                <span className="serif px-4 text-center text-[clamp(34px,3.4vw,58px)] leading-[0.9]">{ed.name}</span>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-8 text-center">
        <p key={e.name} className="display origin-bottom animate-[flip-up_0.7s_var(--ease-out-expo)] text-[clamp(30px,3.6vw,56px)] leading-none">
          {e.name}
        </p>
        <p className="label mt-3">
          {e.meta} · {e.notes} ·{" "}
          <TLink href={`/collezione/${e.slug}`} label={e.name} className="link-under">
            Discover →
          </TLink>
        </p>
      </div>
    </section>
  );
}
