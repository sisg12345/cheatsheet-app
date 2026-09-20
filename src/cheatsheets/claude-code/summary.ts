/**
 * Claude Codeチートシートのサマリー。一覧のカード・ヘッダーのメニュー・シートのページの見出しに出す。
 * 最初に読み込むバンドルに入るので、セクションと項目の中身は content.ts に置き、ここには件数だけを持たせる。
 *
 * - sectionCount / itemCount は content.ts の件数と一致させる（tests/unit/registry.test.ts が突き合わせる）
 */
import type { CheatSheetSummary } from "../types";

export const claudeCodeSummary: CheatSheetSummary = {
  slug: "claude-code",
  title: "Claude Code チートシート",
  name: "Claude Code",
  description:
    "起動・セッション操作、CLAUDE.md、権限、MCP、Skills・Subagents、Hooks、自動化までをまとめたClaude Codeリファレンス。",
  eyebrow: "AI coding agent",
  accent: "#d97757",
  keywords: ["claude", "claude code", "cc", "ai", "エージェント", "cli", "mcp"],
  sectionCount: 14,
  itemCount: 118,
};
