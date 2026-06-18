import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource-variable/comfortaa";
import "@fontsource-variable/nunito";
import "./studio.css";
import Studio from "./Studio";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Studio />
  </React.StrictMode>,
);
