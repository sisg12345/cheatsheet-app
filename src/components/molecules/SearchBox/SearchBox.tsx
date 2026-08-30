/**
 * 検索入力欄。入力値は持たず、value と onChange を親から受け取る制御コンポーネント。
 * 一覧ページとシートページで、状態の持ち方（useState / URLクエリ）を変えて使い回している。
 */
import { useId, type Ref } from "react";
import styles from "./SearchBox.module.css";

interface SearchBoxProps {
  /** 現在の検索語。 */
  value: string;
  /** 入力のたびに呼ばれる。入力値そのものが渡る。 */
  onChange: (value: string) => void;
  /** 入力欄のプレースホルダ。 */
  placeholder?: string;
  /** 右側に出す件数表示。省略すると表示されない。 */
  resultLabel?: string;
  /** input への参照。`/` キーでフォーカスするために useSearchShortcuts が使う。 */
  ref?: Ref<HTMLInputElement>;
}

export function SearchBox({
  value,
  onChange,
  placeholder = "検索",
  resultLabel,
  ref,
}: SearchBoxProps) {
  // label と input を結ぶためのid。同じページに複数置いてもidが衝突しないよう useId で採番する。
  const inputId = useId();

  return (
    <div className={styles.group}>
      <div className={styles.search}>
        {/* 虫眼鏡アイコンと `/` キーの表示は装飾。読み上げからは除外する。 */}
        <span className={styles.icon} aria-hidden="true">
          ⌕
        </span>

        {/* ラベルは視覚的には隠すが、DOMには残してスクリーンリーダーに読ませる。 */}
        <label className={styles.visuallyHidden} htmlFor={inputId}>
          チートシートを検索
        </label>

        {/* type="search" にすると、ブラウザ標準のクリアボタンとロールが得られる。
            autoComplete="off" は、過去の入力候補が検索の邪魔をしないようにするため。
            React 19 では ref を通常のprop として受け渡せる。 */}
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

      {/* 件数は aria-live="polite" にして、絞り込み結果の変化を読み上げさせる。 */}
      {resultLabel ? (
        <span className={styles.result} aria-live="polite">
          {resultLabel}
        </span>
      ) : null}
    </div>
  );
}
