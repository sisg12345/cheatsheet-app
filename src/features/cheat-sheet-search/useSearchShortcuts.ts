import { useEffect, useRef, type RefObject } from "react";

const TYPING_TAGS = ["INPUT", "TEXTAREA", "SELECT"];

/**
 * `/` で検索欄へフォーカスし、Escape で検索語をクリアする。
 * 一覧ページと個別シートで共通のショートカット。
 *
 * onClear は毎レンダー新しい関数でも構わない。最新の関数をrefで保持し、
 * keydownリスナーの再登録が起きないようにしている。
 */
export function useSearchShortcuts(
  inputRef: RefObject<HTMLInputElement | null>,
  onClear: () => void,
) {
  const onClearRef = useRef(onClear);

  useEffect(() => {
    onClearRef.current = onClear;
  }, [onClear]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping = TYPING_TAGS.includes(target?.tagName ?? "");
      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        inputRef.current?.focus();
      }
      if (event.key === "Escape") {
        onClearRef.current();
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [inputRef]);
}
