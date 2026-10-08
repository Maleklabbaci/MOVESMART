import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppWrapper from "./App.tsx";
import "@fontsource-variable/montserrat";
import "@fontsource-variable/montserrat/wght-italic.css";
import "@fontsource-variable/playfair-display";
import "@fontsource-variable/playfair-display/wght-italic.css";
import "@fontsource-variable/noto-sans-arabic";
import "@fontsource-variable/noto-naskh-arabic";
import "./index.css";
import "./lib/i18n";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>,
);
