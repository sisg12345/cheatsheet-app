"use client";

import { forwardRef } from "react";
import styles from "./SearchBox.module.css";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  resultLabel?: string;
}

export const SearchBox = forwardRef<HTMLInputElement, SearchBoxProps>(function SearchBox(
  { value, onChange, placeholder = "検索", resultLabel },
  ref,
) {
  return (
    <div className={styles.group}>
      <div className={styles.search}>
        <span className={styles.icon} aria-hidden="true">
          ⌕
        </span>
        <label className={styles.visuallyHidden} htmlFor="cheatsheet-search">
          チートシートを検索
        </label>
        <input
          ref={ref}
          id="cheatsheet-search"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete="off"
        />
        <kbd>/</kbd>
      </div>
      {resultLabel ? (
        <span className={styles.result} aria-live="polite">
          {resultLabel}
        </span>
      ) : null}
    </div>
  );
});
