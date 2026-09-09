/**
 * チートシート画面（`/cheatsheets/:slug`）のレイアウト。
 *
 * 検索語をURLの `?q=` に持たせているため、絞り込んだ状態のURLをそのまま共有でき、
 * リロードや戻る操作でも同じ表示が復元される。
 */
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { CheatSheet } from "@/src/cheatsheets/types";
import { Button } from "@/src/components/atoms/Button/Button";
import { PrintFilterNote } from "@/src/components/molecules/PrintFilterNote/PrintFilterNote";
import { SearchBox } from "@/src/components/molecules/SearchBox/SearchBox";
import { CheatSheetSection } from "@/src/components/organisms/CheatSheetSection/CheatSheetSection";
import { CheatSheetSidebar } from "@/src/components/organisms/CheatSheetSidebar/CheatSheetSidebar";
import { filterCheatSheetSections } from "@/src/features/cheat-sheet-search/filterCheatSheet";
import { useSearchShortcuts } from "@/src/features/cheat-sheet-search/useSearchShortcuts";
import styles from "./CheatSheetLayout.module.css";

/** 自分で history を書き換えたことを、URLの購読者へ知らせるためのイベント名。 */
const URL_CHANGED_EVENT = "cheatsheet:urlchange";

/**
 * URLのクエリ文字列を外部ストアとして購読する。
 *
 * 正はブラウザの window.location。react-router の location は startTransition で
 * 流れるため遅れて届き、直後に popstate が来ると更新がコミットされないまま
 * 破棄されることもある。一方 window.location は replaceState でも履歴移動でも
 * 同期的に更新されるので、常に現在のURLが読める。
 *
 * ただしレンダー中に可変な外部状態を直接読むと、React が投機的にレンダーして
 * 結果を捨てたときに読んだ値と確定した値がずれる。useSyncExternalStore は
 * まさにこの用途のAPIで、購読と読み出しの整合をReactに任せられる。
 */
function subscribeToUrl(onStoreChange: () => void) {
  // 戻る/進むと、目次アンカーのクリック（同一文書内のフラグメント遷移でも popstate
  // は飛ぶ）を拾う。
  window.addEventListener("popstate", onStoreChange);
  // pushState/replaceState は何のイベントも出さないので、自分で書いたときは
  // ここへ通知する。これが無いと、購読していない経路でスナップショットだけが
  // 変わる状態になり、useSyncExternalStore の前提を外れる。
  window.addEventListener(URL_CHANGED_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("popstate", onStoreChange);
    window.removeEventListener(URL_CHANGED_EVENT, onStoreChange);
  };
}

function getUrlSearch() {
  return window.location.search;
}

interface CheatSheetLayoutProps {
  /** 表示するシート。App.tsx が slug から解決して渡す。 */
  sheet: CheatSheet;
}

