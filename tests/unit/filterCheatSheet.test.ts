import { describe, expect, it } from "vitest";
import { htmlCheatSheet } from "@/src/cheatsheets/html/content";
import { filterCheatSheetSections } from "@/src/features/cheat-sheet-search/filterCheatSheet";

describe("filterCheatSheetSections", () => {
  it("空の検索語では全セクションを返す", () => {
    expect(filterCheatSheetSections(htmlCheatSheet.sections, "")).toHaveLength(
      htmlCheatSheet.sections.length,
    );
  });

  it("構文に一致する項目だけを返す", () => {
    const result = filterCheatSheetSections(htmlCheatSheet.sections, "<table>");
    expect(result.length).toBeGreaterThan(0);
    expect(
      result.flatMap((section) => section.items).some((item) => item.syntax?.includes("<table>")),
    ).toBe(true);
  });

  it("NFKC正規化と大文字小文字を吸収する", () => {
    expect(filterCheatSheetSections(htmlCheatSheet.sections, "ＭＥＴＡ").length).toBeGreaterThan(0);
  });
});
