import type { CheatSheetSection } from "@/src/cheatsheets/types";
import { includesSearch } from "@/src/lib/normalizeSearch";

/**
 * 検索語に一致するセクション・項目だけを残す。
 *
 * 戻り値を破壊的に変更してはいけない。コピーを返すのは項目を絞り込んだ経路だけで、
 * 空クエリとセクション一致では content.ts のオブジェクトをそのまま参照で返す。
 * シートデータはモジュールレベルのシングルトンなので、変更すると元データが壊れる。
 */
export function filterCheatSheetSections(
  sections: CheatSheetSection[],
  query: string,
): CheatSheetSection[] {
  if (!query.trim()) return sections;

  return sections
    .map((section) => {
      // セクション見出しが一致したら項目は削らない。「フォーム」で引いた読み手に
      // セクション全体を読ませたいため。
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
