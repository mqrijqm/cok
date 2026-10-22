// Plain module (not "use client") so server pages can build zone lists.
export type FlyZone = { trigger?: string; start?: string | number; endTrigger?: string; end?: string };

/** From the top of the page to the end of `selector`. start: -1 so the very top counts as inside. */
export const fromTopUntil = (selector: string): FlyZone => ({ start: -1, endTrigger: selector, end: "bottom top" });
export const whileVisible = (selector: string): FlyZone => ({ trigger: selector, start: "top bottom", end: "bottom top" });
