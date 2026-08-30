/** Button の Storybook。variant ごとの見え方を並べて確認する。 */
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";

const meta = {
  title: "Atoms/Button",
  component: Button,
  tags: ["autodocs"],
  args: { children: "コピー" },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Outline: Story = {};
export const Solid: Story = { args: { variant: "solid" } };
export const Ghost: Story = { args: { variant: "ghost" } };
