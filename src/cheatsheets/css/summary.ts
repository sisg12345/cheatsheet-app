/**
 * CSSチートシートのサマリー。一覧のカード・ヘッダーのメニュー・シートのページの見出しに出す。
 * 最初に読み込むバンドルに入るので、セクションと項目は content.ts に置き、ここには件数だけを書く。
 *
 * - sectionCount / itemCount は content.ts の件数と一致させる（tests/unit/registry.test.ts が突き合わせる）
 */
import type { CheatSheetSummary } from "../types";

export const cssSummary: CheatSheetSummary = {
  slug: "css",
  title: "CSS チートシート",
  name: "CSS",
  description:
    "セレクターとカスケード、ボックスモデル、Flexbox・Grid、配置、文字と色、レスポンシブ、アニメーション、:has() や @layer などの新しい機能までをまとめたCSSリファレンス。",
  eyebrow: "Style sheet language",
  // CSS の公式ロゴの色（rebeccapurple）。そのままではダークの背景で暗すぎて読みにくいので、
  // ダークでは明るい紫にする。
  accent: "light-dark(#663399, #9d6fe0)",
  keywords: ["css", "スタイル", "スタイルシート", "stylesheet", "レイアウト", "デザイン"],
  sectionCount: 16,
  itemCount: 165,
};
