/**
 * アプリのエントリーポイント。
 * ルーターとグローバルCSSを用意して App をマウントするだけで、画面の中身は持たない。
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles.css";

// `!` は index.html に <div id="root"> がある前提。無ければ起動時点で落ちるので、
// 実行時に静かに壊れるより早く気づける。
// StrictMode は開発時のみ二重描画して、副作用の後始末漏れを検出する。
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
