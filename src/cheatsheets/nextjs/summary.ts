/**
 * Next.jsチートシートのサマリー。一覧のカード・ヘッダーのメニュー・シートのページの見出しに出す。
 * 最初に読み込むバンドルに入るので、セクションと項目は content.ts に置き、ここには件数だけを書く。
 *
 * - sectionCount / itemCount は content.ts の件数と一致させる（tests/unit/registry.test.ts が突き合わせる）
 */
import type { CheatSheetSummary } from "../types";

export const nextjsSummary: CheatSheetSummary = {
  slug: "nextjs",
  title: "Next.js チートシート",
  name: "Next.js",
  description:
    "App Router のルーティング、Server Components、データ取得とキャッシュ、Server Actions、Proxy、設定までをまとめたNext.jsリファレンス。",
  eyebrow: "React framework",
  // ブランドが白黒なので、テーマの文字色（ライトは黒、ダークは白）をそのまま使う。
  accent: "var(--color-ink)",
  keywords: ["next", "nextjs", "app router", "server components", "ssr", "vercel"],
  sectionCount: 10,
  itemCount: 68,
};
