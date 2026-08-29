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
  sheet: CheatSheet;
}

export function CheatSheetLayout({ sheet }: CheatSheetLayoutProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const searchRef = useRef<HTMLInputElement>(null);
  const filteredSections = useMemo(
    () => filterCheatSheetSections(sheet.sections, query),
    [query, sheet.sections],
  );
  const visibleItems = filteredSections.reduce((sum, section) => sum + section.items.length, 0);

  const setQuery = useCallback(
    (value: string) => {
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous);
          if (value) next.set("q", value);
          else next.delete("q");
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  useSearchShortcuts(searchRef, () => setQuery(""));

  return (
    <main className={styles.main} style={{ "--sheet-accent": sheet.accent } as CSSProperties}>
      <header className={styles.hero}>
        <div className={styles.eyebrow}>{sheet.eyebrow} / CHEAT SHEET</div>
        <div className={styles.heading}>
          <div>
            <span className={styles.monogram}>{sheet.shortTitle}</span>
            <h1>{sheet.title}</h1>
            <p>{sheet.description}</p>
          </div>
          <div className={styles.actions}>
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
