import { useState } from "react";
import { Button } from "@/src/components/atoms/Button/Button";
import { THEME_STORAGE_KEY, type Theme } from "./theme";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // ストレージが使えない環境では永続化を諦める（表示の切り替えは成立させる）
  }
}

function getInitialTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

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
