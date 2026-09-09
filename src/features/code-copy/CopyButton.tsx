import { useEffect, useRef, useState } from "react";
import { Button } from "@/src/components/atoms/Button/Button";

/** 「コピー済み」表示を保つ時間。 */
const COPIED_LABEL_MS = 1400;

interface CopyButtonProps {
  value: string;
}

export function CopyButton({ value }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  /** 連打されたら前のタイマーを捨て、最後のコピーから数え直す。 */
  const flagCopied = () => {
    setCopied(true);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopied(false), COPIED_LABEL_MS);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      flagCopied();
    } catch {
      // Clipboard API はHTTPS以外の配信や権限拒否で失敗する。その環境向けの保険。
      // 画面外ではなく透明な固定要素にするのは、select() にレイアウトが必要なため。
      const helper = document.createElement("textarea");
      helper.value = value;
      helper.style.position = "fixed";
      helper.style.opacity = "0";
      document.body.appendChild(helper);
      helper.select();
      const succeeded = document.execCommand("copy");
      helper.remove();
      if (succeeded) flagCopied();
    }
  };

  return (
    <Button size="sm" variant="ghost" onClick={copy} aria-live="polite">
      {copied ? "コピー済み" : "コピー"}
    </Button>
  );
}
