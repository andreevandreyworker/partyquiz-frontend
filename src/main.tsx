import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@fontsource-variable/comfortaa";
import "@fontsource-variable/nunito";
import App from "./App";
import { AuthProvider } from "./auth";
import { loadTheme } from "./cms";
import { refreshTranslations } from "./i18n";
import "./index.css";

loadTheme();
refreshTranslations();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
