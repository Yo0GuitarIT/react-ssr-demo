import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Button from "./components/Button";

const ListOfDogBreeds = lazy(() => import("./components/DogBreeds"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <h1>🚀 React Server-Side Rendering Demo</h1>
        <p>這是使用 Vite + Express 實現的 React SSR!</p>
        <p>當前時間: {new Date().toLocaleString("zh-TW")}</p>

        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            backgroundColor: "#f0f0f0",
            borderRadius: "8px",
          }}
        >
          <h3>✨ 功能說明</h3>
          <ul>
            <li>伺服器端渲染 (SSR)</li>
            <li>客戶端水合 (Hydration)</li>
            <li>Vite 熱更新支援</li>
            <li>現代化開發體驗</li>
          </ul>
        </div>

        <Button />

        <div>
          <h1>🐶 狗狗品種列表</h1>
          <Suspense fallback={<p>載入狗狗品種中...</p>}>
            <ListOfDogBreeds />
          </Suspense>
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default App;
