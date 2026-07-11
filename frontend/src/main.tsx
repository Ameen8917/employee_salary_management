import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConfigProvider } from "antd";
import App from "./App";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider theme={{ token: { colorPrimary: "#16795a", borderRadius: 10, fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" } }}>
      <App />
    </ConfigProvider>
  </StrictMode>,
);
