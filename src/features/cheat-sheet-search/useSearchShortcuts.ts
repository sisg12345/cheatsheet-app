/**
 * 検索欄のキーボードショートカットを提供するフック。
 * 一覧ページ（CatalogLayout）とシートページ（CheatSheetLayout）が共通で使う。
 */
import { useEffect, useRef, type RefObject } from "react";

/** この要素にフォーカスがあるときは入力中とみなし、`/` をショートカットに使わない。 */
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

  // 毎レンダーで最新のonClearをrefへ移す。読み出しはリスナー内だけなので、
  // ここでrefを更新してもリスナーの再登録は起きない。
  useEffect(() => {
    onClearRef.current = onClear;
  }, [onClear]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      // IME変換中のキーはショートカットとして扱わない。日本語入力ではEscapeが
      // 変換の取り消しに割り当てられており、ここで拾うと「変換を戻すつもりが
      // 検索語ごと消えてフォーカスも外れる」ことになる。
      // keyCode 229 は isComposing を立てない環境向けの保険。
      if (event.isComposing || event.keyCode === 229) return;

      const target = event.target as HTMLElement | null;
      const isTyping = TYPING_TAGS.includes(target?.tagName ?? "");

      // 入力中でなければ `/` を検索欄へのジャンプに使う。
      // preventDefaultしないと、フォーカス後の入力欄に `/` が1文字入ってしまう。
      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        inputRef.current?.focus();
      }

      // Escapeは入力中かどうかに関わらず受け付ける（IME変換中を除く。上のガード参照）。
      // 検索語を消したうえでフォーカスも外し、ページ本文の閲覧に戻す。
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
