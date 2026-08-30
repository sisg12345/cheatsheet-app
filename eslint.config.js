/**
 * ESLint の設定（Flat Config）。TypeScript と React Hooks のルールを対象ファイルに適用する。
 */
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    // 生成物とレビュースキルのフィクスチャは対象外。
    // .claude/ はアプリのコードではなく、意図的に規約違反を含むファイルを持つため。
    ignores: [
      ".claude",
      "dist",
      "coverage",
      "storybook-static",
      "playwright-report",
      "test-results",
    ],
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    // 実行環境はブラウザのみ。Node向けの設定ファイル自体もこの設定でチェックされるが、
    // グローバル変数を使っていないため問題にならない。
    languageOptions: { ecmaVersion: 2022, globals: globals.browser },
    plugins: { "react-hooks": reactHooks, "react-refresh": reactRefresh },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // コンポーネントと定数以外を同じファイルから export すると、開発時のHot Reloadが
      // 効かなくなる。allowConstantExport で定数の同居だけ許可している。
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    },
  },
);
