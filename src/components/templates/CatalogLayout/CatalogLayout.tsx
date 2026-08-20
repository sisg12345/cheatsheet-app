"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CheatSheetSummary } from "@/src/cheatsheets/types";
import { SearchBox } from "@/src/components/molecules/SearchBox/SearchBox";
import { CheatSheetCard } from "@/src/components/organisms/CheatSheetCard/CheatSheetCard";
import { includesSearch } from "@/src/lib/normalizeSearch";
import styles from "./CatalogLayout.module.css";

interface CatalogLayoutProps {
  sheets: CheatSheetSummary[];
}

export function CatalogLayout({ sheets }: CatalogLayoutProps) {
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
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
  const totalItems = sheets.reduce((sum, sheet) => sum + sheet.itemCount, 0);

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
  }, []);

  return (
    <main className={styles.main}>
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
            {!query ? (
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
