# CheatSheet Hub

HTMLタグ、Gitコマンドなど、複数の技術チートシートを検索・閲覧できるReactアプリです。現在はHTMLとGitを収録しています。

## 構成

- React 19
- TypeScript
- Vite 8
- CSS Modules
- React Router
- Atomic Design
- Storybook 10
- Vitest / Playwright
- Docker / Docker Compose

## ローカル開発

Node.js 22以上を使用します。

```bash
npm ci
npm run dev
```

`http://localhost:3000` で開きます。

## コマンド

| コマンド                  | 内容                   |
| ------------------------- | ---------------------- |
| `npm run dev`             | Vite開発サーバー       |
| `npm run build`           | 型チェックと本番ビルド |
| `npm run preview`         | 本番ビルドのプレビュー |
| `npm run typecheck`       | TypeScript型チェック   |
| `npm run lint`            | ESLint                 |
| `npm run lint:css`        | Stylelint              |
| `npm run format`          | Prettier整形           |
| `npm test`                | Vitest                 |
| `npm run test:coverage`   | Vitestカバレッジ       |
| `npm run test:e2e`        | Playwright             |
| `npm run storybook`       | Storybook開発サーバー  |
| `npm run build:storybook` | Storybook静的ビルド    |

## Docker

開発環境：

```bash
docker compose up --build app
```

本番ビルド相当：

```bash
docker compose --profile production up --build app-production
```

どちらも `http://localhost:3000` で確認できます。同時には起動しないでください。

## ディレクトリ構成

```text
cheatsheet-app/
├── .storybook/                     Storybook設定（stories収集とグローバル装飾）
├── src/
│   ├── cheatsheets/                ドメイン層：チートシートの型・データ・レジストリ
│   │   ├── types.ts                コンテンツ型の単一の定義元
│   │   ├── helpers.ts              データ記述用の item() ヘルパー
│   │   ├── registry.ts             収録シートの一覧と派生データ（辞書・サマリー）
│   │   ├── html/content.ts         HTMLシートの中身
│   │   └── git/content.ts          Gitシートの中身
│   ├── components/                 表示層：Atomic Designで階層化したUI
│   │   ├── atoms/                  Badge・Button（最小UI、状態を持たない）
│   │   ├── molecules/              CodeBlock・SearchBox（atomsの組み合わせ）
│   │   ├── organisms/              AppHeader・CheatSheetCard／Section／Sidebar（画面領域）
│   │   └── templates/              CatalogLayout・CheatSheetLayout（画面全体と状態の束ね役）
│   ├── features/                   機能層：画面をまたいで使う振る舞い
│   │   ├── cheat-sheet-search/     検索の絞り込みロジックとキーボードショートカット
│   │   ├── code-copy/              コード例のクリップボードコピー
│   │   └── theme-switch/           ライト／ダークの切り替えと保存キー
│   ├── lib/                        汎用層：どの機能にも依存しない純関数
│   │   ├── formatIndex.ts          0始まりindexを "01" 形式へ
│   │   └── normalizeSearch.ts      検索語の正規化（NFKC＋小文字化）と一致判定
│   ├── App.tsx                     ルーティングと404、ヘッダーの配置
│   ├── main.tsx                    エントリーポイント（Router／グローバルCSSの取り付け）
│   ├── styles.css                  デザイントークンと素の要素への最低限の調整
│   └── vite-env.d.ts               Vite用の型宣言
├── tests/
│   ├── unit/                       Vitest：純ロジックとフックの検証
│   ├── e2e/                        Playwright：ユーザー導線の検証
│   └── setup.ts                    jest-domマッチャの読み込み
├── Dockerfile                      開発・本番兼用のイメージ定義
├── compose.yaml                    app（開発）と app-production（本番相当）の起動定義
├── index.html                      HTMLの雛形と、描画前に走るテーマ初期化スクリプト
├── package.json
├── vite.config.ts                  開発サーバーと本番ビルド（`@` エイリアスの定義元）
├── vitest.config.ts                ユニットテスト（対象は tests/unit のみ）
└── playwright.config.ts            E2E（4173番でdevサーバーを自動起動）
```

## 各ディレクトリの責務

### `src/cheatsheets/` — ドメイン

チートシートというコンテンツそのものを定義する層です。

- `types.ts` がコンテンツ型の**単一の定義元**で、`components/` も `features/` もこの型だけを見ます。同じ形の型を各所で再定義しません。
- `registry.ts` が収録シートの単一の情報源です。ルーティングも一覧カードも、ここから派生する辞書（`cheatSheetRegistry`）とサマリー（`cheatSheetSummaries`）から自動的に組み立てられます。
- 項目の生成は `helpers.ts` の `item()` を通します。`content.ts` にオブジェクトリテラルを直書きしません。
- UIやReactには依存しません。逆に、シートの中身（文言・コード例）を `components/` に書くこともしません。

### `src/components/` — 表示

受け取ったデータを画面に出すことだけを担当します。Atomic Designで4階層に分かれ、**依存は下位方向のみ**（atoms ← molecules ← organisms ← templates）です。

