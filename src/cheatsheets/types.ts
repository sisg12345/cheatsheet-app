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

/**
 * シートの表書きと件数。各シートの summary.ts に書く。
 *
 * 一覧のカード・ヘッダーのメニュー・シートのページの見出しはこれだけで描けるので、最初に
 * 読み込むバンドルにはこちらだけを入れ、セクションの中身（`CheatSheetContent`）はシートを
 * 開いたときに読み込む。
 */
export interface CheatSheetSummary {
  /** URLに使う識別子。`/cheatsheets/<slug>` になる。 */
  slug: string;
  /** シートの呼び名（例: "HTMLタグ チートシート"）。画面には出さず、一覧の検索に使う。 */
  title: string;
  /**
   * 題材の正式名（例: "Claude Code"、"React.js"）。カードの題名・シートのページの見出し・
   * ヘッダーのメニューに出す。"CC" や "JS" のような省略形にはしない。
   */
  name: string;
  description: string;
  /** タイトル上の小さなラベル（例: "Markup language"）。 */
  eyebrow: string;
  /** シート固有の色。CSS変数 `--sheet-accent` に流し込まれる。 */
  accent: string;
  keywords: string[];
  /**
   * content.ts の sections の数と、その items の合計。中身を読み込まずに一覧へ出すため手で持つ。
   * 中身と食い違うと tests/unit/registry.test.ts が落ち、正しい値を示す。
   */
  sectionCount: number;
  itemCount: number;
}

/** シートの中身。各シートの content.ts に書き、registry の loadCheatSheet が開いたときに読み込む。 */
export interface CheatSheetContent {
  id: string;
  /** 配列順がそのまま表示順・採番順になる。 */
  sections: CheatSheetSection[];
  sources: SourceLink[];
  /** YYYY-MM-DD。内容を直したら更新する。 */
  updatedAt: string;
}
