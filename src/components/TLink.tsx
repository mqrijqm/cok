"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLenis } from "lenis/react";
import { coverThen } from "@/lib/transition";

type Props = Omit<React.ComponentProps<typeof Link>, "href"> & {
  href: string;
  /** Word shown on the curtain while the page changes. */
  label?: string;
};

/** A Link that drops the colour curtain first, and scrolls smoothly for same-page anchors. */
export default function TLink({ href, label, onClick, children, ...rest }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();

  return (
    <Link
      href={href}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        const [path, hash] = href.split("#");
        const target = path || pathname;
        e.preventDefault();
        if (target === pathname) {
          lenis?.scrollTo(hash ? `#${hash}` : 0, { duration: 1.8 });
          return;
        }
        coverThen(label ?? (typeof children === "string" ? children : "Avorio"), () => router.push(href, { scroll: false }));
      }}
    >
      {children}
    </Link>
  );
}
