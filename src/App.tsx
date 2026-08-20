import { Link, Route, Routes, useParams } from "react-router-dom";
import { cheatSheetSummaries, getCheatSheet } from "@/src/cheatsheets/registry";
import { AppHeader } from "@/src/components/organisms/AppHeader/AppHeader";
import { CatalogLayout } from "@/src/components/templates/CatalogLayout/CatalogLayout";
import { CheatSheetLayout } from "@/src/components/templates/CheatSheetLayout/CheatSheetLayout";

function CheatSheetPage() {
  const { slug = "" } = useParams();
  const sheet = getCheatSheet(slug);
  return sheet ? <CheatSheetLayout sheet={sheet} /> : <NotFound />;
}

function NotFound() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "8rem 1.5rem" }}>
      <p style={{ color: "var(--muted)", fontFamily: "var(--font-mono)" }}>404 / NOT FOUND</p>
      <h1 style={{ marginTop: "1rem", fontSize: "clamp(2.5rem, 7vw, 5rem)" }}>
        ページが見つかりません
      </h1>
      <p style={{ margin: "1.5rem 0", color: "var(--muted)" }}>
        URLを確認するか、一覧からチートシートを選択してください。
      </p>
      <Link to="/" style={{ color: "var(--accent)", fontWeight: 700 }}>
        ← チートシート一覧へ
      </Link>
    </main>
  );
}

export default function App() {
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
