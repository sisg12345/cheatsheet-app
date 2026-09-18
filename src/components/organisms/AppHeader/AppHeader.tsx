import { Link } from "react-router-dom";
import type { CheatSheetSummary } from "@/src/cheatsheets/types";
import { ThemeToggle } from "@/src/features/theme-switch/ThemeToggle";
import { SheetMenu } from "./SheetMenu";
import styles from "./AppHeader.module.css";

interface AppHeaderProps {
  /** メニューに並べるシート。registry の cheatSheetSummaries がそのまま渡る。 */
  sheets: CheatSheetSummary[];
}

export function AppHeader({ sheets }: AppHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* ロゴ。"C/" の記号部分は装飾なので読み上げから外し、
            リンク全体には aria-label で行き先を明示する。 */}
        <Link className={styles.brand} to="/" aria-label="CheatSheet Hub ホーム">
          <span className={styles.mark} aria-hidden="true">
            C/
          </span>
          <span>CHEATSHEET HUB</span>
        </Link>

        {/* シートへの移動はメニューにまとめ、中身は registry から作る。
            シートを増やしてもヘッダーの幅は変わらず、どの画面幅でも全シートへ行ける。 */}
        <nav className={styles.nav} aria-label="メインナビゲーション">
          <Link to="/">一覧</Link>
          <SheetMenu sheets={sheets} />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
