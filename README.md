# React Server-Side Rendering (SSR) Demo

這是一個使用現代化技術棧 **Vite + Express + React** 實現的 Server-Side Rendering 示範專案。

## 🚀 技術棧

- **React 19.2.0** - 最新版本的 React
- **Vite 7.1.12** - 次世代前端建構工具 (替代 Webpack/Babel)
- **Express 5.1.0** - Node.js 網頁框架
- **ES Modules** - 使用原生 ES 模組語法
- **pnpm** - 高效能的套件管理器

## 📦 安裝與執行

### 安裝依賴套件

```bash
pnpm install
```

### 開發模式

```bash
# 啟動開發伺服器
pnpm dev

# 使用 nodemon 自動重啟 (檔案變更時)
pnpm dev:watch
```

### 生產模式

```bash
# 建構客戶端與伺服器端程式碼
pnpm build

# 或分別建構
pnpm build:client  # 建構客戶端
pnpm build:server  # 建構伺服器端

# 預覽生產版本
pnpm preview
```

## 🏗️ 專案結構

```
react-ssr-demo/
├── src/
│   ├── app.jsx              # 主要 React 組件
│   ├── entry-client.jsx     # 客戶端入口點 (Hydration)
│   └── entry-server.jsx     # 伺服器端入口點 (SSR)
├── server.js                # Express + Vite SSR 伺服器
├── index.html               # HTML 模板
├── vite.config.js           # Vite 設定檔
├── nodemon.json             # Nodemon 設定檔
└── package.json             # 專案配置與腳本
```

## 🔧 如何將 Server-Side Rendering 加入 Client-Only React App

如果您有一個純客戶端的 React 應用程式，以下是加入 SSR 的步驟：

### 1. 安裝必要套件

```bash
# 安裝 Express 伺服器
pnpm add express

# 安裝 Vite 和 React 插件 (開發依賴)
pnpm add -D vite @vitejs/plugin-react

# 可選：安裝 nodemon 用於開發時自動重啟
pnpm add -D nodemon
```

### 2. 建立 Vite 設定檔 (`vite.config.js`)

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: "./index.html",
      },
    },
  },
});
```

### 3. 修改 `package.json`

```json
{
  "type": "module",
  "scripts": {
    "dev": "node server.js",
    "build:client": "vite build --outDir dist/client",
    "build:server": "vite build --outDir dist/server --ssr src/entry-server.jsx",
    "build": "npm run build:client && npm run build:server"
  }
}
```

### 4. 建立 HTML 模板 (`index.html`)

```html
<!DOCTYPE html>
<html lang="zh-TW">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React SSR App</title>
  </head>
  <body>
    <div id="root"><!--ssr-outlet--></div>
    <script type="module" src="/src/entry-client.jsx"></script>
  </body>
</html>
```

### 5. 建立伺服器端入口點 (`src/entry-server.jsx`)

```jsx
import { renderToString } from "react-dom/server";
import App from "./app.jsx";

export function render() {
  // 將 React 組件渲染為 HTML 字串
  const html = renderToString(<App />);
  return html;
}
```

### 6. 建立客戶端入口點 (`src/entry-client.jsx`)

```jsx
import { hydrateRoot } from "react-dom/client";
import App from "./app.jsx";

