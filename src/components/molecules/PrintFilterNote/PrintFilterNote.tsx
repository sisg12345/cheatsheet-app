/**
 * 絞り込み中であることを紙面に残す断り書き。画面には出さず、印刷時にだけ現れる。
 *
 * 検索欄は印刷時に消える（SearchBox.module.css）ため、絞り込んだまま印刷すると
 * 紙面が全体なのか抜粋なのか分からなくなる。一覧ページとシートページの両方が
 * 同じ役割で必要になるので、文言もスタイルもここに一本化している。
 */
import styles from "./PrintFilterNote.module.css";

interface PrintFilterNoteProps {
  /** 現在の検索語。空白のみのときは絞り込んでいない扱いで、何も描画しない。 */
  query: string;
  /** 件数の言い回し。ページごとに数え方が違うので呼び出し側が組み立てる（例: "2 件 / 5 件中"）。 */
  detail: string;
}

export function PrintFilterNote({ query, detail }: PrintFilterNoteProps) {
  // 絞り込んでいないなら断り書きは不要。全件を刷るだけなので何も言うことがない。
  if (!query.trim()) return null;

  // JSXで改行して組み立てると式とテキストの境目で空白が落ちるので、
  // 一文をここで組み立ててから埋め込む。
  return (
    <p className={styles.note}>{`この紙面は「${query}」で絞り込んだ抜粋です（${detail}）。`}</p>
  );
}
