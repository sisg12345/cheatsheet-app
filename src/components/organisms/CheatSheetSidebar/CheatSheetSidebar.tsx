import { Link } from "react-router-dom";
import type { CheatSheetSection } from "@/src/cheatsheets/types";
import styles from "./CheatSheetSidebar.module.css";

interface CheatSheetSidebarProps {
  sections: CheatSheetSection[];
}

export function CheatSheetSidebar({ sections }: CheatSheetSidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <Link className={styles.back} to="/">
        ← 一覧へ戻る
      </Link>
      <p className={styles.label}>CONTENTS</p>
      <nav aria-label="チートシート目次">
        {sections.map((section, index) => (
          <a key={section.id} href={`#${section.id}`}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            {section.title}
          </a>
        ))}
      </nav>
    </aside>
  );
}
