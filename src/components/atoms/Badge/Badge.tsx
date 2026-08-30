/**
 * 項目の状態を示す小さなラベル。
 * CheatSheetSection が `normal` 以外の項目に付ける。
 */
import type { ReactNode } from "react";
import type { ItemStatus } from "@/src/cheatsheets/types";
import styles from "./Badge.module.css";

interface BadgeProps {
  /** バッジに表示する文言（"注意"、"危険" など）。 */
  children: ReactNode;
  /**
   * 配色。`ItemStatus` をそのまま受け、値がCSS Modulesのクラス名と1対1で対応する。
   * 型を共有しているので、状態を増やすときはCSS側のクラス追加も必要になる。
   */
  tone?: ItemStatus;
}

export function Badge({ children, tone = "normal" }: BadgeProps) {
  return <span className={`${styles.badge} ${styles[tone]}`}>{children}</span>;
}
