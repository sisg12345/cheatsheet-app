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
      shortTitle: "Git",
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
/** カルーセル用の小さい版。短縮名が題名になり、長い説明は1行で省略されること。 */
export const Compact: Story = {
  args: {
    compact: true,
    sheet: {
      ...meta.args.sheet,
      slug: "docker",
      title: "Docker チートシート",
      name: "Docker",
      shortTitle: "Docker",
      description:
        "コンテナとイメージの操作、Dockerfile、ボリューム、ネットワーク、Compose、後片付けまでをまとめたリファレンス。",
      eyebrow: "Container platform",
      accent: "#2496ed",
    },
  },
};
