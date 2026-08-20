import type { CheatSheetItem, ItemStatus } from "./types";

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
