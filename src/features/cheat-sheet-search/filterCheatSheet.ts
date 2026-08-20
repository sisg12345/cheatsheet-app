import type { CheatSheetSection } from "@/src/cheatsheets/types";
import { includesSearch } from "@/src/lib/normalizeSearch";

export function filterCheatSheetSections(
  sections: CheatSheetSection[],
  query: string,
): CheatSheetSection[] {
  if (!query.trim()) return sections;

  return sections
    .map((section) => {
      const sectionMatches = includesSearch([section.title, section.description ?? ""], query);
      if (sectionMatches) return section;

      const items = section.items.filter((entry) =>
        includesSearch(
          [
            entry.label,
            entry.syntax ?? "",
            entry.description,
            entry.note ?? "",
            ...(entry.keywords ?? []),
          ],
          query,
        ),
      );
      return { ...section, items };
    })
    .filter((section) => section.items.length > 0);
}
