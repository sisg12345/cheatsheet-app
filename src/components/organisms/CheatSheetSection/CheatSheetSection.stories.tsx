/**
 * CheatSheetSection の Storybook。
 * args には実データではなく最小構成のダミーセクションを置いている。
 * content.ts を読み込むと、データ更新のたびにStoryの見た目が変わってしまうため。
 */
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheatSheetSection } from "./CheatSheetSection";

const meta = {
  title: "Organisms/CheatSheetSection",
  component: CheatSheetSection,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    index: 0,
    section: {
      id: "sample",
      title: "基本構文",
      description: "頻繁に使うコマンド",
      items: [
        {
          id: "status",
          label: "状態を確認",
          syntax: "git status",
          description: "作業ツリーとステージの状態を表示します。",
          status: "info",
        },
      ],
    },
  },
} satisfies Meta<typeof CheatSheetSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
