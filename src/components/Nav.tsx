"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useLenis } from "lenis/react";
import Logo from "./Logo";
import TLink from "./TLink";
import { NAV } from "@/lib/content";

type Theme = "dark" | "light";

function themeUnderNav(): Theme | undefined {
  const el = document.elementsFromPoint(window.innerWidth / 2, 36).find((n) => (n as HTMLElement).closest?.("[data-nav]"));
  return (el as HTMLElement | undefined)?.closest<HTMLElement>("[data-nav]")?.dataset.nav as Theme | undefined;
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const lenis = useLenis(({ scroll }) => {
    setScrolled(scroll > 40);
    const t = themeUnderNav();
    if (t) setTheme(t);
  });

  // A new page starts at the top with its own colours.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setScrolled(window.scrollY > 40);
      const t = themeUnderNav();
      if (t) setTheme(t);
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  const wasOpen = useRef(false);
  useEffect(() => {
    if (!menuRef.current || wasOpen.current === open) return;
    wasOpen.current = open;
    const links = menuRef.current.querySelectorAll(".mm-link");
    if (open) {
      lenis?.stop();
      gsap.set(menuRef.current, { display: "flex" });
      gsap.fromTo(menuRef.current, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.8, ease: "expo.inOut" });
      gsap.fromTo(links, { yPercent: 110, rotateX: -80 }, { yPercent: 0, rotateX: 0, duration: 1, ease: "expo.out", stagger: 0.06, delay: 0.3 });
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

  const close = () => setOpen(false);
  const light = theme === "light" && scrolled;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-[var(--gutter)] pt-3">
        <nav
          className={`mx-auto flex items-center justify-between rounded-[14px] border-[1.5px] transition-[height,padding,background-color,color,border-color] duration-500 ease-[var(--ease-out-expo)] ${
            scrolled
              ? `h-[52px] px-3 pl-4 ${light ? "border-magenta bg-beige text-magenta" : "border-beige bg-magenta text-beige"}`
              : `h-[80px] border-transparent bg-transparent px-0 ${theme === "light" ? "text-magenta" : "text-beige"}`
          }`}
        >
          <TLink href="/" label="Avorio" onClick={close} className={`transition-[font-size] duration-700 ${scrolled ? "text-[15px]" : "text-[19px]"}`}>
            <Logo />
          </TLink>

          <ul className={`absolute left-1/2 hidden -translate-x-1/2 items-center lg:flex ${scrolled ? "text-[13px]" : "text-[14px]"} transition-[font-size] duration-700`}>
            {NAV.map((item) => (
              <li key={item.label}>
                <TLink
                  href={item.href}
                  label={item.label}
                  aria-current={pathname !== "/" && item.href.startsWith(pathname) ? "page" : undefined}
                  className="link-under mx-3.5 block py-2 aria-[current=page]:[background-size:100%_1.5px]"
                >
                  {item.label}
                </TLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <TLink href="/regali" label="Regali" onClick={close} className={`btn ${light || (!scrolled && theme === "light") ? "btn-dark" : ""} ${scrolled ? "btn-sm" : ""}`}>
              Order
            </TLink>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="grid h-10 w-10 place-items-center rounded-[10px] border-[1.5px] border-current lg:hidden"
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
        className="p3d fixed inset-0 z-40 hidden flex-col justify-end bg-magenta px-[var(--gutter)] pb-10 pt-28 lg:hidden"
        style={{ clipPath: "inset(0 0 100% 0)" }}
      >
        <ul className="flex flex-col gap-1">
          {[...NAV, { label: "Contatto", href: "/contatto" }].map((item) => (
            <li key={item.label} className="line-mask">
              <TLink href={item.href} label={item.label} onClick={close} className="mm-link display block origin-bottom text-[13.5vw] text-beige">
                {item.label}
              </TLink>
            </li>
          ))}
        </ul>
        <p className="label mt-10 text-beige">Firenze · Cioccolato bianco</p>
      </div>
    </>
  );
}
