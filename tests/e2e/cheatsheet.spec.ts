/**
 * 一覧からシートを開くまでの主要導線を通しで確認するE2Eテスト。
 * ロケータは getByRole を優先する。クラス名やDOM構造の変更で壊れず、
 * 支援技術から見た名前が保たれているかも同時に検証できるため。
 */
import { expect, test, type Page } from "@playwright/test";
import { openSheetFromMenu, sheetMenuButton } from "./sheetMenu";
import { openSheet } from "./sheetPage";

/** 一覧のカードの題名（シートの正式名）。カードのリンクの中にあるので、押せばシートへ移る。 */
function catalogCardTitle(page: Page, name: string) {
  return page
    .getByRole("region", { name: "チートシート一覧" })
    .getByRole("heading", { name, exact: true });
}

/** シートのページの見出し。カードの題名と同じく正式名だけ（「〇〇 チートシート」ではない）。 */
function sheetHeading(page: Page, name: string) {
  return page.getByRole("heading", { level: 1, name, exact: true });
}

test("一覧からHTMLチートシートを検索して開ける", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /必要な構文へ/ })).toBeVisible();
  await page.getByRole("searchbox").fill("HTML");
  await catalogCardTitle(page, "HTML").click();
  await expect(sheetHeading(page, "HTML")).toBeVisible();
});

/**
 * 後から追加したシート。一覧の検索とヘッダーのメニューの両方から辿れることを確認する。
 * navLabel はシートの正式名で、一覧のカードの題名・ヘッダーのメニューの表示名・シートのページの
 * 見出しを兼ねる。title はテスト名に使う呼び名。
 */
const addedSheets = [
  { query: "Vim", navLabel: "Vim", title: "Vim チートシート", path: "/cheatsheets/vim" },
  {
    query: "Claude",
    navLabel: "Claude Code",
    title: "Claude Code チートシート",
    path: "/cheatsheets/claude-code",
  },
  {
    query: "JavaScript",
    navLabel: "JavaScript",
    title: "JavaScript チートシート",
    path: "/cheatsheets/javascript",
  },
  {
    query: "Docker",
    navLabel: "Docker",
    title: "Docker チートシート",
    path: "/cheatsheets/docker",
  },
  {
    query: "TypeScript",
    navLabel: "TypeScript",
    title: "TypeScript チートシート",
    path: "/cheatsheets/typescript",
  },
  {
    query: "React",
    navLabel: "React.js",
    title: "React.js チートシート",
    path: "/cheatsheets/react",
  },
  { query: "Vue", navLabel: "Vue.js", title: "Vue.js チートシート", path: "/cheatsheets/vue" },
];

for (const sheet of addedSheets) {
  test(`一覧から${sheet.title}を検索して開ける`, async ({ page }) => {
    await page.goto("/");
    await page.getByRole("searchbox").fill(sheet.query);
    await catalogCardTitle(page, sheet.navLabel).click();
    await expect(page).toHaveURL(new RegExp(`${sheet.path}$`));
    await expect(sheetHeading(page, sheet.navLabel)).toBeVisible();
  });

  test(`ヘッダーのメニューから${sheet.title}へ移動できる`, async ({ page }) => {
    await page.goto("/");
    await openSheetFromMenu(page, sheet.navLabel);
    await expect(page).toHaveURL(new RegExp(`${sheet.path}$`));
    await expect(sheetHeading(page, sheet.navLabel)).toBeVisible();
  });
}

test("メニューは今いるシートを示し、選ぶと閉じる", async ({ page }) => {
  await page.goto("/cheatsheets/git");
  await sheetMenuButton(page).click();
  await expect(sheetMenuButton(page)).toHaveAttribute("aria-expanded", "true");
  await expect(
    page.getByRole("banner").getByRole("link", { name: "Git", exact: true }),
  ).toHaveAttribute("aria-current", "page");

  await page.getByRole("banner").getByRole("link", { name: "Vim", exact: true }).click();
  await expect(page).toHaveURL(/\/cheatsheets\/vim$/);
  await expect(sheetMenuButton(page)).toHaveAttribute("aria-expanded", "false");
});

test("メニューは Escape で閉じ、シート内の検索語は消さない", async ({ page }) => {
  // シート内検索は window の Escape でクリアする。メニューを閉じる Escape がそこまで届くと、
  // メニューを閉じただけで検索語まで消えてしまう。
  await openSheet(page, "/cheatsheets/html?q=form");
  await sheetMenuButton(page).click();
  await expect(
    page.getByRole("banner").getByRole("link", { name: "Git", exact: true }),
  ).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(sheetMenuButton(page)).toHaveAttribute("aria-expanded", "false");
  await expect(sheetMenuButton(page)).toBeFocused();
  await expect(page.getByRole("searchbox")).toHaveValue("form");
  await expect(page).toHaveURL(/\?q=form/);
});

test("メニューの外を押すと閉じる", async ({ page }) => {
  await page.goto("/");
  await sheetMenuButton(page).click();
  await expect(sheetMenuButton(page)).toHaveAttribute("aria-expanded", "true");

  await page.getByRole("heading", { name: /必要な構文へ/ }).click();
  await expect(sheetMenuButton(page)).toHaveAttribute("aria-expanded", "false");
  await expect(
    page.getByRole("banner").getByRole("link", { name: "Git", exact: true }),
  ).toBeHidden();
});
