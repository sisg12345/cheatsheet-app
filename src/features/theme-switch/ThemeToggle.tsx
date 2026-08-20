"use client";

import { useEffect, useState } from "react";
import { Button } from "@/src/components/atoms/Button/Button";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("cheatsheet-theme", theme);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = localStorage.getItem("cheatsheet-theme") as Theme | null;
    const preferred = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const initial = stored ?? preferred;
    applyTheme(initial);
    const frame = requestAnimationFrame(() => setTheme(initial));
    return () => cancelAnimationFrame(frame);
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    applyTheme(next);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      aria-label={theme === "light" ? "ダークモードに切り替え" : "ライトモードに切り替え"}
      title={theme === "light" ? "ダークモード" : "ライトモード"}
    >
      <span aria-hidden="true">{theme === "light" ? "◐" : "☀"}</span>
      <span>{theme === "light" ? "Dark" : "Light"}</span>
    </Button>
  );
}
