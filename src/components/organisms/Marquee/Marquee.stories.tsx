/**
 * Marquee の Storybook。
 * 中身には実際のカードではなく最小構成のダミーを置いている。流れ方・止まり方だけを
 * 確認したいため。ダミーをリンクにしているのは、実画面と同じく1本目だけが Tab で
 * たどれ、複製の2本目はたどれないことを確かめられるようにするため。
 */
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Marquee } from "./Marquee";

function items(count: number) {
  return Array.from({ length: count }, (_, index) => (
    <a
      key={index}
      href={`#item-${index + 1}`}
      style={{
        display: "grid",
        width: 240,
        minHeight: 72,
        placeItems: "center",
        border: "1px solid var(--color-line)",
        borderRadius: "var(--radius-md)",
        background: "var(--color-surface-raised)",
        color: "var(--color-ink)",
        fontFamily: "var(--font-mono)",
        textDecoration: "none",
      }}
    >
      ITEM {String(index + 1).padStart(2, "0")}
    </a>
  ));
}

const meta = {
  title: "Organisms/Marquee",
  component: Marquee,
  tags: ["autodocs"],
  // 幅いっぱいに流れる部品なので、中央寄せではなく横幅を与えて描画する。
  parameters: { layout: "padded" },
  args: { children: items(8) },
} satisfies Meta<typeof Marquee>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
/** 枠より短い枚数。1本で枠を埋めるよう間隔が広がり、2本目が枠の途中から現れないこと。 */
export const Few: Story = { args: { children: items(2) } };
