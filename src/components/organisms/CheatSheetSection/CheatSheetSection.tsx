import { Badge } from "@/src/components/atoms/Badge/Badge";
import { CodeBlock } from "@/src/components/molecules/CodeBlock/CodeBlock";
import type { CheatSheetSection as Section } from "@/src/cheatsheets/types";
import styles from "./CheatSheetSection.module.css";

interface CheatSheetSectionProps {
  section: Section;
  index: number;
}

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
        <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
        <div>
          <h2>{section.title}</h2>
          {section.description ? <p>{section.description}</p> : null}
        </div>
        <span className={styles.count}>{section.items.length} ITEMS</span>
      </header>
      <div className={styles.items}>
        {section.items.map((entry) => (
          <article className={styles.item} key={entry.id}>
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
            <div className={styles.code}>
              {entry.syntax ? <CodeBlock code={entry.syntax} compact /> : <span>—</span>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
