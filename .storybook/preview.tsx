/**
 * Storybook 全体に共通する設定。
 * アプリと同じ styles.css を読み込み、トークン（色・フォント）を実際の画面と揃える。
 */
import type { Preview } from "@storybook/react-vite";
import "../src/styles.css";

const preview: Preview = {
  parameters: {
    // アクセシビリティ違反はwarningではなくエラーにして、見落としを防ぐ。
    a11y: { test: "error" },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    layout: "centered",
  },
  // 単体で表示すると幅が潰れるコンポーネントがあるため、最小幅と余白を与えて描画する。
  decorators: [
    (Story) => (
      <div style={{ minWidth: 320, padding: 24 }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
