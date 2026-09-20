/**
 * Vueチートシートのサマリー。一覧のカード・ヘッダーのメニュー・シートのページの見出しに出す。
 * 最初に読み込むバンドルに入るので、セクションと項目の中身は content.ts に置き、ここには件数だけを持たせる。
 *
 * - sectionCount / itemCount は content.ts の件数と一致させる（tests/unit/registry.test.ts が突き合わせる）
 */
import type { CheatSheetSummary } from "../types";

export const vueSummary: CheatSheetSummary = {
  slug: "vue",
  title: "Vue.js チートシート",
  name: "Vue.js",
  description:
    "テンプレート構文、ディレクティブ、ref と reactive、computed と watch、props と emit、スロットまでをまとめたVue 3リファレンス。",
  eyebrow: "UI framework",
  accent: "#42b883",
  keywords: ["vue", "vue.js", "vue3", "composition api", "script setup", "リアクティブ"],
  sectionCount: 12,
  itemCount: 82,
};
