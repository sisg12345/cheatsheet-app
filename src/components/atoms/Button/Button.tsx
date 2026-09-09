import type { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "ghost" | "outline";
  size?: "sm" | "md";
}

export function Button({
  className = "",
  variant = "outline",
  size = "md",
  // フォーム内に置いたときの意図しない送信を防ぐ。
  type = "button",
  ...props
}: ButtonProps) {
  // class属性の並び順はカスケードに影響しない（効くのは詳細度と読み込み順）。
  // 上書きしたい呼び出し側は詳細度を上げること（例: CodeBlock の `.copy button`）。
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${className}`}
      {...props}
    />
  );
}
