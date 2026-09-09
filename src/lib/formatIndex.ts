/** 0始まりのindexを `01` `02` … の表示用ラベルにする。 */
export function formatIndex(index: number): string {
  return String(index + 1).padStart(2, "0");
}
