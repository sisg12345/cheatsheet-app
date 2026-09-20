/**
 * Next.jsチートシートのデータ。
 *
 * 表示側（components）はこの構造だけを見るので、ここに書いた順序がそのまま
 * 目次とページの並び順になる。項目は必ず helpers.ts の item() で生成する。
 *
 *   item(id, label, syntax, description, note?, status?, keywords?)
 *
 * - id はシート内で一意。目次のアンカー（#id）とReactのkeyに使われる
 * - status は normal / info / warning / danger。省略時は normal
 * - 秘密情報の漏えいや、外から直接呼べる処理の検証漏れにつながる書き方には warning、
 *   推奨の書き方には info を付ける。バッジの色が唯一の警告表示になるため、付け忘れると危険が伝わらない
 * - 範囲は App Router だけ（Pages Router は扱わない）。例は TypeScript で書く
 * - 対象の版は target に持たせ、フッターに出す。15・16 で変わった点（非同期の params、
 *   proxy.ts、Cache Components など）は note に書く。版に依存する記述は公式ブログで確かめる
 * - keywords は検索用の別名。全角/半角・大文字小文字は normalizeSearch が吸収する
 * - 内容を直したら updatedAt も更新する。版が変わったら target も直す
 * - セクション・項目を増減したら summary.ts の件数も直す（tests/unit/registry.test.ts が突き合わせる）
 */
import { item } from "../helpers";
import type { CheatSheetContent } from "../types";

