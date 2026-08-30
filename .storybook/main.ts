/**
 * Storybook の設定。src/ 配下の *.stories.tsx を拾い、Vite の設定を共有する。
 */
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  // addon-a11y でアクセシビリティ検査、addon-vitest で Story をそのままテストとして実行できる。
  addons: ["@storybook/addon-a11y", "@storybook/addon-vitest"],
  framework: { name: "@storybook/react-vite", options: {} },
};

export default config;
