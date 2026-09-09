/**
 * チートシートのドメイン型。ここがコンテンツの単一の定義元で、
 * components / features 側はこの型だけを見る。
 */

/** バッジの色とラベルに1対1で対応する。破壊的なコマンドには `danger` を付ける。 */
export type ItemStatus = "normal" | "info" | "warning" | "danger";

export interface SourceLink {
  label: string;
  url: string;
}

export interface CheatSheetItem {
  /** シート内で一意。React の `key` に使う。 */
  id: string;
  label: string;
  /** 省略した項目はコード欄に `—` が出る。 */
  syntax?: string;
  description: string;
  /** 使いどころ・注意点。説明より小さく表示される。 */
  note?: string;
  /** 検索用の別名。全角/半角・大文字小文字は normalizeSearch が吸収する。 */
  keywords?: string[];
  /** 未指定は `normal` 扱いで、バッジは表示されない。 */
  status?: ItemStatus;
}

export interface CheatSheetSection {
  /** シート内で一意。`key` と `<section id>`（目次のアンカー先）に使う。 */
  id: string;
  title: string;
  description?: string;
  items: CheatSheetItem[];
}

export interface CheatSheet {
  id: string;
  /** URLに使う識別子。`/cheatsheets/<slug>` になる。 */
  slug: string;
  title: string;
  /** カードのモノグラムに出る短縮名（例: "HTML"）。 */
  shortTitle: string;
  description: string;
  /** タイトル上の小さなラベル（例: "Markup language"）。 */
  eyebrow: string;
  /** シート固有の色。CSS変数 `--sheet-accent` に流し込まれる。 */
  accent: string;
  keywords: string[];
  /** 配列順がそのまま表示順・採番順になる。 */
  sections: CheatSheetSection[];
  sources: SourceLink[];
  /** YYYY-MM-DD。内容を直したら更新する。 */
  updatedAt: string;
}

/**
 * 一覧画面用の軽量サマリー。registry が `CheatSheet` から派生させる。
 * sections の中身は持たず件数だけ集計済みなので、一覧描画で全項目を走査せずに済む。
 */
export interface CheatSheetSummary {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  eyebrow: string;
  accent: string;
  keywords: string[];
  sectionCount: number;
  itemCount: number;
}
