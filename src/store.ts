import { createStore } from "zustand/vanilla";
import { useStore as useZustandStore } from "zustand";

export type AppState = {
  count: number;
  inc: () => void;
};

export function createAppStore(preloaded?: Partial<AppState>) {
  return createStore<AppState>()((set, get) => ({
    count: preloaded?.count ?? 0,
    inc: () => set({ count: get().count + 1 }),
  }));
}

export type AppStore = ReturnType<typeof createAppStore>;

export function useAppStore<T>(store: AppStore, selector: (s: AppState) => T) {
  return useZustandStore(store, selector);
}