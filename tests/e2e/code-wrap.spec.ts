/**
 * コード枠の折り返しのE2Eテスト。
 *
 * ブラウザはハイフンの直後を折り返せる場所として扱うため（UAX #14）、幅の狭い画面では
 * `position-anchor: --menu;` が `--` と `menu;` に分かれ、`--` が別の値のように見えてしまう。
 * CodeBlock はハイフンとその次の1文字を折り返さない span でくくってこれを止めているが、
 * どこで折り返されたかは描画してみないと分からないので、いちばん狭い 375px でこのテストで確かめる。
 * あわせて、入りきらない長いコマンドやURLがこれまでどおり枠の中に折り返されることも見る。
 */
import { expect, test } from "@playwright/test";

test("375px 幅で、コードがハイフンの直後で折り返されず、枠からもはみ出さない", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto("/");
  const paths = await page
    .getByRole("region", { name: "チートシート一覧" })
    .getByRole("link")
    .evaluateAll((links) => links.map((link) => link.getAttribute("href")!));

  for (const path of paths) {
    await page.goto(path);
    const result = await page.evaluate(() => {
      // 文字を1つずつ測り、同じ高さに並ぶものをまとめて、実際に描画された行を組み立てる。
      function renderedLines(root: Element): string[] {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        const lines: { top: number; text: string }[] = [];
        let node: Node | null;
        while ((node = walker.nextNode())) {
          const text = node.textContent ?? "";
          for (let i = 0; i < text.length; i++) {
            const range = document.createRange();
            range.setStart(node, i);
            range.setEnd(node, i + 1);
            const top = Math.round(range.getBoundingClientRect().top);
            const last = lines.at(-1);
            if (!last || Math.abs(top - last.top) > 2) lines.push({ top, text: text[i] });
            else last.text += text[i];
          }
        }
        return lines.map((line) => line.text);
      }

      const badBreaks: string[] = [];
      const overflowing: string[] = [];
      for (const code of document.querySelectorAll("code")) {
        if (code.scrollWidth > code.clientWidth + 1) overflowing.push(code.textContent ?? "");
        // 複数行のコードは1行ずつ span に分かれているので、その単位で見る。
        // こうしないと、元のコードの改行を折り返しと取り違えてしまう。
        const rows = [...code.children].filter((el) => getComputedStyle(el).display === "block");
        for (const row of rows.length > 0 ? rows : [code]) {
          const lines = renderedLines(row);
          for (let i = 0; i < lines.length - 1; i++) {
            // 語の途中がハイフンで切れた行。続きがハイフンのときは `---` のような区切り線なので数えない。
            if (/-$/.test(lines[i]) && /^[^\s-]/.test(lines[i + 1])) {
              badBreaks.push(`${lines[i]} / ${lines[i + 1]}`);
            }
          }
        }
      }
      return { badBreaks, overflowing };
    });
    expect(result, path).toEqual({ badBreaks: [], overflowing: [] });
  }
});
