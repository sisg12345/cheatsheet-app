import { Link } from "react-router-dom";
import type { CheatSheetSummary } from "@/src/cheatsheets/types";
import styles from "./CheatSheetCard.module.css";

interface CheatSheetCardProps {
  sheet: CheatSheetSummary;
  index: number;
}

export function CheatSheetCard({ sheet, index }: CheatSheetCardProps) {
  return (
    <Link
      className={styles.card}
      to={`/cheatsheets/${sheet.slug}`}
      style={{ "--sheet-accent": sheet.accent } as React.CSSProperties}
    >
      <div className={styles.topline}>
        <span>{String(index + 1).padStart(2, "0")}</span>
        <span>{sheet.eyebrow}</span>
      </div>
      <div className={styles.monogram} aria-hidden="true">
        {sheet.shortTitle}
      </div>
      <div>
        <h2>{sheet.title}</h2>
        <p>{sheet.description}</p>
      </div>
      <dl className={styles.stats}>
        <div>
          <dt>SECTIONS</dt>
          <dd>{sheet.sectionCount}</dd>
        </div>
        <div>
          <dt>ITEMS</dt>
          <dd>{sheet.itemCount}</dd>
        </div>
        <div className={styles.open}>
          <dt>OPEN</dt>
          <dd aria-hidden="true">↗</dd>
        </div>
      </dl>
    </Link>
  );
}
