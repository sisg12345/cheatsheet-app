import { useEffect, useRef, type RefObject } from "react";

/** ここにフォーカスがあるときは入力中とみなし、`/` をショートカットに使わない。 */
const TYPING_TAGS = ["INPUT", "TEXTAREA", "SELECT"];

/**
 * `/` で検索欄へフォーカスし、Escape で検索語をクリアする。
 * onClear は毎レンダー新しい関数でも構わない（refで保持しリスナーを張り直さない）。
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
      // 日本語入力ではEscapeが変換の取り消しなので、ここで拾うと検索語ごと消えてしまう。
      // keyCode 229 は見ない。Androidのソフトキーボードは変換中でなくても全keydownを
      // 229 で報告するため、弾くと外付けキーボードで `/` と Escape が効かなくなる。
      if (event.isComposing) return;

      const target = event.target as HTMLElement | null;
      const isTyping = TYPING_TAGS.includes(target?.tagName ?? "");

      // preventDefault しないと、フォーカス後の入力欄に `/` が1文字入る。
      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        inputRef.current?.focus();
      }

      // Escapeは入力中かどうかに関わらず受け付ける。
      if (event.key === "Escape") {
        onClearRef.current();
        inputRef.current?.blur();
      }
    };

    // windowで受けるのは、ページのどこにフォーカスがあっても効かせるため。
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [inputRef]);
}
