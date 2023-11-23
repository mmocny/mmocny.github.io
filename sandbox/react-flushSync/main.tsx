import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AppTestRender from "./AppTestRender";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
    <App />
    // <AppTestRender />
  // </React.StrictMode>
);
