import { useId, type Ref } from "react";
import styles from "./SearchBox.module.css";

interface SearchBoxProps {
  value: string;
  /**
   * `isComposing` はIME変換の未確定中かどうか。回数が問題になる処理（URLの書き換えなど）を
   * 親が間引けるようにしている。表示に使う値は変換中でも常に渡す。
   */
  onChange: (value: string, isComposing: boolean) => void;
  placeholder?: string;
  /** 右側に出す件数表示。省略すると表示されない。 */
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

        {/* 視覚的には隠すが、DOMには残して読み上げさせる。 */}
        <label className={styles.visuallyHidden} htmlFor={inputId}>
          チートシートを検索
        </label>

        {/* type="search" でブラウザ標準のクリアボタンとロールが得られる。 */}
        <input
          ref={ref}
          id={inputId}
          type="search"
          value={value}
          onChange={(event) => {
            // 変換中かどうかはネイティブイベント側にしか無い。
            const native = event.nativeEvent;
            onChange(event.target.value, native instanceof InputEvent && native.isComposing);
          }}
          // 確定直前の input に isComposing が立ったままの環境があるため、
          // 確定時にも1回「変換中でない」扱いで通知する。
          onCompositionEnd={(event) => onChange(event.currentTarget.value, false)}
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
