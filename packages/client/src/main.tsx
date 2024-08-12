import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app.tsx";
import "./index.css";

// Create a client

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
