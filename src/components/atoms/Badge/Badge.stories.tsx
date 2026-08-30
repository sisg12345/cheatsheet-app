/** Badge の Storybook。tone ごとの見え方を並べて確認する。 */
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./Badge";

const meta = {
  title: "Atoms/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: { children: "推奨" },
} satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Warning: Story = { args: { tone: "warning", children: "注意" } };
export const Danger: Story = { args: { tone: "danger", children: "危険" } };
