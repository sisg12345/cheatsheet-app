import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import type { CheatSheetSummary } from "@/src/cheatsheets/types";
import { formatIndex } from "@/src/lib/formatIndex";
import styles from "./CheatSheetCard.module.css";

interface CheatSheetCardProps {
  sheet: CheatSheetSummary;
  /** 0始まり。左上の通し番号に使う。 */
  index: number;
}

export function CheatSheetCard({ sheet, index }: CheatSheetCardProps) {
  // カスタムプロパティをインラインstyleに書くため、CSSProperties へのキャストが要る。
  return (
    <Link
      className={styles.card}
      to={`/cheatsheets/${sheet.slug}`}
      style={{ "--sheet-accent": sheet.accent } as CSSProperties}
    >
      <div className={styles.topline}>
        <span>{formatIndex(index)}</span>
        <span>{sheet.eyebrow}</span>
      </div>

      {/* タイトルと重複する装飾なので読み上げからは外す。 */}
      <div className={styles.monogram} aria-hidden="true">
        {sheet.shortTitle}
      </div>

      <div>
        <h2>{sheet.title}</h2>
        <p>{sheet.description}</p>
      </div>

      {/* 収録数。ラベルと値の対なので dl で組む。
          矢印は装飾のため aria-hidden にし、OPEN のラベルだけを読ませる。 */}
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
