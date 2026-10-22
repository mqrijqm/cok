/**
 * Page transitions. The curtain lives in the root layout and registers
 * itself here; links call `coverThen` before navigating.
 */
type Curtain = {
  cover: (label: string) => Promise<void>;
};

let curtain: Curtain | null = null;

export function registerCurtain(c: Curtain | null) {
  curtain = c;
}

export async function coverThen(label: string, go: () => void) {
  if (!curtain) return go();
  await curtain.cover(label);
  go();
}

declare global {
  interface Window {
    __avorioRevealAt?: number;
  }
}

/** Milliseconds until the curtain has lifted enough for intro animations. */
export function revealDelay() {
  if (typeof window === "undefined" || !window.__avorioRevealAt) return 0;
  return Math.max(0, window.__avorioRevealAt - performance.now());
}
