/**
 * 一覧画面（`/`）のレイアウト。
 *
 * 検索語をローカルstateで持ち、シート単位で絞り込む。
 * 個別シート内の項目検索は CheatSheetLayout 側の担当で、ここでは扱わない。
 */
import { useMemo, useRef, useState } from "react";
import type { CheatSheetSummary } from "@/src/cheatsheets/types";
import { SearchBox } from "@/src/components/molecules/SearchBox/SearchBox";
import { CheatSheetCard } from "@/src/components/organisms/CheatSheetCard/CheatSheetCard";
import { useSearchShortcuts } from "@/src/features/cheat-sheet-search/useSearchShortcuts";
import { includesSearch } from "@/src/lib/normalizeSearch";
import styles from "./CatalogLayout.module.css";

interface CatalogLayoutProps {
  /** 表示するシートの一覧。registry の cheatSheetSummaries がそのまま渡る。 */
  sheets: CheatSheetSummary[];
}

export function CatalogLayout({ sheets }: CatalogLayoutProps) {
  // 一覧の検索語はURLに持たせていない。共有する価値が薄く、
  // シートを選べば結果に辿り着けるため（シート内検索は ?q= に持たせている）。
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  // タイトル・短縮名・説明・キーワードのいずれかに一致したシートを残す。
  const visibleSheets = useMemo(
    () =>
      sheets.filter((sheet) =>
        includesSearch(
          [sheet.title, sheet.shortTitle, sheet.description, ...sheet.keywords],
          query,
        ),
      ),
    [query, sheets],
  );

  // 見出し横のREFERENCES件数。検索で絞られても総数を出したいので、
  // visibleSheets ではなく元の sheets から集計する。
  const totalItems = sheets.reduce((sum, sheet) => sum + sheet.itemCount, 0);

  // `/` でこの検索欄へフォーカス、Escapeで検索語をクリアする。
  useSearchShortcuts(searchRef, () => setQuery(""));

  return (
    <main className={styles.main}>
      {/* hero: キャッチコピー、収録数、検索欄 */}
      <section className={styles.hero}>
        <div className={styles.eyebrow}>DEVELOPER REFERENCE / 2026</div>
        <div className={styles.heroGrid}>
          <div>
            <h1>
              必要な構文へ、
              <br />
              <em>最短距離で。</em>
            </h1>
            <p>覚えるためではなく、すぐ使うための技術チートシート集。</p>
          </div>
          <dl className={styles.overview}>
            <div>
              <dt>SHEETS</dt>
              <dd>{sheets.length}</dd>
            </div>
            <div>
              <dt>REFERENCES</dt>
              <dd>{totalItems}</dd>
            </div>
            <div>
              <dt>ACCESS</dt>
              <dd>FREE</dd>
            </div>
          </dl>
        </div>
        <SearchBox
          ref={searchRef}
          value={query}
          onChange={setQuery}
          placeholder="HTML、Git、コマンドを検索"
          resultLabel={`${visibleSheets.length} 件のチートシート`}
        />
      </section>

      {/* catalog: シートカードの一覧、または空状態 */}
      <section className={styles.catalog} aria-label="チートシート一覧">
        <div className={styles.sectionTitle}>
          <span>INDEX</span>
          <p>チートシートを選択</p>
        </div>
        {visibleSheets.length > 0 ? (
          <div className={styles.grid}>
            {visibleSheets.map((sheet, index) => (
              <CheatSheetCard key={sheet.slug} sheet={sheet} index={index} />
            ))}

            {/* 予告カードは検索中には出さない。検索結果に一致しない枠が混ざると、
                絞り込みの件数表示と見た目が食い違うため。 */}
            {!query.trim() ? (
              <article className={styles.comingSoon}>
                <span>03+</span>
                <div>
                  <strong>MORE SOON</strong>
                  <p>CSS、JavaScript、Docker などを追加予定です。</p>
                </div>
              </article>
            ) : null}
          </div>
        ) : (
          <div className={styles.empty}>
            <strong>一致するチートシートがありません</strong>
            <p>別のキーワードで検索してください。</p>
          </div>
        )}
      </section>
    </main>
  );
}
