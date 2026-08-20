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
