import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { THEME_STORAGE_KEY } from "@/src/features/theme-switch/theme";

/**
 * index.html の初期化スクリプトは描画前に走る必要があるためモジュールを import できず、
 * ストレージキーをリテラルで持っている。TS側の定数とずれると無言で壊れるため、
 * ここで一致を検証する。
 */
const html = readFileSync(path.resolve(process.cwd(), "index.html"), "utf8");

describe("index.html のテーマ初期化スクリプト", () => {
  it("TS側と同じストレージキーを使っている", () => {
    expect(html).toContain(`localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)})`);
  });

  it("data-theme を設定している（削除するとFOUCが再発する）", () => {
    expect(html).toContain("document.documentElement.dataset.theme");
  });

  it("light と dark の両方を扱っている", () => {
    expect(html).toContain('"light"');
    expect(html).toContain('"dark"');
  });
});
