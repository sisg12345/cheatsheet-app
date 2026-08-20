import type { Preview } from "@storybook/react-vite";
import "../src/styles.css";

const preview: Preview = {
  parameters: {
    a11y: { test: "error" },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div style={{ minWidth: 320, padding: 24 }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
