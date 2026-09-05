/**
 * 検索語とデータ双方を同じ規則で正規化するための汎用関数。
 * 一覧検索（CatalogLayout）とシート内検索（filterCheatSheet）が共通で使う。
 */

/**
 * 検索比較用に文字列を正規化する。
 *
 * NFKCで全角英数・半角カナを標準形に畳んでから比較するため、
 * `ＭＥＴＡ` と `meta`、`ｶﾞ` と `ガ` が同じ語として一致する。
 *
 * NFKCを小文字化より先に行うこと。NFKCは互換文字から大文字を生成することがあり
 * （`㎅` → `KB`、`ℬ` → `B`）、順序を逆にするとその大文字が残って一致しなくなる。
 */
export function normalizeSearch(value: string): string {
  return value.normalize("NFKC").toLowerCase().trim();
}

/**
 * 複数の検索対象文字列のいずれかに検索語が含まれるかを判定する。
 *
 * 空クエリでは常にtrueを返す。呼び出し側のフィルタを素通しさせ、
 * 「検索していない状態＝全件表示」を各所で書き分けずに済ませるため。
 */
export function includesSearch(haystack: string[], query: string): boolean {
  const normalizedQuery = normalizeSearch(query);
  if (!normalizedQuery) return true;

  // 対象をスペースで連結してから一括正規化する。要素ごとに正規化するより
  // 呼び出し回数が減り、語が要素をまたいで誤ヒットする心配も実用上ない。
  return normalizeSearch(haystack.join(" ")).includes(normalizedQuery);
}
