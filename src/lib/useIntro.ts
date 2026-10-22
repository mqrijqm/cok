"use client";

import { useEffect, useEffectEvent } from "react";
import { INTRO_DONE } from "./motion";
import { revealDelay } from "./transition";

declare global {
  interface Window {
    __avorioIntroDone?: boolean;
  }
}

/**
 * Runs `cb` once the preloader has lifted, or right away (after any page
 * curtain has cleared) if it already has.
 */
export function useIntro(cb: () => void) {
  const onIntro = useEffectEvent(cb);

  useEffect(() => {
    if (window.__avorioIntroDone) {
      const id = window.setTimeout(() => onIntro(), revealDelay());
      return () => window.clearTimeout(id);
    }
    const run = () => onIntro();
    window.addEventListener(INTRO_DONE, run, { once: true });
    return () => window.removeEventListener(INTRO_DONE, run);
  }, []);
}
