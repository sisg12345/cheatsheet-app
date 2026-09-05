/**
 * シート内検索の絞り込みロジック。
 * 純関数なので tests/unit/filterCheatSheet.test.ts でそのまま検証している。
 */
import type { CheatSheetSection } from "@/src/cheatsheets/types";
import { includesSearch } from "@/src/lib/normalizeSearch";

/**
 * 検索語に一致するセクション・項目だけを残した配列を返す。
 *
 * 絞り込みは3段階。
 * 1. セクションの見出し・説明が一致したら、そのセクションを項目ごと丸ごと残す。
 *    「フォーム」で引いた読み手にセクション全体を読ませたいため、ここで項目は削らない。
 * 2. 見出しが一致しなければ、項目単位で絞り込む。
 * 3. 最後に、項目が1つも残らなかったセクションを落とす。見出しだけが並ぶのを防ぐため。
 *
 * 元の配列・オブジェクトは一切変更しない。ただしコピーを返すとは限らない:
 * 空クエリのときは受け取った配列をそのまま、セクション自体が一致したときは
 * content.ts のセクションオブジェクトをそのまま参照で返す。新しいオブジェクトを
 * 作るのは項目を絞り込んだ経路だけ。
 *
 * このため戻り値を破壊的に変更してはいけない（items の並べ替えや splice など）。
 * シートデータはモジュールレベルのシングルトンなので、変更するとセッション中ずっと
 * 元データが壊れ、registry の itemCount とも食い違う。
 */
export function filterCheatSheetSections(
  sections: CheatSheetSection[],
  query: string,
): CheatSheetSection[] {
  // 空白のみの入力は「検索していない」と同じ扱いにし、元の配列をそのまま返す。
  if (!query.trim()) return sections;

  return sections
    .map((section) => {
      // 1段目: セクション自体が一致するなら項目は削らずそのまま返す。
      const sectionMatches = includesSearch([section.title, section.description ?? ""], query);
      if (sectionMatches) return section;

      // 2段目: 項目の見出し・構文・説明・補足・キーワードを検索対象にする。
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
