"use client";

import Link from "next/link";
import { useState } from "react";
import {
  categories, isAccessory, methodById, products, type PrintLocation, type Product,
} from "@/lib/catalog";
import {
  clampQty, normaliseConfig, quote, sgd, turnaroundFor, type Config,
} from "@/lib/pricing";
import { addToCart, draftsStore, labStore, useStore } from "@/lib/store";
import { Garment, type GarmentView } from "./Garment";
import { Icon } from "./Icon";
import { Stepper } from "./Stepper";
import { UploadZone } from "./UploadZone";

const viewLabels: Record<GarmentView, string> = { front: "Front", back: "Back", detail: "Print detail" };

function useDraft(product: Product) {
  const drafts = useStore(draftsStore);
  const config = normaliseConfig(product, drafts[product.slug]);
  const update = (patch: Partial<Config>) =>
    draftsStore.set((d) => ({ ...d, [product.slug]: { ...normaliseConfig(product, d[product.slug]), ...patch } }));
  return [config, update] as const;
}

function Gallery({ product, config }: { product: Product; config: Config }) {
  const [view, setView] = useState<GarmentView>("front");
  const color = product.colors.find((c) => c.name === config.color) ?? product.colors[0];
  const views: GarmentView[] = isAccessory(product) ? ["front", "detail"] : ["front", "back", "detail"];
  const shown = views.includes(view) ? view : "front";
  const props = {
    kind: product.kind, color: color.hex, accent: product.accent, text: config.text, method: config.method,
    artwork: config.artwork?.thumb, locations: config.locations,
  };
  return (
    <div className="lg:sticky lg:top-24 lg:self-start">
      <div className="crop rounded-lg bg-surface" style={{ ["--crop-inset" as string]: "16px" }}>
        <Garment {...props} view={shown} label={`${color.name} ${product.name}, ${viewLabels[shown].toLowerCase()} view`} className="aspect-square w-full p-6" />
      </div>
      <ul className="mt-3 flex gap-2" aria-label="Product views">
        {views.map((v) => (
          <li key={v}>
            <button
              type="button" onClick={() => setView(v)} aria-pressed={shown === v}
              className={`block h-20 w-20 overflow-hidden rounded-md border-2 bg-surface ${shown === v ? "border-teal" : "border-line hover:border-teal"}`}
            >
              <Garment {...props} view={v} label={`${viewLabels[v]} view`} className="h-full w-full p-1" placeholder={false} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Tabs({ product, config }: { product: Product; config: Config }) {
  const [tab, setTab] = useState(0);
  const method = methodById[config.method];
  const names = ["Details", "Printing method", "Design tips"];
  const tips = [
    ...(product.tips ?? []),
    "Send artwork at 300 DPI at the size you want it printed.",
    "Use a transparent PNG, or a vector PDF, AI or EPS file, for the cleanest edges.",
    "Convert text to outlines in vector files so fonts don't change.",
    "Keep important detail inside the crop marks. Anything near the edge can shift slightly.",
    isAccessory(product) ? "Add a 3 mm bleed around full-bleed artwork." : "Front prints sit about 8 cm below the collar. Tell us if you need them higher or lower.",
  ];
  return (
    <section className="mt-12" aria-label="More about this product">
      <div role="tablist" aria-label="Product information" className="scroll-x flex gap-1 border-b border-line">
        {names.map((n, i) => (
          <button
            key={n} role="tab" id={`tab-${i}`} aria-selected={tab === i} aria-controls={`panel-${i}`} tabIndex={tab === i ? 0 : -1}
            onClick={() => setTab(i)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") { setTab((tab + 1) % 3); document.getElementById(`tab-${(tab + 1) % 3}`)?.focus(); }
              if (e.key === "ArrowLeft") { setTab((tab + 2) % 3); document.getElementById(`tab-${(tab + 2) % 3}`)?.focus(); }
            }}
            className={`min-h-11 whitespace-nowrap border-b-2 px-4 font-semibold ${tab === i ? "border-teal text-teal" : "border-transparent text-ink hover:text-teal"}`}
          >
            {n}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="max-w-3xl py-6">
        {tab === 0 && (
          <div>
            <dl className="grid gap-x-8 gap-y-2 sm:grid-cols-[140px_1fr]">
              {[...product.details, { label: "Brand", value: product.brands.join(", ") }].map((d) => (
                <div key={d.label} className="contents">
                  <dt className="font-semibold">{d.label}</dt>
                  <dd className="mb-2 sm:mb-0">{d.value}</dd>
                </div>
              ))}
            </dl>
            {product.sizeChart && (
              <div className="scroll-x mt-6">
                <table className="data-table max-w-md">
                  <caption>Size chart. Garment measurements, laid flat.</caption>
                  <thead><tr><th scope="col">Size</th><th scope="col">Chest (width)</th><th scope="col">Length</th></tr></thead>
                  <tbody>
                    {product.sizeChart.map((r) => (
                      <tr key={r.size}><th scope="row">{r.size}</th><td>{r.chest}</td><td>{r.length}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {tab === 1 && (
          <div>
            <h3>{method.name}</h3>
            <p className="mt-2">{method.what}</p>
            <div className="mt-4 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="font-semibold">Good for</p>
                <ul className="mt-1 list-disc pl-5">{method.pros.map((p) => <li key={p}>{p}</li>)}</ul>
              </div>
              <div>
                <p className="font-semibold">Keep in mind</p>
                <ul className="mt-1 list-disc pl-5">{method.cons.map((p) => <li key={p}>{p}</li>)}</ul>
              </div>
            </div>
            <Link href={`/services/${method.id}/`} className="btn btn-ghost -ml-3 mt-4">Read more about {method.name}</Link>
          </div>
        )}
        {tab === 2 && (
          <ul className="list-disc pl-5">
            {tips.map((t) => <li key={t} className="mb-1">{t}</li>)}
          </ul>
        )}
      </div>
    </section>
  );
}

export function ProductExperience({ product, mode }: { product: Product; mode: "page" | "lab" }) {
  const [config, update] = useDraft(product);
  const [added, setAdded] = useState(false);
  const method = methodById[config.method];
  const q = quote(product, config);
  const accessory = isAccessory(product);
  const verb = product.quoteOnly ? "Request quote" : "Add to cart";
  const priceNote = product.quoteOnly ? "Estimate. We confirm the final price by quote." : "Final price is confirmed after artwork review.";

  function toggleLocation(loc: PrintLocation) {
    const has = config.locations.includes(loc);
    const next = has ? config.locations.filter((l) => l !== loc) : [...config.locations, loc];
    if (next.length) update({ locations: next });
  }

  function submit() {
    addToCart(product.slug, { ...config, qty: q.qty });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 3000);
  }

  const action = (
    <button type="button" className="btn btn-primary btn-lg" onClick={submit}>
      {added ? "Added" : verb}
    </button>
  );

  return (
    <div>
      <div className="grid gap-8 lg:grid-cols-[3fr_2fr] lg:gap-12">
        <Gallery product={product} config={config} />

        <div>
          {mode === "page" ? <h1>{product.name}</h1> : <h2 className="text-3xl">{product.name}</h2>}
          {product.badges.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-1" aria-label="Tags">
              {product.badges.map((b) => <li key={b} className="badge">{b}</li>)}
            </ul>
          )}
          <p className="mt-3">{product.short}</p>

          <div className="mt-4 rounded-lg border border-line bg-surface p-4" aria-live="polite">
            <p className="caption">{q.qty} {q.qty === 1 ? "piece" : "pieces"}, {method.name}</p>
            <p className="price text-3xl">{sgd(q.unit)} <span className="text-base font-normal text-muted">per piece</span></p>
            <p className="mt-1">
              Total <span className="price">{sgd(q.total)}</span>
              {(q.setup > 0 || q.rush > 0) && (
                <span className="caption"> (includes {[q.setup > 0 && `setup ${sgd(q.setup)}`, q.rush > 0 && `rush ${sgd(q.rush)}`].filter(Boolean).join(" and ")})</span>
              )}
            </p>
            <p className="caption mt-1">{priceNote}</p>
          </div>

          <div className="mt-6 space-y-6">
            <fieldset>
              <legend className="field-label">Colour: <span className="font-normal">{config.color}</span></legend>
              <div className="flex flex-wrap gap-1">
                {product.colors.map((c) => (
                  <label key={c.name} className="choice flex h-11 w-11 items-center justify-center rounded-full p-1">
                    <input type="radio" name={`${product.slug}-color`} className="sr-only-input" checked={config.color === c.name} onChange={() => update({ color: c.name })} />
                    <span className="block h-full w-full rounded-full border border-black/20" style={{ background: c.hex }} />
                    <span className="sr-only">{c.name}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="field-label">{product.sizeLabel}: <span className="font-normal">{config.size}</span></legend>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <label key={s.label} className="choice flex min-h-11 min-w-11 items-center justify-center px-3 font-semibold">
                    <input type="radio" name={`${product.slug}-size`} className="sr-only-input" checked={config.size === s.label} onChange={() => update({ size: s.label })} />
                    {s.label}
                    {s.add > 0 && <span className="sr-only"> (adds {sgd(s.add)} per piece)</span>}
                  </label>
                ))}
              </div>
              {product.sizes.some((s) => s.add > 0) && <p className="caption mt-1">Larger sizes cost a little more per piece.</p>}
              {!accessory && <p className="caption mt-1">Need a mix of sizes? Add each size to the cart separately, or tell us at checkout.</p>}
            </fieldset>

            {product.brands.length > 1 && (
              <div>
                <label htmlFor={`${product.slug}-brand`} className="field-label">Garment brand</label>
                <select id={`${product.slug}-brand`} className="input max-w-xs" value={config.brand} onChange={(e) => update({ brand: e.target.value })}>
                  {product.brands.map((b) => <option key={b}>{b}</option>)}
                </select>
              </div>
            )}

            <fieldset>
              <legend className="field-label">Print method</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {product.methods.map((id) => {
                  const m = methodById[id];
                  return (
                    <label key={id} className="choice p-3">
                      <input type="radio" name={`${product.slug}-method`} className="sr-only-input" checked={config.method === id}
                        onChange={() => update({ method: id, qty: clampQty(m, config.qty), rush: config.rush && Boolean(m.rushTurnaround) })} />
                      <span className="flex items-start justify-between gap-2">
                        <span className="font-semibold">{m.name}</span>
                        {config.method === id && <Icon name="check" size={20} />}
                      </span>
                      <span className="caption block">{m.setupFee ? `Setup ${sgd(m.setupFee)} per location` : "No setup fee"}</span>
                      <span className="caption block">{m.minQty === 1 ? "No minimum order" : `Minimum ${m.minQty} pieces`}</span>
                      <span className="caption block">{m.turnaround}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div>
              <p id={`${product.slug}-qty-l`} className="field-label">Quantity</p>
              <span className="field-hint">{method.name}: {method.minQty} to {method.maxQty.toLocaleString("en-SG")} pieces</span>
              <div role="group" aria-labelledby={`${product.slug}-qty-l`}>
                <Stepper value={q.qty} min={method.minQty} max={method.maxQty} onChange={(n) => update({ qty: clampQty(method, n) })} />
              </div>
            </div>

            {!accessory && (
              <fieldset>
                <legend className="field-label">Print locations</legend>
                <span className="field-hint">Front is included. Each extra location adds to the price per piece.</span>
                <div className="flex flex-wrap gap-2">
                  {([["front", "Front"], ["back", "Back (+80%)"], ["sleeve", "Sleeve (+50%)"]] as [PrintLocation, string][]).map(([loc, label]) => (
                    <label key={loc} className="choice flex min-h-11 items-center gap-2 px-3">
                      <input type="checkbox" className="h-5 w-5 accent-teal" checked={config.locations.includes(loc)} onChange={() => toggleLocation(loc)} />
                      {label}
                    </label>
                  ))}
                </div>
                <p className="caption mt-1">Percentages are of the front-print price per piece.</p>
              </fieldset>
            )}

            {method.rushTurnaround && (
              <label className="choice flex items-start gap-3 p-3">
                <input type="checkbox" className="mt-1 h-5 w-5 accent-teal" checked={config.rush} onChange={(e) => update({ rush: e.target.checked })} />
                <span>
                  <span className="block font-semibold">Rush: ready in {method.rushTurnaround} (+{sgd(30)})</span>
                  <span className="caption block">After proof approval. Subject to our workload.</span>
                </span>
              </label>
            )}

            <div>
              <label htmlFor={`${product.slug}-text`} className="field-label">Text to print (optional)</label>
              <span className="field-hint">Shows on the preview. For logos and images, upload artwork below.</span>
              <input id={`${product.slug}-text`} className="input max-w-md" maxLength={40} autoComplete="off" value={config.text}
                onChange={(e) => update({ text: e.target.value })} placeholder="e.g. Class of 2026" />
            </div>

            <UploadZone value={config.artwork} onChange={(a) => update({ artwork: a })} />
          </div>

          <div className="mt-6 hidden items-center gap-4 lg:flex">
            {action}
            {added && <Link href="/cart/" className="font-semibold">View cart</Link>}
          </div>
          <p role="status" className="sr-only">{added ? `${product.name} added to cart` : ""}</p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 text-sm">
            <Icon name="clock" size={16} />Ready in {turnaroundFor(config)} after proof approval
          </p>
          <p className="caption mt-3 flex items-center gap-2">
            <Icon name="shield" size={16} />No payment until you approve the digital proof.
          </p>
        </div>
      </div>

      {mode === "page" && <Tabs product={product} config={config} />}

      <div className="h-24 lg:hidden" aria-hidden="true" />
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-line bg-paper px-4 py-2 shadow-[0_-4px_12px_rgb(0_0_0/0.06)] lg:hidden">
        <div>
          <p className="price text-lg leading-tight">{sgd(q.total)}</p>
          <p className="caption leading-tight">{sgd(q.unit)} per piece</p>
        </div>
        {added ? (
          <Link href="/cart/" className="btn btn-primary">Added. View cart</Link>
        ) : (
          <button type="button" className="btn btn-primary" onClick={submit}>{verb}</button>
        )}
      </div>
    </div>
  );
}

export function DesignLab() {
  const { slug } = useStore(labStore);
  const product = products.find((p) => p.slug === slug) ?? products[0];
  return (
    <div className="wrap pb-16">
      <div className="mb-8 max-w-md">
        <label htmlFor="lab-product" className="field-label">Start with a product</label>
        <select id="lab-product" className="input" value={product.slug} onChange={(e) => labStore.set({ slug: e.target.value })}>
          {categories.map((c) => (
            <optgroup key={c.id} label={c.name}>
              {products.filter((p) => p.category === c.id).map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
            </optgroup>
          ))}
        </select>
        <p className="caption mt-1">Your design saves on this device as you go.</p>
      </div>
      <ProductExperience key={product.slug} product={product} mode="lab" />
    </div>
  );
}
