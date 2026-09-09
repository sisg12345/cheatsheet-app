import { Link } from "react-router-dom";
import type { CheatSheetSection } from "@/src/cheatsheets/types";
import { formatIndex } from "@/src/lib/formatIndex";
import styles from "./CheatSheetSidebar.module.css";

interface CheatSheetSidebarProps {
  /** 順序と番号は本文側と一致させる。 */
  sections: CheatSheetSection[];
}

export function CheatSheetSidebar({ sections }: CheatSheetSidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <Link className={styles.back} to="/">
        ← 一覧へ戻る
      </Link>
      <p className={styles.label}>CONTENTS</p>

      {/* ページ内アンカーなので Link ではなく素の <a href="#id"> を使う。
          飛び先は CheatSheetSection が section.id に付けている id。
          見出しが固定ヘッダーに隠れないよう、styles.css で scroll-padding-top を効かせている。 */}
      <nav aria-label="チートシート目次">
        {sections.map((section, index) => (
          <a key={section.id} href={`#${section.id}`}>
            <span>{formatIndex(index)}</span>
            {section.title}
          </a>
        ))}
      </nav>
    </aside>
  );
}
