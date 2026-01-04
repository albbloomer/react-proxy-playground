import React from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import { createAppStore } from "./store";

export async function render(url: string) {
  const store = createAppStore({ count: 10 });
  const appHtml = renderToString(<App store={store} />);
  const state = store.getState();
  return { appHtml, state };
}