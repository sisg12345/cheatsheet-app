export type Theme = "light" | "dark";

/**
 * index.html の初期化スクリプトにも同じ値がリテラルで書かれている（描画前に走る
 * 必要がありモジュールをimportできないため）。ずれるとテーマの保存が無言で壊れるので、
 * tests/unit/themeBootstrap.test.ts が一致を検証している。
 */
export const THEME_STORAGE_KEY = "cheatsheet-theme";
