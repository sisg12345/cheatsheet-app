/**
 * Vite の設定（開発サーバーと本番ビルド）。
 * テストは vitest.config.ts、E2Eは playwright.config.ts と別ファイルに分けている。
 */
import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  // "@" はリポジトリルートを指す。コード側の "@/src/..." という import はこの定義による。
  resolve: { alias: { "@": path.resolve(import.meta.dirname) } },
  // 0.0.0.0 で待ち受けるのは、Dockerコンテナ内から起動してもホスト側のブラウザで開けるようにするため。
  server: { host: "0.0.0.0", port: 3000 },
  preview: { host: "0.0.0.0", port: 3000 },
});
