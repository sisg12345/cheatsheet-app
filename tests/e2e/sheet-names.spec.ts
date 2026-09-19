/**
 * シートの名前（カードの題名・詳細ページの背景の透かし）のE2Eテスト。
 *
 * 名前は "CC" のように省略せず "Claude Code" と正式名で出し、長い名前は枠の幅 ÷ 文字数で
 * 文字を縮めて収めている。1文字の幅は書体と字面で変わり CSS の計算だけでは保証できないので、
 * 画面幅ごとに全シートが枠からはみ出さないことをここで確かめる（820px は一覧が2列になる幅）。
 */
import { expect, test } from "@playwright/test";

for (const width of [1280, 820, 375]) {
  test(`${width}px 幅で、一覧と注目のチートシートのカードの題名がはみ出さない`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const cards = page
      .getByRole("region", { name: "チートシート一覧" })
      .getByRole("link")
      .or(page.getByRole("region", { name: "注目のチートシート" }).getByRole("link"));
    await expect(cards.first()).toBeVisible();

    // カードは overflow: hidden なので、中身がはみ出すと scrollWidth が clientWidth を超える
    // （説明は自分の中で省略記号に切り詰めるので、カードの幅は押し広げない）。
    const overflowing = await cards.evaluateAll((links) =>
      links
        .filter((link) => link.scrollWidth > link.clientWidth)
        .map((link) => link.getAttribute("href")),
    );
    expect(overflowing).toEqual([]);
  });

  test(`${width}px 幅で、詳細ページの透かしが見出しの幅に収まり、ページが横にはみ出さない`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const paths = await page
      .getByRole("region", { name: "チートシート一覧" })
      .getByRole("link")
      .evaluateAll((links) => links.map((link) => link.getAttribute("href")!));

    for (const path of paths) {
      await page.goto(path);
      const result = await page.evaluate(() => {
        const heading = document.querySelector("main h1")!.parentElement!;
        const watermark = heading.firstElementChild!;
        return {
          fits:
            watermark.getBoundingClientRect().right <= heading.getBoundingClientRect().right + 1,
          pageOverflow: document.documentElement.scrollWidth > window.innerWidth,
        };
      });
      expect(result, path).toEqual({ fits: true, pageOverflow: false });
    }
  });
}
