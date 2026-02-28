"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  document.body.setAttribute("data-theme", theme);
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
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const nextTheme = safeReadTheme() ?? getSystemTheme();
    setTheme(nextTheme);
    applyTheme(nextTheme);
  }, []);

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
      className="inline-flex h-10 items-center gap-2 rounded-full border border-[color:var(--line)] px-4 text-sm font-medium text-[color:var(--text)] transition-colors hover:bg-[color:var(--surface)]"
      aria-label="Toggle theme"
    >
      <span>{theme === "dark" ? "Dark" : "Light"}</span>
      <span className="text-base">{theme === "dark" ? "☾" : "☀"}</span>
    </button>
  );
}