| 階層        | 責務                                                     | 例                                                                      |
| ----------- | -------------------------------------------------------- | ----------------------------------------------------------------------- |
| `atoms`     | 見た目の最小単位。ドメインにも機能にも依存しない         | `Button`、`Badge`                                                       |
| `molecules` | atomsを組み合わせた部品。状態は持たず親から受け取る      | `SearchBox`、`CodeBlock`                                                |
| `organisms` | 意味のある画面領域。表示ロジックはここに置く             | `AppHeader`、`CheatSheetCard`、`CheatSheetSection`、`CheatSheetSidebar` |
| `templates` | 画面全体のレイアウトと状態の束ね役。ルーティングの受け口 | `CatalogLayout`（`/`）、`CheatSheetLayout`（`/cheatsheets/:slug`）      |

- 検索語などの状態を持つのは `templates` だけです。一覧はローカルstate、シートページはURLの `?q=` に持たせ、絞り込んだ状態のURLをそのまま共有できるようにしています。
- スタイルは1コンポーネント1ファイルの `Xxx.module.css` を同じディレクトリに置きます。色・角丸・影・フォントは `src/styles.css` のトークン（`--color-*` など）を通します。
- `Xxx.stories.tsx` も同じディレクトリに置き、見た目と状態のバリエーションはStorybookで確認します。

### `src/features/` — 機能

画面をまたいで使う振る舞いを、機能単位でまとめる層です。

- `cheat-sheet-search/` — 検索語に一致するセクション・項目だけを残す絞り込み（`filterCheatSheet.ts`）と、`/` でのフォーカス移動・`Escape` でのクリア（`useSearchShortcuts.ts`）。日本語入力を壊さないよう、IME変換中のキーは無視します。
- `code-copy/` — コード例のクリップボードコピー。Clipboard APIが使えない環境向けのフォールバックもここに閉じています。
- `theme-switch/` — テーマの切り替えと `localStorage` の保存キー。初期テーマの決定は `index.html` の同期スクリプトが描画前に済ませているため、この層は切り替えだけを担当します。
- `components/` を使う側です（`CopyButton` が `Button` を使うなど）。ただしatomsが `features/` に依存することはありません。

### `src/lib/` — 汎用

どの機能にも属さない純関数だけを置きます。ドメイン型もReactも参照しません。機能固有のロジックは `features/<feature>/` 側です。

- `normalizeSearch.ts` — 一覧検索とシート内検索が共通で使う正規化と一致判定。全角／半角・大文字小文字の差を吸収します。
- `formatIndex.ts` — カード・セクション見出し・目次で共通の採番表記。

### ルート直下のファイル

- `index.html` — HTMLの雛形に加えて、**Reactより前に `data-theme` を確定させる同期スクリプト**を持ちます。ライトテーマのちらつき（FOUC）を防ぐためで、保存キーは `src/features/theme-switch/theme.ts` と一致している必要があります（`tests/unit/themeBootstrap.test.ts` が検証）。
- `src/main.tsx` — RouterとグローバルCSSを用意して `App` をマウントするだけで、画面の中身は持ちません。
- `src/App.tsx` — ルーティングと404。シートごとのルートは切らず、`:slug` ひとつを registry に解決させます。

### `tests/`

| 対象                                                 | 置き場所                                  |
| ---------------------------------------------------- | ----------------------------------------- |
| 純ロジック（`src/lib/`、`features/**/*.ts`）・フック | `tests/unit/`（Vitest。テスト名は日本語） |
| コンポーネントの見た目・状態                         | 各コンポーネント横の `Xxx.stories.tsx`    |
| ユーザー導線                                         | `tests/e2e/`（Playwright）                |

Vitestの対象は `tests/unit/**` のみで、`src/` 配下に `*.test.ts` を置いても実行されません。

## 依存の向き

```text
main.tsx
  └─▶ App.tsx（ルーティング）
        └─▶ templates ──▶ organisms ──▶ molecules ──▶ atoms   ← components/ 内は下位方向のみ
              │              │              │
              └──────────────┴──────────────┴──▶ features/ ──▶ components/（atomsを除く）

依存の末端（他のどの層にも依存しない）
  cheatsheets/   型とデータ。すべての層がここの型を参照する
  lib/           純関数。すべての層から呼ばれる
```

- `components/` の各階層は上位階層をimportしません。
- `features/` から `components/` を使うのは可、`components/` が `features/` のウィジェットを使うのも既存パターンです。ただし**atomsは `features/` に依存しません**。
- `lib/` はどこからも使われる末端で、他のどこにも依存しません。
- 他ディレクトリからのimportは `@/src/...` エイリアス（定義元は `vite.config.ts` と `tsconfig.app.json`）。相対パスは同一ディレクトリと同一ドメイン内1階層までとし、`../../` は書きません。

## チートシートの追加

1. `src/cheatsheets/<slug>/content.ts` に `CheatSheet` 型のデータを作成します（項目は `item()` 経由）。
2. `src/cheatsheets/registry.ts` の `sheets` 配列へ追加します。
3. ヘッダーの直リンクは `AppHeader.tsx` にべた書きなので、必要なら追記します。
4. `npm run typecheck && npm test && npm run build` で確認します。

ルーティングと一覧カードはレジストリから自動的に生成されます。

## 実装済み機能

- 一覧検索とチートシート内検索
- `/` キーで検索欄へ移動、`Escape` キーで検索解除
- コード例のコピー
- ライト／ダークテーマ
- 印刷・PDF保存向けスタイル
- 検索条件のURL同期
- Storybookによるコンポーネント確認

## 今後のおすすめ

- Zodによるコンテンツスキーマ検証
- MiniSearchによる全文検索
- PWAとオフライン閲覧
- StorybookのVisual Regression Test
