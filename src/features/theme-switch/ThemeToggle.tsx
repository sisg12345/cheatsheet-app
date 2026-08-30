/**
 * ライト／ダークを切り替えるヘッダー内のボタン。
 *
 * 初期テーマの決定（保存値とOS設定の読み取り）は index.html の同期スクリプトが
 * 描画前に済ませている。このコンポーネントは切り替えだけを担当する。
 */
import { useState } from "react";
import { Button } from "@/src/components/atoms/Button/Button";
import { THEME_STORAGE_KEY, type Theme } from "./theme";

/** `<html data-theme>` を書き換えて即座に配色を切り替え、選択を保存する。 */
function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // ストレージが使えない環境では永続化を諦める（表示の切り替えは成立させる）
  }
}

/**
 * 現在のテーマをDOMから読む。
 *
 * localStorageやOS設定を読み直さないのは、index.htmlの初期化スクリプトが
 * 既に同じ判定を済ませて data-theme に反映しているため。二重に判定すると
 * 両者がずれたときに表示と保存値が食い違う。
 */
function getInitialTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function ThemeToggle() {
  // 初期値の計算は初回レンダーのみでよいので、関数を渡す遅延初期化を使う。
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    // stateはラベル表示用、applyThemeはDOMと保存用。両方を同じ値で更新する。
    setTheme(next);
    applyTheme(next);
  };

  // aria-labelには「切り替え先」を入れる。表示中のテーマ名ではなく操作結果を読み上げるため。
  // アイコンは装飾なので aria-hidden にし、隣のテキストだけを読ませる。
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
