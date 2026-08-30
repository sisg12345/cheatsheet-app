/**
 * 最小単位のボタン。atomsなのでfeaturesやドメインには依存しない。
 * variant / size の見た目だけを持ち、押したときの挙動は呼び出し側が決める。
 */
import type { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

/** `<button>` の標準属性（onClick、disabled、aria-* など）をそのまま受け付ける。 */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 見た目の系統。既定は枠線のみの `outline`。 */
  variant?: "solid" | "ghost" | "outline";
  /** 大きさ。ツールバーなど密度の高い場所では `sm`。 */
  size?: "sm" | "md";
}

export function Button({
  className = "",
  variant = "outline",
  size = "md",
  // 既定を "button" にして、フォーム内に置いたときの意図しない送信を防ぐ。
  type = "button",
  ...props
}: ButtonProps) {
  // 受け取ったclassNameは最後に連結する。CSS Modulesの定義順ではなく
  // 記述順で後勝ちになるため、呼び出し側から個別に上書きできる。
  // 残りのpropsはそのままspreadし、標準属性を素通しさせる。
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${className}`}
      {...props}
    />
  );
}
