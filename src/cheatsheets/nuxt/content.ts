/**
 * Nuxt.jsチートシートのデータ。
 *
 * 表示側（components）はこの構造だけを見るので、ここに書いた順序がそのまま
 * 目次とページの並び順になる。項目は必ず helpers.ts の item() で生成する。
 *
 *   item(id, label, syntax, description, note?, status?, keywords?)
 *
 * - id はシート内で一意。目次のアンカー（#id）とReactのkeyに使われる
 * - status は normal / info / warning / danger。省略時は normal
 * - 秘密情報の漏えいや、リクエスト間で状態が混ざる書き方には warning、推奨の書き方には info を付ける。
 *   バッジの色が唯一の警告表示になるため、付け忘れると危険が伝わらない
 * - 範囲は Nuxt 本体。Vue 自体の書き方は Vue.js シートに任せ、Nuxt が足す仕組みだけを扱う
 * - 対象は Nuxt 4（4.5、2026-07）。ファイルの置き場所は Nuxt 4 の app/ ディレクトリ構成で書く。
 *   バージョンに依存する記述は公式ブログとドキュメントで確認済み（2026-09-19）
 * - keywords は検索用の別名。全角/半角・大文字小文字は normalizeSearch が吸収する
 * - 内容を直したら updatedAt も更新する
 */
import { item } from "../helpers";
import type { CheatSheet } from "../types";

