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

/**
 * localStorageやOS設定を読み直さないのは、index.html の初期化スクリプトが既に同じ判定を
 * 済ませて data-theme に反映しているため。二重に判定すると表示と保存値が食い違う。
 */
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

  // aria-label には操作結果（切り替え先）を入れる。これがボタン配下のテキストを
  // すべて置き換えるので、読み上げられるのはこの文言だけになる。
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
