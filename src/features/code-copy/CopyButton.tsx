/**
 * コード例をクリップボードへコピーするボタン。
 * CodeBlock から使われ、コピー後は一時的にラベルを「コピー済み」に変える。
 */
import { useEffect, useRef, useState } from "react";
import { Button } from "@/src/components/atoms/Button/Button";

interface CopyButtonProps {
  /** コピー対象の文字列。ボタンのラベルには出さない。 */
  value: string;
}

export function CopyButton({ value }: CopyButtonProps) {
  // コピー完了表示中かどうか。
  const [copied, setCopied] = useState(false);
  // 表示を元に戻すsetTimeoutのID。連打時に前のタイマーを打ち消すために保持する。
  const timerRef = useRef<number | undefined>(undefined);

  // アンマウント後にsetStateが走らないよう、タイマーを止めてから消える。
  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  /** 「コピー済み」表示にして、1.4秒後に元のラベルへ戻す。 */
  const flagCopied = () => {
    setCopied(true);
    // 連打されたら前のタイマーを捨て、最後のコピーから1.4秒数え直す。
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopied(false), 1400);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      flagCopied();
    } catch {
      // Clipboard APIはHTTPS以外の配信や権限拒否で失敗する。
      // その環境でもコピーできるよう、非推奨のexecCommandを保険として残している。
      // 画面外ではなく透明な固定要素にするのは、select()にレイアウトが必要なため。
      const helper = document.createElement("textarea");
      helper.value = value;
      helper.style.position = "fixed";
      helper.style.opacity = "0";
      document.body.appendChild(helper);
      helper.select();
      const succeeded = document.execCommand("copy");
      helper.remove();
      // 失敗したときは何も表示を変えない（コピーできていないため）。
      if (succeeded) flagCopied();
    }
  };

  // aria-live="polite" で、ラベルの変化をスクリーンリーダーに伝える。
  return (
    <Button size="sm" variant="ghost" onClick={copy} aria-live="polite">
      {copied ? "コピー済み" : "コピー"}
    </Button>
  );
}
