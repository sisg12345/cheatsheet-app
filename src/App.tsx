import { Route, Routes, useParams } from "react-router-dom";
import { cheatSheetSummaries, getCheatSheetSummary } from "@/src/cheatsheets/registry";
import { AppHeader } from "@/src/components/organisms/AppHeader/AppHeader";
import { useScrollToTopOnNavigate } from "@/src/features/scroll-to-top/useScrollToTopOnNavigate";
import { CatalogPage } from "@/src/pages/CatalogPage/CatalogPage";
import { CheatSheetPage } from "@/src/pages/CheatSheetPage/CheatSheetPage";
import { NotFoundPage } from "@/src/pages/NotFoundPage/NotFoundPage";

function CheatSheetRoute() {
  const { slug = "" } = useParams();
  const summary = getCheatSheetSummary(slug);

  // key でシートごとに作り直す。検索語はURLからも取り直すので表示自体は key なしでも
  // 追随するが、シート固有の状態をまとめて捨てられるほうが後から状態を足しやすい。
  // 中身の読み込み待ち（Suspense）も作り直されるので、別のシートへ移ると前のシートを出したまま
  // 待たずに、移り先の見出しと読み込み中の表示がすぐ出る。
  return summary ? <CheatSheetPage key={summary.slug} summary={summary} /> : <NotFoundPage />;
}

export default function App() {
  // 別のページへ移ったら先頭から見せる（戻る・進むではブラウザの復元に任せる）。
  useScrollToTopOnNavigate();

  // ヘッダーは Routes の外に置き、ページ遷移で再マウントさせない。
  return (
    <>
      <AppHeader sheets={cheatSheetSummaries} />
      <Routes>
        <Route path="/" element={<CatalogPage sheets={cheatSheetSummaries} />} />
        <Route path="/cheatsheets/:slug" element={<CheatSheetRoute />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
