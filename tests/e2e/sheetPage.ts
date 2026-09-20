/**
 * シートのページを開く E2E 用のヘルパー。
 *
 * シートの中身はページを開いてから読み込むので、goto が返った時点では見出しと
 * 読み込み中の表示しか出ていないことがある。検索欄は中身を読み込んでから出るので、それを待つ。
 * 待たずに DOM を直接触ったりキーを送ったりすると、要素が無くて落ちるか、
 * 何も起きずに通ってしまい検証にならない。
 */
import { expect, type Page } from "@playwright/test";

export async function openSheet(page: Page, url: string) {
  await page.goto(url);
  await expect(page.getByRole("searchbox")).toBeVisible();
}
