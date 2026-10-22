"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useLenis } from "lenis/react";
import Logo from "./Logo";
import { NAV } from "@/lib/content";

type Theme = "dark" | "light";

function Chevron() {
  return (
    <svg viewBox="0 0 10 6" className="h-[6px] w-[9px] opacity-70" aria-hidden>
      <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis(({ scroll }) => {
    setScrolled(scroll > 40);
    const el = document.elementsFromPoint(window.innerWidth / 2, 36).find((n) => (n as HTMLElement).closest?.("[data-nav]"));
    const t = (el as HTMLElement | undefined)?.closest<HTMLElement>("[data-nav]")?.dataset.nav as Theme | undefined;
    if (t) setTheme(t);
  });

  const wasOpen = useRef(false);
  useEffect(() => {
    if (!menuRef.current || wasOpen.current === open) return;
    wasOpen.current = open;
    const links = menuRef.current.querySelectorAll(".mm-link");
    if (open) {
      lenis?.stop();
      gsap.set(menuRef.current, { display: "flex" });
      gsap.fromTo(menuRef.current, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.8, ease: "expo.inOut" });
      gsap.fromTo(links, { yPercent: 110 }, { yPercent: 0, duration: 1, ease: "expo.out", stagger: 0.05, delay: 0.3 });
    } else {
      lenis?.start();
      gsap.to(menuRef.current, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.6,
        ease: "expo.inOut",
        onComplete: () => {
          if (menuRef.current) gsap.set(menuRef.current, { display: "none" });
        },
      });
    }
  }, [open, lenis]);

  const go = (id: string) => {
    setOpen(false);
    lenis?.scrollTo(id, { offset: -20, duration: 1.6 });
  };

  const light = theme === "light" && scrolled;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-[var(--gutter)] pt-3">
        <nav
          className={`mx-auto flex items-center justify-between rounded-[14px] border transition-all duration-700 ease-[var(--ease-out-expo)] ${
            scrolled
              ? `h-[52px] px-3 pl-4 backdrop-blur-xl ${
                  light
                    ? "border-cocoa-800/10 bg-ivory-300/65 text-cocoa-800 shadow-[0_10px_40px_-12px_rgb(43_32_25/0.35)]"
                    : "border-ivory-100/10 bg-cocoa-850/60 text-ivory-100 shadow-[0_10px_40px_-12px_rgb(0_0_0/0.6)]"
                }`
              : "h-[80px] border-transparent bg-transparent px-0 text-ivory-100"
          }`}
        >
          <div className="flex items-center gap-12">
            <a href="#top" onClick={(e) => (e.preventDefault(), go("#top"))} className={`transition-[font-size] duration-700 ${scrolled ? "text-[15px]" : "text-[19px]"}`}>
              <Logo />
            </a>
            <ul className={`hidden items-center gap-1 lg:flex ${scrolled ? "text-[13px]" : "text-[16px]"} font-medium transition-[font-size] duration-700`}>
              {NAV.map((item) => (
                <li key={item.label} className="group relative">
                  <a
                    href={"href" in item ? item.href : "#collezione"}
                    onClick={(e) => (e.preventDefault(), go("href" in item ? item.href : "#collezione"))}
                    className="flex items-center gap-1.5 rounded-[8px] px-3 py-2 transition-colors hover:bg-current/8"
                  >
                    {item.label}
                    {"items" in item && <Chevron />}
                  </a>
                  {"items" in item && (
                    <div className="pointer-events-none absolute left-0 top-full pt-3 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:opacity-100">
                      <ul
                        className={`min-w-[200px] translate-y-1 rounded-[14px] border p-2 backdrop-blur-xl transition-transform duration-300 group-hover:translate-y-0 ${
                          light ? "border-cocoa-800/10 bg-ivory-200/90 text-cocoa-800" : "border-ivory-100/10 bg-cocoa-850/90 text-ivory-100"
                        }`}
                      >
                        {item.items.map((sub) => (
                          <li key={sub}>
                            <a href="#collezione" className="block rounded-[8px] px-3 py-2 text-[13px] hover:bg-current/8">
                              {sub}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-4">
            <span className="label hidden text-[10px] sm:inline">
              <b className="font-medium">IT</b> <span className="opacity-40">/ EN</span>
            </span>
            <a href="#abbonamento" onClick={(e) => (e.preventDefault(), go("#abbonamento"))} className={`btn ${scrolled ? "btn-sm" : ""}`}>
              Order now
            </a>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className={`grid h-10 w-10 place-items-center rounded-[10px] lg:hidden ${light ? "bg-cocoa-800/8" : "bg-ivory-100/10"}`}
            >
              <span className="relative block h-3 w-4">
                <span className={`absolute left-0 h-px w-4 bg-current transition-all duration-500 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 top-1.5 h-px w-4 bg-current transition-opacity ${open ? "opacity-0" : ""}`} />
                <span className={`absolute left-0 h-px w-4 bg-current transition-all duration-500 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <div
        ref={menuRef}
        className="fixed inset-0 z-40 hidden flex-col justify-end bg-cocoa-950 px-[var(--gutter)] pb-10 pt-28 lg:hidden"
        style={{ clipPath: "inset(0 0 100% 0)" }}
      >
        <ul className="flex flex-col gap-1">
          {NAV.map((item) => (
            <li key={item.label} className="line-mask">
              <a
                href="#collezione"
                onClick={(e) => (e.preventDefault(), go("href" in item ? item.href : "#collezione"))}
                className="mm-link display block text-[15vw] text-ivory-100"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="label mt-10 text-ivory-500">Firenze · Hand-tempered white chocolate</p>
      </div>
    </>
  );
}
