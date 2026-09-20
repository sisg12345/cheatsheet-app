/**
 * TypeScriptチートシートのサマリー。一覧のカード・ヘッダーのメニュー・シートのページの見出しに出す。
 * 最初に読み込むバンドルに入るので、セクションと項目の中身は content.ts に置き、ここには件数だけを持たせる。
 *
 * - sectionCount / itemCount は content.ts の件数と一致させる（tests/unit/registry.test.ts が突き合わせる）
 */
import type { CheatSheetSummary } from "../types";

export const typescriptSummary: CheatSheetSummary = {
  slug: "typescript",
  title: "TypeScript チートシート",
  name: "TypeScript",
  description:
    "基本の型から、ユニオンと絞り込み、ジェネリクス、ユーティリティ型、型操作、tsconfig・tsc までをまとめたTypeScriptリファレンス。",
  eyebrow: "Typed language",
  accent: "#3178c6",
  keywords: ["typescript", "ts", "型", "ジェネリクス", "tsconfig", "tsc"],
  sectionCount: 14,
  itemCount: 123,
};
