import React from "react";

const App = () => {
  return (
    <div>
      <h1>Hello from Server-Side Rendering!</h1>
      <p>這個頁面是在伺服器端算繪的</p>
      <button onClick={() => alert("Client-side interaction works!")}>
        點我測試客戶端互動
      </button>
    </div>
  );
};

export default App;
