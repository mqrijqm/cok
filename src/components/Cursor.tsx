"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useMediaQuery } from "@/lib/useMediaQuery";

/** Vermilion dot + lagging ring. Grows into a labelled disc over [data-cursor]. */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const enabled = useMediaQuery("(hover: hover) and (pointer: fine)");

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return;
    const dx = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power3" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power3" });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.5, ease: "power3" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.5, ease: "power3" });

    let shown = false;
    const move = (e: PointerEvent) => {
      if (!shown) {
        gsap.to([dot.current, ring.current], { autoAlpha: 1, duration: 0.3 });
        shown = true;
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      const labelled = t.closest<HTMLElement>("[data-cursor]");
      const interactive = t.closest("a, button, [role=tab]");
      setLabel(labelled ? labelled.dataset.cursor ?? "" : null);
      ring.current?.classList.toggle("is-hover", !!interactive && !labelled);
    };
    const leave = () => {
      gsap.to([dot.current, ring.current], { autoAlpha: 0, duration: 0.3 });
      shown = false;
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <style>{`
        @media (hover: hover) and (pointer: fine) {
          a, button, [role=tab], [data-cursor] { cursor: none; }
        }
        .cursor-ring.is-hover > span { scale: 1.9; }
      `}</style>
      <div
        ref={ring}
        aria-hidden
        className="cursor-ring pointer-events-none fixed left-0 top-0 z-[100] opacity-0"
      >
        <span
          className={`absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-magenta outline outline-[1.5px] outline-beige transition-[width,height,scale,background-color] duration-500 ease-[var(--ease-out-expo)] ${
            label !== null ? "h-24 w-24 bg-magenta" : "h-9 w-9"
          }`}
        >
          <span
            className={`label text-[10px] text-beige transition-opacity duration-300 ${label ? "opacity-100" : "opacity-0"}`}
          >
            {label}
          </span>
        </span>
      </div>
      <div ref={dot} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[100] opacity-0">
        <span
          className={`absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-magenta outline outline-[1.5px] outline-beige transition-opacity ${
            label !== null ? "opacity-0" : "opacity-100"
          }`}
        />
      </div>
    </>
  );
}
