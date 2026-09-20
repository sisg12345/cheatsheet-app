/**
 * HTMLチートシートのサマリー。一覧のカード・ヘッダーのメニュー・シートのページの見出しに出す。
 * 最初に読み込むバンドルに入るので、セクションと項目の中身は content.ts に置き、ここには件数だけを持たせる。
 *
 * - sectionCount / itemCount は content.ts の件数と一致させる（tests/unit/registry.test.ts が突き合わせる）
 */
import type { CheatSheetSummary } from "../types";

export const htmlSummary: CheatSheetSummary = {
  slug: "html",
  title: "HTMLタグ チートシート",
  name: "HTML",
  description:
    "文書構造、テキスト、メディア、フォーム、アクセシビリティまでをすばやく確認できるHTMLリファレンス。",
  eyebrow: "Markup language",
  accent: "#6f4cff",
  keywords: ["html", "タグ", "マークアップ", "フォーム", "アクセシビリティ"],
  sectionCount: 10,
  itemCount: 109,
};
