export function normalizeSearch(value: string): string {
  return value.toLowerCase().normalize("NFKC").trim();
}

export function includesSearch(haystack: string[], query: string): boolean {
  const normalizedQuery = normalizeSearch(query);
  if (!normalizedQuery) return true;
  return normalizeSearch(haystack.join(" ")).includes(normalizedQuery);
}
