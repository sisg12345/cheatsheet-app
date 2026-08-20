import { expect, test } from "@playwright/test";

test("一覧からHTMLチートシートを検索して開ける", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /必要な構文へ/ })).toBeVisible();
  await page.getByRole("searchbox").fill("HTML");
  await page.getByRole("link", { name: /HTMLタグ/ }).click();
  await expect(page.getByRole("heading", { name: "HTMLタグ チートシート" })).toBeVisible();
});
