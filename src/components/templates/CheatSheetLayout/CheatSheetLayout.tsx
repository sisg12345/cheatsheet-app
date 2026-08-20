"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CheatSheet } from "@/src/cheatsheets/types";
import { Button } from "@/src/components/atoms/Button/Button";
import { SearchBox } from "@/src/components/molecules/SearchBox/SearchBox";
import { CheatSheetSection } from "@/src/components/organisms/CheatSheetSection/CheatSheetSection";
import { CheatSheetSidebar } from "@/src/components/organisms/CheatSheetSidebar/CheatSheetSidebar";
import { filterCheatSheetSections } from "@/src/features/cheat-sheet-search/filterCheatSheet";
import styles from "./CheatSheetLayout.module.css";

interface CheatSheetLayoutProps {
  sheet: CheatSheet;
}

export function CheatSheetLayout({ sheet }: CheatSheetLayoutProps) {
  const [query, setQueryState] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const filteredSections = useMemo(
    () => filterCheatSheetSections(sheet.sections, query),
    [query, sheet.sections],
  );
  const visibleItems = filteredSections.reduce((sum, section) => sum + section.items.length, 0);

  const setQuery = useCallback((value: string) => {
    setQueryState(value);
    const url = new URL(window.location.href);
    if (value) url.searchParams.set("q", value);
    else url.searchParams.delete("q");
    window.history.replaceState(null, "", url);
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setQueryState(new URLSearchParams(window.location.search).get("q") ?? "");
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const isTyping = ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === "Escape") {
        setQuery("");
        searchRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [setQuery]);

  return (
    <main className={styles.main} style={{ "--sheet-accent": sheet.accent } as React.CSSProperties}>
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
