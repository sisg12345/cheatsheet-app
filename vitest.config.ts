/**
 * Vitest の設定。vite.config.ts とは別に持ち、テスト用のエイリアスと環境をここで揃える。
 */
import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(import.meta.dirname) } },
  test: {
    // 対象は tests/unit のみ。src/ 配下に *.test.ts を置いても実行されない。
    include: ["tests/unit/**/*.test.{ts,tsx}"],
    // DOMを使うテストがあるため jsdom。setupFiles で jest-dom のマッチャを読み込む。
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    coverage: { reporter: ["text", "html"] },
  },
});
