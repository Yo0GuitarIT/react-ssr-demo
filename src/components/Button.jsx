import { useState } from "react";

const Button = () => {
  const [count, setCount] = useState(0);
  return (
    <>
      <p>當前計數: {count}</p>
      <button
        style={{
          padding: "10px 15px",
          borderRadius: "5px",
          border: "none",
          backgroundColor: "#007bff",
          color: "#fff",
          cursor: "pointer",
        }}
        onClick={() => {
          setCount((prev) => prev + 1);
        }}
      >
        按鈕
      </button>
    </>
  );
};

export default Button;
