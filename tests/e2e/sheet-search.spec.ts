/**
 * シート内検索の回帰テスト。
 *
 * 入力欄の値はローカルstateが持ち、URLの `?q=` へは打鍵ごとに書く（IME変換の
 * 未確定中だけは書かず、確定時に1回）。URLが動いたらそこから取り直す。
 * この二重管理は「入力の追随」と「URLとの整合」が壊れやすく、実際に何度も
 * 壊しているので、壊れ方ごとにケースを固定してある。
 *
 * ロケータは getByRole を優先する。クラス名やDOM構造の変更で壊れず、
 * 支援技術から見た名前が保たれているかも同時に検証できるため。
 */
import { expect, test } from "@playwright/test";

const SHEET = "/cheatsheets/html";

/** 検索欄の右に出る件数表示。絞り込みが実際に効いたかはこの文言で見る。 */
function resultLabel(page: import("@playwright/test").Page) {
  return page.getByText(/\d+ セクション \/ \d+ 項目/);
}

/**
 * IMEでの変換をブラウザ上で再現する。
 *
 * PlaywrightのキーボードAPIは合成イベントを出さないため、実際のIMEが出す
 * compositionstart → input(isComposing) → 確定 という流れをネイティブsetter経由で
 * 組み立てる。確定時の input と compositionend の前後を inputBeforeEnd で
 * 入れ替えられるようにしてあるのは、この順序が環境によって異なり、
 * 過去に片方の順序でだけ壊れたことがあるため。
 */
async function typeWithIme(
  page: import("@playwright/test").Page,
  steps: string[],
  confirmed: string,
  inputBeforeEnd: boolean,
) {
  await page.evaluate(
    async ({ steps, confirmed, inputBeforeEnd }) => {
      const el = document.querySelector<HTMLInputElement>('input[type="search"]');
      if (!el) throw new Error("search input not found");
      const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
      el.focus();
      el.dispatchEvent(new CompositionEvent("compositionstart", { bubbles: true }));
      for (const step of steps) {
        el.dispatchEvent(new CompositionEvent("compositionupdate", { bubbles: true, data: step }));
        setValue.call(el, step);
        el.dispatchEvent(new InputEvent("input", { bubbles: true, data: step, isComposing: true }));
        await new Promise((resolve) => setTimeout(resolve, 20));
      }
      setValue.call(el, confirmed);
      const fireInput = () =>
        el.dispatchEvent(
          new InputEvent("input", { bubbles: true, data: confirmed, isComposing: false }),
        );
      const fireEnd = () =>
        el.dispatchEvent(
          new CompositionEvent("compositionend", { bubbles: true, data: confirmed }),
        );
      if (inputBeforeEnd) {
        fireInput();
        fireEnd();
      } else {
        fireEnd();
        fireInput();
      }
    },
    { steps, confirmed, inputBeforeEnd },
  );
}

