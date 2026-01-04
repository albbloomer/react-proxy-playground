import React from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App";
import { createAppStore } from "./store";

declare global {
  interface Window {
    __INITIAL_STATE__?: any;
  }
}

const preloaded = window.__INITIAL_STATE__ ?? {};
const store = createAppStore(preloaded);

hydrateRoot(document.getElementById("root")!, <App store={store} />);