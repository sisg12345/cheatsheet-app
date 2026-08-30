/**
 * 全ページ共通の固定ヘッダー。ブランドロゴ・主要リンク・テーマ切り替えを並べる。
 * App.tsx が Routes の外側に置いているため、ページ遷移しても再マウントされない。
 */
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/src/features/theme-switch/ThemeToggle";
import styles from "./AppHeader.module.css";

export function AppHeader() {
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

        {/* シートへの直リンク。収録数が増えたら registry から生成する形に変える想定。
            狭い画面ではCSS側で一覧以外のリンクを隠している。 */}
        <nav className={styles.nav} aria-label="メインナビゲーション">
          <Link to="/">一覧</Link>
          <Link to="/cheatsheets/html">HTML</Link>
          <Link to="/cheatsheets/git">Git</Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
