/**
 * テーマ機能の共有定数。
 *
 * THEME_STORAGE_KEY は index.html の初期化スクリプトにも同じ値がリテラルで
 * 書かれている（描画前に走る必要があり、モジュールを import できないため）。
 * 両者がずれるとテーマの保存が無言で壊れるので、
 * tests/unit/themeBootstrap.test.ts が一致を検証している。
 */
export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "cheatsheet-theme";
