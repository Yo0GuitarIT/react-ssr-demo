const express = require("express");
const app = express();
const port = 3000;

// 根路由 - 顯示 "hello world"
app.get("/", (req, res) => {
  res.send("hello world -！");
});

// 啟動伺服器
app.listen(port, () => {
  console.log(`伺服器正在 http://localhost:${port} 運行`);
});
