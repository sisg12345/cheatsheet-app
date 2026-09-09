import { Route, Routes, useParams } from "react-router-dom";
import { cheatSheetSummaries, getCheatSheet } from "@/src/cheatsheets/registry";
import { AppHeader } from "@/src/components/organisms/AppHeader/AppHeader";
import { CatalogPage } from "@/src/pages/CatalogPage/CatalogPage";
import { CheatSheetPage } from "@/src/pages/CheatSheetPage/CheatSheetPage";
import { NotFoundPage } from "@/src/pages/NotFoundPage/NotFoundPage";

function CheatSheetRoute() {
  const { slug = "" } = useParams();
  const sheet = getCheatSheet(slug);

  // key でシートごとに作り直す。検索語はURLからも取り直すので表示自体は key なしでも
  // 追随するが、シート固有の状態をまとめて捨てられるほうが後から状態を足しやすい。
  return sheet ? <CheatSheetPage key={sheet.slug} sheet={sheet} /> : <NotFoundPage />;
}

export default function App() {
  // ヘッダーは Routes の外に置き、ページ遷移で再マウントさせない。
  return (
    <>
      <AppHeader />
      <Routes>
        <Route path="/" element={<CatalogPage sheets={cheatSheetSummaries} />} />
        <Route path="/cheatsheets/:slug" element={<CheatSheetRoute />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
