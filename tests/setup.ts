/**
 * Vitest の共通セットアップ（vitest.config.ts の setupFiles から読み込まれる）。
 * toBeInTheDocument などの jest-dom マッチャを全テストで使えるようにする。
 */
import "@testing-library/jest-dom/vitest";
