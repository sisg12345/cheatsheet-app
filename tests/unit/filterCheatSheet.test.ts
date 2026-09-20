/**
 * シート内検索の絞り込みが、検索欄の期待どおりに動くことを守るテスト。
 * ダミーではなく実データ（htmlContent）を通し、
 * 実際のコンテンツで検索が機能することまで確認している。
 */
import { describe, expect, it } from "vitest";
import { htmlContent } from "@/src/cheatsheets/html/content";
import { filterCheatSheetSections } from "@/src/features/cheat-sheet-search/filterCheatSheet";

describe("filterCheatSheetSections", () => {
  it("空の検索語では全セクションを返す", () => {
    expect(filterCheatSheetSections(htmlContent.sections, "")).toHaveLength(
      htmlContent.sections.length,
    );
  });

  it("構文に一致する項目だけを返す", () => {
    const result = filterCheatSheetSections(htmlContent.sections, "<table>");
    expect(result.length).toBeGreaterThan(0);
    expect(
      result.flatMap((section) => section.items).some((item) => item.syntax?.includes("<table>")),
    ).toBe(true);
  });

  it("NFKC正規化と大文字小文字を吸収する", () => {
    expect(filterCheatSheetSections(htmlContent.sections, "ＭＥＴＡ").length).toBeGreaterThan(0);
  });
});
