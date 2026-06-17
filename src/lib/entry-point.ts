const KEY = "smart-navigator:entry";

export function setEntryPoint(id: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, id);
  window.dispatchEvent(new Event("smart-navigator:entry-change"));
}

export function getEntryPoint(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(KEY);
}

export function clearEntryPoint() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("smart-navigator:entry-change"));
}

import { useSyncExternalStore } from "react";
export function useEntryPoint(): string | null {
  return useSyncExternalStore(
    (cb) => {
      if (typeof window === "undefined") return () => {};
      window.addEventListener("smart-navigator:entry-change", cb);
      window.addEventListener("storage", cb);
      return () => {
        window.removeEventListener("smart-navigator:entry-change", cb);
        window.removeEventListener("storage", cb);
      };
    },
    () => getEntryPoint(),
    () => null,
  );
}
