/**
 * ページを移ったときのスクロール位置のE2Eテスト。
 * 別のページへ移ったら先頭から見せ、同じページの中の移動（目次のアンカー）では位置を動かさない。
 * ルーターはスクロール位置を扱わないので、何もしないと前のページの高さのまま次のページが表示される。
 */
import { expect, test, type Page } from "@playwright/test";
import { openSheetFromMenu } from "./sheetMenu";
import { openSheet } from "./sheetPage";

function scrollY(page: Page) {
  return page.evaluate(() => window.scrollY);
}

test("一覧の下のほうでカードを押すと、シートのページは先頭から表示される", async ({ page }) => {
  await page.goto("/");
  const card = page
    .getByRole("region", { name: "チートシート一覧" })
    .getByRole("heading", { name: "Vue.js", exact: true });
  await card.scrollIntoViewIfNeeded();
  expect(await scrollY(page)).toBeGreaterThan(0);

  await card.click();
  await expect(page).toHaveURL(/\/cheatsheets\/vue$/);
  await expect.poll(() => scrollY(page)).toBe(0);
});

test("シートのページを下まで読んでからメニューで別のシートへ移ると、先頭から表示される", async ({
  page,
}) => {
  await openSheet(page, "/cheatsheets/html");
  await page.evaluate(() => window.scrollTo({ top: 3000, behavior: "instant" }));
  await expect.poll(() => scrollY(page)).toBeGreaterThan(1000);

  await openSheetFromMenu(page, "Git");
  await expect(page).toHaveURL(/\/cheatsheets\/git$/);
  await expect.poll(() => scrollY(page)).toBe(0);
});

test("目次のアンカーで同じページの中を移るときは、先頭へ戻さない", async ({ page }) => {
  await openSheet(page, "/cheatsheets/html");
  await page.getByRole("complementary").locator('a[href^="#"]').nth(3).click();
  await expect(page).toHaveURL(/#/);
  await expect.poll(() => scrollY(page)).toBeGreaterThan(0);
});
