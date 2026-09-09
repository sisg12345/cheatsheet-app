import { Link } from "react-router-dom";
import styles from "./NotFoundPage.module.css";

export function NotFoundPage() {
  return (
    <main className={styles.main}>
      <p className={styles.eyebrow}>404 / NOT FOUND</p>
      <h1>ページが見つかりません</h1>
      <p>URLを確認するか、一覧からチートシートを選択してください。</p>
      <Link to="/" className={styles.back}>
        ← チートシート一覧へ
      </Link>
    </main>
  );
}
