"use client";

import { useEffect, useEffectEvent } from "react";
import { INTRO_DONE } from "./motion";

declare global {
  interface Window {
    __avorioIntroDone?: boolean;
  }
}

/** Runs `cb` once the preloader has lifted (or right away if it already has). */
export function useIntro(cb: () => void) {
  const onIntro = useEffectEvent(cb);

  useEffect(() => {
    if (window.__avorioIntroDone) {
      onIntro();
      return;
    }
    const run = () => onIntro();
    window.addEventListener(INTRO_DONE, run, { once: true });
    return () => window.removeEventListener(INTRO_DONE, run);
  }, []);
}
