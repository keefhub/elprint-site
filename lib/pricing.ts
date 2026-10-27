import {
  RUSH_FEE, isAccessory, methodById, products,
  type Method, type MethodId, type PrintLocation, type Product,
} from "./catalog";

export interface ArtworkMeta {
  name: string;
  size: number;
  type: string;
  /** Small WebP data URL for image files; absent for PDF, AI and EPS. */
  thumb?: string;
}

export interface Config {
  color: string;
  size: string;
  brand: string;
  method: MethodId;
  qty: number;
  locations: PrintLocation[];
  rush: boolean;
  text: string;
  artwork?: ArtworkMeta;
}

/** Share of the front-print price charged for each extra location. */
export const LOCATION_FACTOR: Record<PrintLocation, number> = { front: 1, back: 0.8, sleeve: 0.5 };

export const COURIER_FEE = 25;
/** PLACEHOLDER: SingPost registered-post fee was not supplied. */
export const SINGPOST_FEE = 4.5;
export const SINGPOST_MAX_PIECES = 4;

export const sgd = (n: number) => `S$${n.toFixed(2)}`;

export function tierPrice(method: Method, qty: number) {
  let price = method.tiers[0].price;
  for (const t of method.tiers) if (qty >= t.from) price = t.price;
  return price;
}

export function clampQty(method: Method, qty: number) {
  if (!Number.isFinite(qty)) return method.minQty;
  return Math.min(method.maxQty, Math.max(method.minQty, Math.round(qty)));
}

export function defaultConfig(product: Product, methodId?: MethodId): Config {
  const method = methodById[methodId && product.methods.includes(methodId) ? methodId : product.methods[0]];
  const mid = product.sizes[Math.min(1, product.sizes.length - 1)];
  return {
    color: product.colors[0].name,
    size: mid.label,
    brand: product.brands[0],
    method: method.id,
    qty: method.minQty,
    locations: ["front"],
    rush: false,
    text: "",
  };
}

/** Make a saved draft safe to use against the current catalogue. */
export function normaliseConfig(product: Product, saved?: Config): Config {
  const base = defaultConfig(product);
  if (!saved) return base;
  const method = methodById[product.methods.includes(saved.method) ? saved.method : base.method];
  return {
    ...base,
    ...saved,
    color: product.colors.some((c) => c.name === saved.color) ? saved.color : base.color,
    size: product.sizes.some((s) => s.label === saved.size) ? saved.size : base.size,
    brand: product.brands.includes(saved.brand) ? saved.brand : base.brand,
    method: method.id,
    qty: clampQty(method, saved.qty),
    locations: saved.locations?.length ? saved.locations : ["front"],
    rush: Boolean(saved.rush && method.rushTurnaround),
  };
}

export interface Quote {
  qty: number;
  garment: number;
  print: number;
  unit: number;
  setup: number;
  rush: number;
  total: number;
  method: Method;
}

export function quote(product: Product, cfg: Config): Quote {
  const method = methodById[cfg.method];
  const qty = clampQty(method, cfg.qty);
  const size = product.sizes.find((s) => s.label === cfg.size);
  const garment = product.price + (size?.add ?? 0);
  const locations: PrintLocation[] = isAccessory(product) ? ["front"] : cfg.locations;
  const factor = locations.reduce((sum, l) => sum + LOCATION_FACTOR[l], 0);
  const print = tierPrice(method, qty) * factor;
  const setup = method.setupFee * locations.length;
  const rush = cfg.rush && method.rushTurnaround ? RUSH_FEE : 0;
  const unit = garment + print;
  return { qty, garment, print, unit, setup, rush, total: unit * qty + setup + rush, method };
}

/** The "From" price shown on cards: lowest per-piece price at the smallest order, front print only. */
export function fromPrice(product: Product) {
  let best = Infinity;
  for (const id of product.methods) {
    const m = methodById[id];
    best = Math.min(best, product.price + tierPrice(m, m.minQty));
  }
  return best;
}

export function turnaroundFor(cfg: Config) {
  const m = methodById[cfg.method];
  return cfg.rush && m.rushTurnaround ? m.rushTurnaround : m.turnaround;
}

export function optionSummary(product: Product, cfg: Config) {
  const m = methodById[cfg.method];
  const parts = [`${cfg.color}`, `Size ${cfg.size}`, m.name];
  if (!isAccessory(product)) parts.push(`Print: ${cfg.locations.join(", ")}`);
  if (cfg.rush) parts.push("Rush");
  return parts;
}

export function productsForCalculator() {
  return products.filter((p) => !isAccessory(p));
}

export function deliveryFee(mode: "courier" | "collect" | "singpost", pieces: number) {
  if (mode === "courier") return COURIER_FEE;
  if (mode === "singpost" && pieces <= SINGPOST_MAX_PIECES) return SINGPOST_FEE;
  return 0;
}

export const isPostalCode = (v: string) => /^\d{6}$/.test(v.trim());
