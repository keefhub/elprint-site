"use client";

import { useMemo, useRef, useState } from "react";
import { methods, type MethodId, type Product } from "@/lib/catalog";
import { fromPrice } from "@/lib/pricing";
import { Icon } from "./Icon";
import { ProductCard } from "./ProductCard";

interface Filters {
  methods: MethodId[];
  price: string[];
  sleeve: string[];
  fabric: string[];
  sizes: string[];
}
const empty: Filters = { methods: [], price: [], sleeve: [], fabric: [], sizes: [] };

const priceBuckets = [
  { id: "u15", label: "Under S$15", test: (p: number) => p < 15 },
  { id: "15-30", label: "S$15 to S$30", test: (p: number) => p >= 15 && p <= 30 },
  { id: "o30", label: "Over S$30", test: (p: number) => p > 30 },
];

const sorts = [
  { id: "popular", label: "Popular" },
  { id: "low", label: "Price: low to high" },
  { id: "high", label: "Price: high to low" },
  { id: "name", label: "Name" },
];

function uniq<T>(items: T[]) {
  return Array.from(new Set(items));
}

function Group({
  legend, name, options, selected, onToggle,
}: {
  legend: string; name: string; options: { id: string; label: string }[]; selected: string[]; onToggle: (id: string) => void;
}) {
  if (options.length < 2) return null;
  return (
    <fieldset className="border-b border-line py-4">
      <legend className="mb-2 font-semibold">{legend}</legend>
      {options.map((o) => (
        <label key={o.id} className="flex min-h-11 cursor-pointer items-center gap-3">
          <input
            type="checkbox" name={name} className="h-5 w-5 accent-teal"
            checked={selected.includes(o.id)} onChange={() => onToggle(o.id)}
          />
          {o.label}
        </label>
      ))}
    </fieldset>
  );
}

