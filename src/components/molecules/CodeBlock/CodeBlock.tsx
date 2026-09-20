import type { CSSProperties, ReactNode } from "react";
import { CopyButton } from "@/src/features/code-copy/CopyButton";
import styles from "./CodeBlock.module.css";

interface CodeBlockProps {
  code: string;
  /** 上下の余白を詰める。項目一覧に並べるときに使う。 */
  compact?: boolean;
}

/**
 * ハイフンの並び（2個まで）と、その次の1文字。ここで分けて折り返しを止める。
 * 2個までにしているのは、長い区切り線（`----…`）が丸ごとひとかたまりになって
 * 枠からはみ出すのを防ぐため。並びの末尾2個だけを次の文字とつなぎ止める。
 */
const HYPHEN_GROUP = /(-{1,2}[^\s-])/;

/** 行頭の空白の数。折り返した続きの行を、その行の字下げより深く始めるために使う。 */
function countIndent(line: string): number {
  return line.length - line.trimStart().length;
}

/**
 * ブラウザはハイフンの直後を折り返せる場所として扱う（UAX #14）ため、狭い画面では
 * `--menu` が `--` と `menu` に分かれ、`--` が別の値のように見えてしまう。
 * ハイフンとその次の1文字を、折り返さない span でくくって、この折り返しだけを止める。
 * 文字は足さないので、選択してコピーした内容は元のコードのまま。
 */
function protectHyphens(text: string): ReactNode {
  if (!text.includes("-")) return text;
  // 区切り文字を取り出す split なので、奇数番目が HYPHEN_GROUP に一致した部分になる。
  return text.split(HYPHEN_GROUP).map((part, index) =>
    index % 2 === 1 ? (
      <span key={index} className={styles.noBreak}>
        {part}
      </span>
    ) : (
      part
    ),
  );
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
          ? protectHyphens(code)
          : lines.map((line, index) => {
              const { indent, head, tail } = splitLine(line);
              return (
                <span
                  key={index}
                  className={styles.line}
                  style={{ "--indent": indent } as CSSProperties}
                >
                  {line.slice(0, indent)}
                  <span className={styles.lineHead}>{protectHyphens(head)}</span>
                  {protectHyphens(tail)}
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
