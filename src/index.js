import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";   // ← importante que no diga .jsx
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