export function ShopBrowser({ products }: { products: Product[] }) {
  const [filters, setFilters] = useState<Filters>(empty);
  const [sort, setSort] = useState("popular");
  const dialogRef = useRef<HTMLDialogElement>(null);

  const options = useMemo(() => ({
    methods: methods
      .filter((m) => products.some((p) => p.methods.includes(m.id)))
      .map((m) => ({ id: m.id, label: m.name })),
    sleeve: uniq(products.map((p) => p.sleeve)).filter((s) => s !== "None").map((s) => ({ id: s, label: `${s} sleeve` })),
    fabric: uniq(products.map((p) => p.fabric)).map((f) => ({ id: f, label: f })),
    sizes: uniq(products.map((p) => p.sizeRange)).map((s) => ({ id: s, label: s })),
  }), [products]);

  const visible = useMemo(() => {
    const list = products.filter((p) => {
      const price = fromPrice(p);
      return (
        (!filters.methods.length || filters.methods.some((m) => p.methods.includes(m))) &&
        (!filters.price.length || filters.price.some((id) => priceBuckets.find((b) => b.id === id)!.test(price))) &&
        (!filters.sleeve.length || filters.sleeve.includes(p.sleeve)) &&
        (!filters.fabric.length || filters.fabric.includes(p.fabric)) &&
        (!filters.sizes.length || filters.sizes.includes(p.sizeRange))
      );
    });
    if (sort === "low") list.sort((a, b) => fromPrice(a) - fromPrice(b));
    if (sort === "high") list.sort((a, b) => fromPrice(b) - fromPrice(a));
    if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, filters, sort]);

  const toggle = <K extends keyof Filters>(key: K) => (id: string) =>
    setFilters((f) => {
      const cur = f[key] as string[];
      return { ...f, [key]: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] };
    });

  const active = [
    ...filters.methods.map((id) => ({ key: "methods" as const, id, label: options.methods.find((o) => o.id === id)?.label ?? id })),
    ...filters.price.map((id) => ({ key: "price" as const, id, label: priceBuckets.find((b) => b.id === id)!.label })),
    ...filters.sleeve.map((id) => ({ key: "sleeve" as const, id, label: `${id} sleeve` })),
    ...filters.fabric.map((id) => ({ key: "fabric" as const, id, label: id })),
    ...filters.sizes.map((id) => ({ key: "sizes" as const, id, label: `Sizes ${id}` })),
  ];

  const groups = (
    <>
      <Group legend="Print method" name="method" options={options.methods} selected={filters.methods} onToggle={toggle("methods")} />
      <Group legend="Price range" name="price" options={priceBuckets} selected={filters.price} onToggle={toggle("price")} />
      <Group legend="Sleeve type" name="sleeve" options={options.sleeve} selected={filters.sleeve} onToggle={toggle("sleeve")} />
      <Group legend="Fabric" name="fabric" options={options.fabric} selected={filters.fabric} onToggle={toggle("fabric")} />
      <Group legend="Size range" name="sizes" options={options.sizes} selected={filters.sizes} onToggle={toggle("sizes")} />
    </>
  );

  return (
    <div className="wrap pb-16 lg:grid lg:grid-cols-[260px_1fr] lg:gap-12">
      <aside aria-label="Filters" className="hidden lg:block">
        <div className="sticky top-24">
          <div className="flex items-center justify-between">
            <h2 className="text-xl">Filters</h2>
            {active.length > 0 && <button type="button" className="btn btn-ghost" onClick={() => setFilters(empty)}>Clear all</button>}
          </div>
          {groups}
        </div>
      </aside>

      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <button type="button" className="btn btn-secondary lg:hidden" onClick={() => dialogRef.current?.showModal()}>
            <Icon name="filter" size={20} />Filters{active.length ? ` (${active.length})` : ""}
          </button>
          <p role="status" aria-live="polite" className="caption">
            {visible.length} {visible.length === 1 ? "product" : "products"}
          </p>
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="caption">Sort</label>
            <select id="sort" className="input w-auto" value={sort} onChange={(e) => setSort(e.target.value)}>
              {sorts.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
        </div>

        {active.length > 0 && (
          <ul className="mb-4 flex flex-wrap gap-2" aria-label="Applied filters">
            {active.map((a) => (
              <li key={`${a.key}-${a.id}`}>
                <button type="button" onClick={() => toggle(a.key)(a.id)}
                  className="flex min-h-11 items-center gap-1 rounded-full border border-teal bg-teal-tint px-4 text-sm font-semibold text-ink">
                  {a.label}<Icon name="x" size={16} /><span className="sr-only">Remove filter</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {visible.length ? (
          <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((p) => <ProductCard key={p.slug} product={p} />)}
          </ul>
        ) : (
          <div className="card p-8 text-center">
            <p className="text-lg font-semibold">No products match these filters.</p>
            <p className="caption mt-1">Remove a filter to see more.</p>
            <button type="button" className="btn btn-primary mt-4" onClick={() => setFilters(empty)}>Clear all filters</button>
          </div>
        )}
      </div>

      <dialog ref={dialogRef} aria-label="Filters" className="m-0 mt-auto max-h-[85vh] w-full max-w-none rounded-t-xl bg-paper p-0 lg:hidden">
        <div className="flex max-h-[85vh] flex-col">
          <div className="flex items-center justify-between border-b border-line px-4 py-2">
            <h2 className="text-xl">Filters</h2>
            <button type="button" className="flex h-11 w-11 items-center justify-center" aria-label="Close filters" onClick={() => dialogRef.current?.close()}>
              <Icon name="x" className="text-ink" />
            </button>
          </div>
          <div className="overflow-y-auto px-4">{groups}</div>
          <div className="flex gap-2 border-t border-line p-4">
            <button type="button" className="btn btn-secondary" onClick={() => setFilters(empty)}>Clear all</button>
            <button type="button" className="btn btn-primary flex-1" onClick={() => dialogRef.current?.close()}>
              Show {visible.length} {visible.length === 1 ? "result" : "results"}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
