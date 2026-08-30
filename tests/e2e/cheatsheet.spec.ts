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
