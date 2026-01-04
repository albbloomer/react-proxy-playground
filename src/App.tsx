import React from "react";
import type { AppStore } from "./store";
import { useAppStore } from "./store";

export default function App({ store }: { store: AppStore }) {
  const count = useAppStore(store, (s) => s.count);
  const inc = useAppStore(store, (s) => s.inc);

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>SSR + CSR + Zustand + TS</h1>
      <p>count: {count}</p>
      <button onClick={inc}>+1</button>
    </div>
  );
}