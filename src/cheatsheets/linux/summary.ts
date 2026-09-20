/**
 * Linux コマンドチートシートのサマリー。一覧のカード・ヘッダーのメニュー・シートのページの見出しに出す。
 * 最初に読み込むバンドルに入るので、セクションと項目は content.ts に置き、ここには件数だけを書く。
 *
 * - sectionCount / itemCount は content.ts の件数と一致させる（tests/unit/registry.test.ts が突き合わせる）
 */
import type { CheatSheetSummary } from "../types";

export const linuxSummary: CheatSheetSummary = {
  slug: "linux",
  title: "Linux コマンド チートシート",
  name: "Linux",
  description:
    "ファイル操作、検索、テキスト処理、権限、プロセス、ディスク、ネットワーク、パッケージ、systemd までをまとめたLinuxコマンドリファレンス。",
  eyebrow: "Operating system",
  accent: "#fcc624",
  keywords: ["linux", "unix", "コマンド", "ターミナル", "ubuntu", "サーバー"],
  sectionCount: 13,
  itemCount: 93,
};
