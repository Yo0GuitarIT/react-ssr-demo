// 使用 Babel 來支援 JSX 和 ES6 模組
require("@babel/register")({
  presets: ["@babel/preset-env", "@babel/preset-react"],
});

const express = require("express");
const path = require("path");
const React = require("react");
const ReactDOMServer = require("react-dom/server");

// 從 src 目錄匯入主 App 組件
const App = require("./src/App").default;

// 初始化 Express app
const app = express();

// 從 'public' 目錄提供靜態檔案
app.use("/static", express.static(path.join(__dirname, "public")));

// 處理所有 GET 請求
app.get("*", (req, res) => {
  // 將 App 組件算繪至 HTML 字串
  const html = ReactDOMServer.renderToString(React.createElement(App));

  // 送出包含所算繪的 App 組件的 HTML 回應
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>My React SSR App</title>
      </head>
      <body>
        <!-- 注入已算繪的 App 組件 -->
        <div id="root">${html}</div>
        <!-- 連接至主 JavaScript 包裹 -->
        <script src="/static/js/bundle.js"></script>
      </body>
    </html>
  `);
});

// 於連接埠 3000 啟動伺服器
app.listen(3000, () => {
  console.log("Server listening on port 3000");
  console.log("開啟 http://localhost:3000 查看結果");
});
