/**
 * チートシートデータを書くためのヘルパー。
 * 項目の生成は必ずこの `item()` を通し、content.ts にオブジェクトリテラルを直書きしない。
 */
import type { CheatSheetItem, ItemStatus } from "./types";

/**
 * `CheatSheetItem` を生成する。引数はすべて位置指定なので、順序に注意する。
 *
 * ```
 * item(id, label, syntax, description, note?, status?, keywords?)
 * ```
 *
 * - `id`          シート内で一意（`key` とページ内アンカーに使われる）
 * - `label`       項目の見出し
 * - `syntax`      コード例。無い項目は `undefined` を明示的に渡す
 * - `description` 説明文
 * - `note`        補足（省略可）
 * - `status`      既定は `normal`。破壊的な操作には `danger` を付ける
 * - `keywords`    検索用の別名（省略可）
 *
 * `syntax` だけ省略可能記法にせず必須位置に置いてあるのは、後続の引数を
 * 渡すときに `undefined` を書かせて、位置のずれに気づきやすくするため。
 */
export function item(
  id: string,
  label: string,
  syntax: string | undefined,
  description: string,
  note?: string,
  status: ItemStatus = "normal",
  keywords: string[] = [],
): CheatSheetItem {
  return { id, label, syntax, description, note, status, keywords };
}
