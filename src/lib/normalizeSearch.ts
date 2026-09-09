/**
 * 検索比較用に文字列を正規化する。
 *
 * NFKCは小文字化より先に行うこと。互換文字から大文字を生成することがあり
 * （`㎅` → `KB`）、逆順だとその大文字が残って一致しなくなる。
 */
export function normalizeSearch(value: string): string {
  return value.normalize("NFKC").toLowerCase().trim();
}

/** 検索対象のいずれかに検索語が含まれるか。空クエリは常にtrue（＝全件表示）。 */
export function includesSearch(haystack: string[], query: string): boolean {
  const normalizedQuery = normalizeSearch(query);
  if (!normalizedQuery) return true;

  return normalizeSearch(haystack.join(" ")).includes(normalizedQuery);
}
