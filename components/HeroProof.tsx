"use client";

import Link from "next/link";
import { useState } from "react";
import { methodById, productBySlug, type MethodId } from "@/lib/catalog";
import { clampQty, defaultConfig, normaliseConfig, quote, sgd } from "@/lib/pricing";
import { draftsStore, labStore } from "@/lib/store";
import { Garment } from "./Garment";

const product = productBySlug["heavy-cotton-tee"];
const heroMethods: MethodId[] = ["dtg", "silkscreen", "embroidery"];
const heroQty = [1, 12, 24, 100];

/** The hero is a live proof: type text, pick a method, see the shirt and the price. */
export function HeroProof() {
  const [text, setText] = useState("Your team name");
  const [method, setMethod] = useState<MethodId>("dtg");
  const [qty, setQty] = useState(1);

  const m = methodById[method];
  const effective = clampQty(m, qty);
  const q = quote(product, { ...defaultConfig(product, method), method, qty: effective });

  function carryToLab() {
    draftsStore.set((d) => ({
      ...d,
      [product.slug]: { ...normaliseConfig(product, d[product.slug]), text, method, qty: effective },
    }));
    labStore.set({ slug: product.slug });
  }

  return (
    <div className="card proof-in p-4 sm:p-6">
      <div className="crop rounded-md bg-white" style={{ ["--crop-inset" as string]: "10px" }}>
        <Garment
          kind="tee" color="#FFFFFF" text={text} method={method} animate
          label={`White T-shirt with the text "${text || "Your design"}" printed on the chest using ${m.name}`}
          className="mx-auto aspect-square w-full max-w-sm p-4"
        />
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <label htmlFor="hero-text" className="field-label">Type your text or team name</label>
          <input id="hero-text" className="input" maxLength={40} autoComplete="off" value={text} onChange={(e) => setText(e.target.value)} />
        </div>

        <fieldset>
          <legend className="field-label">Print method</legend>
          <div className="grid grid-cols-3 gap-2">
            {heroMethods.map((id) => (
              <label key={id} className="choice flex min-h-11 items-center justify-center px-2 text-center text-sm font-semibold">
                <input type="radio" name="hero-method" className="sr-only-input" checked={method === id} onChange={() => setMethod(id)} />
                {methodById[id].name}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="field-label">Pieces</legend>
          <div className="grid grid-cols-4 gap-2">
            {heroQty.map((n) => (
              <label key={n} className="choice flex min-h-11 items-center justify-center font-semibold">
                <input type="radio" name="hero-qty" className="sr-only-input" checked={qty === n} onChange={() => setQty(n)} />
                {n}
              </label>
            ))}
          </div>
        </fieldset>

        <div aria-live="polite" className="border-t border-line pt-3">
          <p className="price text-2xl">
            {sgd(q.unit)} <span className="text-base font-normal text-muted">per piece, {effective} {effective === 1 ? "piece" : "pieces"}</span>
          </p>
          <p className="caption">
            {effective !== qty ? `${m.name} starts at ${m.minQty} pieces, so this shows ${effective}. ` : ""}
            Estimate for a Gildan tee with a front print{q.setup ? `, including a ${sgd(q.setup)} setup fee` : ""}. Final price is confirmed after artwork review.
          </p>
        </div>

        <Link href="/design/" onClick={carryToLab} className="btn btn-primary btn-lg w-full">Continue in Design Lab</Link>
      </div>
    </div>
  );
}
