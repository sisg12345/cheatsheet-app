/**
 * レジストリに登録したシートが、表示側の前提を満たしていることを守るテスト。
 * id の重複は React の key 警告や目次アンカーの飛び先違い、accent の重複は一覧で
 * シートの見分けが付かなくなる形でしか表に出ないため、データを足した時点でここで落とす。
 */
import { describe, expect, it } from "vitest";
import { cheatSheetSummaries, getCheatSheet } from "@/src/cheatsheets/registry";

/** 2回目以降に現れた値を返す。重複がなければ空配列。 */
function duplicates(values: string[]): string[] {
  return values.filter((value, index) => values.indexOf(value) !== index);
}

describe("cheatSheetRegistry", () => {
  it.each([
    "html",
    "git",
    "vim",
    "claude-code",
    "javascript",
    "docker",
    "typescript",
    "react",
    "vue",
    "nextjs",
    "nuxt",
    "linux",
    "bash",
    "vite",
    "npm",
  ])("%s を slug で取得できる", (slug) => {
    expect(getCheatSheet(slug)?.slug).toBe(slug);
  });

  // 辞書は slug をキーにしているため、重複すると後勝ちで消える。配列側のサマリーで数える。
  it("slug が重複していない", () => {
    expect(duplicates(cheatSheetSummaries.map((sheet) => sheet.slug))).toEqual([]);
  });

  // name はヘッダーのメニューのリンク名になる。重複すると見分けが付かず、E2E でも特定できない。
  it("name が重複していない", () => {
    expect(duplicates(cheatSheetSummaries.map((sheet) => sheet.name))).toEqual([]);
  });

  it("accent がシート同士で被っていない", () => {
    expect(duplicates(cheatSheetSummaries.map((sheet) => sheet.accent.toLowerCase()))).toEqual([]);
  });
});

describe.each(cheatSheetSummaries.map((sheet) => sheet.slug))("%s シートのデータ", (slug) => {
  it("セクション id がシート内で重複していない", () => {
    const sections = getCheatSheet(slug)?.sections ?? [];
    expect(duplicates(sections.map((section) => section.id))).toEqual([]);
  });

  it("項目 id がシート内で重複していない", () => {
    const sections = getCheatSheet(slug)?.sections ?? [];
    const ids = sections.flatMap((section) => section.items.map((entry) => entry.id));
    expect(duplicates(ids)).toEqual([]);
  });
});
