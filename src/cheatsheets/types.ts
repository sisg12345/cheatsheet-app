/**
 * チートシートのドメイン型。
 *
 * ここがコンテンツの単一の定義元で、components / features 側はこの型だけを見る。
 * 同じ形の型を各所で再定義しないこと（名前が衝突するときは import 時に別名を付ける）。
 */

/**
 * 項目の危険度・重要度。バッジの色とラベルに1対1で対応する。
 * 破壊的なコマンドには必ず `danger` を付ける。
 */
export type ItemStatus = "normal" | "info" | "warning" | "danger";

/** シート下部に並べる出典リンク。 */
export interface SourceLink {
  /** リンクの表示名（例: "HTML Living Standard"）。 */
  label: string;
  /** 公式ドキュメントのURL。外部リンクとして新規タブで開く。 */
  url: string;
}

/** チートシート1項目。1つのタグ・コマンドに相当する。 */
export interface CheatSheetItem {
  /**
   * シート内で一意な識別子。React の `key` に使われる。
   * 重複すると再描画が壊れるため、必ず重複しない値にする。
   */
  id: string;
  /** 一覧に太字で出る見出し（例: `<table>`、"ユーザー名"）。 */
  label: string;
  /** コード例。省略した項目はコード欄に `—` が表示される。 */
  syntax?: string;
  /** 何をするものかの説明。1〜2文で簡潔に。 */
  description: string;
  /** 使いどころ・注意点の補足。説明より小さく表示される。 */
  note?: string;
  /**
   * 検索でヒットさせたい別名・日本語表記。
   * 比較は normalizeSearch を通るので、全角/半角・大文字小文字は考慮不要。
   */
  keywords?: string[];
  /** 未指定は `normal` 扱いで、バッジは表示されない。 */
  status?: ItemStatus;
}

/** 項目をまとめた章。サイドバーの目次1行に対応する。 */
export interface CheatSheetSection {
  /**
   * シート内で一意な識別子。`key` と `<section id>` の両方に使われ、
   * 目次のページ内アンカー（`#id`）のリンク先になる。重複すると目次が壊れる。
   */
  id: string;
  /** 目次とセクション見出しに出るタイトル。 */
  title: string;
  /** 見出し直下に出る補足。省略可。 */
  description?: string;
  /** このセクションに属する項目。表示順は配列順のまま。 */
  items: CheatSheetItem[];
}

/** チートシート1枚分の完全なデータ。 */
export interface CheatSheet {
  /** データ上の識別子（例: "html-reference"）。 */
  id: string;
  /** URL に使う識別子。`/cheatsheets/<slug>` になる。 */
  slug: string;
  /** ページ見出しに出る正式名称。 */
  title: string;
  /** カードのモノグラムやヘッダーに出る短縮名（例: "HTML"）。 */
  shortTitle: string;
  /** 一覧カードとページ冒頭に出る概要。 */
  description: string;
  /** タイトル上の小さなラベル（例: "Markup language"）。 */
  eyebrow: string;
  /** シート固有のテーマ色。CSS変数 `--sheet-accent` に流し込まれる。 */
  accent: string;
  /** 一覧検索でこのシートをヒットさせたい語。 */
  keywords: string[];
  /** 本文。配列順がそのまま表示順・採番順になる。 */
  sections: CheatSheetSection[];
  /** フッターに並べる出典。 */
  sources: SourceLink[];
  /** 最終更新日（YYYY-MM-DD）。内容を直したら必ず更新する。 */
  updatedAt: string;
}

/**
 * 一覧画面用の軽量サマリー。
 *
 * `CheatSheet` から registry が派生させる。sections の中身までは持たず、
 * 件数だけを集計済みで保持するため、一覧描画で全項目を走査せずに済む。
 */
export interface CheatSheetSummary {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  eyebrow: string;
  accent: string;
  keywords: string[];
  /** セクション数。カードの SECTIONS に表示。 */
  sectionCount: number;
  /** 全セクションの項目数の合計。カードの ITEMS に表示。 */
  itemCount: number;
}
