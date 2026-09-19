import { useLayoutEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * 別のページへ移ったら、スクロール位置を先頭に戻す。
 *
 * BrowserRouter はスクロール位置を扱わない（データルーター用の ScrollRestoration は使えない）ので、
 * そのままだと一覧の下のほうでカードを押すと、開いたシートも途中の高さから表示される。
 *
 * - 見るのは pathname だけ。目次の `#アンカー` や検索語の `?q=` の書き換えは同じページの中の
 *   移動なので、位置を動かさない。
 * - 戻る・進む（POP）はブラウザのスクロール復元に任せ、読んでいた位置へ戻れるようにする。
 *   初回の読み込みも POP なので、再読み込みで先頭へ飛ばされることもない。
 * - 描画の前（useLayoutEffect）に動かし、前のページの高さのまま一瞬表示されるのを防ぐ。
 */
export function useScrollToTopOnNavigate() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useLayoutEffect(() => {
    if (navigationType === "POP") return;
    // html の scroll-behavior: smooth（目次のアンカー用）を効かせず、切り替えた瞬間に先頭へ移す。
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, navigationType]);
}
