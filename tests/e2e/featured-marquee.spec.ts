/**
 * 一覧の「注目のチートシート」（自動で流れるカルーセル）のE2Eテスト。
 *
 * 流れている列は動き続けるため、Playwright の操作は「要素が止まるまで待つ」で詰まる。
 * マウスは座標で動かし、カードを押すときは先に一時停止ボタンで止める。
 * 総数はシートを足すたびに変わるため、件数は下の一覧のカード数と突き合わせる。
 */
import { expect, test, type Page } from "@playwright/test";

function featured(page: Page) {
  return page.getByRole("region", { name: "注目のチートシート" });
}

/** 流れている1本目の列。複製の2本目は aria-hidden なので role では拾われない。 */
function track(page: Page) {
  return featured(page).getByRole("list");
}

/** 列の今の横位置（px）。左へ流れるほど小さくなる。 */
function offset(page: Page) {
  return track(page).evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41);
}

test("自動で左へ流れ、ホバー中は止まる", async ({ page }) => {
  await page.goto("/");
  const start = await offset(page);
  await expect.poll(() => offset(page)).toBeLessThan(start);

  // 列は横に動いているが縦の位置は変わらないので、その高さで画面中央に置く。
  const box = await track(page).boundingBox();
  await page.mouse.move(640, box!.y + box!.height / 2);
  await expect(track(page)).toHaveCSS("animation-play-state", "paused");

  await page.mouse.move(640, 5);
  await expect(track(page)).toHaveCSS("animation-play-state", "running");
});

test("一時停止ボタンで止めたままにでき、再生で再開する", async ({ page }) => {
  await page.goto("/");
  await featured(page).getByRole("button", { name: "一時停止" }).click();
  // ホバーで止まっているのではないことを確かめるため、マウスを外へ出す。
  await page.mouse.move(640, 5);
  await expect(track(page)).toHaveCSS("animation-play-state", "paused");

  await featured(page).getByRole("button", { name: "再生" }).click();
  await expect(track(page)).toHaveCSS("animation-play-state", "running");
});

test("止めてからカードを押すと、そのシートへ移動できる", async ({ page }) => {
  await page.goto("/");
  await featured(page).getByRole("button", { name: "一時停止" }).click();
  await featured(page)
    .getByRole("link", { name: /Git チートシート/ })
    .click();
  await expect(page).toHaveURL(/\/cheatsheets\/git$/);
});

test("複製の列は読み上げと Tab の対象にならない", async ({ page }) => {
  await page.goto("/");
  const links = featured(page).getByRole("link");
  const catalogLinks = page.getByRole("region", { name: "チートシート一覧" }).getByRole("link");
  await expect(links).toHaveCount(await catalogLinks.count());

  // 1本目の最後のカードから Tab で進むと、複製のカードを飛ばして一時停止ボタンへ移る。
  // フォーカスが中にある間は流れが止まり、見えていないカードは枠ごと横にスクロールして見せる。
  await links.last().focus();
  await expect(track(page)).toHaveCSS("animation-play-state", "paused");
  const viewport = () => track(page).evaluate((el) => el.parentElement!.scrollLeft);
  expect(await viewport()).toBeGreaterThan(0);

  await page.keyboard.press("Tab");
  await expect(featured(page).getByRole("button", { name: "一時停止" })).toBeFocused();
  // 枠の外へ出たら、スクロールのずれを戻して流れの位置と合わせる。
  expect(await viewport()).toBe(0);
});

test("検索中は出さず、検索語を消すと戻る", async ({ page }) => {
  // 検索欄と結果の間に挟まると、結果が画面の下へ押し出されるため。
  await page.goto("/");
  await expect(featured(page)).toBeVisible();

  await page.getByRole("searchbox").fill("Git");
  await expect(featured(page)).toBeHidden();

  await page.getByRole("searchbox").fill("");
  await expect(featured(page)).toBeVisible();
});

test("動きを減らす設定では流さず、横スクロールで最後まで見られる", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(track(page)).toHaveCSS("animation-name", "none");
  await expect(featured(page).getByRole("button", { name: "一時停止" })).toBeHidden();

  // 縦は先に画面内へ入れ、見切れの判定を横のスクロールだけに絞る（1280×720 では
  // 縦のスクロールが1px未満の端数を残し、カードの下端がわずかに画面外に出る）。
  await featured(page).scrollIntoViewIfNeeded();
  const last = featured(page).getByRole("link").last();
  await expect(last).not.toBeInViewport();
  await last.scrollIntoViewIfNeeded();
  await expect(last).toBeInViewport({ ratio: 1 });
});

test("スマホ幅では画面の端まで広げても、ページが横にはみ出さない", async ({ page }) => {
  // スマホ幅では枠を左右の余白ぶん外へ広げている。広げすぎるとページごと横に揺れる。
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await expect(featured(page)).toBeVisible();
  const [scrollWidth, innerWidth] = await page.evaluate(() => [
    document.documentElement.scrollWidth,
    window.innerWidth,
  ]);
  expect(scrollWidth).toBe(innerWidth);
});
