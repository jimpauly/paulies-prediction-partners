/**
 * React entry point — Phase 1 scaffold.
 *
 * This file is intentionally minimal. It establishes the React root and
 * is ready to mount components in Phase 2.
 */

import React from "react";
import ReactDOM from "react-dom/client";

const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      {/* Phase 2: mount React components here */}
    </React.StrictMode>
  );
}
