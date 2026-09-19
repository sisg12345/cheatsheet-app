import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import type { CheatSheetSummary } from "@/src/cheatsheets/types";
import { formatIndex } from "@/src/lib/formatIndex";
import styles from "./CheatSheetCard.module.css";

interface CheatSheetCardProps {
  sheet: CheatSheetSummary;
  /** 0始まり。左上の通し番号に使う。 */
  index: number;
  /** 横に流すカルーセルに並べる小さい版。一覧のカードと同じ見た目のまま全体を詰め、説明は1行に切り詰める。 */
  compact?: boolean;
}

export function CheatSheetCard({ sheet, index, compact = false }: CheatSheetCardProps) {
  // カスタムプロパティをインラインstyleに書くため、CSSProperties へのキャストが要る。
  const Title = compact ? "div" : "h2";
  return (
    <Link
      className={`${styles.card} ${compact ? styles.compact : ""}`}
      to={`/cheatsheets/${sheet.slug}`}
      style={{ "--sheet-accent": sheet.accent } as CSSProperties}
    >
      <div className={styles.topline}>
        <span>{formatIndex(index)}</span>
        <span>{sheet.eyebrow}</span>
      </div>

      {/* 題名はシートの正式名。小さい版で見出しにしないのは、同じシートを一覧のカードが
          h2 で出しており、見出しでたどると同じ名前が2回ずつ並ぶため。
          番号・題名・説明・収録数を包まずに並べるのは、一覧で同じ行のカード同士の
          行の高さを subgrid でそろえるため（CheatSheetCard.module.css の .card）。 */}
      <Title className={styles.monogram}>
        <span className={styles.name}>{sheet.name}</span>
      </Title>
      <p>{sheet.description}</p>

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
