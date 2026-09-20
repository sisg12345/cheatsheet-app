/**
 * レジストリに登録したシートが、表示側の前提を満たしていることを守るテスト。
 * id の重複は React の key 警告や目次アンカーの飛び先違い、accent の重複は一覧で
 * シートの見分けが付かなくなる形でしか表に出ないため、データを足した時点でここで落とす。
 */
import { describe, expect, it } from "vitest";
import {
  cheatSheetSummaries,
  getCheatSheetSummary,
  loadCheatSheet,
} from "@/src/cheatsheets/registry";

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
  ])("%s を slug で取得できる", (slug) => {
    expect(getCheatSheetSummary(slug)?.slug).toBe(slug);
  });

  // 辞書が Object.prototype を継承しているため、素通しすると継承メンバーが返って404に落ちない。
  it.each(["constructor", "toString", "hasOwnProperty", "__proto__", "unknown"])(
    "未登録の %s はサマリーが無く、中身の読み込みは失敗する",
    async (slug) => {
      expect(getCheatSheetSummary(slug)).toBeUndefined();
      await expect(loadCheatSheet(slug)).rejects.toThrow(slug);
    },
  );

  // React の use は結果を Promise 自体に覚えさせるので、毎回別の Promise だと描画のたびにサスペンドする。
  it("同じ slug の読み込みには同じ Promise を返す", () => {
    expect(loadCheatSheet("html")).toBe(loadCheatSheet("html"));
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

describe.each(cheatSheetSummaries)("$slug シートのデータ", (summary) => {
  // 件数は一覧に出すために summary.ts が手で持っている。中身を直して件数を直し忘れると、
  // 一覧の件数とシートを開いたときの件数が食い違うので、ここで正しい値を示して落とす。
  it("サマリーの件数が中身と一致する", async () => {
    const { sections } = await loadCheatSheet(summary.slug);
    expect({ sectionCount: summary.sectionCount, itemCount: summary.itemCount }).toEqual({
      sectionCount: sections.length,
      itemCount: sections.reduce((total, section) => total + section.items.length, 0),
    });
  });

  it("セクション id がシート内で重複していない", async () => {
    const { sections } = await loadCheatSheet(summary.slug);
    expect(duplicates(sections.map((section) => section.id))).toEqual([]);
  });

  it("項目 id がシート内で重複していない", async () => {
    const { sections } = await loadCheatSheet(summary.slug);
    const ids = sections.flatMap((section) => section.items.map((entry) => entry.id));
    expect(duplicates(ids)).toEqual([]);
  });
});
