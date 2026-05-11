"use client";

import { useState } from "react";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.style.colorScheme = theme;
}

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function safeReadTheme(): Theme | null {
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") {
      return saved;
    }
  } catch {
    return null;
  }
  return null;
}

function safeWriteTheme(theme: Theme) {
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // Ignore storage write failures.
  }
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(() => {
    if (typeof window === "undefined") return null;
    const nextTheme = safeReadTheme() ?? getSystemTheme();
    applyTheme(nextTheme);
    return nextTheme;
  });

  function toggleTheme() {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    applyTheme(nextTheme);
    safeWriteTheme(nextTheme);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--line)] text-base text-[color:var(--text)] transition-colors hover:bg-[color:var(--surface)]"
      aria-label="Toggle theme"
      suppressHydrationWarning
    >
      {theme === null ? null : theme === "dark" ? "☾" : "☀"}
    </button>
  );
}
