/** Mutable scroll data read inside render loops (no React re-renders). */
export const scrollState = {
  y: 0,
  velocity: 0,
};

/** 0 before the intro, 1 once the flying pieces have burst out (animated by the DOM). */
export const flyIntro = { t: 0 };

/**
 * Making-of state, written by the section on scroll and read by its 3D scene.
 * p: progress 0 → 1. The background wipes from the top between magenta and
 * beige; fromM/toM say which colour is on each side of the wipe line.
 */
export const makingState = { p: 0, wipe: 0, fromM: 1, toM: 1 };
