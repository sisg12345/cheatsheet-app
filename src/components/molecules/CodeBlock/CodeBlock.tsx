import type { CSSProperties } from "react";
import { CopyButton } from "@/src/features/code-copy/CopyButton";
import styles from "./CodeBlock.module.css";

interface CodeBlockProps {
  code: string;
  /** 上下の余白を詰める。項目一覧に並べるときに使う。 */
  compact?: boolean;
}

/** 行頭の空白の数。折り返した続きの行を、その行の字下げより深く始めるために使う。 */
function countIndent(line: string): number {
  return line.length - line.trimStart().length;
}

export function CodeBlock({ code, compact = false }: CodeBlockProps) {
  const lines = code.split("\n");

  return (
    <div className={`${styles.wrapper} ${compact ? styles.compact : ""}`}>
      {/* 複数行（設定ファイルの例など）は1行ずつ描き、折り返した続きの行を字下げに合わせる。
          1行のコマンドはこれまでどおりそのまま折り返す。コピーされるのはどちらも code そのもの。 */}
      <code>
        {lines.length === 1
          ? code
          : lines.map((line, index) => (
              <span
                key={index}
                className={styles.line}
                style={{ "--indent": countIndent(line) } as CSSProperties}
              >
                {line}
              </span>
            ))}
      </code>
      <div className={styles.copy}>
        <CopyButton value={code} />
      </div>
    </div>
  );
}
