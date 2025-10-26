import React from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App.jsx";

// 使用 hydrateRoot 而不是 render，以便與伺服器算繪的內容同步
const rootElement = document.getElementById("root");
hydrateRoot(rootElement, <App />);