test("目次アンカーを挟んで戻ると、URLと入力欄・絞り込みが一致する", async ({ page }) => {
  // 目次は素の <a href="#id"> なので同一ルート上に履歴エントリが積まれる。
  // 初期値だけをURLから取る実装だと、ここで表示とURLが食い違った。
  await page.goto(SHEET);
  await page.getByRole("searchbox").fill("form");
  await expect(page).toHaveURL(/\?q=form/);

  // ここは href が `#` 始まりであること自体が検証の前提なので、role ではなく
  // 属性で絞る（同じ目次内に「一覧へ戻る」リンクも並んでいる）。
  await page.getByRole("complementary").locator('a[href^="#"]').first().click();
  await expect(page).toHaveURL(/\?q=form#/);

  await page.keyboard.press("Escape");
  await expect(page).not.toHaveURL(/q=form/);

  await page.goBack();
  await expect(page).toHaveURL(/\?q=form/);
  await expect(page.getByRole("searchbox")).toHaveValue("form");
  await expect(resultLabel(page)).toHaveText("2 セクション / 2 項目");
});

test("?q= 付きで開いて目次アンカーを挟んで戻っても、URLと表示が一致する", async ({ page }) => {
  // 入力せずに `?q=` 付きで開くと、最初の履歴エントリは history.state に key を
  // 持たない（location.key が "default" 固定になる）。エントリの識別に頼る実装は
  // ここで同期を取りこぼすため、打ってから遷移するケースとは別に固定しておく。
  await page.goto(`${SHEET}?q=form`);
  await expect(page.getByRole("searchbox")).toHaveValue("form");

  await page.getByRole("complementary").locator('a[href^="#"]').first().click();
  await expect(page).toHaveURL(/\?q=form#/);

  await page.keyboard.press("Escape");
  await expect(page).not.toHaveURL(/q=form/);

  await page.goBack();
  await expect(page).toHaveURL(/\?q=form/);
  await expect(page.getByRole("searchbox")).toHaveValue("form");
  await expect(resultLabel(page)).toHaveText("2 セクション / 2 項目");
});

test("目次アンカーへ進むと、q の無いURLに合わせて絞り込みが解除される", async ({ page }) => {
  // replaceState は前方のエントリを切り詰めないので、アンカーのエントリは
  // 検索語を書いたあとも残る。進んだ先には `?q=` が無い。
  await page.goto(SHEET);
  await page.getByRole("complementary").locator('a[href^="#"]').first().click();
  await expect(page).toHaveURL(/#/);

  await page.goBack();
  await page.getByRole("searchbox").fill("form");
  await expect(page).toHaveURL(/\?q=form/);
  await expect(resultLabel(page)).toHaveText("2 セクション / 2 項目");

  await page.goForward();
  await expect(page).not.toHaveURL(/q=form/);
  await expect(page.getByRole("searchbox")).toHaveValue("");
  await expect(resultLabel(page)).toHaveText("10 セクション / 101 項目");
});

test("シートを切り替えると検索語が持ち越されない", async ({ page }) => {
  await page.goto(SHEET);
  await page.getByRole("searchbox").fill("form");
  await expect(page).toHaveURL(/\?q=form/);

  await page.getByRole("banner").getByRole("link", { name: "Git" }).click();
  await expect(page).not.toHaveURL(/q=/);
  await expect(page.getByRole("searchbox")).toHaveValue("");
});

test("検索語を書き換えても目次アンカーの hash が落ちない", async ({ page }) => {
  await page.goto(`${SHEET}#semantic`);
  await page.getByRole("searchbox").fill("form");
  await expect(page).toHaveURL(/#semantic$/);
});

test("目次アンカーを踏んだ直後に入力しても hash が落ちない", async ({ page }) => {
  // react-router は location の更新を startTransition で流すので、アンカーを踏んだ
  // 直後はコミット済みの location.hash がまだ空。そこを見て書くと `#id` が落ちる。
  // 待ちを入れずに input を出して、その窓を踏みにいく。
  await page.goto(SHEET);
  await page.getByRole("complementary").locator('a[href^="#"]').first().click();
  await expect(page).toHaveURL(/#/);

  await page.evaluate(() => {
    const el = document.querySelector<HTMLInputElement>('input[type="search"]');
    if (!el) throw new Error("search input not found");
    const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
    el.focus();
    setValue.call(el, "form");
    el.dispatchEvent(new InputEvent("input", { bubbles: true, data: "form" }));
  });

  await expect(page).toHaveURL(/\?q=form#/);
});

test("同じシートのリンクを踏むと、q の消えたURLに合わせて絞り込みも解除される", async ({
  page,
}) => {
  // ルーターの push では popstate が飛ばず、slug が同じなので key による作り直しも
  // 起きない。URLだけ ?q= が消えて絞り込みが残る、という食い違いが起きやすい経路。
  await page.goto(`${SHEET}?q=form`);
  await expect(resultLabel(page)).toHaveText("2 セクション / 2 項目");

  await page.getByRole("banner").getByRole("link", { name: "HTML" }).click();
  await expect(page).not.toHaveURL(/q=/);
  await expect(page.getByRole("searchbox")).toHaveValue("");
  await expect(resultLabel(page)).toHaveText("10 セクション / 101 項目");
});

test("打った直後に同じシートのリンクを踏んでも、URLと表示が食い違わない", async ({ page }) => {
  // リンクの遷移と直前の書き込みが同じトランジションにまとめられ、ルーターの
  // location が変化しないまま終わることがある。ルーターの location ではなく
  // window.location を正として突き合わせることで解決している。
  await page.goto(SHEET);
  await page.getByRole("searchbox").focus();
  await page.keyboard.type("form", { delay: 20 });
  await page.getByRole("banner").getByRole("link", { name: "HTML" }).click();

  await expect(page).not.toHaveURL(/q=/);
  await expect(page.getByRole("searchbox")).toHaveValue("");
  await expect(resultLabel(page)).toHaveText("10 セクション / 101 項目");

  // 続けて目次アンカーを踏んでも、消えた検索語が戻ってこないこと。
  await page.getByRole("complementary").locator('a[href^="#"]').first().click();
  await expect(page.getByRole("searchbox")).toHaveValue("");
  await expect(resultLabel(page)).toHaveText("10 セクション / 101 項目");
});

test("打った直後に目次アンカーを踏んでも検索語が消えない", async ({ page }) => {
  // アンカーのクリックは popstate を起こし、そこでURLから取り直す。打鍵ごとに
  // URLへ書いているので、取り直しても直前に打った検索語がそのまま返ってくる。
  await page.goto(SHEET);
  await page.getByRole("searchbox").focus();
  await page.keyboard.type("form", { delay: 20 });
  await page.getByRole("complementary").locator('a[href^="#"]').first().click();

  await expect(page.getByRole("searchbox")).toHaveValue("form");
  await expect(resultLabel(page)).toHaveText("2 セクション / 2 項目");
  await expect(page).toHaveURL(/\?q=form#/);
});

test("打った直後にページを離れても、戻れば検索語が復元される", async ({ page }) => {
  // 打鍵ごとにURLへ書いているので、離脱の直前まで打った内容がURLに載っている。
  await page.goto(SHEET);
  await page.getByRole("searchbox").focus();
  await page.keyboard.type("form", { delay: 20 });
  await page.getByRole("complementary").getByRole("link", { name: /一覧/ }).click();
  await expect(page).toHaveURL(/\/$/);

  await page.goBack();
  await expect(page).toHaveURL(/\?q=form/);
  await expect(page.getByRole("searchbox")).toHaveValue("form");
});

test("リンクを押した直後に Escape を叩いても、離れようとしたシートへ戻されない", async ({
  page,
}) => {
  // Escape は window の keydown で拾うので、遷移中でも離れる側のレイアウトが反応する。
  // navigate に pathname を渡さないと、ルーターの遅れた location からパスが補完され、
  // 移動前のパスでURLを書き直して遷移そのものを取り消してしまう。
  await page.goto(SHEET);
  await page.getByRole("banner").getByRole("link", { name: "Git" }).click();
  await page.keyboard.press("Escape");

  await expect(page).toHaveURL(/\/cheatsheets\/git/);
  await expect(page.getByRole("heading", { name: /Git/ }).first()).toBeVisible();
});

test("検索していない状態の Escape では履歴に書き込まない", async ({ page }) => {
  // 同じURLを書き直すだけの呼び出しは、ブラウザの履歴書き込み回数の上限を
  // 無駄に消費する。
  await page.goto(SHEET);
  await page.evaluate(() => {
    (window as unknown as { __writes: number }).__writes = 0;
    const original = history.replaceState.bind(history);
    history.replaceState = (...args: Parameters<typeof history.replaceState>) => {
      (window as unknown as { __writes: number }).__writes += 1;
      return original(...args);
    };
  });

  for (let i = 0; i < 5; i += 1) await page.keyboard.press("Escape");
  expect(await page.evaluate(() => (window as unknown as { __writes: number }).__writes)).toBe(0);

  // 実際に検索語があるときは、これまでどおりクリアされる。
  await page.getByRole("searchbox").fill("form");
  await expect(page).toHaveURL(/\?q=form/);
  await page.keyboard.press("Escape");
  await expect(page).not.toHaveURL(/q=/);
  await expect(page.getByRole("searchbox")).toHaveValue("");
});

test("IME変換中は履歴に書き込まず、確定時に1回だけ書く", async ({ page }) => {
  // 日本語入力では確定前のローマ字1打ごとに input イベントが飛ぶ。そのまま書くと
  // 短い語をいくつか打つだけでブラウザの履歴書き込み上限に近づく。
  await page.goto(SHEET);
  await page.evaluate(() => {
    (window as unknown as { __writes: number }).__writes = 0;
    const original = history.replaceState.bind(history);
    history.replaceState = (...args: Parameters<typeof history.replaceState>) => {
      (window as unknown as { __writes: number }).__writes += 1;
      return original(...args);
    };
  });

  await typeWithIme(page, ["ひ", "ひょ", "ひょう"], "表", true);
  await expect(page.getByRole("searchbox")).toHaveValue("表");
  await expect(page).toHaveURL(/\?q=%E8%A1%A8/);
  expect(await page.evaluate(() => (window as unknown as { __writes: number }).__writes)).toBe(1);
});

test("履歴の書き込みが拒否されても、打った文字が巻き戻らない", async ({ page }) => {
  // Safari は replaceState を「30秒あたり約100回」で打ち切り SecurityError を投げる。
  // URLは進まなくなるが、入力欄はローカルstateなので打てるままであること。
  // 検出と値をどちらもURLの購読から取っているので、URLが動かない間は取り込みも起きない。
  await page.goto(SHEET);
  await page.getByRole("searchbox").focus();
  await page.keyboard.type("for", { delay: 40 });
  await expect(page).toHaveURL(/\?q=for$/);

  await page.evaluate(() => {
    history.replaceState = () => {
      throw new DOMException("throttled", "SecurityError");
    };
  });
  await page.keyboard.type("mat", { delay: 40 });

  await expect(page.getByRole("searchbox")).toHaveValue("format");
  await expect(page).toHaveURL(/\?q=for$/);
});

for (const inputBeforeEnd of [true, false]) {
  const order = inputBeforeEnd ? "input→compositionend" : "compositionend→input";
  test(`IME変換（${order}）で確定した日本語が入力欄に残り、絞り込みに使われる`, async ({
    page,
  }) => {
    // 変換中に onChange を止める実装にしたところ、この順序の片方で確定文字が
    // 消え、変換を中断するとその後の入力もペーストも効かなくなった。
    await page.goto(SHEET);
    await typeWithIme(page, ["ひ", "ひょ", "ひょう"], "表", inputBeforeEnd);
    await expect(page.getByRole("searchbox")).toHaveValue("表");
    await expect(page).toHaveURL(/\?q=%E8%A1%A8/);
    await expect(resultLabel(page)).not.toHaveText("10 セクション / 101 項目");
  });
}

test("変換を中断したあとも通常の入力とペーストができる", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto(SHEET);

  // compositionstart だけ起きて compositionend が来ない状況を作る。
  await page.evaluate(() => {
    const el = document.querySelector<HTMLInputElement>('input[type="search"]');
    el?.focus();
    el?.dispatchEvent(new CompositionEvent("compositionstart", { bubbles: true }));
  });

  await page.getByRole("searchbox").focus();
  await page.keyboard.type("meta");
  await expect(page.getByRole("searchbox")).toHaveValue("meta");

  await page.getByRole("searchbox").fill("");
  await page.evaluate(() => navigator.clipboard.writeText("表"));
  await page.getByRole("searchbox").focus();
  await page.keyboard.press("ControlOrMeta+v");
  await expect(page.getByRole("searchbox")).toHaveValue("表");
});

test("速く打っても文字が落ちない", async ({ page }) => {
  // 入力欄の value を非同期なURL往復で駆動していたときは "meta" が "a" になった。
  await page.goto(SHEET);
  await page.getByRole("searchbox").focus();
  await page.keyboard.type("meta", { delay: 0 });
  await expect(page.getByRole("searchbox")).toHaveValue("meta");
  await expect(page).toHaveURL(/\?q=meta/);
});

test("空白のみの入力は消されず、絞り込みもかからない", async ({ page }) => {
  // 日本語入力はスペースを変換キーに使うため、打ったスペースが消えてはいけない。
  await page.goto(SHEET);
  await page.getByRole("searchbox").focus();
  await page.keyboard.type("  ");
  await expect(page.getByRole("searchbox")).toHaveValue("  ");
  await expect(resultLabel(page)).toHaveText("10 セクション / 101 項目");
});

test("?q= 付きURLを直接開くと絞り込まれた状態で復元される", async ({ page }) => {
  await page.goto(`${SHEET}?q=form`);
  await expect(page.getByRole("searchbox")).toHaveValue("form");
  await expect(resultLabel(page)).toHaveText("2 セクション / 2 項目");
});
