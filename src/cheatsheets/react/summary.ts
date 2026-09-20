/**
 * Reactチートシートのサマリー。一覧のカード・ヘッダーのメニュー・シートのページの見出しに出す。
 * 最初に読み込むバンドルに入るので、セクションと項目の中身は content.ts に置き、ここには件数だけを持たせる。
 *
 * - sectionCount / itemCount は content.ts の件数と一致させる（tests/unit/registry.test.ts が突き合わせる）
 */
import type { CheatSheetSummary } from "../types";

export const reactSummary: CheatSheetSummary = {
  slug: "react",
  title: "React.js チートシート",
  name: "React.js",
  description:
    "JSX、props、state、Effect、ref、フォーム、Context、Suspense、メモ化、TypeScript での型付けまでをまとめたReactリファレンス。",
  eyebrow: "UI library",
  accent: "#149eca",
  keywords: ["react", "jsx", "hooks", "フック", "コンポーネント", "usestate"],
  sectionCount: 13,
  itemCount: 81,
};
