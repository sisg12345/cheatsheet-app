/**
 * CheatSheetCard の Storybook。一覧に並べる基本形と、カルーセルに流す小さい版を見比べる。
 * args には実データではなく最小構成のダミーサマリーを置いている。content.ts を読み込むと、
 * データ更新のたびにStoryの見た目が変わってしまうため。
 * Link を使うので、Router の中で描画する。
 */
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";
import { CheatSheetCard } from "./CheatSheetCard";

const meta = {
  title: "Organisms/CheatSheetCard",
  component: CheatSheetCard,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div style={{ width: 520 }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  args: {
    index: 1,
    sheet: {
      slug: "git",
      title: "Git チートシート",
      name: "Git",
      description: "日常操作、ブランチ、リモートまでをまとめたリファレンス。",
      eyebrow: "Version control",
      accent: "#f05033",
      keywords: [],
      sectionCount: 10,
      itemCount: 112,
    },
  },
} satisfies Meta<typeof CheatSheetCard>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
/** 長い名前。題名がカード幅に収まるまで縮むこと。 */
const longName = {
  ...meta.args.sheet,
  slug: "claude-code",
  title: "Claude Code チートシート",
  name: "Claude Code",
  description:
    "起動・セッション操作、CLAUDE.md、権限、MCP、Skills・Subagents、Hooks、自動化までをまとめたリファレンス。",
  eyebrow: "AI coding agent",
  accent: "#d97757",
};
export const LongName: Story = { args: { sheet: longName } };
/** カルーセル用の小さい版。長い名前も枠に収まり、長い説明は1行で省略されること。 */
export const Compact: Story = { args: { compact: true, sheet: longName } };
