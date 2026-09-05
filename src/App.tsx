/**
 * ルーティングと画面の骨組み。
 *
 * ヘッダーは Routes の外側に置いてあるため、ページ遷移しても再マウントされない
 * （テーマ切り替えの状態が遷移のたびに初期化されるのを避けている）。
 */
import { Link, Route, Routes, useParams } from "react-router-dom";
import { cheatSheetSummaries, getCheatSheet } from "@/src/cheatsheets/registry";
import { AppHeader } from "@/src/components/organisms/AppHeader/AppHeader";
import { CatalogLayout } from "@/src/components/templates/CatalogLayout/CatalogLayout";
import { CheatSheetLayout } from "@/src/components/templates/CheatSheetLayout/CheatSheetLayout";

/**
 * URLの :slug からシートを解決する。
 * registry に無い slug は undefined が返るので、そのまま404表示に落とす。
 */
function CheatSheetPage() {
  const { slug = "" } = useParams();
  const sheet = getCheatSheet(slug);
  // key を付けることで、シートを切り替えたときに CheatSheetLayout を作り直す。
  // 前のシートの検索状態やスクロール位置を引きずらないため。
  return sheet ? <CheatSheetLayout key={sheet.slug} sheet={sheet} /> : <NotFound />;
}

/** 404表示。専用のCSS Modulesを持たないので、スタイルはインラインで完結させている。 */
function NotFound() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "8rem 1.5rem" }}>
      <p style={{ color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}>404 / NOT FOUND</p>
      <h1 style={{ marginTop: "1rem", fontSize: "clamp(2.5rem, 7vw, 5rem)" }}>
        ページが見つかりません
      </h1>
      <p style={{ margin: "1.5rem 0", color: "var(--color-muted)" }}>
        URLを確認するか、一覧からチートシートを選択してください。
      </p>
      <Link to="/" style={{ color: "var(--color-accent)", fontWeight: 700 }}>
        ← チートシート一覧へ
      </Link>
    </main>
  );
}

export default function App() {
  // シートごとのルートは切らず、:slug ひとつで受けて registry に解決させる。
  // シートを追加しても registry の配列に足すだけで済む。
  return (
    <>
      <AppHeader />
      <Routes>
        <Route path="/" element={<CatalogLayout sheets={cheatSheetSummaries} />} />
        <Route path="/cheatsheets/:slug" element={<CheatSheetPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