// 客戶端水合 (Hydration)
hydrateRoot(document.getElementById("root"), <App />);
```

### 7. 建立 Express 伺服器 (`server.js`)

```javascript
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import { createServer as createViteServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function createServer() {
  const app = express()

  // 建立 Vite 伺服器在中介軟體模式
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  })

  // 使用 vite 的連接實例作為中介軟體
  app.use(vite.middlewares)

  // 處理根路由的 SSR
  app.get('/', async (req, res, next) => {
    const url = req.originalUrl

    try {
      // 1. 讀取 index.html
      let template = fs.readFileSync(
        path.resolve(__dirname, 'index.html'),
        'utf-8',
      )

      // 2. 應用 Vite HTML 轉換
      template = await vite.transformIndexHtml(url, template)

      // 3. 載入伺服器入口點
      const { render } = await vite.ssrLoadModule('/src/entry-server.jsx')

      // 4. 渲染 app HTML
      const appHtml = await render(url)

      // 5. 將 app 渲染的 HTML 注入到模板中
      const html = template.replace(\`<!--ssr-outlet-->\`, appHtml)

      // 6. 回傳渲染的 HTML
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      vite.ssrFixStacktrace(e)
      next(e)
    }
  })

  app.listen(3000, () => {
    console.log('🚀 伺服器運行在 http://localhost:3000')
  })
}

createServer()
```

## 💧 什麼是 Hydration (水合)?

**Hydration** 是 React SSR 中的關鍵概念，它是指將伺服器端渲染的靜態 HTML 「注入生命」的過程。

### Hydration 的工作原理

1. **伺服器端渲染 (SSR)**：

   - 伺服器使用 `renderToString()` 將 React 組件轉換為 HTML 字串
   - 這個 HTML 被送到瀏覽器，用戶立即看到內容
   - 此時的 HTML 是靜態的，沒有 JavaScript 交互功能

2. **客戶端水合 (Hydration)**：
   - 瀏覽器載入並執行 JavaScript 檔案
   - React 使用 `hydrateRoot()` 「接管」現有的 DOM
   - React 會比較伺服器渲染的 HTML 與客戶端渲染的結果
   - 為 DOM 元素附加事件監聽器和狀態管理

### 程式碼範例

**伺服器端 (entry-server.jsx)**：

```jsx
import { renderToString } from "react-dom/server";
import App from "./app.jsx";

export function render() {
  // 將 React 組件渲染為 HTML 字串
  const html = renderToString(<App />);
  return html;
}
```

**客戶端 (entry-client.jsx)**：

```jsx
import { hydrateRoot } from "react-dom/client";
import App from "./app.jsx";

// 水合：讓靜態 HTML 變成互動式 React 應用
hydrateRoot(document.getElementById("root"), <App />);
```

### Hydration 的優勢

1. **更快的首次載入**：用戶立即看到內容，無需等待 JavaScript
2. **SEO 友好**：搜尋引擎可以索引伺服器渲染的內容
3. **漸進增強**：即使 JavaScript 載入失敗，基本內容仍可顯示
4. **更好的用戶體驗**：結合了 SSR 的快速載入和 SPA 的互動性

### 注意事項

- **伺服器端和客戶端必須渲染相同的內容**，否則會出現 hydration 不匹配錯誤
- **避免在組件中使用瀏覽器特定的 API**（如 `window`、`document`）進行初始渲染
- **使用 `useEffect` 處理僅客戶端的邏輯**

## 🆚 相比傳統方法的優勢

### 使用 Vite 替代 Babel/Webpack

| 傳統方法 (Babel + Webpack)  | 現代方法 (Vite)      |
| --------------------------- | -------------------- |
| 複雜的設定檔                | 零設定或最小設定     |
| 慢啟動 (冷啟動數秒到數分鐘) | 極快啟動 (< 1 秒)    |
| 慢熱更新                    | 極快熱更新 (< 100ms) |
| 需要打包整個應用            | 使用原生 ES 模組     |
| 複雜的除錯                  | 清晰的錯誤訊息       |

### 開發體驗改善

- ⚡ **即時熱更新**：修改程式碼後立即在瀏覽器中看到變化
- 🛠️ **優秀的開發工具**：內建源碼對應、錯誤追蹤
- 📦 **現代化打包**：生產版本高度優化
- 🔧 **零設定**：大部分情況下無需複雜設定

## 🔗 參考資源

- [Vite 官方文件](https://vitejs.dev/)
- [React SSR 指南](https://react.dev/reference/react-dom/server)
- [Express 官方文件](https://expressjs.com/)
- [Hydration 深入解析](https://react.dev/reference/react-dom/client/hydrateRoot)

## 📄 授權

ISC License
