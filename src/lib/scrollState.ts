/** Mutable scroll data read inside render loops (no React re-renders). */
export const scrollState = {
  y: 0,
  velocity: 0,
};

/** 0 before the intro, 1 once the flying pieces have burst out (animated by the DOM). */
export const flyIntro = { t: 0 };

/** Making-of scroll progress, 0 → 1, written by the section and read by its 3D scene. */
export const makingState = { p: 0 };
