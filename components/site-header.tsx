"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useLayoutEffect, useState } from "react";

import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/projects", label: "Projects" },
];

function isActivePath(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function SiteHeader() {
  const pathname = usePathname();
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number } | null>(null);
  const [pillReady, setPillReady] = useState(false);

  useLayoutEffect(() => {
    const activeIndex = navItems.findIndex((item) => isActivePath(item.href, pathname ?? ""));
    const activeEl = itemRefs.current[activeIndex];
    if (!activeEl) return;
    setPillStyle({ left: activeEl.offsetLeft, width: activeEl.offsetWidth });
    // Allow CSS transition only after the first position is set
    setPillReady(true);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--line)] bg-[color:var(--bg)]/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="font-mono text-base font-medium tracking-tight text-[color:var(--text)]"
        >
          mfaisalghozi.id
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <nav className="relative hidden sm:flex items-center gap-1 rounded-full border border-[color:var(--line)] p-1">
            {pillStyle && (
              <span
                className="absolute inset-y-1 rounded-full"
                style={{
                  left: pillStyle.left,
                  width: pillStyle.width,
                  transition: pillReady
                    ? "left 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    : "none",
                  background:
                    "linear-gradient(135deg, color-mix(in srgb, var(--accent) 14%, transparent), color-mix(in srgb, var(--accent) 7%, transparent))",
                  boxShadow:
                    "0 0 0 1px color-mix(in srgb, var(--accent) 28%, transparent), inset 0 1px 0 color-mix(in srgb, white 10%, transparent)",
                }}
              />
            )}
            {navItems.map((item, i) => {
              const active = isActivePath(item.href, pathname ?? "");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  className={[
                    "relative z-10 rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-150",
                    active
                      ? "text-[color:var(--text)]"
                      : "text-[color:var(--muted)] hover:text-[color:var(--text)]",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
