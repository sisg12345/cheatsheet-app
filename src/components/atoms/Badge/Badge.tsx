import type { ReactNode } from "react";
import type { ItemStatus } from "@/src/cheatsheets/types";
import styles from "./Badge.module.css";

interface BadgeProps {
  children: ReactNode;
  tone?: ItemStatus;
}

export function Badge({ children, tone = "normal" }: BadgeProps) {
  return <span className={`${styles.badge} ${styles[tone]}`}>{children}</span>;
}
