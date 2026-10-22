"use client";

import { useSyncExternalStore } from "react";

/** Live media-query match; `serverValue` is used during prerender. */
export function useMediaQuery(query: string, serverValue = false) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverValue
  );
}

let webglSupport: boolean | undefined;
const noop = () => () => {};

export function useWebGL() {
  return useSyncExternalStore(
    noop,
    () => {
      if (webglSupport === undefined) {
        try {
          const c = document.createElement("canvas");
          webglSupport = !!(c.getContext("webgl2") || c.getContext("webgl"));
        } catch {
          webglSupport = false;
        }
      }
      return webglSupport;
    },
    () => false
  );
}
