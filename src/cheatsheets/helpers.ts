import type { CheatSheetItem, ItemStatus } from "./types";

/**
 * `CheatSheetItem` を生成する。引数はすべて位置指定。
 *
 * `syntax` を省略可能にせず必須位置に置いてあるのは、後続の引数を渡すときに
 * `undefined` を明示させて位置のずれに気づきやすくするため。
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
