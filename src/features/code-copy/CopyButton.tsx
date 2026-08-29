import { useEffect, useRef, useState } from "react";
import { Button } from "@/src/components/atoms/Button/Button";

interface CopyButtonProps {
  value: string;
}

export function CopyButton({ value }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const flagCopied = () => {
    setCopied(true);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopied(false), 1400);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      flagCopied();
    } catch {
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
