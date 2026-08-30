/**
 * チートシート本文の1セクション。見出しと、その配下の項目一覧を表示する。
 * 検索で絞り込まれた後のセクションを受け取るため、items が元データと異なることがある。
 */
import { Badge } from "@/src/components/atoms/Badge/Badge";
import { CodeBlock } from "@/src/components/molecules/CodeBlock/CodeBlock";
import type { CheatSheetSection as Section } from "@/src/cheatsheets/types";
import { formatIndex } from "@/src/lib/formatIndex";
import styles from "./CheatSheetSection.module.css";

interface CheatSheetSectionProps {
  /** 表示するセクション。検索後は items が絞り込まれた状態で渡る。 */
  section: Section;
  /** 表示上の並び順（0始まり）。見出し左の番号に使う。 */
  index: number;
}

/**
 * ItemStatus と画面表示ラベルの対応表。
 * `as const` で全キーを網羅させ、状態を増やしたときにここの追加漏れを型エラーで検出する。
 */
const statusLabels = {
  normal: "標準",
  info: "推奨",
  warning: "注意",
  danger: "危険",
} as const;

export function CheatSheetSection({ section, index }: CheatSheetSectionProps) {
  // id は目次のアンカー（#id）の飛び先。section.id をそのまま使う必要がある。
  return (
    <section className={styles.section} id={section.id}>
      {/* セクション見出し。番号・タイトル・件数の3カラム。 */}
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
          // key は CheatSheetItem.id。シート内で一意である前提。
          <article className={styles.item} key={entry.id}>
            {/* normal はバッジを出さない。全項目に「標準」が並ぶと目印にならないため。 */}
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

            {/* syntax の無い項目にはダッシュを置き、3カラムの列崩れを防ぐ。 */}
            <div className={styles.code}>
              {entry.syntax ? <CodeBlock code={entry.syntax} compact /> : <span>—</span>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
