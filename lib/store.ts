import { useSyncExternalStore } from "react";
import type { Config } from "./pricing";

/**
 * Tiny localStorage-backed store. No server: cart, drafts and orders live in the
 * visitor's browser. Falls back to memory when storage is blocked.
 */
export interface Store<T> {
  initial: T;
  get: () => T;
  set: (update: T | ((prev: T) => T)) => void;
  subscribe: (cb: () => void) => () => void;
}

export function createStore<T>(key: string, initial: T): Store<T> {
  const listeners = new Set<() => void>();
  let raw: string | null | undefined;
  let value: T = initial;
  let memory: T = initial;
  let usingMemory = false;

  const emit = () => listeners.forEach((l) => l());
  const onStorage = (e: StorageEvent) => {
    if (e.key === key || e.key === null) emit();
  };

  function get(): T {
    if (typeof window === "undefined") return initial;
    if (usingMemory) return memory;
    let next: string | null;
    try {
      next = window.localStorage.getItem(key);
    } catch {
      return memory;
    }
    if (next === raw) return value;
    raw = next;
    try {
      value = next === null ? initial : (JSON.parse(next) as T);
    } catch {
      value = initial;
    }
    return value;
  }

  function set(update: T | ((prev: T) => T)) {
    const next = typeof update === "function" ? (update as (p: T) => T)(get()) : update;
    try {
      window.localStorage.setItem(key, JSON.stringify(next));
      usingMemory = false;
    } catch {
      usingMemory = true;
      memory = next;
    }
    emit();
  }

  function subscribe(cb: () => void) {
    listeners.add(cb);
    if (listeners.size === 1 && typeof window !== "undefined") window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(cb);
      if (listeners.size === 0 && typeof window !== "undefined") window.removeEventListener("storage", onStorage);
    };
  }

  return { initial, get, set, subscribe };
}

export function useStore<T>(store: Store<T>): T {
  return useSyncExternalStore(store.subscribe, store.get, () => store.initial);
}

/* ---------- Stores ---------- */

export interface CartLine {
  id: string;
  slug: string;
  config: Config;
}

export type DeliveryMode = "courier" | "collect" | "singpost";

export interface CheckoutDraft {
  step: 1 | 2 | 3;
  name: string;
  email: string;
  phone: string;
  mode: DeliveryMode;
  address: string;
  postal: string;
  instructions: string;
  agreed: boolean;
}

export interface OrderLine {
  name: string;
  options: string[];
  qty: number;
  unit: number;
  total: number;
  artwork?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  kind: "order" | "quote";
  lines: OrderLine[];
  subtotal: number;
  delivery: number;
  total: number;
  customer: Pick<CheckoutDraft, "name" | "email" | "phone" | "mode" | "address" | "postal" | "instructions">;
}

export const cartStore = createStore<CartLine[]>("elprint:cart", []);
export const draftsStore = createStore<Record<string, Config>>("elprint:drafts", {});
export const labStore = createStore<{ slug: string }>("elprint:lab", { slug: "heavy-cotton-tee" });
export const orderStore = createStore<Order | null>("elprint:last-order", null);
export const checkoutInitial: CheckoutDraft = {
  step: 1, name: "", email: "", phone: "", mode: "courier", address: "", postal: "", instructions: "", agreed: false,
};
export const checkoutStore = createStore<CheckoutDraft>("elprint:checkout", checkoutInitial);

export function addToCart(slug: string, config: Config) {
  const id = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  cartStore.set((lines) => [...lines, { id, slug, config }]);
}

export function newOrderId() {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return `EL-${ymd}-${Math.floor(1000 + Math.random() * 9000)}`;
}
