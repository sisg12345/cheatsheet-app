/**
 * Viteチートシートのデータ。
 *
 * 表示側（components）はこの構造だけを見るので、ここに書いた順序がそのまま
 * 目次とページの並び順になる。項目は必ず helpers.ts の item() で生成する。
 *
 *   item(id, label, syntax, description, note?, status?, keywords?)
 *
 * - id はシート内で一意。目次のアンカー（#id）とReactのkeyに使われる
 * - status は normal / info / warning / danger。省略時は normal
 * - ブラウザに公開される値に秘密情報を入れる書き方には warning、推奨の書き方には info を付ける。
 *   バッジの色が唯一の警告表示になるため、付け忘れると危険が伝わらない
 * - 対象は Vite 8（8.3、2026-09）。バンドラーが Rolldown に変わり、build.rollupOptions は
 *   build.rolldownOptions に名前が変わった。バージョンに依存する記述は公式ブログと
 *   移行ガイド、および vite の型定義で確認済み（2026-09-20）
 * - keywords は検索用の別名。全角/半角・大文字小文字は normalizeSearch が吸収する
 * - 内容を直したら updatedAt も更新する
 * - セクション・項目を増減したら summary.ts の件数も直す（tests/unit/registry.test.ts が突き合わせる）
 */
import { item } from "../helpers";
import type { CheatSheetContent } from "../types";

