"use client";

import Link from "next/link";
import { useState } from "react";
import { methodById, productBySlug } from "@/lib/catalog";
import {
  COURIER_FEE, SINGPOST_FEE, SINGPOST_MAX_PIECES, clampQty, deliveryFee, isPostalCode, optionSummary, quote, sgd,
} from "@/lib/pricing";
import { cartStore, checkoutStore, useStore, type DeliveryMode } from "@/lib/store";
import { Garment } from "./Garment";
import { Icon } from "./Icon";
import { Stepper } from "./Stepper";

export function useCartLines() {
  const lines = useStore(cartStore);
  return lines.flatMap((line) => {
    const product = productBySlug[line.slug];
    if (!product) return [];
    return [{ line, product, q: quote(product, line.config) }];
  });
}

export function CartView() {
  const rows = useCartLines();
  const draft = useStore(checkoutStore);
  const [touched, setTouched] = useState(false);

  const pieces = rows.reduce((n, r) => n + r.q.qty, 0);
  const subtotal = rows.reduce((n, r) => n + r.q.total, 0);
  const mode: DeliveryMode = draft.mode === "singpost" && pieces > SINGPOST_MAX_PIECES ? "courier" : draft.mode;
  const needsPostal = mode !== "collect";
  const postalOk = isPostalCode(draft.postal);
  const fee = deliveryFee(mode, pieces);
  const hasQuote = rows.some((r) => productBySlug[r.line.slug].quoteOnly);

  if (!rows.length) {
    return (
      <div className="wrap pb-24">
        <div className="card max-w-xl p-8">
          <h2>Your cart is empty.</h2>
          <p className="mt-2">Pick a product to start, or go straight to the Design Lab.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/shop/" className="btn btn-primary">Browse products</Link>
            <Link href="/design/" className="btn btn-secondary">Start designing</Link>
          </div>
        </div>
      </div>
    );
  }

  const setQty = (id: string, qty: number) =>
    cartStore.set((ls) => ls.map((l) => {
      if (l.id !== id) return l;
      const m = methodById[l.config.method];
      return { ...l, config: { ...l.config, qty: clampQty(m, qty) } };
    }));
  const remove = (id: string) => cartStore.set((ls) => ls.filter((l) => l.id !== id));

  return (
    <div className="wrap pb-24 lg:grid lg:grid-cols-[1fr_380px] lg:gap-12">
      <div>
        <table className="w-full">
          <caption className="sr-only">Items in your cart</caption>
          <thead className="max-md:sr-only">
            <tr className="border-b border-line text-left text-sm text-muted">
              <th scope="col" className="py-2 font-semibold">Product</th>
              <th scope="col" className="py-2 font-semibold">Unit price</th>
              <th scope="col" className="py-2 font-semibold">Quantity</th>
              <th scope="col" className="py-2 text-right font-semibold">Total</th>
              <th scope="col" className="py-2"><span className="sr-only">Remove</span></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ line, product, q }) => {
              const color = product.colors.find((c) => c.name === line.config.color) ?? product.colors[0];
              const method = methodById[line.config.method];
              return (
                <tr key={line.id} className="border-b border-line align-top max-md:grid max-md:grid-cols-[88px_1fr] max-md:gap-x-3 max-md:py-4">
                  <td className="py-4 max-md:row-span-4 max-md:py-0 md:pr-4">
                    <div className="flex gap-4">
                      <Garment
                        kind={product.kind} color={color.hex} accent={product.accent} text={line.config.text} method={line.config.method}
                        artwork={line.config.artwork?.thumb} locations={line.config.locations} placeholder={false}
                        label={`${color.name} ${product.name}`} className="h-[88px] w-[88px] shrink-0 rounded bg-surface"
                      />
                      <div className="max-md:hidden">
                        <Link href={`/shop/${product.slug}/`} className="font-semibold text-ink no-underline hover:text-teal hover:underline">{product.name}</Link>
                        <Options product={product.slug} line={line} />
                      </div>
                    </div>
                  </td>
                  <td className="md:hidden">
                    <Link href={`/shop/${product.slug}/`} className="font-semibold text-ink no-underline">{product.name}</Link>
                    <Options product={product.slug} line={line} />
                  </td>
                  <td className="price py-4 font-normal max-md:py-1 md:pr-4"><span className="caption md:hidden">Unit price: </span>{sgd(q.unit)}</td>
                  <td className="py-4 max-md:py-1 md:pr-4">
                    <Stepper label={`Quantity for ${product.name}`} value={q.qty} min={method.minQty} max={method.maxQty} onChange={(n) => setQty(line.id, n)} />
                  </td>
                  <td className="price py-4 text-right max-md:py-1 max-md:text-left"><span className="caption font-normal md:hidden">Line total: </span>{sgd(q.total)}
                    {q.setup > 0 && <span className="caption block font-normal">includes {sgd(q.setup)} setup</span>}
                  </td>
                  <td className="py-4 text-right max-md:col-start-2 max-md:py-1 max-md:text-left">
                    <button type="button" onClick={() => remove(line.id)} className="btn btn-ghost -mr-3 text-muted">
                      <Icon name="trash" size={20} muted /><span className="sr-only">Remove {product.name} from cart</span>
                      <span aria-hidden="true">Remove</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="caption mt-3">Final price is confirmed after artwork review.</p>
      </div>

      <aside aria-label="Order summary" className="mt-8 lg:mt-0">
        <div className="card p-4 sm:p-6 lg:sticky lg:top-24">
          <h2 className="text-xl">Order summary</h2>

          <fieldset className="mt-4">
            <legend className="field-label">Delivery</legend>
            <div className="space-y-2">
              {([
                ["courier", "Courier", `${sgd(COURIER_FEE)} per trip. Book 2 days ahead.`],
                ["collect", "Self-collection", "Free, at Braddell Tech."],
                ["singpost", "SingPost", `1 to ${SINGPOST_MAX_PIECES} pieces, registered post. ${sgd(SINGPOST_FEE)}.`],
              ] as [DeliveryMode, string, string][]).map(([id, label, note]) => {
                const off = id === "singpost" && pieces > SINGPOST_MAX_PIECES;
                return (
                  <label key={id} className="choice p-3">
                    <input type="radio" name="delivery" className="sr-only-input" disabled={off} checked={mode === id}
                      onChange={() => checkoutStore.set((d) => ({ ...d, mode: id }))} />
                    <span className="block font-semibold">{label}</span>
                    <span className="caption block">{off ? `Only for ${SINGPOST_MAX_PIECES} pieces or fewer.` : note}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {needsPostal && (
            <div className="mt-4">
              <label htmlFor="cart-postal" className="field-label">Delivery postal code</label>
              <input
                id="cart-postal" className="input max-w-48" inputMode="numeric" autoComplete="postal-code" maxLength={6}
                value={draft.postal} aria-invalid={touched && !postalOk ? true : undefined} aria-describedby="cart-postal-msg"
                onBlur={() => setTouched(true)}
                onChange={(e) => checkoutStore.set((d) => ({ ...d, postal: e.target.value.replace(/\D/g, "") }))}
              />
              <p id="cart-postal-msg" className={touched && !postalOk ? "field-error" : "caption mt-1"}>
                {touched && !postalOk ? "Enter a 6-digit Singapore postal code." : "Island-wide delivery. Same fee anywhere in Singapore."}
              </p>
            </div>
          )}

          <dl className="mt-6 space-y-2">
            <div className="flex justify-between"><dt>Subtotal ({pieces} {pieces === 1 ? "piece" : "pieces"})</dt><dd className="price font-normal">{sgd(subtotal)}</dd></div>
            <div className="flex justify-between">
              <dt>Delivery</dt>
              <dd className="price font-normal">{needsPostal && !postalOk ? "Enter postal code" : fee === 0 ? "Free" : sgd(fee)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-2 text-lg">
              <dt className="font-semibold">Estimated total</dt>
              <dd className="price">{sgd(subtotal + (needsPostal && !postalOk ? 0 : fee))}</dd>
            </div>
          </dl>

          <p className="caption mt-3">Checking out as a guest. You don&apos;t need an account.</p>
          <Link href="/checkout/" className="btn btn-primary btn-lg mt-4 w-full">Proceed to checkout</Link>
          <p className="caption mt-3 flex items-start gap-2">
            <Icon name="shield" size={16} className="mt-0.5" />
            <span>No payment required until you approve the digital proof.{hasQuote ? " Jackets are confirmed by quote." : ""}</span>
          </p>
        </div>
      </aside>
    </div>
  );
}

function Options({ product, line }: { product: string; line: { config: import("@/lib/pricing").Config } }) {
  const p = productBySlug[product];
  return (
    <ul className="caption mt-1">
      {optionSummary(p, line.config).map((o) => <li key={o}>{o}</li>)}
      <li>{line.config.artwork ? `Artwork: ${line.config.artwork.name}` : line.config.text ? `Text: “${line.config.text}”` : "No artwork yet. Add it at checkout."}</li>
    </ul>
  );
}
