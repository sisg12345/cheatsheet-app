/**
 * シートの中身（content.ts）を開いたときに読み込む仕組みのE2Eテスト。
 *
 * 最初のバンドルには一覧に出すサマリーだけを入れ、中身はシートを開いてから読み込んでいる。
 * どこかで content.ts を静的に import すると、画面は変わらないまま中身が最初のバンドルに
 * 戻ってしまうので、読み込みの有無そのものをここで確かめる。
 *
 * dev サーバー（playwright.config.ts が起動する）では各シートの content.ts がそのままの
 * パスで要求されるので、リクエストのパスでどのシートの中身かを見分ける。
 */
import { expect, test, type Page } from "@playwright/test";
import { openSheetFromMenu, sheetMenuButton } from "./sheetMenu";

const CONTENT_PATH = /^\/src\/cheatsheets\/([^/]+)\/content\.ts$/;

/** slug のシートの中身へのリクエストかどうか。page.route に渡す。 */
function isContentOf(slug: string) {
  return (url: URL) => url.pathname === `/src/cheatsheets/${slug}/content.ts`;
}

/** シートのページの見出し（正式名）。読み込み中から出ている。 */
function sheetHeading(page: Page, name: string) {
  return page.getByRole("heading", { level: 1, name, exact: true });
}

test("一覧ではシートの中身を読み込まず、開いたシートの中身だけを読み込む", async ({ page }) => {
  const loaded: string[] = [];
  page.on("request", (request) => {
    const slug = new URL(request.url()).pathname.match(CONTENT_PATH)?.[1];
    if (slug) loaded.push(slug);
  });

  await page.goto("/");
  await expect(
    page.getByRole("region", { name: "チートシート一覧" }).getByRole("link").first(),
  ).toBeVisible();
  expect(loaded).toEqual([]);

  // 一覧にも検索欄があるので、シートのページにしか無い件数表示で読み込みを待つ。
  await openSheetFromMenu(page, "Git");
  await expect(page.getByText(/\d+ セクション \/ \d+ 項目/)).toBeVisible();
  expect(loaded).toEqual(["git"]);
});

test("中身を読み込むまでは見出しと読み込み中の案内を出し、読み込めたら検索欄に差し替える", async ({
  page,
}) => {
  // 中身の応答を止めておき、読み込み中の表示を確かめてから流す。
  let release = () => {};
  const released = new Promise<void>((resolve) => (release = resolve));
  await page.route(isContentOf("vim"), async (route) => {
    await released;
    await route.continue();
  });

  await page.goto("/cheatsheets/vim");
  await expect(sheetHeading(page, "Vim")).toBeVisible();
  await expect(page.getByRole("status")).toHaveText("シートを読み込んでいます…");
  await expect(page.getByRole("searchbox")).toHaveCount(0);

  release();
  await expect(page.getByRole("searchbox")).toBeVisible();
  await expect(page.getByRole("status")).toHaveCount(0);
  await expect(sheetHeading(page, "Vim")).toBeVisible();
});

test("中身を読み込めなかったときは、ヘッダーと見出しを残したまま読み込み直しを促す", async ({
  page,
}) => {
  const isDockerContent = isContentOf("docker");
  await page.route(isDockerContent, (route) => route.abort());

  await page.goto("/cheatsheets/docker");
  await expect(page.getByRole("alert")).toContainText("シートを読み込めませんでした");
  await expect(sheetHeading(page, "Docker")).toBeVisible();
  await expect(sheetMenuButton(page)).toBeVisible();

  // 通信が戻っていれば、読み込み直すと開ける。
  await page.unroute(isDockerContent);
  await page.getByRole("button", { name: "再読み込み" }).click();
  await expect(page.getByRole("searchbox")).toBeVisible();
  await expect(page.getByRole("alert")).toHaveCount(0);
});

// constructor などは Object.prototype の継承メンバー。辞書を素通しすると404に落ちずに白画面になる。
for (const slug of ["no-such-sheet", "constructor", "toString", "__proto__"]) {
  test(`未登録の slug（${slug}）では404を出す`, async ({ page }) => {
    await page.goto(`/cheatsheets/${slug}`);
    await expect(
      page.getByRole("heading", { level: 1, name: "ページが見つかりません" }),
    ).toBeVisible();
  });
}
