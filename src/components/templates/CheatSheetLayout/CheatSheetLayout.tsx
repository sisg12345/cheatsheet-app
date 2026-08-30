/**
 * チートシート画面（`/cheatsheets/:slug`）のレイアウト。
 *
 * 検索語をURLの `?q=` に持たせているため、絞り込んだ状態のURLをそのまま共有でき、
 * リロードや戻る操作でも同じ表示が復元される。
 */
import { useCallback, useMemo, useRef, type CSSProperties } from "react";
import { useSearchParams } from "react-router-dom";
import type { CheatSheet } from "@/src/cheatsheets/types";
import { Button } from "@/src/components/atoms/Button/Button";
import { SearchBox } from "@/src/components/molecules/SearchBox/SearchBox";
import { CheatSheetSection } from "@/src/components/organisms/CheatSheetSection/CheatSheetSection";
import { CheatSheetSidebar } from "@/src/components/organisms/CheatSheetSidebar/CheatSheetSidebar";
import { filterCheatSheetSections } from "@/src/features/cheat-sheet-search/filterCheatSheet";
import { useSearchShortcuts } from "@/src/features/cheat-sheet-search/useSearchShortcuts";
import styles from "./CheatSheetLayout.module.css";

interface CheatSheetLayoutProps {
  /** 表示するシート。App.tsx が slug から解決して渡す。 */
  sheet: CheatSheet;
}

export function CheatSheetLayout({ sheet }: CheatSheetLayoutProps) {
  // 検索語の置き場はURLのクエリ。useStateと二重に持たないことで、
  // URL直打ちでの復元と入力欄の表示が必ず一致する。
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const searchRef = useRef<HTMLInputElement>(null);

  // 目次と本文の両方がこの結果を使うため、両者の表示は常に一致する。
  const filteredSections = useMemo(
    () => filterCheatSheetSections(sheet.sections, query),
    [query, sheet.sections],
  );
  const visibleItems = filteredSections.reduce((sum, section) => sum + section.items.length, 0);

  const setQuery = useCallback(
    (value: string) => {
      setSearchParams(
        // 関数形式で既存のクエリを引き継ぎ、qだけを差し替える。
        (previous) => {
          const next = new URLSearchParams(previous);
          if (value) next.set("q", value);
          // 空文字なら残さない。`?q=` だけのURLが履歴に残らないようにする。
          else next.delete("q");
          return next;
        },
        // replace にするのは、1文字打つごとに履歴が積まれて
        // 戻るボタンが使い物にならなくなるのを防ぐため。
        { replace: true },
      );
    },
    // setSearchParams は安定なので、setQuery も再生成されない。
    // これで useSearchShortcuts に渡すクリア処理の同一性も保たれる。
    [setSearchParams],
  );

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
