/**
 * シートを追加するときは `sheets` 配列に足す。ルーティングも一覧カードも
 * 以下の派生データから組み立てられるが、シート名をべた書きしている箇所
 * （AppHeader.tsx の直リンク、CatalogPage.tsx の検索欄プレースホルダー、
 * index.html の meta description）は手で追記する。
 */
import { claudeCodeCheatSheet } from "./claude-code/content";
import { gitCheatSheet } from "./git/content";
import { htmlCheatSheet } from "./html/content";
import type { CheatSheet, CheatSheetSummary } from "./types";
import { vimCheatSheet } from "./vim/content";

/** 配列順が一覧の表示順になる。 */
const sheets = [htmlCheatSheet, gitCheatSheet, vimCheatSheet, claudeCodeCheatSheet] as const;

export const cheatSheetRegistry: Readonly<Record<string, CheatSheet>> = Object.fromEntries(
  sheets.map((sheet) => [sheet.slug, sheet]),
);

/** 件数はここで集計しておき、カード側では再計算しない。 */
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
 * `Object.hasOwn` で自前のキーに限定するのは、`Object.fromEntries` の辞書が
 * Object.prototype を継承しており、`constructor` などの slug に対して継承メンバー
 * （truthy）を返すため。素通しすると404に落ちず、sections を持たない値で
 * 描画されて白画面になる。
 */
export function getCheatSheet(slug: string): CheatSheet | undefined {
  return Object.hasOwn(cheatSheetRegistry, slug) ? cheatSheetRegistry[slug] : undefined;
}
