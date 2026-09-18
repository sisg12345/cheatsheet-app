/**
 * ヘッダーの「チートシート」メニューを操作する E2E 用のヘルパー。
 * シートへの移動はメニューを開いてからリンクを押す2段階になるので、手順をここにまとめる。
 */
import type { Page } from "@playwright/test";

/** メニューの開閉ボタン。 */
export function sheetMenuButton(page: Page) {
  return page.getByRole("banner").getByRole("button", { name: "チートシート" });
}

/** メニューを開き、名前が一致するシートへのリンクを押す。 */
export async function openSheetFromMenu(page: Page, name: string) {
  await sheetMenuButton(page).click();
  await page.getByRole("banner").getByRole("link", { name, exact: true }).click();
}
