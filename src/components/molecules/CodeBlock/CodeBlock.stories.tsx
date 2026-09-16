/** CodeBlock の Storybook。コピーボタンの動作もここで確認できる。 */
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CodeBlock } from "./CodeBlock";

const meta = {
  title: "Molecules/CodeBlock",
  component: CodeBlock,
  tags: ["autodocs"],
  args: { code: 'git commit -m "feat: add cheat sheet"' },
} satisfies Meta<typeof CodeBlock>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: { compact: true } };
/** 複数行。狭い幅で、折り返した続きの行がその行の字下げより深く始まることを確認する。 */
export const Multiline: Story = {
  args: {
    code: "services:\n  app:\n    image: nginx:alpine\n\n    environment:\n      DATABASE_URL: postgres://postgres:example@db:5432/postgres",
  },
};
