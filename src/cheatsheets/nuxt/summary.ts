/**
 * Nuxt.jsチートシートのサマリー。一覧のカード・ヘッダーのメニュー・シートのページの見出しに出す。
 * 最初に読み込むバンドルに入るので、セクションと項目は content.ts に置き、ここには件数だけを書く。
 *
 * - sectionCount / itemCount は content.ts の件数と一致させる（tests/unit/registry.test.ts が突き合わせる）
 */
import type { CheatSheetSummary } from "../types";

export const nuxtSummary: CheatSheetSummary = {
  slug: "nuxt",
  title: "Nuxt.js チートシート",
  name: "Nuxt.js",
  description:
    "ディレクトリ構成、ルーティング、useFetch などのデータ取得、状態と設定、サーバー API、SEO、描画モードまでをまとめたNuxtリファレンス。",
  eyebrow: "Vue framework",
  accent: "#00dc82",
  keywords: ["nuxt", "nuxt4", "nuxi", "nitro", "ssr", "usefetch"],
  sectionCount: 8,
  itemCount: 53,
};
