/**
 * Gitチートシートのサマリー。一覧のカード・ヘッダーのメニュー・シートのページの見出しに出す。
 * 最初に読み込むバンドルに入るので、セクションと項目の中身は content.ts に置き、ここには件数だけを持たせる。
 *
 * - sectionCount / itemCount は content.ts の件数と一致させる（tests/unit/registry.test.ts が突き合わせる）
 */
import type { CheatSheetSummary } from "../types";

export const gitSummary: CheatSheetSummary = {
  slug: "git",
  title: "Git チートシート",
  name: "Git",
  description:
    "日常操作、ブランチ、リモート、履歴調査、安全な取り消しまでをまとめたGitリファレンス。",
  eyebrow: "Version control",
  accent: "#f05033",
  keywords: ["git", "バージョン管理", "commit", "branch", "rebase", "stash"],
  sectionCount: 10,
  itemCount: 112,
};