export const nuxtCheatSheet: CheatSheet = {
  id: "nuxt-reference",
  slug: "nuxt",
  title: "Nuxt.js チートシート",
  name: "Nuxt.js",
  description:
    "ディレクトリ構成、ルーティング、useFetch などのデータ取得、状態と設定、サーバー API、SEO、描画モードまでをまとめたNuxtリファレンス。",
  eyebrow: "Vue framework",
  accent: "#00dc82",
  keywords: ["nuxt", "nuxt4", "nuxi", "nitro", "ssr", "usefetch"],
  updatedAt: "2026-09-19",
  sources: [
    { label: "Nuxt ドキュメント", url: "https://nuxt.com/docs/4.x/getting-started/introduction" },
    { label: "Nuxt 4 リリース記事", url: "https://nuxt.com/blog/v4" },
  ],
  sections: [
    // 作成と開発・ビルドのコマンド。
    {
      id: "setup",
      title: "はじめる・CLI",
      description: "プロジェクトを作り、開発・ビルド・静的生成のコマンドを使う。",
      items: [
        item(
          "create-nuxt",
          "プロジェクトを作る",
          "npm create nuxt@latest my-app",
          "Nuxt のひな形を作る。",
          "Node.js 22 以降が必要。",
          "info",
          ["setup", "nuxi"],
        ),
        item(
          "nuxt-dev",
          "開発サーバーを起動",
          "npm run dev -- -o",
          "開発サーバーを起動し、ブラウザで開く。",
        ),
        item(
          "nuxt-build",
          "本番用にビルド",
          "npm run build",
          "サーバー付きのアプリとしてビルドし、.output に出力する。",
          "node .output/server/index.mjs で起動できる。",
        ),
        item(
          "nuxt-generate",
          "静的なサイトとして書き出す",
          "npm run generate",
          "すべてのページを事前に描画し、静的なファイルとして書き出す。",
        ),
        item(
          "nuxt-preview",
          "ビルド結果を確認",
          "npm run preview",
          "ビルドした結果を、ローカルで動かして確認する。",
        ),
        item(
          "module-add",
          "モジュールを追加",
          "npx nuxt module add image",
          "モジュールをインストールし、nuxt.config の modules に登録する。",
        ),
        item(
          "nuxt-upgrade",
          "バージョンを上げる",
          "npx nuxt upgrade --dedupe",
          "Nuxt を最新に更新し、重複した依存関係を整理する。",
        ),
        item(
          "nuxt-typecheck",
          "型チェック",
          "npx nuxt typecheck",
          "vue-tsc でプロジェクト全体の型を検査する。",
          "vue-tsc と typescript を開発用の依存関係に入れておく。",
        ),
      ],
    },
    // Nuxt 4 の置き場所。app/ の中は自動で読み込まれ、server/・public/・shared/ はルート直下。
    {
      id: "structure",
      title: "ディレクトリ構成",
      description: "決まったフォルダに置くと、ルートや自動 import に使われる。",
      items: [
        item(
          "app-dir",
          "app ディレクトリ",
          "app/",
          "ページ・コンポーネント・レイアウトなど、アプリのコードを置く。",
          "Nuxt 4 から既定の置き場所。server/・public/・shared/・nuxt.config.ts はルート直下に置く。",
          "info",
        ),
        item(
          "app-vue",
          "アプリの最上位",
          "app/app.vue",
          "アプリの外枠。<NuxtLayout> と <NuxtPage /> でレイアウトとページを表示する。",
        ),
        item(
          "pages",
          "ページ",
          "app/pages/index.vue",
          "pages の中のファイルの場所が、そのまま URL になる。",
        ),
        item(
          "dynamic-page",
          "動的なページ",
          "app/pages/posts/[id].vue",
          "URL の一部を route.params.id で受け取る。",
          "[...slug].vue にすると、残りの階層をまとめて受け取る。",
        ),
        item(
          "components-auto-import",
          "コンポーネントの自動 import",
          "app/components/base/Button.vue",
          "components の中は import なしで使える。フォルダ名が名前の前に付き、<BaseButton /> になる。",
        ),
        item(
          "composables",
          "コンポーザブルの自動 import",
          "app/composables/useCounter.ts",
          "composables 直下の関数は、import なしで使える。",
        ),
        item(
          "auto-imports",
          "Vue の API も自動 import",
          "const count = ref(0);",
          "ref や computed、useFetch などは、import を書かずにそのまま使える。",
        ),
        item(
          "layouts",
          "レイアウト",
          "app/layouts/default.vue",
          "ページを包む共通の外枠。<slot /> の場所にページが入る。",
        ),
        item(
          "server-dir",
          "サーバー API",
          "server/api/hello.ts",
          "/api/hello で呼べる API を作る。",
          "server/routes に置くと /api が付かない URL になる。",
        ),
        item(
          "public-dir",
          "静的ファイル",
          "public/favicon.ico",
          "そのまま /favicon.ico として配信される。",
        ),
        item(
          "shared-dir",
          "アプリとサーバーで共有",
          "shared/utils/format.ts",
          "アプリとサーバーの両方で使う関数や型を置く。shared/utils と shared/types は自動 import される。",
        ),
      ],
    },
    // ページ間の移動とルートごとの処理。
    {
      id: "routing",
      title: "ルーティング・ミドルウェア",
      description: "リンクとコードからの移動、ページごとの設定、移動の前の処理。",
      items: [
        item(
          "nuxt-link",
          "リンク",
          '<NuxtLink to="/about">About</NuxtLink>',
          "ページを再読み込みせずに移動するリンク。画面に入ると移動先を先読みする。",
          undefined,
          "info",
        ),
        item(
          "nuxt-link-external",
          "外部リンク",
          '<NuxtLink to="https://nuxt.com" external target="_blank">Nuxt</NuxtLink>',
          "外部のサイトへのリンク。",
        ),
        item(
          "use-route",
          "今のルートを読む",
          "const route = useRoute();\nroute.params.id;",
          "URL の params やクエリを読む。",
        ),
        item(
          "navigate-to",
          "コードから移動",
          'await navigateTo("/login");',
          "コードからページを移動する。サーバーでもクライアントでも使える。",
          "外部の URL へは navigateTo(url, { external: true }) と書く。",
        ),
        item(
          "define-page-meta",
          "ページごとの設定",
          'definePageMeta({ layout: "admin", middleware: "auth" });',
          "ページで使うレイアウトやミドルウェアを指定する。",
        ),
        item(
          "route-middleware",
          "ルートミドルウェア",
          'export default defineNuxtRouteMiddleware((to) => {\n  if (!isLoggedIn()) return navigateTo("/login");\n});',
          "ページを移動する前に実行する処理を app/middleware に書く。",
          "ファイル名を auth.global.ts のように .global にすると、全ページで動く。",
        ),
      ],
    },
    // データ取得。表示用は useFetch / useAsyncData、イベントの中は $fetch を使う。
    {
      id: "data-fetching",
      title: "データ取得",
      description: "サーバーで取得したデータを、クライアントで取り直さずに使う。",
      items: [
        item(
          "use-fetch",
          "API からデータを取得",
          'const { data, status, error, refresh } = await useFetch("/api/posts");',
          "サーバーで取得したデータをクライアントに引き継ぎ、同じデータを2回取らない。",
          undefined,
          "info",
        ),
        item(
          "use-async-data",
          "任意の非同期処理の結果",
          'const { data } = await useAsyncData("user", () => $fetch(`/api/users/${id}`));',
          "第1引数のキーで結果を保存し、同じキーを使うコンポーネント同士で共有する。",
          "Nuxt 4 から、data と error の初期値は undefined（以前は null）。",
        ),
        item(
          "fetch-in-event",
          "イベントの中で API を呼ぶ",
          'await $fetch("/api/posts", { method: "POST", body: form });',
          "クリックや送信などのイベントの中で API を呼ぶ。",
          "表示用のデータを setup で直接 $fetch すると、サーバーとクライアントで2回取得される。",
        ),
        item(
          "use-lazy-fetch",
          "待たずに表示する",
          'const { data, status } = useLazyFetch("/api/comments");',
          "取得の完了を待たずにページを表示する。",
          'status が "pending" の間は、読み込み中の表示を出す。',
        ),
        item(
          "fetch-query",
          "クエリを付ける",
          'useFetch("/api/posts", { query: { page } })',
          "クエリを付けて取得する。ref を渡すと、値が変わったときに取り直す。",
        ),
        item(
          "fetch-pick",
          "必要な項目だけ残す",
          'useFetch("/api/user", { pick: ["id", "name"] })',
          "必要なプロパティだけを残し、クライアントに送るデータを減らす。",
        ),
        item(
          "fetch-client-only",
          "クライアントでだけ取得",
          'useFetch("/api/me", { server: false })',
          "サーバーでは取得せず、ブラウザでだけ取得する。",
        ),
        item(
          "refresh-nuxt-data",
          "データを取り直す",
          'await refreshNuxtData("posts");',
          "キーを指定して、useAsyncData / useFetch のデータを取り直す。",
          "個別に取り直すなら、戻り値の refresh() を呼ぶ。",
        ),
      ],
    },
    // 共有状態と設定。モジュールの外側の ref はサーバーでリクエスト間に共有されてしまう。
    {
      id: "state-config",
      title: "状態・設定",
      description: "SSR でも安全な共有状態と、環境変数で上書きできる設定。",
      items: [
        item(
          "use-state",
          "共有状態",
          'const count = useState("count", () => 0);',
          "SSR でも安全に使える共有状態を作る。同じキーで共有される。",
          "コンポーネントの外で ref を作ると、サーバーで別のユーザーのリクエストと共有されてしまう。",
          "warning",
        ),
        item(
          "runtime-config",
          "実行時の設定",
          'runtimeConfig: { apiSecret: "", public: { apiBase: "/api" } }',
          "nuxt.config で設定を定義する。public 以外はサーバーでだけ読める。",
        ),
        item(
          "use-runtime-config",
          "設定を読む",
          "const config = useRuntimeConfig();\nconfig.public.apiBase;",
          "runtimeConfig の値を読む。",
        ),
        item(
          "runtime-config-env",
          "環境変数で上書き",
          "NUXT_PUBLIC_API_BASE=https://api.example.com",
          "NUXT_ で始まる環境変数で、runtimeConfig を実行時に上書きする。",
          "秘密情報は public に入れない（NUXT_API_SECRET のように public の外に置く）。",
          "warning",
        ),
        item(
          "app-config",
          "ビルド時に決まる公開設定",
          'export default defineAppConfig({ theme: { primary: "green" } });',
          "app/app.config.ts に、テーマなどの公開してよい設定を書く。",
          "環境変数では上書きできず、中身はクライアントに送られる。",
        ),
        item(
          "use-cookie",
          "cookie",
          'const token = useCookie("token", { maxAge: 60 * 60 });',
          "サーバーでもクライアントでも読み書きできる cookie を ref として扱う。",
        ),
      ],
    },
    // server/ の中は Nitro が動かす。ファイル名でメソッドを絞れる。
    {
      id: "server",
      title: "サーバー API",
      description: "server/api に書いたハンドラーが API になる。",
      items: [
        item(
          "define-event-handler",
          "ハンドラー",
          'export default defineEventHandler(() => ({ message: "hello" }));',
          "API のハンドラーを定義する。返した値は JSON で返される。",
        ),
        item(
          "method-suffix",
          "メソッドを限定",
          "server/api/posts.post.ts",
          "ファイル名に .get や .post を付けると、そのメソッドのリクエストだけに応答する。",
        ),
        item(
          "read-body",
          "本文を読む",
          "const body = await readBody(event);",
          "リクエストの本文を読み取る。",
        ),
        item(
          "get-query",
          "クエリを読む",
          "const query = getQuery(event);",
          "URL のクエリをオブジェクトで受け取る。",
        ),
        item(
          "get-router-param",
          "パスの値を読む",
          'const id = getRouterParam(event, "id");',
          "server/api/users/[id].ts のような動的なパスの値を読む。",
        ),
        item(
          "create-error",
          "エラーを返す",
          'throw createError({ statusCode: 404, statusMessage: "Not Found" });',
          "ステータスコード付きのエラーを返す。",
        ),
      ],
    },
    // head のタグ・プラグイン・モジュールと、ブラウザでだけ描画する部品。
    {
      id: "seo-plugins",
      title: "SEO・プラグイン・モジュール",
      description: "メタタグの設定と、アプリを拡張する仕組み。",
      items: [
        item(
          "use-seo-meta",
          "SEO のメタタグ",
          'useSeoMeta({ title: "ブログ", description: "最新の記事", ogImage: "/og.png" });',
          "SEO 向けのメタタグを、型の付いた書き方で設定する。",
          undefined,
          "info",
        ),
        item(
          "use-head",
          "head のタグ",
          'useHead({ link: [{ rel: "icon", href: "/favicon.ico" }] });',
          "head に link や script などのタグを追加する。",
        ),
        item(
          "define-nuxt-plugin",
          "プラグイン",
          "export default defineNuxtPlugin((nuxtApp) => { … });",
          "アプリの起動時に実行する処理を app/plugins に書く。",
          "ファイル名を .client.ts / .server.ts にすると、実行する側を限定できる。",
        ),
        item(
          "modules",
          "モジュールを登録",
          'modules: ["@nuxt/image", "@nuxt/fonts"]',
          "nuxt.config の modules に、使うモジュールを並べる。",
        ),
        item(
          "client-only",
          "ブラウザでだけ描画",
          "<ClientOnly><Chart /></ClientOnly>",
          "中身をブラウザでだけ描画する。サーバーで動かないライブラリに使う。",
        ),
        item(
          "error-page",
          "エラーページ",
          "app/error.vue",
          "エラーが起きたときに、ページの代わりに表示する。",
          'clearError({ redirect: "/" }) でエラーを消して移動する。',
        ),
      ],
    },
    // ページごとに描画の仕方を変える。
    {
      id: "rendering",
      title: "描画モード",
      description: "サーバー描画・事前描画・クライアントだけの描画を切り替える。",
      items: [
        item(
          "route-rules",
          "ルートごとの描画",
          'routeRules: { "/": { prerender: true }, "/blog/**": { isr: 3600 }, "/admin/**": { ssr: false } }',
          "nuxt.config で、ページごとに事前描画・一定時間ごとの再生成・サーバー描画の有無を切り替える。",
          undefined,
          "info",
        ),
        item(
          "ssr-false",
          "アプリ全体を SPA に",
          "ssr: false",
          "nuxt.config で、アプリ全体をブラウザだけで描画する。",
          "SEO のためのサーバー描画は行われなくなる。",
        ),
      ],
    },
  ],
};
