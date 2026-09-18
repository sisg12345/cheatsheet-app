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

/**
 * 1行を、字下げ・最初の語・残りに分ける。最初の語だけを CSS で途中改行できるようにし、
 * 長いキーなどが字下げの直後で丸ごと次の行へ送られて、1行目が空白だけになるのを防ぐ。
 */
function splitLine(line: string) {
  const indent = countIndent(line);
  const body = line.slice(indent);
  const headEnd = body.search(/\s/);
  return {
    indent,
    head: headEnd === -1 ? body : body.slice(0, headEnd),
    tail: headEnd === -1 ? "" : body.slice(headEnd),
  };
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
          : lines.map((line, index) => {
              const { indent, head, tail } = splitLine(line);
              return (
                <span
                  key={index}
                  className={styles.line}
                  style={{ "--indent": indent } as CSSProperties}
                >
                  {line.slice(0, indent)}
                  <span className={styles.lineHead}>{head}</span>
                  {tail}
                </span>
              );
            })}
      </code>
      <div className={styles.copy}>
        <CopyButton value={code} />
      </div>
    </div>
  );
}
