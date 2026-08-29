import { useId, type Ref } from "react";
import styles from "./SearchBox.module.css";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  resultLabel?: string;
  ref?: Ref<HTMLInputElement>;
}

export function SearchBox({
  value,
  onChange,
  placeholder = "検索",
  resultLabel,
  ref,
}: SearchBoxProps) {
  const inputId = useId();

  return (
    <div className={styles.group}>
      <div className={styles.search}>
        <span className={styles.icon} aria-hidden="true">
          ⌕
        </span>
        <label className={styles.visuallyHidden} htmlFor={inputId}>
          チートシートを検索
        </label>
        <input
          ref={ref}
          id={inputId}
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
}
