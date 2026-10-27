"use client";

import Link from "next/link";
import { useState } from "react";
import { methodById, type MethodId } from "@/lib/catalog";
import { clampQty, defaultConfig, productsForCalculator, quote, sgd } from "@/lib/pricing";
import { draftsStore, labStore } from "@/lib/store";

const garments = productsForCalculator();

export function PriceCalculator() {
  const [slug, setSlug] = useState(garments[0].slug);
  const [method, setMethod] = useState<MethodId>(garments[0].methods[0]);
  const [qtyText, setQtyText] = useState("12");

  const product = garments.find((p) => p.slug === slug) ?? garments[0];
  const activeMethod = product.methods.includes(method) ? method : product.methods[0];
  const m = methodById[activeMethod];
  const wanted = Number(qtyText) || 0;
  const qty = clampQty(m, wanted || m.minQty);
  const q = quote(product, { ...defaultConfig(product, activeMethod), method: activeMethod, qty });

  function carry() {
    draftsStore.set((d) => ({ ...d, [product.slug]: { ...defaultConfig(product, activeMethod), qty } }));
    labStore.set({ slug: product.slug });
  }

  return (
    <div className="card grid gap-6 p-4 sm:p-6 lg:grid-cols-[1fr_1fr]">
      <div className="space-y-4">
        <div>
          <label htmlFor="calc-garment" className="field-label">Garment</label>
          <select id="calc-garment" className="input" value={product.slug} onChange={(e) => setSlug(e.target.value)}>
            {garments.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="calc-method" className="field-label">Print method</label>
          <select id="calc-method" className="input" value={activeMethod} onChange={(e) => setMethod(e.target.value as MethodId)}>
            {product.methods.map((id) => <option key={id} value={id}>{methodById[id].name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="calc-qty" className="field-label">Quantity</label>
          <span className="field-hint">{m.name}: {m.minQty} to {m.maxQty.toLocaleString("en-SG")} pieces</span>
          <input id="calc-qty" className="input max-w-40" inputMode="numeric" autoComplete="off" value={qtyText}
            onChange={(e) => setQtyText(e.target.value.replace(/\D/g, ""))} onBlur={() => setQtyText(String(qty))} />
        </div>
      </div>

      <div className="crop rounded-lg bg-white p-6" aria-live="polite" style={{ ["--crop-inset" as string]: "8px" }}>
        <p className="caption">{q.qty} × {product.name}, {m.name}, front print</p>
        <p className="price mt-1 text-4xl">{sgd(q.total)}</p>
        <p className="caption">Estimated total</p>
        <dl className="mt-4 space-y-1">
          <div className="flex justify-between gap-4"><dt>Garment</dt><dd className="price font-normal">{sgd(q.garment)} each</dd></div>
          <div className="flex justify-between gap-4"><dt>Print</dt><dd className="price font-normal">{sgd(q.print)} each</dd></div>
          <div className="flex justify-between gap-4"><dt>Setup fee</dt><dd className="price font-normal">{q.setup ? sgd(q.setup) : "None"}</dd></div>
          <div className="flex justify-between gap-4 border-t border-line pt-1"><dt className="font-semibold">Per piece</dt><dd className="price">{sgd(q.unit)}</dd></div>
        </dl>
        {wanted !== 0 && wanted !== qty && (
          <p className="field-error">{m.name} takes {m.minQty} to {m.maxQty.toLocaleString("en-SG")} pieces, so this shows {qty}.</p>
        )}
        <p className="caption mt-3">Final price is confirmed after artwork review.</p>
        <Link href="/design/" onClick={carry} className="btn btn-primary mt-4 w-full">Start designing with these options</Link>
      </div>
    </div>
  );
}
