import { CopyButton } from "@/src/features/code-copy/CopyButton";
import styles from "./CodeBlock.module.css";

interface CodeBlockProps {
  code: string;
  /** 上下の余白を詰める。項目一覧に並べるときに使う。 */
  compact?: boolean;
}

export function CodeBlock({ code, compact = false }: CodeBlockProps) {
  return (
    <div className={`${styles.wrapper} ${compact ? styles.compact : ""}`}>
      <code>{code}</code>
      <div className={styles.copy}>
        <CopyButton value={code} />
      </div>
    </div>
  );
}
