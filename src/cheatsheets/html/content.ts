/**
 * HTMLチートシートのデータ。
 *
 * 表示側（components）はこの構造だけを見るので、ここに書いた順序がそのまま
 * 目次とページの並び順になる。項目は必ず helpers.ts の item() で生成する。
 *
 *   item(id, label, syntax, description, note?, status?, keywords?)
 *
 * - id はシート内で一意。目次のアンカー（#id）とReactのkeyに使われる
 * - status は normal / info / warning / danger。省略時は normal
 * - keywords は検索用の別名。全角/半角・大文字小文字は normalizeSearch が吸収する
 * - 内容を直したら updatedAt も更新する
 */
import { item } from "../helpers";
import type { CheatSheet } from "../types";

export const htmlCheatSheet: CheatSheet = {
  id: "html-reference",
  slug: "html",
  title: "HTMLタグ チートシート",
  shortTitle: "HTML",
  description:
    "文書構造、テキスト、メディア、フォーム、アクセシビリティまでをすばやく確認できるHTMLリファレンス。",
  eyebrow: "Markup language",
  accent: "#6f4cff",
  keywords: ["html", "タグ", "マークアップ", "フォーム", "アクセシビリティ"],
  updatedAt: "2026-08-18",
  sources: [{ label: "HTML Living Standard", url: "https://html.spec.whatwg.org/multipage/" }],
  sections: [
    // ページの外枠。ブラウザと検索エンジンが最初に読む部分から並べる。
    {
      id: "document",
      title: "文書構造・メタ情報",
      description: "ページ全体の骨組みと、ブラウザ・検索エンジン向けの情報。",
      items: [
        item(
          "doctype",
          "<!doctype html>",
          "<!doctype html>",
          "HTML文書であることを宣言する。",
          "必ず文書の先頭に記述。",
          "info",
        ),
        item(
          "html",
          "<html>",
          '<html lang="ja">…</html>',
          "HTML文書のルート要素。",
          "langで主言語を指定。",
        ),
        item("head", "<head>", "<head>…</head>", "画面に直接表示しない文書情報を格納する。"),
        item("body", "<body>", "<body>…</body>", "画面に表示するコンテンツを格納する。"),
        item(
          "title",
          "<title>",
          "<title>ページタイトル</title>",
          "ブラウザタブや検索結果に使われるタイトル。",
        ),
        item(
          "meta-charset",
          "<meta charset>",
          '<meta charset="utf-8">',
          "文字エンコーディングを指定する。",
          "headの早い位置へ。",
        ),
        item(
          "meta-viewport",
          "<meta viewport>",
          '<meta name="viewport" content="width=device-width, initial-scale=1">',
          "モバイル表示領域を設定する。",
        ),
        item(
          "meta-description",
          "<meta description>",
          '<meta name="description" content="ページの説明">',
          "ページ内容の要約を提供する。",
        ),
        item(
          "link",
          "<link>",
          '<link rel="stylesheet" href="style.css">',
          "CSSやアイコンなど外部リソースを関連付ける。",
        ),
        item("style", "<style>", "<style>p { color: navy; }</style>", "文書内にCSSを記述する。"),
        item(
          "script",
          "<script>",
          '<script src="app.js" defer></script>',
          "JavaScriptを読み込む／記述する。",
          "外部スクリプトはdeferを検討。",
        ),
        item(
          "noscript",
          "<noscript>",
          "<noscript>JavaScriptが必要です</noscript>",
          "JavaScriptが無効な場合の代替内容。",
        ),
      ],
    },
    // 見た目ではなく役割で組む要素。div の代わりに何を使うかの判断材料。
    {
      id: "semantic",
      title: "セマンティック構造",
      description: "見た目ではなく、コンテンツの役割を表現する。",
      items: [
        item("header", "<header>", "<header>…</header>", "ページまたはセクションの導入部。"),
        item(
          "nav",
          "<nav>",
          '<nav aria-label="主要メニュー">…</nav>',
          "主要なナビゲーション。",
          "複数ある場合はラベルを付ける。",
          "info",
        ),
        item(
          "search",
          "<search>",
          "<search><form>…</form></search>",
          "検索・絞り込み操作のまとまり。",
        ),
        item(
          "main",
          "<main>",
          "<main>…</main>",
          "ページ固有の中心コンテンツ。",
          "通常、可視ページ内に1つ。",
          "info",
        ),
        item(
          "section",
          "<section>",
          "<section><h2>見出し</h2>…</section>",
          "見出しを伴う主題ごとのまとまり。",
        ),
        item("article", "<article>", "<article>…</article>", "単独で配布・再利用できる内容。"),
        item("aside", "<aside>", "<aside>補足情報</aside>", "本文と間接的に関係する補足。"),
        item("footer", "<footer>", "<footer>…</footer>", "ページまたはセクションの末尾情報。"),
        item(
          "address",
          "<address>",
          "<address>contact@example.com</address>",
          "直近の文書・記事に関する連絡先。",
        ),
        item(
          "headings",
          "<h1>〜<h6>",
          "<h2>セクション見出し</h2>",
          "見出しレベルを表す。",
          "論理的な階層順で使う。",
          "info",
        ),
        item(
          "hgroup",
          "<hgroup>",
          "<hgroup><h1>題名</h1><p>副題</p></hgroup>",
          "見出しと副題・タグラインをまとめる。",
        ),
      ],
    },
    // 段落・見出しから、強調や引用などのインライン要素まで。
    {
      id: "text",
      title: "テキスト・文章",
      description: "文章の構造や意味を表すブロック／インライン要素。",
      items: [
        item("p", "<p>", "<p>本文です。</p>", "段落。"),
        item(
          "br",
          "<br>",
          "東京都<br>千代田区",
          "意味のある改行。",
          "余白目的には使わない。",
          "warning",
        ),
        item("hr", "<hr>", "<hr>", "話題や場面の区切り。"),
        item("strong", "<strong>", "<strong>必須</strong>", "重要性・緊急性が高い内容。"),
        item("em", "<em>", "<em>今すぐ</em>", "文脈上の強調。"),
        item("mark", "<mark>", "検索結果：<mark>HTML</mark>", "関連性によるハイライト。"),
        item("small", "<small>", "<small>税込価格</small>", "注記、免責、著作権など。"),
        item("s", "<s>", "<s>5,000円</s>", "現在は正しくない／有効でない内容。"),
        item(
          "del-ins",
          "<del> / <ins>",
          "<del>旧</del> <ins>新</ins>",
          "削除／追加された変更内容。",
        ),
        item("sub-sup", "<sub> / <sup>", "H<sub>2</sub>O / x<sup>2</sup>", "下付き／上付き。"),
        item("code", "<code>", "<code>npm run dev</code>", "短いコード断片。"),
        item("pre", "<pre>", "<pre><code>…</code></pre>", "空白や改行を保持した整形済みテキスト。"),
        item("kbd", "<kbd>", "<kbd>Ctrl</kbd> + <kbd>C</kbd>", "ユーザーが入力するキーや操作。"),
        item(
          "quote",
          "<q> / <blockquote>",
          '<blockquote cite="URL">…</blockquote>',
          "短い引用／まとまった引用。",
        ),
        item(
          "abbr",
          "<abbr>",
          '<abbr title="HyperText Markup Language">HTML</abbr>',
          "略語・頭字語。",
        ),
        item(
          "time",
          "<time>",
          '<time datetime="2026-08-18">8月18日</time>',
          "機械可読な日付・時刻。",
        ),
        item(
          "ruby",
          "<ruby> / <rt> / <rp>",
          "<ruby>漢字<rt>かんじ</rt></ruby>",
          "ルビと読みを表す。",
        ),
        item("span", "<span>", '<span class="label">新着</span>', "意味を持たないインラインの箱。"),
        item("wbr", "<wbr>", "verylong<wbr>identifier", "長い語の改行候補位置。"),
      ],
    },
    // リストと、その仲間である説明リスト・図表のまとまり。
    {
      id: "grouping",
      title: "グループ・リスト",
      description: "関連する要素をまとめ、順序や用語の関係を表す。",
      items: [
        item("div", "<div>", '<div class="card">…</div>', "意味を持たないブロックの箱。"),
        item("ul", "<ul>", "<ul><li>項目</li></ul>", "順序に意味がないリスト。"),
        item("ol", "<ol>", "<ol><li>手順</li></ol>", "順序に意味があるリスト。"),
        item("li", "<li>", "<li>項目</li>", "ul、ol、menuのリスト項目。"),
        item(
          "dl",
          "<dl> / <dt> / <dd>",
          "<dl><dt>HTML</dt><dd>…</dd></dl>",
          "用語と説明、名前と値の組。",
        ),
        item(
          "figure",
          "<figure>",
          "<figure>…<figcaption>図1</figcaption></figure>",
          "本文から参照される自己完結した図版。",
        ),
        item(
          "figcaption",
          "<figcaption>",
          "<figcaption>図1：構成図</figcaption>",
          "figureのキャプション。",
        ),
        item(
          "menu",
          "<menu>",
          "<menu><li><button>保存</button></li></menu>",
          "操作コマンドのリスト。",
        ),
      ],
    },
    // リンクと埋め込みメディア。代替テキストや遅延読み込みの指定を含む。
    {
      id: "media",
      title: "リンク・画像・メディア",
      description: "別ページへの移動と画像・音声・動画の表示。",
      items: [
        item(
          "a",
          "<a>",
          '<a href="/about">概要</a>',
          "ハイパーリンク。",
          "移動にはbuttonではなくaを使う。",
        ),
        item(
          "external-link",
          "外部リンク",
          '<a href="https://example.com" target="_blank" rel="noopener noreferrer">公式サイト</a>',
          "新しいタブで安全に外部ページを開く。",
        ),
        item(
          "img",
          "<img>",
          '<img src="photo.webp" alt="湖畔の白い家" width="960" height="640">',
          "画像。",
          "意味のある画像には具体的なalt。",
          "info",
        ),
        item(
          "decorative-img",
          "装飾画像",
          '<img src="shape.svg" alt="" aria-hidden="true">',
          "読み上げ不要な装飾画像。",
        ),
        item(
          "picture",
          "<picture>",
          '<picture><source srcset="photo.avif" type="image/avif"><img src="photo.webp" alt="…"></picture>',
          "形式や画面条件に応じて画像を切り替える。",
        ),
        item("audio", "<audio>", '<audio src="audio.mp3" controls></audio>', "音声プレーヤー。"),
        item(
          "video",
          "<video>",
          '<video src="movie.mp4" controls poster="cover.webp"></video>',
          "動画プレーヤー。",
        ),
        item(
          "track",
          "<track>",
          '<track kind="captions" src="ja.vtt" srclang="ja" label="日本語">',
          "字幕、キャプション、チャプター。",
        ),
        item(
          "iframe",
          "<iframe>",
          '<iframe src="https://example.com" title="埋め込み内容" loading="lazy"></iframe>',
          "別のHTMLページを埋め込む。",
          "titleとsandboxを検討。",
          "warning",
        ),
      ],
    },
    // 表。レイアウト目的での使用を避ける旨は description に明記している。
    {
      id: "tables",
      title: "テーブル",
      description: "行と列の関係を持つデータに使用する。レイアウト目的には使わない。",
      items: [
        item("table", "<table>", "<table>…</table>", "表全体。"),
        item(
          "caption",
          "<caption>",
          "<caption>プラン比較</caption>",
          "表のタイトル／説明。",
          "tableの最初の子にする。",
          "info",
        ),
        item(
          "table-groups",
          "<thead> / <tbody> / <tfoot>",
          "<thead>…</thead><tbody>…</tbody>",
          "ヘッダー／本体／フッターの行群。",
        ),
        item("tr", "<tr>", "<tr>…</tr>", "表の1行。"),
        item(
          "th",
          "<th>",
          '<th scope="col">月額</th>',
          "見出しセル。",
          "scopeで列・行との関係を示す。",
          "info",
        ),
        item("td", "<td>", "<td>¥980</td>", "データセル。"),
        item(
          "colspan",
          "colspan / rowspan",
          '<td colspan="2">合計</td>',
          "セルを列方向／行方向へ結合する。",
          "複雑化し過ぎない。",
          "warning",
        ),
      ],
    },
    // フォーム。項目数が多いので、要素 → 入力タイプ → 補助要素の順に並べる。
    {
      id: "forms",
      title: "フォーム",
      description: "入力欄には見えるラベルと適切な入力タイプを付ける。",
      items: [
        item(
          "form",
          "<form>",
          '<form action="/contact" method="post">…</form>',
          "入力・送信範囲。",
        ),
        item(
          "label",
          "<label>",
          '<label for="email">メール</label>',
          "入力欄の名前。",
          "forと入力欄のidを一致。",
          "info",
        ),
        item(
          "input-text",
          '<input type="text">',
          '<input id="name" name="name" type="text" autocomplete="name">',
          "1行の文字入力。",
        ),
        item(
          "input-email",
          '<input type="email">',
          '<input id="email" name="email" type="email" required>',
          "メールアドレス入力。",
        ),
        item(
          "input-check",
          "checkbox / radio",
          '<input id="agree" name="agree" type="checkbox">',
          "複数選択／単一選択。",
        ),
        item(
          "input-date",
          "date / time / number",
          '<input name="date" type="date">',
          "日付、時刻、数値に適した入力UI。",
        ),
        item(
          "textarea",
          "<textarea>",
          '<textarea id="message" name="message" rows="5"></textarea>',
          "複数行入力。",
        ),
        item(
          "select",
          "<select> / <option>",
          '<select name="plan"><option value="basic">Basic</option></select>',
          "選択メニューと選択肢。",
        ),
        item(
          "button",
          "<button>",
          '<button type="submit">送信</button>',
          "操作ボタン。",
          "typeを明示する。",
          "info",
        ),
        item(
          "fieldset",
          "<fieldset> / <legend>",
          "<fieldset><legend>通知方法</legend>…</fieldset>",
          "関連入力のグループとグループ名。",
        ),
        item(
          "datalist",
          "<datalist>",
          '<input list="cities"><datalist id="cities"><option value="東京"></datalist>',
          "入力候補リスト。",
        ),
        item(
          "progress",
          "<progress>",
          '<progress value="70" max="100">70%</progress>',
          "処理の進捗。",
        ),
        item(
          "meter",
          "<meter>",
          '<meter min="0" max="100" value="72">72</meter>',
          "既知範囲内の測定値。",
        ),
      ],
    },
    // JavaScript無しでも動く対話要素と、埋め込み系の要素。
    {
      id: "interactive",
      title: "埋め込み・対話要素",
      description: "開閉UI、ダイアログ、テンプレートなど。",
      items: [
        item(
          "details",
          "<details> / <summary>",
          "<details><summary>詳しい説明</summary><p>追加情報</p></details>",
          "ネイティブな開閉UI。",
        ),
        item(
          "dialog",
          "<dialog>",
          '<dialog id="confirm">…</dialog>',
          "ダイアログ／モーダル。",
          "showModal()で開く。",
        ),
        item(
          "popover",
          "Popover API",
          '<button popovertarget="help">ヘルプ</button><div id="help" popover>…</div>',
          "軽量なポップオーバーUI。",
        ),
        item(
          "canvas",
          "<canvas>",
          '<canvas width="640" height="360">代替内容</canvas>',
          "JavaScriptで描画するビットマップ領域。",
        ),
        item(
          "svg",
          "<svg>",
          '<svg viewBox="0 0 24 24" aria-hidden="true">…</svg>',
          "ベクター画像を文書内に埋め込む。",
        ),
        item(
          "template",
          "<template>",
          '<template id="card-template">…</template>',
          "初期表示されない再利用用HTML。",
        ),
        item("slot", "<slot>", '<slot name="title"></slot>', "Web Componentsの差し込み口。"),
      ],
    },
    // 要素を問わず使える属性。アクセシビリティに関わるものを優先して並べる。
    {
      id: "attributes",
      title: "主要なグローバル属性",
      description: "ほぼすべてのHTML要素で利用できる属性。",
      items: [
        item("id", "id", 'id="profile"', "文書内で一意の識別子。"),
        item("class", "class", 'class="card featured"', "CSS／JavaScript用の分類名。"),
        item("lang", "lang", 'lang="ja"', "要素内容の言語。"),
        item("hidden", "hidden", "<div hidden>…</div>", "要素を非表示にする真偽属性。"),
        item(
          "tabindex",
          "tabindex",
          'tabindex="0" / tabindex="-1"',
          "キーボードフォーカスを制御する。",
          "正の値は原則避ける。",
          "warning",
        ),
        item("data", "data-*", 'data-user-id="42"', "独自データ属性。"),
        item(
          "contenteditable",
          "contenteditable",
          'contenteditable="true"',
          "内容を編集可能にする。",
        ),
        item("inert", "inert", "<section inert>…</section>", "配下を操作・フォーカス不可にする。"),
        item(
          "aria",
          "role / aria-*",
          'aria-label="メニューを閉じる"',
          "支援技術へ役割・状態を補足する。",
          "まずネイティブHTMLを使う。",
          "warning",
        ),
      ],
    },
    // 閉じタグを持たない空要素と、実装後に見直すチェック項目。
    {
      id: "quality",
      title: "空要素・品質チェック",
      description: "閉じタグのない要素と、実装時の確認ポイント。",
      items: [
        item(
          "void",
          "空要素",
          "area, base, br, col, embed, hr, img, input, link, meta, source, track, wbr",
          "子要素を持てず、終了タグを書かない要素。",
        ),
        item(
          "escape",
          "文字参照",
          "&lt; → &amp;lt; / &amp; → &amp;amp;",
          "HTML構文と衝突する文字を安全に表示する。",
        ),
        item(
          "alt-check",
          "画像の代替テキスト",
          'alt="説明" / alt=""',
          "意味のある画像は説明し、装飾画像は空にする。",
          undefined,
          "info",
        ),
        item(
          "label-check",
          "フォームラベル",
          '<label for="id">…</label>',
          "すべての入力欄へ認識可能な名前を付ける。",
          undefined,
          "info",
        ),
        item(
          "keyboard-check",
          "キーボード操作",
          "Tab / Enter / Space / Escape",
          "マウスなしで操作を完了できるようにする。",
          undefined,
          "info",
        ),
        item(
          "deprecated",
          "廃止タグ",
          "center, font, marquee, blink, frame, frameset, applet",
          "新規実装では現行HTMLとCSSへ置き換える。",
          undefined,
          "danger",
        ),
      ],
    },
  ],
};
