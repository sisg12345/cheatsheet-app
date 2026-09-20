/**
 * npmチートシートのサマリー。一覧のカード・ヘッダーのメニュー・シートのページの見出しに出す。
 * 最初に読み込むバンドルに入るので、セクションと項目は content.ts に置き、ここには件数だけを書く。
 *
 * - sectionCount / itemCount は content.ts の件数と一致させる（tests/unit/registry.test.ts が突き合わせる）
 */
import type { CheatSheetSummary } from "../types";

export const npmSummary: CheatSheetSummary = {
  slug: "npm",
  title: "npm チートシート",
  name: "npm",
  description:
    "インストールと更新、スクリプト、npx、バージョン指定、lock ファイルとセキュリティ、ワークスペース、公開までをまとめたnpmリファレンス。",
  eyebrow: "Package manager",
  accent: "#cb3837",
  keywords: ["npm", "npx", "package.json", "node", "パッケージ", "依存関係"],
  sectionCount: 9,
  itemCount: 57,
};