export const viteContent: CheatSheetContent = {
  id: "vite-reference",
  updatedAt: "2026-09-20",
  sources: [
    { label: "Vite ガイド", url: "https://vite.dev/guide/" },
    { label: "Vite 設定リファレンス", url: "https://vite.dev/config/" },
  ],
  sections: [
    // 作成と、開発・ビルド・プレビューのコマンドと主なオプション。
    {
      id: "setup",
      title: "はじめる・CLI",
      description: "プロジェクトを作り、開発サーバーとビルドのコマンドを使う。",
      items: [
        item(
          "create-vite",
          "プロジェクトを作る",
          "npm create vite@latest my-app -- --template react-ts",
          "テンプレートを選んでプロジェクトを作る（react-ts、vue-ts、vanilla-ts など）。",
          "Node.js 20.19 / 22.12 以降が必要。",
          "info",
          ["setup", "template"],
        ),
        item(
          "vite-dev",
          "開発サーバーを起動",
          "npm run dev",
          "vite で開発サーバーを起動する。変更はページを再読み込みせずに反映される（HMR）。",
        ),
        item(
          "vite-build",
          "本番用にビルド",
          "npm run build",
          "vite build で、本番用のファイルを dist に出力する。",
        ),
        item(
          "vite-preview",
          "ビルド結果を確認",
          "npm run preview",
          "vite preview で、ビルドした dist をローカルで配信して確認する。",
          "本番用のサーバーとしては使わない。",
        ),
        item(
          "vite-host",
          "ほかの端末から開く",
          "npx vite --host",
          "LAN の中のスマホなどから開けるように、すべてのアドレスで待ち受ける。",
        ),
        item(
          "vite-port",
          "ポートを指定",
          "npx vite --port 3000 --strictPort",
          "ポートを指定する。--strictPort で、使用中なら別のポートへずらさずにエラーにする。",
        ),
        item("vite-open", "ブラウザで開く", "npx vite --open", "起動と同時にブラウザで開く。"),
        item(
          "vite-mode",
          "モードを指定してビルド",
          "npx vite build --mode staging",
          "モードを指定して、.env.staging などを読み込む。",
        ),
        item(
          "vite-force",
          "事前バンドルを作り直す",
          "npx vite --force",
          "依存関係の事前バンドルのキャッシュを無視して作り直す。",
          "依存関係を入れ替えたのに反映されないときに使う。",
        ),
      ],
    },
    // vite.config の主な設定。
    {
      id: "config",
      title: "vite.config",
      description: "プラグイン・別名・開発サーバー・公開パスなどの設定。",
      items: [
        item(
          "define-config",
          "設定ファイル",
          'import { defineConfig } from "vite";\nimport react from "@vitejs/plugin-react";\n\nexport default defineConfig({ plugins: [react()] });',
          "vite.config.ts に設定を書く。defineConfig で包むと補完が効く。",
          "Vue なら @vitejs/plugin-vue を使う。",
        ),
        item(
          "resolve-alias",
          "import の別名",
          'resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } }',
          "import のパスに別名を付ける。",
          "TypeScript 側の paths にも同じ別名を書く。Vite 8 は resolve.tsconfigPaths で tsconfig の paths を読むこともできる。",
        ),
        item(
          "server-options",
          "開発サーバーの設定",
          "server: { port: 3000, strictPort: true, open: true }",
          "開発サーバーのポートや、起動時の動きを設定する。",
        ),
        item(
          "server-proxy",
          "API へのプロキシ",
          'server: { proxy: { "/api": "http://localhost:8080" } }',
          "開発中、/api へのリクエストを別のサーバーへ転送する。",
          "ブラウザからは同じオリジンに見えるので、開発中の CORS の設定が要らない。",
          "info",
        ),
        item(
          "base",
          "公開パス",
          'base: "/my-app/"',
          "サブディレクトリに置くときの公開パスを指定する。",
          "GitHub Pages のプロジェクトページなどで使う。",
        ),
        item(
          "config-function",
          "コマンドやモードで切り替え",
          'export default defineConfig(({ command, mode }) => ({\n  base: mode === "production" ? "/app/" : "/",\n}));',
          "関数にすると、serve / build のどちらか、どのモードかで設定を変えられる。",
        ),
        item(
          "define",
          "値を埋め込む",
          "define: { __APP_VERSION__: JSON.stringify(pkg.version) }",
          "ビルド時に、コード中の名前を決まった値へ置き換える。",
          "置き換えは文字列としてそのまま差し込まれるので、文字列を入れるときは JSON.stringify() で包む。import.meta.env と違い、VITE_ の接頭辞が要らないぶん、秘密情報を入れないよう注意する。",
          "warning",
          ["define", "定数", "バージョン"],
        ),
      ],
    },
    // 環境変数とモード。VITE_ の付いた値はブラウザに埋め込まれる。
    {
      id: "env",
      title: "環境変数・モード",
      description: ".env ファイルの値をコードで使う。モードごとにファイルを分けられる。",
      items: [
        item(
          "vite-env-prefix",
          "公開する環境変数",
          "VITE_API_URL=https://api.example.com",
          "VITE_ で始まる変数だけが、クライアントのコードに埋め込まれる。",
          "ビルドした JavaScript から誰でも読めるので、秘密情報は置かない。",
          "warning",
        ),
        item(
          "import-meta-env",
          "環境変数を読む",
          "import.meta.env.VITE_API_URL",
          "コードの中で環境変数を読む。",
        ),
        item(
          "builtin-env",
          "組み込みの値",
          "import.meta.env.MODE / DEV / PROD / BASE_URL",
          "今のモード、開発中か、本番用か、公開パスを読む。",
        ),
        item(
          "env-files",
          ".env ファイルの読み込み順",
          ".env → .env.local → .env.[mode] → .env.[mode].local",
          "後ろのファイルほど優先される。",
          ".local の付いたファイルは Git にコミットしない。",
        ),
        item(
          "env-types",
          "環境変数の型",
          "interface ImportMetaEnv { readonly VITE_API_URL: string; }",
          "vite-env.d.ts に書いて、import.meta.env に型を付ける。",
        ),
        item(
          "load-env",
          "設定ファイルで .env を読む",
          'const env = loadEnv(mode, process.cwd(), "");',
          "vite.config の中で .env の値を読む（設定ファイルでは import.meta.env が使えないため）。",
          '第3引数を "" にすると、VITE_ 以外の変数も読む。',
        ),
      ],
    },
    // 静的ファイルと特別な import。
    {
      id: "assets",
      title: "静的ファイル・import",
      description: "画像や CSS の読み込みと、Vite が用意している特別な import。",
      items: [
        item(
          "public-dir",
          "そのまま配信するファイル",
          "public/favicon.svg",
          "/favicon.svg として、名前を変えずにそのまま配信される。",
          "robots.txt など、名前を固定したいファイルに使う。",
        ),
        item(
          "import-asset",
          "画像の URL を得る",
          'import logo from "./logo.svg";',
          "ファイルを import すると URL を受け取れる。ビルドでは名前にハッシュが付く。",
          "キャッシュが効き、更新したときは新しい URL になる。",
          "info",
        ),
        item(
          "import-raw",
          "中身を文字列で",
          'import text from "./message.txt?raw";',
          "ファイルの中身を文字列として読み込む。",
        ),
        item(
          "import-url",
          "URL だけを得る",
          'import workerUrl from "./worker.js?url";',
          "処理せずに、ファイルの URL だけを受け取る。",
        ),
        item(
          "import-json",
          "JSON",
          'import data from "./data.json";',
          "JSON をオブジェクトとして読み込む。",
        ),
        item(
          "css-modules",
          "CSS Modules",
          'import styles from "./Button.module.css";',
          "*.module.css のクラス名は、ファイルごとに一意な名前に変換される。",
        ),
        item(
          "glob-import",
          "まとめて import",
          'const modules = import.meta.glob("./pages/*.tsx");',
          "パターンに一致するファイルを、まとめて遅延読み込みの関数として受け取る。",
          "{ eager: true } を付けると、すぐに読み込む。",
        ),
        item(
          "web-worker",
          "Web Worker",
          'new Worker(new URL("./worker.ts", import.meta.url), { type: "module" })',
          "Worker のファイルもビルドの対象にして読み込む。",
        ),
      ],
    },
    // ビルドの出力の設定。
    {
      id: "build",
      title: "ビルド",
      description: "出力先・ソースマップ・対象ブラウザ・ライブラリとしての出力。",
      items: [
        item("out-dir", "出力先", 'build: { outDir: "dist" }', "ビルドの出力先のディレクトリ。"),
        item(
          "sourcemap",
          "ソースマップ",
          "build: { sourcemap: true }",
          "本番のエラーを元のコードの位置で追えるように、ソースマップを出力する。",
          '公開するとソースコードが見えるので、"hidden" にしてエラー監視サービスにだけ送る方法もある。',
        ),
        item(
          "build-target",
          "対象のブラウザ",
          'build: { target: "es2022" }',
          "出力するコードが対象とするブラウザや ES の版を指定する。",
          "既定は、広く使える主要ブラウザ（Chrome・Edge 111、Firefox 114、Safari 16.4 以降）。",
        ),
        item(
          "rolldown-options",
          "バンドラーの詳細設定",
          "build: { rolldownOptions: { … } }",
          "Rolldown に渡す細かい設定を書く。",
          "Vite 8 から。build.rollupOptions は非推奨の古い名前で、自動で変換される。",
        ),
        item(
          "library-mode",
          "ライブラリとして出力",
          'build: { lib: { entry: "src/index.ts", name: "MyLib", fileName: "my-lib" } }',
          "アプリではなく、npm に公開するライブラリとして出力する。",
          "React などの依存関係は、同梱しないよう外部として指定する。",
        ),
        item(
          "build-manifest",
          "出力の対応表を書き出す",
          "build: { manifest: true }",
          "元のファイル名と、ハッシュの付いた出力ファイル名の対応表（.vite/manifest.json）を出力する。",
          "Rails や Laravel など、HTML をサーバー側で組み立てる構成で、読み込む JS と CSS の名前を決めるのに使う。",
          "info",
          ["manifest", "バックエンド", "統合"],
        ),
      ],
    },
    // プラグインと HMR、テスト。
    {
      id: "plugins",
      title: "プラグイン・その他",
      description: "自作プラグイン、HMR の API、事前バンドル、テスト。",
      items: [
        item(
          "custom-plugin",
          "プラグインを作る",
          'const myPlugin = { name: "my-plugin", transform(code, id) { … } };',
          "name と、変換などのフックを持つオブジェクトをプラグインとして plugins に渡す。",
        ),
        item(
          "hmr-api",
          "HMR の API",
          "if (import.meta.hot) { import.meta.hot.accept(); }",
          "モジュールを差し替えたときの処理を書く。",
          "本番ビルドでは import.meta.hot が無いので、if で囲む。",
        ),
        item(
          "optimize-deps",
          "事前バンドルの対象",
          'optimizeDeps: { include: ["lodash-es"] }',
          "開発時の事前バンドルに、自動では見つからない依存関係を加える。",
        ),
        item(
          "vitest",
          "テスト",
          "npm install -D vitest",
          "Vite の設定を共有して動くテストツール Vitest を入れる。",
          "npx vitest で実行し、ファイルの変更を監視して再実行する。",
          "info",
        ),
      ],
    },
  ],
};
