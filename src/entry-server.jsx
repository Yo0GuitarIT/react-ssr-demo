import React from "react";
import { renderToString } from "react-dom/server";
import App from "./app.jsx";

export function render() {
  // 將 React 組件渲染為 HTML 字串
  const html = renderToString(<App />);
  return html;
}
