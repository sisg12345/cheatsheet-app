/**
 * Bashチートシートのサマリー。一覧のカード・ヘッダーのメニュー・シートのページの見出しに出す。
 * 最初に読み込むバンドルに入るので、セクションと項目は content.ts に置き、ここには件数だけを書く。
 *
 * - sectionCount / itemCount は content.ts の件数と一致させる（tests/unit/registry.test.ts が突き合わせる）
 */
import type { CheatSheetSummary } from "../types";

export const bashSummary: CheatSheetSummary = {
  slug: "bash",
  title: "Bash チートシート",
  name: "Bash",
  description:
    "スクリプトの基本、変数と展開、条件分岐、繰り返し、関数、配列、リダイレクト、エラー処理、対話操作のショートカットまでをまとめたBashリファレンス。",
  eyebrow: "Shell",
  accent: "#7cb82f",
  keywords: ["bash", "shell", "シェル", "シェルスクリプト", "sh", "script"],
  sectionCount: 9,
  itemCount: 63,
};
