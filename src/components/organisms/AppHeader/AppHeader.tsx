import { Link } from "react-router-dom";
import { ThemeToggle } from "@/src/features/theme-switch/ThemeToggle";
import styles from "./AppHeader.module.css";

export function AppHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link className={styles.brand} to="/" aria-label="CheatSheet Hub ホーム">
          <span className={styles.mark} aria-hidden="true">
            C/
          </span>
          <span>CHEATSHEET HUB</span>
        </Link>
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
