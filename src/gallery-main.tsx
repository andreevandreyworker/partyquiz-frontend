import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource-variable/comfortaa";
import "@fontsource-variable/nunito";
import { installMocks } from "./gallery-mocks";
import "./i18n";
import "./index.css";
import "./gallery.css";
import Gallery from "./Gallery";

installMocks();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Gallery />
  </React.StrictMode>,
);
