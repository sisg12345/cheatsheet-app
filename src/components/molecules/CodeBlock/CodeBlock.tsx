import { CopyButton } from "@/src/features/code-copy/CopyButton";
import styles from "./CodeBlock.module.css";

interface CodeBlockProps {
  code: string;
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
