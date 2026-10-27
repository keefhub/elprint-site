"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { methodById, productBySlug } from "@/lib/catalog";
import { COURIER_FEE, SINGPOST_FEE, SINGPOST_MAX_PIECES, deliveryFee, isPostalCode, optionSummary, sgd } from "@/lib/pricing";
import {
  cartStore, checkoutInitial, checkoutStore, newOrderId, orderStore, useStore,
  type DeliveryMode, type Order,
} from "@/lib/store";
import { useCartLines } from "./CartView";
import { ErrorSummary, Field } from "./Field";
import { Icon } from "./Icon";
import { UploadZone } from "./UploadZone";

const steps = ["Your details", "Artwork", "Review"];

type Errors = Record<string, string>;

export function CheckoutFlow() {
  const router = useRouter();
  const rows = useCartLines();
  const draft = useStore(checkoutStore);
  const [errors, setErrors] = useState<Errors>({});
  const summaryRef = useRef<HTMLDivElement>(null);

  const pieces = rows.reduce((n, r) => n + r.q.qty, 0);
  const subtotal = rows.reduce((n, r) => n + r.q.total, 0);
  const mode: DeliveryMode = draft.mode === "singpost" && pieces > SINGPOST_MAX_PIECES ? "courier" : draft.mode;
  const fee = deliveryFee(mode, pieces);
  const total = subtotal + fee;
  const needsQuote = rows.some((r) => productBySlug[r.line.slug].quoteOnly);
  const step = draft.step;

  const set = (patch: Partial<typeof draft>) => checkoutStore.set((d) => ({ ...d, ...patch }));

  function fail(e: Errors) {
    setErrors(e);
    window.requestAnimationFrame(() => summaryRef.current?.focus());
  }

  function validate(s: number): Errors {
    const e: Errors = {};
    if (s === 1) {
      if (!draft.name.trim()) e.name = "Enter your name.";
      if (!/^\S+@\S+\.\S+$/.test(draft.email.trim())) e.email = "Enter an email address like name@example.com.";
      if (draft.phone.replace(/\D/g, "").length < 8) e.phone = "Enter a phone number with at least 8 digits.";
      if (mode !== "collect") {
        if (!draft.address.trim()) e.address = "Enter your delivery address.";
        if (!isPostalCode(draft.postal)) e.postal = "Enter a 6-digit Singapore postal code.";
      }
    }
    if (s === 3 && !draft.agreed) e.agreed = "Accept the terms and conditions to submit.";
    return e;
  }

  function go(next: 1 | 2 | 3) {
    setErrors({});
    set({ step: next });
    window.scrollTo({ top: 0 });
  }

  function next() {
    const e = validate(step);
    if (Object.keys(e).length) return fail(e);
    go((step + 1) as 2 | 3);
  }

  function submit() {
    const e = { ...validate(1), ...validate(3) };
    if (Object.keys(e).length) {
      if (validate(1) && Object.keys(validate(1)).length) go(1);
      return fail(e);
    }
    const order: Order = {
      id: newOrderId(),
      createdAt: new Date().toISOString(),
      kind: needsQuote ? "quote" : "order",
      lines: rows.map(({ line, product, q }) => ({
        name: product.name,
        options: [...optionSummary(product, line.config), ...(line.config.text ? [`Text: ${line.config.text}`] : [])],
        qty: q.qty, unit: q.unit, total: q.total, artwork: line.config.artwork?.name,
      })),
      subtotal, delivery: fee, total,
      customer: {
        name: draft.name.trim(), email: draft.email.trim(), phone: draft.phone.trim(), mode,
        address: draft.address.trim(), postal: draft.postal, instructions: draft.instructions.trim(),
      },
    };
    orderStore.set(order);
    cartStore.set([]);
    checkoutStore.set({ ...checkoutInitial, name: draft.name, email: draft.email, phone: draft.phone });
    router.push("/checkout/confirmation/");
  }

  if (!rows.length) {
    return (
      <div className="wrap pb-24">
        <div className="card max-w-xl p-8">
          <h2>Your cart is empty.</h2>
          <p className="mt-2">Add a product before you check out.</p>
          <Link href="/shop/" className="btn btn-primary mt-6">Browse products</Link>
        </div>
      </div>
    );
  }

  const errList = Object.values(errors).map((message) => ({ message }));

  return (
    <div className="wrap pb-24 lg:grid lg:grid-cols-[1fr_380px] lg:gap-12">
      <div>
        <ol className="mb-8 flex gap-2" aria-label="Checkout steps">
          {steps.map((label, i) => {
            const n = i + 1;
            const done = n < step;
            return (
              <li key={label} aria-current={n === step ? "step" : undefined}
                className={`flex flex-1 items-center gap-2 border-b-4 pb-2 ${n === step ? "border-teal" : done ? "border-teal/40" : "border-line"}`}>
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${n <= step ? "bg-teal text-white" : "bg-line text-muted"}`}>
                  {done ? <Icon name="check" size={16} className="text-white" /> : n}
                </span>
                <span className={`text-sm font-semibold ${n === step ? "" : "max-sm:sr-only"}`}>{label}</span>
              </li>
            );
          })}
        </ol>

        <ErrorSummary errors={errList} headingRef={summaryRef} />

        {step === 1 && (
          <form noValidate onSubmit={(e) => { e.preventDefault(); next(); }} className="max-w-[600px] space-y-5" aria-labelledby="step-title">
            <h2 id="step-title">Your details</h2>
            <Field label="Full name" required error={errors.name}>
              {(p) => <input {...p} autoComplete="name" value={draft.name} onChange={(e) => set({ name: e.target.value })} />}
            </Field>
            <Field label="Email" required error={errors.email} hint="We send your proof and order updates here.">
              {(p) => <input {...p} type="email" autoComplete="email" value={draft.email} onChange={(e) => set({ email: e.target.value })} />}
            </Field>
            <Field label="Phone" required error={errors.phone}>
              {(p) => <input {...p} type="tel" autoComplete="tel" value={draft.phone} onChange={(e) => set({ phone: e.target.value })} />}
            </Field>

            <fieldset>
              <legend className="field-label">How do you want to receive your order?</legend>
              <div className="grid gap-2 sm:grid-cols-3">
                {([
                  ["courier", "Delivery", `Courier, ${sgd(COURIER_FEE)} per trip`],
                  ["collect", "Self-collection", "Free, at Braddell Tech"],
                  ["singpost", "SingPost", pieces > SINGPOST_MAX_PIECES ? `For ${SINGPOST_MAX_PIECES} pieces or fewer` : `Registered post, ${sgd(SINGPOST_FEE)}`],
                ] as [DeliveryMode, string, string][]).map(([id, label, note]) => (
                  <label key={id} className="choice p-3">
                    <input type="radio" name="mode" className="sr-only-input" disabled={id === "singpost" && pieces > SINGPOST_MAX_PIECES}
                      checked={mode === id} onChange={() => set({ mode: id })} />
                    <span className="block font-semibold">{label}</span>
                    <span className="caption block">{note}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {mode === "collect" ? (
              <div className="card p-4">
                <p className="font-semibold">Collect at EL Print</p>
                <p>15 Lorong 8 Toa Payoh, #07-08 Braddell Tech, Singapore 319262</p>
                <p className="caption">Mon–Fri, 9:30 AM – 6:30 PM. We email you when your order is ready.</p>
              </div>
            ) : (
              <>
                <Field label="Delivery address" required error={errors.address} hint="Block, street and unit number.">
                  {(p) => <input {...p} autoComplete="street-address" value={draft.address} onChange={(e) => set({ address: e.target.value })} />}
                </Field>
                <Field label="Postal code" required error={errors.postal}>
                  {(p) => <input {...p} className={`${p.className} max-w-48`} inputMode="numeric" maxLength={6} autoComplete="postal-code" value={draft.postal}
                    onChange={(e) => set({ postal: e.target.value.replace(/\D/g, "") })} />}
                </Field>
              </>
            )}
            <button type="submit" className="btn btn-primary btn-lg">Continue to artwork</button>
          </form>
        )}

        {step === 2 && (
          <div className="max-w-[600px] space-y-6">
            <h2>Artwork</h2>
            <p>Upload or confirm artwork for each item. You can skip this and email it to us later, but your proof starts once we have it.</p>
            {rows.map(({ line, product }) => (
              <div key={line.id} className="card p-4">
                <p className="mb-3 font-semibold">{product.name} <span className="font-normal text-muted">({methodById[line.config.method].name}, {line.config.qty} pcs)</span></p>
                <UploadZone
                  compact label="Artwork file" value={line.config.artwork}
                  onChange={(a) => cartStore.set((ls) => ls.map((l) => (l.id === line.id ? { ...l, config: { ...l.config, artwork: a } } : l)))}
                />
              </div>
            ))}
            <Field label="Special instructions (optional)" hint="Print placement, colour matching, size mix, deadline.">
              {(p) => <textarea {...p} rows={4} value={draft.instructions} onChange={(e) => set({ instructions: e.target.value })} />}
            </Field>
            <div className="flex flex-wrap gap-3">
              <button type="button" className="btn btn-secondary" onClick={() => go(1)}>Back</button>
              <button type="button" className="btn btn-primary btn-lg" onClick={next}>Continue to review</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="max-w-[600px] space-y-6">
            <h2>Review and submit</h2>
            <section className="card p-4" aria-label="Your details">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold">{draft.name}</p>
                  <p>{draft.email}</p>
                  <p>{draft.phone}</p>
                  <p className="mt-2">{mode === "collect" ? "Self-collection at Braddell Tech" : `${draft.address}, Singapore ${draft.postal}`}</p>
                  {draft.instructions && <p className="caption mt-2">Notes: {draft.instructions}</p>}
                </div>
                <button type="button" className="btn btn-ghost" onClick={() => go(1)}>Edit</button>
              </div>
            </section>
            <div>
              <label className="flex min-h-11 cursor-pointer items-start gap-3">
                <input type="checkbox" className="mt-1 h-5 w-5 accent-teal" checked={draft.agreed} aria-invalid={errors.agreed ? true : undefined}
                  aria-describedby={errors.agreed ? "agree-err" : undefined} onChange={(e) => set({ agreed: e.target.checked })} />
                <span>I have read and accept the <Link href="/terms/" target="_blank">terms and conditions</Link>.</span>
              </label>
              {errors.agreed && (
                <p id="agree-err" className="field-error"><Icon name="alert" size={16} className="mt-0.5 text-error" /><span>{errors.agreed}</span></p>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" className="btn btn-secondary" onClick={() => go(2)}>Back</button>
              <button type="button" className="btn btn-primary btn-lg" onClick={submit}>{needsQuote ? "Submit for quote" : "Place order"}</button>
            </div>
            <p className="caption flex items-start gap-2">
              <Icon name="shield" size={16} className="mt-0.5" />
              You pay nothing now. We send a digital proof first, and you pay after you approve it.
            </p>
          </div>
        )}
      </div>

      <aside aria-label="Order summary" className="mt-10 lg:mt-0">
        <div className="card p-4 sm:p-6 lg:sticky lg:top-24">
          <h2 className="text-xl">Order summary</h2>
          <ul className="mt-4 divide-y divide-line">
            {rows.map(({ line, product, q }) => (
              <li key={line.id} className="flex justify-between gap-3 py-3">
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="caption">{q.qty} × {sgd(q.unit)}, {methodById[line.config.method].name}</p>
                </div>
                <p className="price">{sgd(q.total)}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-3 space-y-2 border-t border-line pt-3">
            <div className="flex justify-between"><dt>Subtotal</dt><dd className="price font-normal">{sgd(subtotal)}</dd></div>
            <div className="flex justify-between"><dt>Delivery</dt><dd className="price font-normal">{fee ? sgd(fee) : "Free"}</dd></div>
            <div className="flex justify-between text-lg"><dt className="font-semibold">Estimated total</dt><dd className="price">{sgd(total)}</dd></div>
          </dl>
          <p className="caption mt-3">Final price is confirmed after artwork review.</p>
        </div>
      </aside>
    </div>
  );
}
