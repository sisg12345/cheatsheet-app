/**
 * 一覧からシートを開くまでの主要導線を通しで確認するE2Eテスト。
 * ロケータは getByRole を優先する。クラス名やDOM構造の変更で壊れず、
 * 支援技術から見た名前が保たれているかも同時に検証できるため。
 */
import { expect, test } from "@playwright/test";

test("一覧からHTMLチートシートを検索して開ける", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /必要な構文へ/ })).toBeVisible();
  await page.getByRole("searchbox").fill("HTML");
  await page.getByRole("link", { name: /HTMLタグ/ }).click();
  await expect(page.getByRole("heading", { name: "HTMLタグ チートシート" })).toBeVisible();
});

/** 後から追加したシート。一覧の検索とヘッダーの直リンクの両方から辿れることを確認する。 */
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
];

for (const sheet of addedSheets) {
  test(`一覧から${sheet.title}を検索して開ける`, async ({ page }) => {
    await page.goto("/");
    await page.getByRole("searchbox").fill(sheet.query);
    await page.getByRole("link", { name: new RegExp(sheet.title) }).click();
    await expect(page).toHaveURL(new RegExp(`${sheet.path}$`));
    await expect(page.getByRole("heading", { name: sheet.title })).toBeVisible();
  });

  test(`ヘッダーの直リンクから${sheet.title}へ移動できる`, async ({ page }) => {
    await page.goto("/");
    await page.getByRole("banner").getByRole("link", { name: sheet.navLabel }).click();
    await expect(page).toHaveURL(new RegExp(`${sheet.path}$`));
    await expect(page.getByRole("heading", { name: sheet.title })).toBeVisible();
  });
}
