import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/** history を書き換えたことをURLの購読者へ知らせる。pushState/replaceState は何も発火しない。 */
const URL_CHANGED_EVENT = "cheatsheet:urlchange";

/**
 * URLのクエリ文字列を購読する。
 *
 * 正は window.location。react-router の location は startTransition で流れるため
 * 遅れて届き、直後に popstate が来ると更新がコミットされないまま破棄されることもある。
 * window.location は replaceState でも履歴移動でも同期的に更新されるので常に現在値が読める。
 * レンダー中に可変な外部状態を直接読むと投機的レンダーで値がずれるため、購読は
 * useSyncExternalStore に任せる。
 */
function subscribeToUrl(onStoreChange: () => void) {
  // 目次アンカーのクリック（同一文書内のフラグメント遷移）でも popstate は飛ぶ。
  window.addEventListener("popstate", onStoreChange);
  window.addEventListener(URL_CHANGED_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("popstate", onStoreChange);
    window.removeEventListener(URL_CHANGED_EVENT, onStoreChange);
  };
}

function getUrlSearch() {
  return window.location.search;
}

/**
 * URLの `?q=` と入力欄の値を同期する。
 *
 * 返す値はローカルstateで、URLへは打鍵ごとに書き戻す。URLを直接 value にすると
 * 反映がルーター経由で遅れるぶん、速い打鍵で文字が落ち、IME変換中は未確定文字列が壊れる。
 *
 * `isComposing` を渡すとURLへの書き込みだけを見送る。日本語入力は確定前のローマ字1打ごとに
 * 入力イベントが飛ぶため、そのまま書くと数語で履歴の書き込み上限に近づく。
 */
export function useUrlQuery(): [string, (value: string, isComposing?: boolean) => void] {
  const navigate = useNavigate();
  const location = useLocation();
  const urlSearch = useSyncExternalStore(subscribeToUrl, getUrlSearch);
  const urlQuery = useMemo(() => new URLSearchParams(urlSearch).get("q") ?? "", [urlSearch]);
  const [query, setQueryState] = useState(urlQuery);
  const [syncedQuery, setSyncedQuery] = useState(urlQuery);

  // ルーターの遷移（同じシートのリンクを押すなど）は popstate も上のイベントも出さない。
  // 再描画で結果的には追随するが、それに頼ると購読していない経路でスナップショットが
  // 変わる状態が残るので、こちらから通知して筋を通す。
  useEffect(() => {
    window.dispatchEvent(new Event(URL_CHANGED_EVENT));
  }, [location]);

  // 取り込みをレンダー中に行うのは、effect 本体での setState が連鎖レンダーを招くため。
  // 検出も値も urlQuery ひとつから取るので、書き込みに失敗してURLが動かないときは
  // 打った文字が巻き戻ることもない。
  if (urlQuery !== syncedQuery) {
    setSyncedQuery(urlQuery);
    if (urlQuery !== query) setQueryState(urlQuery);
  }

  const setQuery = useCallback(
    (value: string, isComposing = false) => {
      setQueryState(value);
      if (isComposing) return;

      // trim せずそのまま載せる。URLと入力欄を一致させておくと共有・復元で見た目が変わらない。
      // 空白のみを「検索していない」と見なす判定は filterCheatSheetSections 側が行う。
      const next = new URLSearchParams(window.location.search);
      if (value) next.set("q", value);
      else next.delete("q");

      const search = next.toString();

      // 同じURLを書き直すだけの呼び出し（検索していない状態での Escape など）を弾く。
      // 両辺とも URLSearchParams を通すのは、`?utm=a%20b` のような正規化前の表記が
      // 毎回「違う」と判定されて無関係なパラメータまで書き換わるのを防ぐため。
      if (search === new URLSearchParams(window.location.search).toString()) return;

      try {
        // setSearchParams ではなく navigate なのは、前者が `?...` だけの to を渡すため
        // hash が落ちるから。pathname も window.location から渡す。省くと resolveTo が
        // ルーターの遅れた location から補完し、別ページへの遷移中だと移動前のパスが入って
        // 遷移が取り消される。basename は未設定なので絶対パスをそのまま渡してよい。
        navigate(
          {
            pathname: window.location.pathname,
            search: search ? `?${search}` : "",
            hash: window.location.hash,
          },
          { replace: true },
        );
        window.dispatchEvent(new Event(URL_CHANGED_EVENT));
      } catch (error) {
        // Safari は履歴の書き込みを「30秒あたり約100回」で打ち切る。URLの更新だけ諦め、
        // 入力欄と絞り込みはローカルstateなので動き続ける。握りつぶすのはこの既知の
        // 一件だけにしないと、打った内容が次の遷移で消える現象だけが残って原因を追えない。
        if (!(error instanceof DOMException && error.name === "SecurityError")) throw error;
      }
    },
    [navigate],
  );

  return [query, setQuery];
}
