import { useMemo, useRef, type CSSProperties } from "react";
import type { CheatSheet } from "@/src/cheatsheets/types";
import { SearchBox } from "@/src/components/molecules/SearchBox/SearchBox";
import { CheatSheetSection } from "@/src/components/organisms/CheatSheetSection/CheatSheetSection";
import { CheatSheetSidebar } from "@/src/components/organisms/CheatSheetSidebar/CheatSheetSidebar";
import { filterCheatSheetSections } from "@/src/features/cheat-sheet-search/filterCheatSheet";
import { useSearchShortcuts } from "@/src/features/cheat-sheet-search/useSearchShortcuts";
import { useUrlQuery } from "@/src/features/cheat-sheet-search/useUrlQuery";
import styles from "./CheatSheetPage.module.css";

interface CheatSheetPageProps {
  sheet: CheatSheet;
}

/** 検索語をURLの `?q=` に持たせ、絞り込んだ状態のURLをそのまま共有・復元できるようにする。 */
export function CheatSheetPage({ sheet }: CheatSheetPageProps) {
  const [query, setQuery] = useUrlQuery();
  const searchRef = useRef<HTMLInputElement>(null);

  // 目次と本文が同じ結果を使うので、両者の表示は常に一致する。
  const filteredSections = useMemo(
    () => filterCheatSheetSections(sheet.sections, query),
    [query, sheet.sections],
  );
  const visibleItems = filteredSections.reduce((sum, section) => sum + section.items.length, 0);

  useSearchShortcuts(searchRef, () => setQuery(""));

  return (
    <main className={styles.main} style={{ "--sheet-accent": sheet.accent } as CSSProperties}>
      {/* hero: シート名とシート内検索 */}
      <header className={styles.hero}>
        <div className={styles.eyebrow}>{sheet.eyebrow} / CHEAT SHEET</div>
        <div className={styles.heading}>
          <span className={styles.monogram}>{sheet.shortTitle}</span>
          <h1>{sheet.title}</h1>
          <p>{sheet.description}</p>
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
