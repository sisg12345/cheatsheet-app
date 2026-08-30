/**
 * 収録シートの一覧と、そこから派生する参照用データ。
 *
 * シートを追加するときに触るのはこのファイルの `sheets` 配列だけでよい。
 * ルーティング（App.tsx）も一覧カードも、以下の派生データから自動的に組み立てられる。
 */
import { gitCheatSheet } from "./git/content";
import { htmlCheatSheet } from "./html/content";
import type { CheatSheet, CheatSheetSummary } from "./types";

/** 収録シートの単一の情報源。配列順が一覧の表示順になる。 */
const sheets = [htmlCheatSheet, gitCheatSheet] as const;

/** slug からシート本体を引くための辞書。ルーティングでの解決に使う。 */
export const cheatSheetRegistry: Readonly<Record<string, CheatSheet>> = Object.fromEntries(
  sheets.map((sheet) => [sheet.slug, sheet]),
);

/** 収録済みの slug 一覧。 */
export const cheatSheetSlugs = sheets.map((sheet) => sheet.slug);

/**
 * 一覧画面に渡すサマリー。
 * セクション数・項目数はここで集計しておき、カード側では再計算しない。
 */
export const cheatSheetSummaries: CheatSheetSummary[] = sheets.map((sheet) => ({
  slug: sheet.slug,
  title: sheet.title,
  shortTitle: sheet.shortTitle,
  description: sheet.description,
  eyebrow: sheet.eyebrow,
  accent: sheet.accent,
  keywords: sheet.keywords,
  sectionCount: sheet.sections.length,
  itemCount: sheet.sections.reduce((total, section) => total + section.items.length, 0),
}));

/**
 * slug に対応するシートを返す。未知の slug では `undefined` を返し、
 * 呼び出し側（App.tsx の CheatSheetPage）が 404 表示に落とす。
 */
export function getCheatSheet(slug: string): CheatSheet | undefined {
  return cheatSheetRegistry[slug];
}
