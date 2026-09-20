/**
 * JavaScriptチートシートのサマリー。一覧のカード・ヘッダーのメニュー・シートのページの見出しに出す。
 * 最初に読み込むバンドルに入るので、セクションと項目の中身は content.ts に置き、ここには件数だけを持たせる。
 *
 * - sectionCount / itemCount は content.ts の件数と一致させる（tests/unit/registry.test.ts が突き合わせる）
 */
import type { CheatSheetSummary } from "../types";

export const javascriptSummary: CheatSheetSummary = {
  slug: "javascript",
  title: "JavaScript チートシート",
  name: "JavaScript",
  description:
    "変数・関数・配列から非同期処理、モジュール、DOM操作、fetch までをまとめたJavaScriptリファレンス。",
  eyebrow: "Programming language",
  accent: "#b58900",
  keywords: ["javascript", "js", "ecmascript", "es6", "dom", "非同期", "fetch"],
  sectionCount: 15,
  itemCount: 156,
};