export const nextjsContent: CheatSheetContent = {
  id: "nextjs-reference",
  updatedAt: "2026-09-20",
  target: "Next.js 16.3",
  sources: [
    { label: "Next.js ドキュメント（App Router）", url: "https://nextjs.org/docs/app" },
    { label: "Next.js 16 リリース記事", url: "https://nextjs.org/blog/next-16" },
  ],
  sections: [
    // 作成と開発・本番のコマンド。Next.js 16 から Turbopack が既定で、next lint は無くなった。
    {
      id: "setup",
      title: "はじめる・CLI",
      description: "プロジェクトを作り、開発・ビルド・本番起動のコマンドを使う。",
      items: [
        item(
          "create-next-app",
          "プロジェクトを作る",
          "npx create-next-app@latest my-app",
          "App Router・TypeScript・Tailwind CSS・ESLint を含むひな形を作る。",
          "Node.js 20.9 以降が必要（Next.js 16）。",
          "info",
          ["setup"],
        ),
        item(
          "next-dev",
          "開発サーバーを起動",
          "npm run dev",
          "next dev で開発サーバーを起動する。",
          "Next.js 16 から Turbopack が既定。webpack を使うなら next dev --webpack。",
          undefined,
          ["turbopack"],
        ),
        item("next-build", "本番用にビルド", "npm run build", "next build で本番用にビルドする。"),
        item(
          "next-start",
          "本番サーバーを起動",
          "npm run start",
          "next start で、ビルドした結果を本番用のサーバーで動かす。",
        ),
        item(
          "codemod-upgrade",
          "バージョンを上げる",
          "npx @next/codemod@canary upgrade latest",
          "Next.js と React を更新し、書き換えが必要なコードを自動で直す。",
        ),
        item(
          "lint",
          "コードを検査する",
          "npx eslint .",
          "ESLint を直接実行して検査する。",
          "next lint は Next.js 16 で削除され、next build も検査しなくなった。",
        ),
      ],
    },
    // ファイルとフォルダの置き方がそのままルートになる。特別な名前のファイルもここにまとめる。
    {
      id: "routing",
      title: "ルーティング",
      description: "app フォルダの階層が URL になる。page.tsx があるフォルダだけが公開される。",
      items: [
        item(
          "page",
          "ページ",
          "app/page.tsx",
          "ルート（/）のページ。default export したコンポーネントが表示される。",
        ),
        item("nested-route", "階層のあるページ", "app/blog/page.tsx", "/blog のページになる。"),
        item(
          "dynamic-segment",
          "動的なセグメント",
          "app/blog/[slug]/page.tsx",
          "URL の一部（/blog/hello の hello）を params で受け取る。",
        ),
        item(
          "catch-all-segment",
          "残りをまとめて受け取る",
          "app/docs/[...slug]/page.tsx",
          "/docs/a/b/c のような複数の階層を、配列でまとめて受け取る。",
          "[[...slug]] と二重にすると、/docs そのものも含む。",
        ),
        item(
          "route-group",
          "ルートグループ",
          "app/(marketing)/about/page.tsx",
          "丸括弧のフォルダは URL に含まれない。レイアウトを分けるのに使う。",
        ),
        item(
          "private-folder",
          "ルートにしないフォルダ",
          "app/_components/Header.tsx",
          "_ で始まるフォルダは URL にならない。部品を置くのに使う。",
        ),
        item(
          "layout",
          "レイアウト",
          "app/layout.tsx",
          "複数のページで共有する外枠。ページを移動しても状態が保たれる。",
          "いちばん外の layout.tsx には <html> と <body> が必須。",
        ),
        item(
          "loading",
          "読み込み中の表示",
          "app/blog/loading.tsx",
          "ページの準備ができるまで表示する UI。自動で Suspense に包まれる。",
        ),
        item(
          "error-boundary",
          "エラー時の表示",
          "app/blog/error.tsx",
          "描画中のエラーを捕まえて表示する UI。",
          'Client Component にするため、先頭に "use client" が必要。',
        ),
        item(
          "not-found",
          "404 ページ",
          "app/not-found.tsx",
          "見つからないときのページ。notFound() を呼んでも表示される。",
        ),
        item(
          "route-handler-file",
          "API のルート",
          "app/api/users/route.ts",
          "GET や POST などの名前の関数を export すると、API として応答する。",
          "同じフォルダに page.tsx と route.ts は置けない。",
        ),
        item(
          "parallel-route",
          "並列ルート",
          "app/@modal/page.tsx",
          "@ で始まるフォルダを作ると、同じ URL の中で複数の画面を同時に描ける。layout が props で受け取る。",
          "Next.js 16 から、すべてのスロットに default.tsx が必須。無いとビルドが落ちるので、notFound() を呼ぶか null を返すものを置く。",
          "warning",
          ["parallel routes", "モーダル", "slot"],
        ),
      ],
    },
    // ページ間の移動。サーバーでの移動（redirect）とクライアントでの移動（useRouter）を分けて書く。
    {
      id: "navigation",
      title: "ナビゲーション",
      description: "リンクとコードからのページ移動、今の URL の読み取り。",
      items: [
        item(
          "link",
          "リンク",
          '<Link href="/blog">ブログ</Link>',
          "ページを再読み込みせずに移動するリンク。画面に入ると移動先を先読みする。",
          "next/link から import する。",
          "info",
        ),
        item(
          "use-router",
          "コードから移動",
          'const router = useRouter();\nrouter.push("/dashboard");',
          "イベントの中などから、ページを移動する。",
          "next/navigation から import し、Client Component で使う。",
        ),
        item(
          "redirect",
          "サーバーで別のページへ",
          'redirect("/login");',
          "Server Component や Server Action の中で、別のページへ移動させる。",
          "next/navigation から import する。例外を投げて処理を止めるので、try の中で呼ばない。",
        ),
        item(
          "use-pathname",
          "今のパスを読む",
          "const pathname = usePathname();",
          "今の URL のパス（/blog/hello など）を読む。",
          "Client Component で使う。",
        ),
        item(
          "use-search-params",
          "クエリを読む（クライアント）",
          'const searchParams = useSearchParams();\nsearchParams.get("q");',
          "Client Component で、URL の ?q=… を読む。",
          "サーバーでは page の searchParams を使う。",
        ),
        item(
          "router-refresh",
          "サーバーのデータを取り直す",
          "router.refresh();",
          "今のページのデータをサーバーから取り直し、表示を更新する。",
          "クライアントの state は保たれる。",
        ),
      ],
    },
    // ページが受け取る値とメタデータ。15 で非同期になり、16 で同期的なアクセスが削除された。
    {
      id: "params-metadata",
      title: "params・メタデータ",
      description: "URL の値の受け取り、静的に作るパスの列挙、タイトルなどのメタデータ。",
      items: [
        item(
          "params",
          "動的なセグメントを受け取る",
          "export default async function Page({ params }: { params: Promise<{ slug: string }> }) {\n  const { slug } = await params;\n}",
          "params は Promise で渡されるので、await して値を取り出す。",
          "Next.js 15 から非同期になり、16 で await しない書き方は使えなくなった。",
          "warning",
        ),
        item(
          "search-params",
          "クエリを受け取る（サーバー）",
          "const { q } = await searchParams;",
          "page の props の searchParams から、URL の ?q=… を受け取る。",
          "params と同じく Promise。使うとそのページはリクエストごとに描画される。",
        ),
        item(
          "generate-static-params",
          "静的に作るパスを列挙",
          "export async function generateStaticParams() {\n  return posts.map((post) => ({ slug: post.slug }));\n}",
          "動的ルートのうち、ビルド時に作っておくページの params を返す。",
        ),
        item(
          "metadata",
          "メタデータ",
          'export const metadata: Metadata = { title: "ブログ", description: "最新の記事" };',
          "ページや layout で、タイトルや説明を設定する。",
        ),
        item(
          "generate-metadata",
          "メタデータを動的に作る",
          "export async function generateMetadata({ params }: Props): Promise<Metadata> { … }",
          "params や取得したデータに応じて、メタデータを作る。",
        ),
        item(
          "title-template",
          "タイトルの書式",
          'title: { template: "%s | サイト名", default: "サイト名" }',
          "layout で、子のページのタイトルに付け足す書式を決める。",
        ),
        item(
          "metadata-files",
          "sitemap・robots・OGP 画像",
          "app/sitemap.ts\napp/robots.ts\napp/opengraph-image.tsx",
          "決まった名前のファイルを置くと、sitemap.xml・robots.txt・OGP 画像が自動で作られる。",
          "opengraph-image.tsx は ImageResponse で画像を描ける。静的なら opengraph-image.png を置くだけでよい。",
          "info",
          ["sitemap", "robots", "ogp", "SEO"],
        ),
      ],
    },
    // サーバーとクライアントの境界。"use client" はなるべく末端の部品に付ける。
    {
      id: "components",
      title: "Server・Client Components",
      description: "既定はサーバーで描画し、操作が要る部品だけをクライアントにする。",
      items: [
        item(
          "server-component",
          "Server Component",
          "export default async function Page() { const posts = await getPosts(); … }",
          "app の中のコンポーネントは、既定でサーバーで描画される。データを直接 await できる。",
          "コードはブラウザに送られないので、データベースなどを直接扱える。",
          "info",
        ),
        item(
          "use-client",
          "Client Component",
          '"use client";',
          "ファイルの先頭に書くと Client Component になり、state やイベントが使える。",
          "このファイルから import したものもクライアントに含まれる。なるべく末端の部品に付ける。",
        ),
        item(
          "server-to-client-props",
          "サーバーからクライアントへ渡す",
          "<LikeButton initialCount={count} />",
          "Server Component から Client Component へは、props で値を渡す。",
          "渡せるのはシリアライズできる値だけ（関数は Server Actions だけ渡せる）。",
        ),
        item(
          "server-as-children",
          "Client の中に Server を入れる",
          "<Modal><Cart /></Modal>",
          "Client Component の children として、Server Component を渡せる。",
        ),
        item(
          "server-only",
          "サーバー専用のモジュール",
          'import "server-only";',
          "クライアントから import されたらビルドエラーにする。",
          "秘密情報を扱うモジュールに書く。npm install server-only で追加する。",
          "info",
        ),
      ],
    },
    // データ取得とキャッシュ。Cache Components（16）ではキャッシュは "use cache" で明示した所だけ。
    {
      id: "data-caching",
      title: "データ取得・キャッシュ",
      description: "Server Component でデータを取り、必要な所だけを明示してキャッシュする。",
      items: [
        item(
          "fetch-server",
          "サーバーでデータを取得",
          'const res = await fetch("https://api.example.com/posts");',
          "Server Component の中で、そのまま fetch してデータを取る。",
          "Next.js 15 から、fetch は既定でキャッシュされない。",
        ),
        item(
          "parallel-fetch",
          "並行して取得",
          "const [user, posts] = await Promise.all([getUser(id), getPosts(id)]);",
          "独立したデータを同時に取りに行き、待ち時間を減らす。",
          undefined,
          "info",
        ),
        item(
          "streaming",
          "遅い部分だけ後から表示",
          "<Suspense fallback={<Skeleton />}><Comments /></Suspense>",
          "時間のかかる部分を Suspense で囲み、ほかの部分を先に表示する。",
        ),
        item(
          "cache-components",
          "Cache Components を有効にする",
          "const nextConfig: NextConfig = { cacheComponents: true };",
          'キャッシュを "use cache" で明示した所だけにする。それ以外はリクエストごとに実行される。',
          "Next.js 16 以降。以前の experimental.ppr や dynamicIO はこれに置き換わった。",
        ),
        item(
          "use-cache",
          "結果をキャッシュ",
          'async function getPosts() {\n  "use cache";\n  return db.post.findMany();\n}',
          "関数やコンポーネントの先頭に書き、その結果をキャッシュする。",
          "キャッシュのキーは引数などから自動で作られる。cacheComponents を有効にして使う。",
        ),
        item(
          "cache-life",
          "キャッシュの期間",
          'cacheLife("hours");',
          '"use cache" の中で、キャッシュを使う期間を指定する。',
          'next/cache から import する。"max" や "days" などのプロファイルを指定できる。',
        ),
        item(
          "cache-tag",
          "キャッシュにタグを付ける",
          'cacheTag("posts");',
          '"use cache" の中でタグを付け、あとでタグ単位で無効にできるようにする。',
        ),
        item(
          "revalidate-tag",
          "タグで作り直す",
          'revalidateTag("posts", "max");',
          "タグの付いたキャッシュを古いものとして扱い、次のアクセスで裏で作り直す。",
          "Next.js 16 から第2引数（cacheLife のプロファイル）が必要。",
        ),
        item(
          "update-tag",
          "すぐに作り直す",
          'updateTag("posts");',
          "Server Action の中で、キャッシュを無効にして同じリクエストで新しいデータを読む。",
          "更新した本人にすぐ結果を見せたいときに使う。Next.js 16 以降。",
        ),
        item(
          "revalidate-path",
          "パスで作り直す",
          'revalidatePath("/blog");',
          "指定したパスのキャッシュを無効にする。",
        ),
      ],
    },
    // フォームの送信先になるサーバーの関数。外から直接呼べるので、中で必ず検証する。
    {
      id: "server-actions",
      title: "Server Actions",
      description: "フォームやボタンから、サーバーの関数を直接呼ぶ。",
      items: [
        item(
          "define-server-action",
          "Server Action を作る",
          '"use server";\n\nexport async function createPost(formData: FormData) { … }',
          "サーバーで実行される関数を定義する。",
          'ファイルの先頭か、関数の本体の先頭に "use server" を書く。',
        ),
        item(
          "form-action",
          "フォームから呼ぶ",
          "<form action={createPost}>…</form>",
          "送信すると、フォームの内容を FormData で受け取って実行される。",
          "JavaScript が読み込まれる前でも送信できる。",
          "info",
        ),
        item(
          "action-state",
          "結果と送信中の状態",
          "const [state, formAction, pending] = useActionState(createPost, initialState);",
          "Server Action の結果と、送信中かどうかを受け取る。",
          "React の機能。Client Component で使う。",
        ),
        item(
          "validate-in-action",
          "中で検証と権限確認をする",
          undefined,
          "Server Action は外から直接呼び出せる。入力の検証とログイン・権限の確認を、関数の中で必ず行う。",
          "画面側の入力チェックだけでは防げない。",
          "warning",
        ),
        item(
          "refresh",
          "キャッシュしていないデータを更新",
          "refresh();",
          "Server Action の中で、キャッシュしていないデータだけを取り直して表示を更新する。",
          "next/cache から import する。Next.js 16 以降。",
        ),
      ],
    },
    // API のルートと、ページに届く前の処理（Proxy）。cookies() などは 15 から非同期。
    {
      id: "route-handlers-proxy",
      title: "Route Handlers・Proxy",
      description: "API のルートを作り、リクエストがページに届く前に処理を挟む。",
      items: [
        item(
          "route-get",
          "GET に応答",
          "export async function GET(request: Request) {\n  return Response.json({ ok: true });\n}",
          "route.ts で GET を export すると、JSON などで応答する。",
        ),
        item(
          "route-post",
          "POST を受け取る",
          "export async function POST(request: Request) {\n  const body = await request.json();\n}",
          "リクエストの本文を読み取って処理する。",
        ),
        item(
          "route-params",
          "Route Handler の params",
          "export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) { … }",
          "第2引数から、動的なセグメントの値を受け取る。",
          "page と同じく Promise なので await する。",
        ),
        item(
          "proxy",
          "Proxy（旧 Middleware）",
          'export default function proxy(request: NextRequest) {\n  return NextResponse.redirect(new URL("/login", request.url));\n}',
          "リクエストがページに届く前に、リダイレクトや書き換えを行う。",
          "Next.js 16 で middleware.ts から proxy.ts に変わり、Node.js で動く。ファイルはプロジェクトのルート（または src）に置く。middleware.ts も Edge 向けに残っているが非推奨で、いずれ削除される。",
        ),
        item(
          "proxy-matcher",
          "Proxy を動かすパス",
          'export const config = { matcher: ["/dashboard/:path*"] };',
          "Proxy を実行するパスを絞る。",
        ),
        item(
          "cookies",
          "cookie を読む",
          'const cookieStore = await cookies();\ncookieStore.get("theme");',
          "リクエストの cookie を読む。Server Action や Route Handler では書き込みもできる。",
          "next/headers から import する。Next.js 15 から非同期。",
        ),
        item(
          "headers",
          "リクエストヘッダーを読む",
          'const headersList = await headers();\nheadersList.get("user-agent");',
          "リクエストのヘッダーを読む。",
          "next/headers から import する。Next.js 15 から非同期。",
        ),
      ],
    },
    // 最適化された組み込みコンポーネント。
    {
      id: "built-ins",
      title: "画像・フォント・スクリプト",
      description: "表示を速くする組み込みのコンポーネントと関数。",
      items: [
        item(
          "image",
          "画像",
          '<Image src="/hero.png" alt="トップ画像" width={1200} height={600} />',
          "画像を最適化して表示する。幅と高さを指定して、読み込み時のずれを防ぐ。",
          "next/image から import する。",
          "info",
        ),
        item(
          "remote-images",
          "外部の画像を許可",
          'images: { remotePatterns: [new URL("https://cdn.example.com/**")] }',
          "next.config で、表示してよい外部の画像の URL を指定する。",
          "images.domains は非推奨。Next.js 16 から、クエリ付きのローカル画像にも images.localPatterns の指定が要る。既定の品質も [75] だけになった。",
        ),
        item(
          "next-font",
          "フォント",
          'const inter = Inter({ subsets: ["latin"] });',
          "Google Fonts などを、自分のサイトから配信する形で読み込む。",
          "next/font/google から import し、inter.className を要素に付ける。",
        ),
        item(
          "script",
          "外部スクリプト",
          '<Script src="https://example.com/analytics.js" strategy="afterInteractive" />',
          "外部スクリプトを読み込むタイミングを指定する。",
          "next/script から import する。",
        ),
        item(
          "next-form",
          "検索フォーム",
          '<Form action="/search"><input name="q" /></Form>',
          "送信すると、入力値をクエリにして移動先のページへクライアント側で移動する。",
          "next/form から import する。",
        ),
      ],
    },
    // 設定ファイルと環境変数。NEXT_PUBLIC_ はブラウザに埋め込まれる点を warning で示す。
    {
      id: "config-env",
      title: "設定・環境変数",
      description: "next.config.ts と環境変数、出力の形式。",
      items: [
        item(
          "next-config",
          "設定ファイル",
          "const nextConfig: NextConfig = { reactCompiler: true };\nexport default nextConfig;",
          "Next.js の設定を next.config.ts に書く。",
          "React Compiler は 16 で安定版になった（既定は無効）。",
        ),
        item(
          "public-env",
          "ブラウザに公開する環境変数",
          "NEXT_PUBLIC_API_URL=https://api.example.com",
          "NEXT_PUBLIC_ で始まる環境変数は、ビルド時にブラウザ向けのコードへ埋め込まれる。",
          "誰でも読めるので、秘密情報には付けない。",
          "warning",
        ),
        item(
          "server-env",
          "サーバーだけの環境変数",
          "process.env.DATABASE_URL",
          "NEXT_PUBLIC_ が付かない環境変数は、サーバー側のコードでだけ読める。",
        ),
        item(
          "env-local",
          "ローカルの環境変数",
          ".env.local",
          "自分の環境だけで使う値を書く。Git にはコミットしない。",
          ".env.development や .env.production で環境ごとに分けられる。",
        ),
        item(
          "output-standalone",
          "必要なファイルだけを出力",
          'output: "standalone"',
          "本番で動かすのに必要なファイルだけを .next/standalone にまとめる。",
          "Docker イメージを小さくするときに使う。",
        ),
        item(
          "output-export",
          "静的なファイルとして書き出す",
          'output: "export"',
          "サーバーなしで配信できる HTML などとして書き出す。",
          "リクエストごとの描画や Server Actions など、サーバーが要る機能は使えない。",
        ),
        item(
          "redirects",
          "リダイレクトの設定",
          'async redirects() { return [{ source: "/old", destination: "/new", permanent: true }]; }',
          "next.config で、パスごとのリダイレクトを設定する。",
        ),
      ],
    },
  ],
};
