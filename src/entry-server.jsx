import { renderToPipeableStream } from "react-dom/server";
import { Writable } from "stream";
import App from "./app.jsx";

export function render(url, response, template) {
  // 使用 renderToPipeableStream 進行串流渲染
  return new Promise((resolve, reject) => {
    let html = "";

    // 創建一個可寫入的流來收集 HTML
    const writableStream = new Writable({
      write(chunk, encoding, callback) {
        html += chunk.toString();
        callback();
      },
    });

    const { pipe, abort } = renderToPipeableStream(<App />, {
      bootstrapScripts: ["/src/entry-client.jsx"],
      onShellReady() {
        // 當初始 shell 準備好時開始收集 HTML
        pipe(writableStream);
      },
      onAllReady() {
        // 當所有內容都渲染完成後，將 HTML 插入模板並發送
        const finalHtml = template.replace("<!--ssr-outlet-->", html);

        response.setHeader("content-type", "text/html");
        response.end(finalHtml);
        resolve();
      },
      onShellError(error) {
        // 處理 shell 渲染錯誤
        reject(error);
      },
      onError(error) {
        // 記錄錯誤但不中斷串流
        console.error("SSR error:", error);
      },
    });

    // 設定超時中止機制（可選）
    setTimeout(() => {
      abort();
    }, 10000); // 10 秒超時
  });
}
