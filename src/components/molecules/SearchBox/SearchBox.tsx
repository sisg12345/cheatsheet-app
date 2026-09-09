/**
 * 検索入力欄。入力値は持たず、value と onChange を親から受け取る制御コンポーネント。
 * 一覧ページとシートページで使い回す。どちらも値はローカルstateで持ち、シートページは
 * それをURLの `?q=` とも同期させている（CheatSheetLayout を参照）。
 */
import { useId, type Ref } from "react";
import styles from "./SearchBox.module.css";

interface SearchBoxProps {
  /** 現在の検索語。 */
  value: string;
  /**
   * 入力のたびに呼ばれる。入力値そのものが渡る。
   *
   * `isComposing` は IME変換の未確定中かどうか。日本語入力では確定前のローマ字にも
   * 入力イベントが飛ぶため、URLの書き換えのように回数が問題になる処理を親が
   * 間引けるようにしている。表示に使う値は変換中でも常に渡す。
   */
  onChange: (value: string, isComposing: boolean) => void;
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
          onChange={(event) => {
            // React の onChange は input イベントを束ねたもの。変換中かどうかは
            // ネイティブイベント側にしか無いので、InputEvent へ絞って読む。
            const native = event.nativeEvent;
            onChange(event.target.value, native instanceof InputEvent && native.isComposing);
          }}
          // 確定時に必ず1回、変換中でない扱いで通知する。確定直前の input イベントに
          // isComposing が立ったままの環境があり、それだけに頼ると確定後の値が
          // 親へ「確定済み」として届かないため。
          onCompositionEnd={(event) => onChange(event.currentTarget.value, false)}
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
