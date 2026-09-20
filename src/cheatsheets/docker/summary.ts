/**
 * Dockerチートシートのサマリー。一覧のカード・ヘッダーのメニュー・シートのページの見出しに出す。
 * 最初に読み込むバンドルに入るので、セクションと項目の中身は content.ts に置き、ここには件数だけを持たせる。
 *
 * - sectionCount / itemCount は content.ts の件数と一致させる（tests/unit/registry.test.ts が突き合わせる）
 */
import type { CheatSheetSummary } from "../types";

export const dockerSummary: CheatSheetSummary = {
  slug: "docker",
  title: "Docker チートシート",
  name: "Docker",
  description:
    "コンテナとイメージの操作、Dockerfile、ボリューム、ネットワーク、Compose、後片付けまでをまとめたDockerリファレンス。",
  eyebrow: "Container platform",
  accent: "#2496ed",
  keywords: ["docker", "コンテナ", "container", "dockerfile", "compose", "イメージ"],
  sectionCount: 12,
  itemCount: 123,
};
