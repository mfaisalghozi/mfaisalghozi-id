"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";

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
          <nav className="flex items-center gap-1 rounded-full border border-[color:var(--line)] p-1">
            {navItems.map((item) => {
              const active = isActivePath(item.href, pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "relative rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-150",
                    active
                      ? "text-[color:var(--text)]"
                      : "text-[color:var(--muted)] hover:text-[color:var(--text)]",
                  ].join(" ")}
                >
                  {active && (
                    <motion.span
                      layoutId="active-nav-pill"
                      className="absolute inset-0 rounded-full"
                      style={{
                        background:
                          "linear-gradient(135deg, color-mix(in srgb, var(--accent) 14%, transparent), color-mix(in srgb, var(--accent) 7%, transparent))",
                        boxShadow:
                          "0 0 0 1px color-mix(in srgb, var(--accent) 28%, transparent), inset 0 1px 0 color-mix(in srgb, white 10%, transparent)",
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
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
