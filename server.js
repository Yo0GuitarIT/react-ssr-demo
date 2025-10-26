import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { createServer as createViteServer } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function createServer() {
  const app = express();

  // 建立 Vite 伺服器在中介軟體模式
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
  });

  // 使用 vite 的連接實例作為中介軟體
  app.use(vite.middlewares);

  // 處理根路由的 SSR
  app.get("/", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      // 1. 讀取 index.html
      let template = fs.readFileSync(
        path.resolve(__dirname, "index.html"),
        "utf-8"
      );

      // 2. 應用 Vite HTML 轉換。這會注入 Vite HMR 客戶端
      template = await vite.transformIndexHtml(url, template);

      // 3. 載入伺服器入口點。ssrLoadModule 自動轉換
      //    ESM 源碼以便在 Node.js 中使用！
      const { render } = await vite.ssrLoadModule("/src/entry-server.jsx");

      // 4. 渲染 app HTML
      const appHtml = await render(url);

      // 5. 將 app 渲染的 HTML 注入到模板中
      const html = template.replace(`<!--ssr-outlet-->`, appHtml);

      // 6. 回傳渲染的 HTML
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      // 如果捕獲到錯誤，讓 Vite 修正堆疊追蹤，以便它回應到實際的源碼
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });

  const port = 3000;
  app.listen(port, () => {
    console.log(`🚀 伺服器運行在 http://localhost:${port}`);
    console.log("🎯 使用 Vite + React SSR");
  });
}

createServer();
