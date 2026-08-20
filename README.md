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
| `npm test`                | Vitest                 |
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
cheatsheet-hub/
├── .storybook/               Storybook設定
├── src/
│   ├── cheatsheets/          チートシートの型・レジストリ・データ
│   │   ├── html/content.ts
│   │   └── git/content.ts
│   ├── components/
│   │   ├── atoms/
│   │   ├── molecules/
│   │   ├── organisms/
│   │   └── templates/
│   ├── features/             検索・コピー・テーマ切り替え
│   ├── lib/                  共通処理
│   ├── App.tsx               ルーティング
│   ├── main.tsx              エントリーポイント
│   └── styles.css            グローバルスタイル
├── tests/
│   ├── unit/
│   └── e2e/
├── Dockerfile
├── compose.yaml
├── index.html
├── package.json
└── vite.config.ts
```

## Atomic Design

- Atoms: Button、Badgeなどの最小UI
- Molecules: SearchBox、CodeBlockなどの組み合わせ
- Organisms: Header、Card、Section、Sidebarなどの画面領域
- Templates: 一覧画面とチートシート画面のレイアウト

## チートシートの追加

1. `src/cheatsheets/<slug>/content.ts` に `CheatSheet` 型のデータを作成します。
2. `src/cheatsheets/registry.ts` の `sheets` 配列へ追加します。
3. `npm run typecheck && npm test && npm run build` で確認します。

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
