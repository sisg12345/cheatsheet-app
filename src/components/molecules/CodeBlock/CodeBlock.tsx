/**
 * コード例の表示枠。コード本体とコピーボタンを組み合わせた molecule。
 * コピー処理そのものは features/code-copy に委ねている。
 */
import { CopyButton } from "@/src/features/code-copy/CopyButton";
import styles from "./CodeBlock.module.css";

interface CodeBlockProps {
  /** 表示するコード。そのままコピー対象にもなる。 */
  code: string;
  /** 上下の余白を詰めた表示にする。項目一覧に並べるときに使う。 */
  compact?: boolean;
}

export function CodeBlock({ code, compact = false }: CodeBlockProps) {
  // コピーボタンは wrapper に対して絶対配置される。
  // wrapper 右側の padding は、長いコードがボタンの下に潜り込まないための余白。
  return (
    <div className={`${styles.wrapper} ${compact ? styles.compact : ""}`}>
      <code>{code}</code>
      <div className={styles.copy}>
        <CopyButton value={code} />
      </div>
    </div>
  );
}
