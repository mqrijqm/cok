export const EASE = {
  out: "power3.out",
  inOut: "power2.inOut",
  expo: "expo.out",
} as const;

export const DUR = {
  fast: 0.4,
  base: 0.8,
  slow: 1.4,
} as const;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Fired by the preloader once the intro curtain has lifted.
export const INTRO_DONE = "avorio:intro-done";
