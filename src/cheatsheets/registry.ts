/**
 * シートを追加するときは `sheets` 配列に足す。ルーティングも一覧カードもヘッダーのメニューも
 * 以下の派生データから組み立てられるが、シート名をべた書きしている箇所
 * （index.html の meta description と README）は手で直す。
 *
 * 最初に読み込むバンドルに入るのは各シートの summary.ts だけで、中身の content.ts は
 * シートを開いたときに loadCheatSheet が動的 import で読み込む（シートごとに別のチャンクになる）。
 * content.ts をどこかで静的に import すると、そのシートの中身が最初のバンドルに戻るので、
 * 中身へは必ず loadCheatSheet を通す。
 */
import { bashSummary } from "./bash/summary";
import { claudeCodeSummary } from "./claude-code/summary";
import { cssSummary } from "./css/summary";
import { dockerSummary } from "./docker/summary";
import { gitSummary } from "./git/summary";
import { htmlSummary } from "./html/summary";
import { javascriptSummary } from "./javascript/summary";
import { linuxSummary } from "./linux/summary";
import { nextjsSummary } from "./nextjs/summary";
import { npmSummary } from "./npm/summary";
import { nuxtSummary } from "./nuxt/summary";
import { reactSummary } from "./react/summary";
import type { CheatSheetContent, CheatSheetSummary } from "./types";
import { typescriptSummary } from "./typescript/summary";
import { vimSummary } from "./vim/summary";
import { viteSummary } from "./vite/summary";
import { vueSummary } from "./vue/summary";

interface SheetEntry {
  summary: CheatSheetSummary;
  /** import() の引数は文字列リテラルのまま書く。変数にすると Vite がシートごとのチャンクに分けられない。 */
  load: () => Promise<CheatSheetContent>;
}

/** 配列順が一覧の表示順になる。summary と load は同じシートのディレクトリを指す。 */
const sheets: SheetEntry[] = [
  { summary: htmlSummary, load: () => import("./html/content").then((m) => m.htmlContent) },
  { summary: cssSummary, load: () => import("./css/content").then((m) => m.cssContent) },
  {
    summary: javascriptSummary,
    load: () => import("./javascript/content").then((m) => m.javascriptContent),
  },
  {
    summary: typescriptSummary,
    load: () => import("./typescript/content").then((m) => m.typescriptContent),
  },
  { summary: reactSummary, load: () => import("./react/content").then((m) => m.reactContent) },
  { summary: nextjsSummary, load: () => import("./nextjs/content").then((m) => m.nextjsContent) },
  { summary: vueSummary, load: () => import("./vue/content").then((m) => m.vueContent) },
  { summary: nuxtSummary, load: () => import("./nuxt/content").then((m) => m.nuxtContent) },
  { summary: npmSummary, load: () => import("./npm/content").then((m) => m.npmContent) },
  { summary: viteSummary, load: () => import("./vite/content").then((m) => m.viteContent) },
  { summary: gitSummary, load: () => import("./git/content").then((m) => m.gitContent) },
  { summary: dockerSummary, load: () => import("./docker/content").then((m) => m.dockerContent) },
  { summary: linuxSummary, load: () => import("./linux/content").then((m) => m.linuxContent) },
  { summary: bashSummary, load: () => import("./bash/content").then((m) => m.bashContent) },
  { summary: vimSummary, load: () => import("./vim/content").then((m) => m.vimContent) },
  {
    summary: claudeCodeSummary,
    load: () => import("./claude-code/content").then((m) => m.claudeCodeContent),
  },
];

const sheetsBySlug: Readonly<Record<string, SheetEntry>> = Object.fromEntries(
  sheets.map((sheet) => [sheet.summary.slug, sheet]),
);

/** 件数も summary.ts が持つので、一覧を描くのにシートの中身は読み込まない。 */
export const cheatSheetSummaries: CheatSheetSummary[] = sheets.map((sheet) => sheet.summary);

/**
 * `Object.hasOwn` で自前のキーに限定するのは、`Object.fromEntries` の辞書が
 * Object.prototype を継承しており、`constructor` などの slug に対して継承メンバー
 * （truthy）を返すため。素通しすると404に落ちず、summary を持たない値で
 * 描画されて白画面になる。サマリーの取得も中身の読み込みも、必ずここを通す。
 */
function findSheet(slug: string): SheetEntry | undefined {
  return Object.hasOwn(sheetsBySlug, slug) ? sheetsBySlug[slug] : undefined;
}

/** 未登録の slug なら undefined（呼び出し側で404にする）。 */
export function getCheatSheetSummary(slug: string): CheatSheetSummary | undefined {
  return findSheet(slug)?.summary;
}

/** 読み込みを始めたシートの Promise。slug は findSheet を通ったものしか入らない。 */
const loadingContents = new Map<string, Promise<CheatSheetContent>>();

/**
 * シートの中身を読み込む。未登録の slug は reject する（先に getCheatSheetSummary で確かめる）。
 *
 * 同じ slug には同じ Promise を返す。React の `use` は結果を Promise 自体に覚えさせるので、
 * 呼ぶたびに別の Promise を渡すと、読み込み済みでも描画のたびにサスペンドし直す。
 * 失敗した Promise は覚えておかず、次に開いたときに読み直す（一時的な通信断で開けなくならないように）。
 */
export function loadCheatSheet(slug: string): Promise<CheatSheetContent> {
  const loading = loadingContents.get(slug);
  if (loading) return loading;

  const sheet = findSheet(slug);
  if (!sheet) return Promise.reject(new Error(`未登録のチートシートです: ${slug}`));

  const promise = sheet.load();
  loadingContents.set(slug, promise);
  promise.catch(() => loadingContents.delete(slug));
  return promise;
}
