/**
 * Viteチートシートのサマリー。一覧のカード・ヘッダーのメニュー・シートのページの見出しに出す。
 * 最初に読み込むバンドルに入るので、セクションと項目は content.ts に置き、ここには件数だけを書く。
 *
 * - sectionCount / itemCount は content.ts の件数と一致させる（tests/unit/registry.test.ts が突き合わせる）
 */
import type { CheatSheetSummary } from "../types";

export const viteSummary: CheatSheetSummary = {
  slug: "vite",
  title: "Vite チートシート",
  name: "Vite",
  description:
    "開発サーバーとビルドのコマンド、vite.config、環境変数とモード、静的ファイルと import、ビルドの設定、プラグインまでをまとめたViteリファレンス。",
  eyebrow: "Build tool",
  accent: "#bd34fe",
  keywords: ["vite", "vitejs", "rolldown", "bundler", "バンドラー", "hmr"],
  sectionCount: 6,
  itemCount: 40,
};
