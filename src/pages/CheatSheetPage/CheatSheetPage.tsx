import {
  Component,
  Suspense,
  use,
  useMemo,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { loadCheatSheet } from "@/src/cheatsheets/registry";
import type { CheatSheetSummary } from "@/src/cheatsheets/types";
import { Button } from "@/src/components/atoms/Button/Button";
import { SearchBox } from "@/src/components/molecules/SearchBox/SearchBox";
import { CheatSheetSection } from "@/src/components/organisms/CheatSheetSection/CheatSheetSection";
import { CheatSheetSidebar } from "@/src/components/organisms/CheatSheetSidebar/CheatSheetSidebar";
import { filterCheatSheetSections } from "@/src/features/cheat-sheet-search/filterCheatSheet";
import { useSearchShortcuts } from "@/src/features/cheat-sheet-search/useSearchShortcuts";
import { useUrlQuery } from "@/src/features/cheat-sheet-search/useUrlQuery";
import styles from "./CheatSheetPage.module.css";

interface CheatSheetPageProps {
  summary: CheatSheetSummary;
}

/**
 * シートのページ。セクションと出典（content.ts）はシートを開いてから読み込む。
 * 見出しはサマリーだけで出せるので読み込みを待たずに出し、検索欄の位置には読み込み中の表示を出す。
 */
export function CheatSheetPage({ summary }: CheatSheetPageProps) {
  return (
    <LoadErrorBoundary
      fallback={
        <CheatSheetLayout
          summary={summary}
          search={
            <div className={styles.notice} role="alert">
              <span>
                シートを読み込めませんでした。通信状態を確かめて、読み込み直してください。
              </span>
              <Button size="sm" onClick={() => window.location.reload()}>
                再読み込み
              </Button>
            </div>
          }
        />
      }
    >
      <Suspense
        fallback={
          <CheatSheetLayout
            summary={summary}
            search={
              <div className={`${styles.notice} ${styles.loading}`} role="status">
                シートを読み込んでいます…
              </div>
            }
          />
        }
      >
        <LoadedCheatSheet summary={summary} />
      </Suspense>
    </LoadErrorBoundary>
  );
}

/** 検索語をURLの `?q=` に持たせ、絞り込んだ状態のURLをそのまま共有・復元できるようにする。 */
function LoadedCheatSheet({ summary }: CheatSheetPageProps) {
  // 読み込み終わるまではここでサスペンドし、上の Suspense が読み込み中の表示に差し替える。
  const content = use(loadCheatSheet(summary.slug));
  const [query, setQuery] = useUrlQuery();
  const searchRef = useRef<HTMLInputElement>(null);

  // 目次と本文が同じ結果を使うので、両者の表示は常に一致する。
  const filteredSections = useMemo(
    () => filterCheatSheetSections(content.sections, query),
    [query, content.sections],
  );
  const visibleItems = filteredSections.reduce((sum, section) => sum + section.items.length, 0);

  useSearchShortcuts(searchRef, () => setQuery(""));

  return (
    <CheatSheetLayout
      summary={summary}
      search={
        <SearchBox
          ref={searchRef}
          value={query}
          onChange={setQuery}
          placeholder="構文、説明、キーワードを検索"
          resultLabel={`${filteredSections.length} セクション / ${visibleItems} 項目`}
        />
      }
    >
      {/* content: 目次と本文。検索で0件になったら本文側だけ空状態に差し替える。 */}
      <div className={styles.content}>
        <CheatSheetSidebar sections={filteredSections} />
        <div className={styles.sections}>
          {filteredSections.length ? (
            filteredSections.map((section, index) => (
              <CheatSheetSection key={section.id} section={section} index={index} />
            ))
          ) : (
            <div className={styles.empty}>
              <strong>一致する項目がありません</strong>
              <p>検索語を短くするか、別のキーワードをお試しください。</p>
            </div>
          )}
        </div>
      </div>

      {/* footer: 更新日、対象の版、出典。外部リンクなので rel="noreferrer" を付ける。 */}
      <footer className={styles.footer}>
        <div>
          <span>UPDATED</span>
          <strong>{content.updatedAt}</strong>
        </div>
        <div>
          <span>TARGET</span>
          <strong>{content.target}</strong>
        </div>
        <div>
          <span>SOURCES</span>
          {content.sources.map((source) => (
            <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
              {source.label} ↗
            </a>
          ))}
        </div>
      </footer>
    </CheatSheetLayout>
  );
}

interface CheatSheetLayoutProps extends CheatSheetPageProps {
  /** 見出しの下、検索欄の位置に出すもの。読み込み中と失敗時は検索欄の代わりに案内を出す。 */
  search: ReactNode;
  /** 見出しより下（目次・本文・フッター）。中身を読み込むまでは無い。 */
  children?: ReactNode;
}

/**
 * ページの枠と見出し。読み込み中・失敗時・読み込み後のどれでも同じものを出し、
 * 中身が届いて差し替わっても、見出しの位置と見た目が変わらないようにする。
 */
function CheatSheetLayout({ summary, search, children }: CheatSheetLayoutProps) {
  return (
    <main className={styles.main} style={{ "--sheet-accent": summary.accent } as CSSProperties}>
      {/* hero: シート名とシート内検索。見出しは一覧のカードの題名と同じく、シート色の正式名だけにする
          （「チートシート」であることは上の装飾ラベルが示す）。 */}
      <header className={styles.hero}>
        <div className={styles.eyebrow}>{summary.eyebrow} / CHEAT SHEET</div>
        <div className={styles.heading}>
          <h1>{summary.name}</h1>
          <p>{summary.description}</p>
        </div>
        {search}
      </header>
      {children}
    </main>
  );
}

interface LoadErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

/**
 * 中身を読み込めなかったとき（通信が切れた、デプロイで古いチャンクが消えたなど）に fallback を出す。
 * これが無いと `use` が投げた失敗が根元まで届き、ヘッダーごと画面が消える。
 * 再読み込みを促すのは、デプロイで消えたチャンクはページを読み込み直さない限り取り直せないため。
 * シートを移ると CheatSheetPage ごと作り直される（App の key）ので、失敗の状態は持ち越さない。
 */
class LoadErrorBoundary extends Component<LoadErrorBoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