export function CheatSheetLayout({ sheet }: CheatSheetLayoutProps) {
  // 検索語はURLの `?q=` に載せて共有・復元できるようにするが、入力欄の value は
  // ローカルstateが持つ。URLへの反映はルーター経由で遅れて届くため、URLを直接
  // value にすると打鍵が速いときに文字が落ち、IME変換中は未確定文字列が壊れる
  // （「めた」と打って「mめめtめた」になる）。
  const navigate = useNavigate();
  const location = useLocation();
  const urlSearch = useSyncExternalStore(subscribeToUrl, getUrlSearch);
  const urlQuery = useMemo(() => new URLSearchParams(urlSearch).get("q") ?? "", [urlSearch]);
  const [query, setQueryState] = useState(urlQuery);
  // 取り込み済みの検索語。URLが変わったことの検出に使う。
  const [syncedQuery, setSyncedQuery] = useState(urlQuery);
  const searchRef = useRef<HTMLInputElement>(null);

  // ルーターの遷移（同じシートのリンクを押すなど）は popstate を出さず、こちらの
  // 書き込みでもないので URL_CHANGED_EVENT も飛ばない。再描画が起きれば
  // useSyncExternalStore が getSnapshot を読み直すので結果的には追随するが、
  // それに頼ると「購読していない経路でスナップショットだけが変わる」状態が残る。
  // 遷移を検知したらこちらから通知して、購読の筋を通しておく。
  useEffect(() => {
    window.dispatchEvent(new Event(URL_CHANGED_EVENT));
  }, [location]);

  // URLの検索語が変わったら入力欄へ取り込む。
  //
  // 検出も値も urlQuery ひとつから取るので、「検出はルーターのlocation、値は
  // window.location」という食い違いが起きない。書き込みに失敗したときは
  // window.location が変わらず urlQuery も動かないため、打った文字が
  // 巻き戻ることもない。
  //
  // effect ではなくレンダー中に調整するのは、effect 本体での setState が
  // 連鎖レンダーを招くため（react-hooks/set-state-in-effect）。ここは外部との
  // 同期ではなく、購読した値からの派生なので、この形が素直になる。
  if (urlQuery !== syncedQuery) {
    setSyncedQuery(urlQuery);
    // 打鍵で書いた直後はURLと入力欄が既に一致しているので、その場合は何も起きない。
    if (urlQuery !== query) setQueryState(urlQuery);
  }

  const setQuery = useCallback(
    (value: string, isComposing = false) => {
      // 入力欄はこのstateを value に取るので、まず同期的に更新する。
      setQueryState(value);

      // IME変換の未確定中はURLを書かない。日本語入力では確定前のローマ字1打ごとに
      // 入力イベントが飛ぶため、そのまま書くと短い語をいくつか打っただけで
      // ブラウザの履歴書き込み上限に近づく（実測で3語＝約36回）。
      // 確定時に onCompositionEnd から改めて通知が来るので、そこで1回書けばよい。
      // 未確定の文字はどのみち共有・復元する意味がない。
      if (isComposing) return;

      // URLへは打鍵ごとに即座に反映する。書き込みを遅らせて間引くこともできるが、
      // 「まだURLに載っていない検索語」という状態が生まれ、そのあいだに離脱・再読み込み・
      // 戻る/進むが起きると打った内容が失われる。履歴の書き込み回数は下の catch で
      // 面倒を見るほうが、状態を増やすより壊れにくい。
      //
      // ここで参照するのは useLocation() ではなく window.location。react-router は
      // location の更新を startTransition で流すため、目次アンカーを踏んだ直後は
      // コミット済みの location.hash がまだ空で、その隙に書くと `#id` が落ちる。
      // window.location はブラウザが同期的に更新しているので常に現在値が読める。
      const next = new URLSearchParams(window.location.search);
      // trim せずに入力そのままを載せる。URLを入力欄の内容と一致させておくことで、
      // 共有したリンクや戻る操作で復元したときに見た目が変わらない。日本語入力は
      // スペースを変換キーに使うため、空白だけの状態も一時的に正当な入力になる。
      // 空白のみを「検索していない」と見なす判定は filterCheatSheetSections 側が
      // trim 済みで行うので、絞り込み結果は全件のままになる。
      // 空文字なら残さない。`?q=` だけのURLが履歴に残らないようにする。
      if (value) next.set("q", value);
      else next.delete("q");

      const search = next.toString();
      const nextSearch = search ? `?${search}` : "";

      // URLが変わらないなら書かない。検索していない状態での Escape のように、
      // 同じURLを書き直すだけの呼び出しがある。履歴の書き込み回数には
      // ブラウザ側の上限があるので、無駄打ちは避ける。
      //
      // 比較は両辺とも URLSearchParams を通した形で行う。生の search と比べると、
      // `?utm=a%20b` のように正規化前の表記で来たURLが毎回「違う」と判定され、
      // qに関係のないパラメータまで `a+b` に書き換えてしまう。
      if (search === new URLSearchParams(window.location.search).toString()) return;

      try {
        navigate(
          // setSearchParams ではなく navigate を使うのは、前者が `?...` だけの to を
          // 渡すため hash が落ちるから。目次アンカーで付いた `#id` を保持する。
          //
          // pathname も window.location から渡すこと。省くと resolveTo が
          // ルーターのコミット済み location から補完するが、これは startTransition で
          // 遅れて届くため、別ページへの遷移中だと「移動前のパス」が入る。
          // 結果として遷移が取り消され、離れようとしたシートへ引き戻される
          // （ヘッダーのリンクを押した直後に Escape を叩くと起きた）。
          // このアプリは basename を設定していないので、絶対パスをそのまま渡してよい。
          {
            pathname: window.location.pathname,
            search: nextSearch,
            hash: window.location.hash,
          },
          // replace にするのは、1文字打つごとに履歴が積まれて
          // 戻るボタンが使い物にならなくなるのを防ぐため。
          // preventScrollReset は付けない。BrowserRouter の navigate は history の
          // replace(to, state) にしか渡さず、data router のスクロール復元でしか
          // 解釈されないため、ここでは無視される。
          { replace: true },
        );
        // pushState/replaceState はイベントを出さないので、購読者へ自分で知らせる。
        window.dispatchEvent(new Event(URL_CHANGED_EVENT));
      } catch (error) {
        // Safari は pushState/replaceState を「30秒あたり約100回」で打ち切り
        // SecurityError を投げる。長文を速く打ち続けたときに限って届きうる。
        // その場合はURLの更新だけを諦める。入力欄も絞り込みもローカルstateなので
        // そのまま使え、次の打鍵で書き込みを試み直す。
        //
        // ただしURLに載らなかった検索語は、そのあと履歴を移動した時点で失われる
        // （上の取り込みはURLを唯一の正とするため）。書けない以上どこにも
        // 残せないので、失敗を覚えて取り込みを止めるより、URLと表示が食い違わない
        // ほうを取っている。
        //
        // 握りつぶすのはこの既知の一件だけにする。ほかの失敗まで飲み込むと、
        // 打った内容が次の遷移で消える現象だけが残って原因が追えなくなる。
        if (!(error instanceof DOMException && error.name === "SecurityError")) throw error;
      }
    },
    [navigate],
  );

  // 目次と本文の両方がこの結果を使うため、両者の表示は常に一致する。
  const filteredSections = useMemo(
    () => filterCheatSheetSections(sheet.sections, query),
    [query, sheet.sections],
  );
  const visibleItems = filteredSections.reduce((sum, section) => sum + section.items.length, 0);

  useSearchShortcuts(searchRef, () => setQuery(""));

  // シート固有色をCSS変数として配下に流し込む（見出し・枠線・リンク色が切り替わる）。
  return (
    <main className={styles.main} style={{ "--sheet-accent": sheet.accent } as CSSProperties}>
      {/* hero: シート名、印刷ボタン、シート内検索 */}
      <header className={styles.hero}>
        <div className={styles.eyebrow}>{sheet.eyebrow} / CHEAT SHEET</div>
        <div className={styles.heading}>
          <div>
            <span className={styles.monogram}>{sheet.shortTitle}</span>
            <h1>{sheet.title}</h1>
            <p>{sheet.description}</p>
          </div>
          <div className={styles.actions}>
            {/* 印刷用のCSS（@media print）で、ヘッダー・目次・操作ボタンを落として紙面を整える。 */}
            <Button onClick={() => window.print()} variant="outline">
              印刷 / PDF保存
            </Button>
          </div>
        </div>
        <SearchBox
          ref={searchRef}
          value={query}
          onChange={setQuery}
          placeholder="構文、説明、キーワードを検索"
          resultLabel={`${filteredSections.length} セクション / ${visibleItems} 項目`}
        />

        {/* 検索欄は紙面では消えるので、絞り込んだまま印刷したときに
            「これは抜粋である」と分かる手がかりを残す。 */}
        <PrintFilterNote
          query={query}
          detail={`${filteredSections.length} セクション・${visibleItems} 項目`}
        />
      </header>

      {/* content: 目次と本文。検索で0件になったら本文側だけ空状態に差し替える。 */}
      <div className={styles.content}>
        <CheatSheetSidebar sections={filteredSections} />
        <div className={styles.sections}>
          {filteredSections.length ? (
            filteredSections.map((section, index) => (
              <CheatSheetSection key={section.id} section={section} index={index} />
            ))
          ) : (
            <div className={styles.empty}>
              <strong>一致する項目がありません</strong>
              <p>検索語を短くするか、別のキーワードをお試しください。</p>
            </div>
          )}
        </div>
      </div>

      {/* footer: 更新日と出典。外部リンクなので rel="noreferrer" を付ける。 */}
      <footer className={styles.footer}>
        <div>
          <span>UPDATED</span>
          <strong>{sheet.updatedAt}</strong>
        </div>
        <div>
          <span>SOURCES</span>
          {sheet.sources.map((source) => (
            <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
              {source.label} ↗
            </a>
          ))}
        </div>
      </footer>
    </main>
  );
}
