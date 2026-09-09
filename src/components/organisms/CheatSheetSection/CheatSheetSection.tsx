import { Badge } from "@/src/components/atoms/Badge/Badge";
import { CodeBlock } from "@/src/components/molecules/CodeBlock/CodeBlock";
import type { CheatSheetSection as Section } from "@/src/cheatsheets/types";
import { formatIndex } from "@/src/lib/formatIndex";
import styles from "./CheatSheetSection.module.css";

interface CheatSheetSectionProps {
  /** 検索後は items が絞り込まれた状態で渡る。 */
  section: Section;
  /** 0始まり。見出し左の通し番号に使う。 */
  index: number;
}

/** 全キーを網羅させ、ItemStatus を増やしたときの追加漏れを型エラーで検出する。 */
const statusLabels = {
  normal: "標準",
  info: "推奨",
  warning: "注意",
  danger: "危険",
} as const;

export function CheatSheetSection({ section, index }: CheatSheetSectionProps) {
  return (
    <section className={styles.section} id={section.id}>
      <header className={styles.header}>
        <span className={styles.number}>{formatIndex(index)}</span>
        <div>
          <h2>{section.title}</h2>
          {section.description ? <p>{section.description}</p> : null}
        </div>
        <span className={styles.count}>{section.items.length} ITEMS</span>
      </header>

      <div className={styles.items}>
        {section.items.map((entry) => (
          <article className={styles.item} key={entry.id}>
            {/* normal は出さない。全項目に「標準」が並ぶと目印にならないため。 */}
            <div className={styles.itemTitle}>
              <h3>{entry.label}</h3>
              {entry.status && entry.status !== "normal" ? (
                <Badge tone={entry.status}>{statusLabels[entry.status]}</Badge>
              ) : null}
            </div>

            <div className={styles.explanation}>
              <p>{entry.description}</p>
              {entry.note ? <small>{entry.note}</small> : null}
            </div>

            {/* syntax が無い項目もダッシュで埋め、3カラムの列崩れを防ぐ。 */}
            <div className={styles.code}>
              {entry.syntax ? <CodeBlock code={entry.syntax} compact /> : <span>—</span>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
