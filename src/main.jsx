import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import AppProvider from "./providers/AppProviders.jsx";
import ErrorBoundary from "./components/feedback/ErrorBoundary";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <AppProvider />
    </ErrorBoundary>
  </StrictMode>
);
