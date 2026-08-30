/**
 * Playwright（E2E）の設定。
 * テスト実行時に dev サーバーを自動起動し、終了時に落とす。
 */
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  use: { baseURL: "http://127.0.0.1:4173", trace: "on-first-retry" },
  // 開発用の3000番と衝突させないため、E2E専用に4173番で立てる。
  // reuseExistingServer により、ローカルでは起動済みのサーバーを使い回して待ち時間を減らす（CIでは常に新規起動）。
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 4173",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
