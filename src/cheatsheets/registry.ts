import { gitCheatSheet } from "./git/content";
import { htmlCheatSheet } from "./html/content";
import type { CheatSheet, CheatSheetSummary } from "./types";

const sheets = [htmlCheatSheet, gitCheatSheet] as const;

export const cheatSheetRegistry: Readonly<Record<string, CheatSheet>> = Object.fromEntries(
  sheets.map((sheet) => [sheet.slug, sheet]),
);

export const cheatSheetSlugs = sheets.map((sheet) => sheet.slug);

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

export function getCheatSheet(slug: string): CheatSheet | undefined {
  return cheatSheetRegistry[slug];
}
